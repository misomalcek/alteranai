---
title: "The Mandelbrot question we have not answered"
description: "If the loss landscape is self-similar across scales, a fixed-window optimiser is the wrong instrument by construction. A question, written down before the work, with what it would take to become a claim."
date: 2026-11-01
category: nature
cluster: fractals-and-worlds
status: published
topics: [fractal-optimizer]
concepts: [adamw, gradient-descent, self-similarity, mandelbrot-set, loss-landscape]
cites: [kingma2015, loshchilov2019, quanta2024, adamworbits]
sources:
  - { doc_key: "~/content/alteranai-content/11-NOTE-mandelbrot-vs-adamw-the-question.md.md", title: "NOTE: Mandelbrot vs AdamW, the question stated before the work, 2026-09-17" }
  - { doc_key: "~/content/alteranai-content/01-The Mandelbrot Hypothesis.md", title: "The Mandelbrot hypothesis" }
---

Gradient descent is a striking idea once you see it plainly: every one of billions of parameters looking for the lowest point, like a river in a valley or snow melting downhill. Then one word: **Mandelbrot.** The set every mathematician knows by sight, and still not fully decoded [@quanta2024].

## The question

> AdamW searches for a minimum in a space it assumes is locally smooth. If that landscape is **self-similar across scales**, then a fixed moment and a fixed step are the wrong instrument: you are crossing structure that looks the same at every zoom level with a single stride.

That is not nonsense. It is an interesting question.

## Stating it precisely

The naive version is wrong and has to be dropped first. AdamW does **not** use one step size: its per-parameter adaptive scaling already responds to local curvature. [@kingma2015] [@loshchilov2019] The serious version is narrower:

| what AdamW fixes | why it matters if the landscape is fractal |
| --- | --- |
| moment coefficients β₁, β₂ are **constants** | the memory of past gradients has one time scale |
| adaptation is **first-order over a fixed window** | structure repeating across scales is invisible to it by construction |

Self-similarity, if present, is a statement about structure *across* scales. A fixed-window first-order method cannot see across scales. That is the whole question.

## The inverted version

The hint that came with it: not classic Mandelbrot, **inverted**. Our blueprint notes work this out against AdamW's update rule term by term [@adamworbits]. Instead of reaching into the weights and reshaping them, reshape the **habitat**: the constraints and environment the model grows in. The optimiser follows the terrain. Change the terrain.

It connects to everything else on this site: gardener, not architect; gradients and boundaries, not decisions.

## What it needs to become a claim

1. **A measurable definition of self-similarity** on a real deep-learning loss surface, not on a picture of one.
2. **A prediction that differs from AdamW's**, one that could come out the other way.

Without both, it stays what it is: a geometric intuition argued from an analogy.

## Why publish a question

It was written down on 17 September 2026, deliberately before any work, so the framing cannot be reconstructed favourably later. Source material is gathered. Formal work has not started. It is parked until there is time and compute to do it properly.

**Update, 1 November 2026.** One implementation from our blueprints claimed to answer it. We ran it: its fractal term never switched on. [The fractal optimizer that was plain gradient descent](../the-fractal-optimizer-that-was-sgd/) has the numbers. The question itself is still open.

**Status: open question.** If you have a measurement that settles it either way, we want to read it.
