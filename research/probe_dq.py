"""Why scaling on == scaling off: record the D_q the optimizer computes, and try higher lr."""
import sys, statistics, torch, torch.nn as nn
sys.path.insert(0, __file__.rsplit('/', 1)[0])
import pure_fractal_orbit_optimizer as F
from bench_fractal import spirals
seen = []
orig = F.PureFractalOrbitOptimizer._calculate_wavelet_dq
def rec(self, *a, **k):
    d = orig(self, *a, **k); seen.append(d); return d
F.PureFractalOrbitOptimizer._calculate_wavelet_dq = rec
X, y = spirals()
for lr in (0.1, 0.5, 1.0):
    res = {}
    for c in (0.2, 0.0):
        seen.clear(); torch.manual_seed(0)
        m = nn.Sequential(nn.Linear(2, 64), nn.Tanh(), nn.Linear(64, 64), nn.Tanh(), nn.Linear(64, 1))
        o = F.PureFractalOrbitOptimizer(m.parameters(), lr=lr, weight_decay=1e-2, entropy_coupling=c); lf = nn.BCEWithLogitsLoss()
        for _ in range(2000):
            o.zero_grad(); l = lf(m(X), y); l.backward(); o.step()
        res[c] = lf(m(X), y).item()
        if c == 0.2:
            above = sum(d > 1 for d in seen)
            print(f"lr {lr}: D_q min {min(seen):.3f} median {statistics.median(seen):.3f} max {max(seen):.3f}; D_q > 1 in {above}/{len(seen)} steps")
    print(f"lr {lr}: final loss scaling on {res[0.2]:.5f} · off {res[0.0]:.5f}")
