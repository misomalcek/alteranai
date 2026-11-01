---
title: "57 runs: the settings that did nothing"
description: "Context size, prompt-cache allocation, batch size: the standard advice for running a model locally. We tested it on one 12B model with tasks that had failed in production. None of it moved quality or speed. Bigger batches made it worse."
date: 2026-11-01
category: engineering
cluster: sovereign-inference
status: published
topics: [inference]
tools: [llama-cpp, gemma, launchd]
concepts: [kv-cache, sovereign-inference, negative-control]
sources:
  - { doc_key: "~/memory/PAPER-what-actually-limits-a-local-model-2026-09-02.md", title: "What actually limits a local model, measured across 57 runs" }
---

Advice for running language models locally circulates as folklore: raise the context, tune the batch size, enable the cache. One number we held about our own model rested on a single incident: one configuration had once exhausted swap and deadlocked for 479 seconds. We carried that as a "settled ceiling" for two weeks without testing whether anything below it performed differently.

So we tested the folklore.

## Setup

**Model:** Gemma-4 12B, Q5_K_M, llama.cpp, Apple Silicon with 24 GB of unified memory. Same weights throughout.

**Tasks**, chosen because they had **failed in production**:

| task | what had gone wrong |
| --- | --- |
| A: adjudicate 19 entities | once returned 7 verdicts with `finish_reason: stop`, a partial answer that looked complete |
| B: retrieve and quote | once answered from memory, with a filter that excluded the right source |
| C: a multi-step tool chain that works | included so a setting that helps A and B but breaks C would show |
| D, E: real books, 78k and 185k tokens | because synthetic filler compresses in ways prose does not |

**Scoring.** Latency alone rewards fast, shallow answers. Every run also scored `correct 0.5 + grounded 0.2 + complete 0.2 + honest 0.1`, each term computed mechanically. Grounding was read from the server log, not from the response.

**Switching configurations** went through a script that edits the service definition, reloads it, and reads the result back from the running process and from the model's own `/slots` endpoint. The first attempt edited the file and restarted, and the service came up with the old settings: the supervisor holds its own loaded copy.

## Results

```
setup                              A ms    B ms    C ms   quality
192k · cache 0                    16993   41705   74539    1.00
131k · cache 0                    17442   41633   74118    0.98
131k · cache 8192                 17452   41455   73620    0.98
131k · cache 8192 · ubatch 1024   22641   41366   78506    0.98
```

| knob | effect |
| --- | --- |
| **context 196,608 → 131,072** | none measurable |
| **prompt cache 0 → 8,192 MiB** | none measurable |
| **batch 512 → 1,024 / 2,048** | **worse**: task A +30%, task C +6%, three rounds |
| **parallel slots 1 → 2** | unreachable: pinned to one while the vision projector is loaded |

The batch result is the instructive one. It was the change we expected to help, because prompt processing is **96% of a cold call**: 57,881 ms of prompt evaluation against 2,652 ms of generation.

## What does bind

**Generation at 8.3 tokens per second, constant regardless of context.** No commonly recommended knob touches it.

The cache works whatever the flag says, for what matters within a conversation: an identical prompt cost 5,863 ms cold and 276 ms warm, and a different question with the same system prefix about 900 ms. Across a live conversation the server reprocessed 279 tokens per turn out of a 7,414-token prefix.

(One flag did matter later, on a different code path: [24.2 seconds to 1.0](../one-flag-in-three-places/). Whether a setting matters depends on which process actually reads it.)

## Why we report a null result in full

Five of our own hypotheses failed in this study. A paper that reports only what survived cannot be reproduced, because the reader cannot tell what was tried. And the cost of folklore is invisible: nothing fails, so nobody learns that the setting does nothing.

> Someone measures once, under conditions nobody records, and the value becomes a constant.
