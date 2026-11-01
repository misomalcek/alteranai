---
title: "A 26B model on 24 GB, without swapping"
description: "Gemma-4 26B swapped 27,848 times in a real agentic run. One flag reported zero, on an easy test. Under the load we actually run, it took two settings together: experts on the CPU and an 8-bit KV cache. No new runtime needed."
date: 2026-11-01
category: engineering
cluster: sovereign-inference
status: published
topics: [inference]
tools: [llama-cpp, gemma]
concepts: [mixture-of-experts, kv-cache, sovereign-inference, negative-control]
sources:
  - { doc_key: "~/memory/measured-26b-usable-ncmoe-plus-kvq8-2026-08-08.md", title: "the 26B swap problem is solved, and MLX is not needed" }
---

Gemma-4 26B is a mixture-of-experts model: large on disk, with only a few experts active per token. On a 24 GB Apple Silicon machine it did not fit comfortably.

## The sequence, including the wrong step

| step | swap-outs |
| --- | --- |
| 26B, plain, bare chat | 8,620 |
| 26B, plain, **real agentic run** | **27,848** |
| `--n-cpu-moe 20`, bare chat | **0**, reported as solved |
| `--n-cpu-moe 24`, real agentic run | **27,848**, not solved |

The zero was measured on a bare chat. Michal's own testing under agentic load found it still swapping. The claim was corrected in the code.

Then he asked the right question: had none of the optimisations worked, was switching to MLX the only way? That exposed that only **half** of the suggested fix had been tried.

## The result

Measured through Una's own agentic loop, tools attached, a ~5,900-token prefix, at the full 96K context:

| configuration | swap-outs | notes |
| --- | --- | --- |
| 26B Q3_K_L plain | 27,848 | unusable |
| `--n-cpu-moe 24` alone | 27,848 | not enough |
| **`--n-cpu-moe 24` + `-ctk q8_0 -ctv q8_0`** | **0** | 3 runs, 0 tool errors, ~13 s each |

15.4 GB resident, 18–24% memory free, 20.7 tokens per second.

## Why the pair works where neither did alone

- **`--n-cpu-moe`** moves the bulky, sparsely used expert feed-forward weights off the GPU budget. It splits by the **role** of a tensor, not by layer depth, unlike `-ngl`, which forces CPU–GPU syncs mid-layer.
- **An 8-bit KV cache** halves what the attention layers hold at 96K.

Neither reclaimed enough. Together they did.

## q8, not q4, on purpose

The suggestion was a 4-bit KV cache. Tool calling is exactly the syntax-sensitive work where cheap KV precision is a bad trade, the same reasoning that keeps our weights at Q5. 8-bit halved the cost while staying near full precision, and it measured to zero. There was no reason to go lower.

## The runtime question, answered with evidence

The strongest argument for switching to MLX was *"it takes swap-outs from 17,544 to nearly zero."* **We were at zero on llama.cpp**, tools working, full context. MLX's remaining advantages (faster decode, multi-token prediction) are optimisation, not rescue, against a second runtime to maintain and losing the Windows and GGUF path. We stayed.

> Measure the load you actually run, not the one that is easy to run.
