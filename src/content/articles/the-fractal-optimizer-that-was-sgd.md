---
title: "The fractal optimizer that was plain gradient descent"
description: "A blueprint reported a fractal-orbit optimizer reaching loss 0.0176 on two-spirals. We ran its code. The fractal term never switched on: in 36,000 steps the measured dimension never crossed the threshold that activates it."
date: 2026-11-01
category: nature
cluster: fractals-and-worlds
status: published
topics: [fractal-optimizer]
concepts: [adamw, gradient-descent, self-similarity, mandelbrot-set, loss-landscape, negative-control]
cites: [fractalbench, ourbench, kingma2015, loshchilov2019]
sources:
  - { doc_key: "research/bench_fractal.json", title: "five seeds × four optimizers, 2,000 steps, torch 2.9.1 on CPU" }
  - { doc_key: "research/probe_dq.py", title: "D_q recorded at every step, three learning rates" }
---

[The Mandelbrot question](../the-mandelbrot-question/) asks whether a loss landscape could be self-similar across scales, and whether an optimizer that sees across scales would beat AdamW. A blueprint in our corpus went further: it described a **PureFractalOrbitOptimizer**, shipped its code, and reported a benchmark [@fractalbench].

| reported | final loss on two-spirals |
| --- | --- |
| SGD + momentum | 0.57231 |
| AdamW | 0.00057 |
| PureFractalOrbitOptimizer | **0.01761** |

The benchmark was generated inside a notebook session. Nobody had run it on our machine. So we did [@ourbench].

## What the code actually does

Read past the vocabulary (Buddhabrot orbits, Haar wavelets, Rényi entropy) and the update rule is one line:

```
θ ← θ − lr · Φ(D_q) · ∇L        Φ(D_q) = 1 / (1 + 0.2 · max(0, D_q − 1))
```

It keeps the last 32 positions of each parameter tensor, projects them to 2D with PCA, box-counts the result at four scales and fits a slope, D_q. **Φ can only shrink the step, and only when D_q is above 1.** Otherwise it is exactly 1 and the update is plain gradient descent with weight decay.

## The control that matters

Same task, same network (2–64–64–1, tanh), full batch, 2,000 steps, five seeds. The decisive row is the last one: the same optimizer with the fractal scaling switched off.

| optimizer | final loss, median of 5 | range | accuracy |
| --- | --- | --- | --- |
| SGD + momentum | 0.03201 | 0.02715–0.03776 | 99.3% |
| AdamW [@kingma2015] [@loshchilov2019] | **0.00053** | 0.00044–0.00732 | 100% |
| fractal orbit | 0.56566 | 0.56561–0.56576 | 70.2% |
| fractal orbit, **scaling off** | 0.56566 | 0.56561–0.56576 | 70.2% |

**On and off are identical to five decimals.** The fractal part did nothing.

## Why: the dimension never crosses 1

We recorded every D_q the optimizer computed:

| learning rate | D_q median | D_q max | steps with D_q > 1 |
| --- | --- | --- | --- |
| 0.1 | 0.688 | 1.000 | 0 of 12,000 |
| 0.5 | 0.728 | 1.000 | 0 of 12,000 |
| 1.0 | 0.704 | 1.001 | 1 of 12,000 |

Thirty-two points along an optimisation path, flattened to two dimensions, trace something close to a **curve**, and a curve has dimension about 1. The scaling waits for a value above 1 that this estimator, on this window, almost never produces. The mechanism is not wrong. It is **switched off by construction.**

The reported 0.01761 did not reproduce. What we measured is what plain SGD without momentum does here: it stalls on the plateau at about 0.566, the same plateau the blueprint attributed to SGD *with* momentum.

## What this does and does not settle

- **It settles this implementation.** As written, it is SGD with decoupled weight decay plus five times the compute.
- **It does not settle the question.** Whether loss landscapes are self-similar is still open. This estimator cannot see it: 32 samples in 2D are too few to measure a dimension above 1.
- **A fair next attempt** needs a dimension estimate that can actually exceed 1 (longer windows, more projected dimensions) and the same switched-off control, run before anyone reports a win.

## Why we publish a negative result

Because the blueprint read well. It had a mechanism, a table and a plausible story about chaotic exploration settling into a basin. Running the scaled and unscaled versions side by side took a few minutes and removed the story completely.

> A component that is never activated reports its success through everything around it.

The code, the raw results and the probe are in [the repository](https://github.com/misomalcek/alteranai/tree/main/research). Re-run them.
