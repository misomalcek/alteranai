import math
import numpy as np
import torch
import torch.nn as nn


class PureFractalOrbitOptimizer(torch.optim.Optimizer):
    """
    Pure Fractal Orbit Optimizer (Inverted Mandelbrot / Buddhabrot Dynamics)
    ------------------------------------------------------------------------
    A standalone non-Euclidean optimizer that replaces traditional 1st/2nd moment
    smoothing (like AdamW/SGD) with pure multi-scale fractal orbit trajectory analysis.

    Core Mathematical Mechanics:
    1. Inverted Mandelbrot (Buddhabrot) Phase-Space Tracking:
       Parameter updates theta_0, theta_1, ..., theta_t are treated as chaotic orbits
       and projected onto a 2D density grid H(w).
    2. Multi-Scale 2D Haar Wavelet Coarse-Graining:
       Applies dyadic 2D Haar wavelet transformations across spatial resolutions r_k = 2^k.
    3. Kolmogorov / Rényi Entropy (S_q) & Generalized Fractal Dimension (D_q):
       Computes S_q(r_k) at each scale and extracts D_q as the scaling slope.
    4. Direct Entropy Step Modulation:
       Scales parameter steps via Phi(D_q) = 1 / (1 + coupling * max(0, D_q - 1)).
    """
    def __init__(
        self, 
        params, 
        lr=1e-2, 
        weight_decay=1e-2, 
        orbit_window=32, 
        grid_size=32, 
        q_order=2.0, 
        entropy_coupling=0.2
    ):
        if not 0.0 <= lr:
            raise ValueError(f"Invalid learning rate: {lr}")
        if not 0.0 <= weight_decay:
            raise ValueError(f"Invalid weight_decay value: {weight_decay}")

        defaults = dict(
            lr=lr, 
            weight_decay=weight_decay,
            orbit_window=orbit_window, 
            grid_size=grid_size,
            q_order=q_order, 
            entropy_coupling=entropy_coupling
        )
        super().__init__(params, defaults)

    def _haar_wavelet_downsample_2d(self, grid: torch.Tensor) -> torch.Tensor:
        """2D Haar Wavelet approximation filter: averages 2x2 grid cells."""
        h, w = grid.shape
        cropped = grid[:h - (h % 2), :w - (w % 2)]
        return (cropped[0::2, 0::2] + cropped[1::2, 0::2] +
                cropped[0::2, 1::2] + cropped[1::2, 1::2]) / 4.0

    def _compute_renyi_entropy(self, grid: torch.Tensor, q: float) -> float:
        """Calculates Rényi entropy S_q across spatial density distribution."""
        total = grid.sum()
        if total == 0:
            return 0.0
        p = grid / total
        p_nonzero = p[p > 0]
        if q == 1.0:
            return -(p_nonzero * torch.log(p_nonzero)).sum().item()
        else:
            return ((1.0 / (1.0 - q)) * torch.log((p_nonzero ** q).sum())).item()

    def _calculate_wavelet_dq(
        self, 
        orbit_buffer: list[torch.Tensor], 
        grid_size: int, 
        q_order: float
    ) -> float:
        """
        Maps parameter checkpoint orbits into Buddhabrot density map H(w),
        applies dyadic 2D Haar wavelet decomposition, and extracts D_q scaling slope.
        """
        if len(orbit_buffer) < 4:
            return 1.0  # Baseline smooth manifold dimension

        # Stack checkpoints: (window_size, num_params)
        orbits = torch.stack(orbit_buffer, dim=0)
        centered = orbits - orbits.mean(dim=0, keepdim=True)

        # Fast 2D PCA projection of high-dimensional parameter trajectories
        if centered.shape[1] >= 2:
            _, _, V = torch.pca_lowrank(centered, q=2)
            proj = torch.matmul(centered, V[:, :2])
        else:
            proj = torch.zeros((centered.shape[0], 2), device=orbits.device)
            proj[:, 0] = centered[:, 0]

        # Rasterize trajectory into 2D density histogram H(w)
        x, y = proj[:, 0], proj[:, 1]
        x_min, x_max = x.min(), x.max()
        y_min, y_max = y.min(), y.max()

        px = max((x_max - x_min).item() * 0.05, 1e-6)
        py = max((y_max - y_min).item() * 0.05, 1e-6)

        x_indices = torch.clamp(
            ((x - (x_min - px)) / (x_max - x_min + 2 * px) * (grid_size - 1)).long(), 0, grid_size - 1
        )
        y_indices = torch.clamp(
            ((y - (y_min - py)) / (y_max - y_min + 2 * py) * (grid_size - 1)).long(), 0, grid_size - 1
        )

        grid = torch.zeros((grid_size, grid_size), device=orbits.device)
        for xi, yi in zip(x_indices, y_indices):
            grid[xi, yi] += 1.0

        # Multi-scale 2D Haar Wavelet transformation & Rényi entropy calculation
        current_grid = grid
        scale_resolutions = []
        sq_values = []
        cell_size = 1.0

        while current_grid.shape[0] >= 4 and current_grid.shape[1] >= 4:
            epsilon = 1.0 / cell_size
            scale_resolutions.append(epsilon)
            sq_values.append(self._compute_renyi_entropy(current_grid, q_order))

            current_grid = self._haar_wavelet_downsample_2d(current_grid)
            cell_size *= 2.0

        if len(scale_resolutions) < 2:
            return 1.0

        ln_inv_eps = np.log(np.array(scale_resolutions))
        sq_arr = np.array(sq_values)

        # Linear fit: S_q(epsilon) = D_q * ln(1/epsilon) + C
        slope, _ = np.polyfit(ln_inv_eps, sq_arr, 1)
        return float(slope)

    @torch.no_grad()
    def step(self, closure=None):
        """Performs a single pure fractal orbit optimization step."""
        loss = None
        if closure is not None:
            with torch.enable_grad():
                loss = closure()

        for group in self.param_groups:
            lr = group['lr']
            weight_decay = group['weight_decay']
            window_size = group['orbit_window']
            grid_size = group['grid_size']
            q_order = group['q_order']
            coupling = group['entropy_coupling']

            for p in group['params']:
                if p.grad is None:
                    continue

                grad = p.grad
                if grad.is_sparse:
                    raise RuntimeError('PureFractalOrbitOptimizer does not support sparse gradients')

                state = self.state[p]

                # State Initialization
                if len(state) == 0:
                    state['step'] = 0
                    state['orbit_buffer'] = []

                state['step'] += 1

                # Decoupled Weight Decay
                if weight_decay != 0:
                    p.mul_(1.0 - lr * weight_decay)

                # Append current parameter checkpoint to orbital flight path buffer
                orbit_buffer = state['orbit_buffer']
                orbit_buffer.append(p.detach().flatten().clone())
                if len(orbit_buffer) > window_size:
                    orbit_buffer.pop(0)

                # Measure Generalized Fractal Dimension D_q via Wavelet Box-Counting
                D_q = self._calculate_wavelet_dq(orbit_buffer, grid_size, q_order)

                # Kolmogorov / Rényi Entropy Adaptive Step Scaling Filter Phi(D_q)
                phi_scale = 1.0 / (1.0 + coupling * max(0.0, D_q - 1.0))

                # Pure Gradient Step: theta_{t+1} = theta_t - lr * Phi(D_q) * grad
                p.add_(grad, alpha=-lr * phi_scale)

        return loss


if __name__ == "__main__":
    torch.manual_seed(42)

    # Example Neural Network
    model = nn.Sequential(
        nn.Linear(64, 128),
        nn.GELU(),
        nn.Linear(128, 10)
    )

    optimizer = PureFractalOrbitOptimizer(
        model.parameters(), 
        lr=1e-2, 
        weight_decay=1e-2,
        entropy_coupling=0.2
    )

    print("Executing PureFractalOrbitOptimizer training loop...")
    for step_idx in range(10):
        inputs = torch.randn(16, 64)
        targets = torch.randn(16, 10)

        optimizer.zero_grad()
        outputs = model(inputs)
        loss = nn.MSELoss()(outputs, targets)
        loss.backward()
        optimizer.step()

        print(f"Step {step_idx + 1:02d} | Loss: {loss.item():.5f}")

    print("Execution complete!")
