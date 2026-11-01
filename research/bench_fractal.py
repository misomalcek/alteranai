"""Reproduce the fractal-orbit benchmark from content/fractal-optimizer-blueprints/06.

Two-spirals, an MLP 2-64-64-1 (tanh), full batch, binary cross-entropy, 2,000 steps,
five seeds. The control that matters: the same fractal optimizer with entropy_coupling=0,
which is the identical code path with the D_q step scaling switched off.
Run: python3 research/bench_fractal.py  (torch 2.9, CPU)
"""
import json, math, statistics, sys, time
import numpy as np, torch, torch.nn as nn
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from pure_fractal_orbit_optimizer import PureFractalOrbitOptimizer

def spirals(n=400, noise=0.15, seed=0):
    g = np.random.default_rng(seed)
    t = np.sqrt(g.random(n)) * 3 * math.pi
    a = np.c_[t * np.cos(t), t * np.sin(t)] / (3 * math.pi) + g.normal(0, noise / 3, (n, 2))
    b = -a
    X = torch.tensor(np.r_[a, b], dtype=torch.float32)
    y = torch.tensor(np.r_[np.zeros(n), np.ones(n)], dtype=torch.float32).unsqueeze(1)
    return X, y

OPTS = {
    'SGD + momentum':          lambda p: torch.optim.SGD(p, lr=0.05, momentum=0.9),
    'AdamW':                   lambda p: torch.optim.AdamW(p, lr=1e-2, weight_decay=1e-2),
    'Fractal orbit':           lambda p: PureFractalOrbitOptimizer(p, lr=0.1, weight_decay=1e-2, entropy_coupling=0.2),
    'Fractal orbit, scaling off': lambda p: PureFractalOrbitOptimizer(p, lr=0.1, weight_decay=1e-2, entropy_coupling=0.0),
}
STEPS, SEEDS = 2000, [0, 1, 2, 3, 4]
X, y = spirals()
if __name__ == "__main__":
    out = {}
    for name, make in OPTS.items():
        losses, accs, secs = [], [], []
        for s in SEEDS:
            torch.manual_seed(s)
            m = nn.Sequential(nn.Linear(2, 64), nn.Tanh(), nn.Linear(64, 64), nn.Tanh(), nn.Linear(64, 1))
            opt = make(m.parameters()); lf = nn.BCEWithLogitsLoss(); t0 = time.time()
            for _ in range(STEPS):
                opt.zero_grad(); loss = lf(m(X), y); loss.backward(); opt.step()
            with torch.no_grad():
                z = m(X); losses.append(lf(z, y).item()); accs.append(((z > 0).float() == y).float().mean().item())
            secs.append(time.time() - t0)
        out[name] = dict(loss_median=statistics.median(losses), loss_min=min(losses), loss_max=max(losses),
                         acc_median=statistics.median(accs), sec_per_run=statistics.mean(secs))
        print(f"{name:28s} loss median {out[name]['loss_median']:.5f} [{min(losses):.5f}–{max(losses):.5f}]  acc {out[name]['acc_median']:.3f}  {out[name]['sec_per_run']:.1f}s/run", flush=True)
    json.dump(dict(steps=STEPS, seeds=SEEDS, torch=torch.__version__, results=out), open(__file__.rsplit('/', 1)[0] + '/bench_fractal.json', 'w'), indent=2)
