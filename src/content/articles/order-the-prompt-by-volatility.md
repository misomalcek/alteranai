---
title: "Order the prompt by volatility"
description: "On a paid API, prompt size is the enemy. On a local model with a prompt cache, volatility is. A 21,900-token per-turn bill, where the tool schemas were the bigger half, and the one ordering rule that serves both."
date: 2026-11-01
category: engineering
cluster: sovereign-inference
status: published
topics: [inference]
tools: [llama-cpp, gemma, claude]
concepts: [kv-cache, system-prompt, sovereign-inference]
sources:
  - { doc_key: "~/memory/2026-10-21-MEASURED-una-prompt-economics-and-the-seo-brain-token-bill.md", title: "Una prompt economics and the SEO Brain token bill" }
---

We wanted SEO Brain, our Claude-based team assistant, to run on the local model too. The first measurement said a one-word message cost 6,939 prompt tokens. That was the floor, not the bill.

## What a cold prompt costs locally

Gemma-4 12B on llama.cpp, two runs with deliberately novel prefixes so nothing could be cached:

```
2,318 tokens   20,983 ms   110.5 tok/s
6,593 tokens   62,778 ms   105.0 tok/s
```

In waiting time:

| prompt | time to first token |
| --- | --- |
| SEO Brain's system prompt alone, 6,271 tokens | **~60 s** |
| plus 70 tool schemas, 21,900 tokens | **~195 s**, not a usable app |

## What a warm prompt costs

Same prefix repeated, cache on: **5 new tokens processed, 732 of 732 cached, ~1.3 s round trip.** Reuse is real and aggressive.

## Two economies, one rule

```
paid API      SIZE is the enemy        every turn pays for the whole prefix
local model   VOLATILITY is the enemy  the prefix is free after turn 1,
                                        as long as nothing above it changes
```

One design serves both: **order the system prompt by volatility.** Most stable first, every per-turn variable strictly at the end. A date, a working directory or a retrieved memory near the top invalidates everything below it, on every turn.

Corollary: **keep the machinery in one language.** A translated prompt is a second prefix and halves the cache hit rate. Output language can be a setting; the instructions should not change.

## Where the 21,900 tokens went

```
system prompt                   ~6,271 tok   every turn
tool schemas (70)              ~13,715 tok   every turn
knowledge, memory, persona        ~600 tok
```

**The schemas were the bigger half.** Cutting the prompt alone fixes under a third. And the prompt itself was about 45% manuals for individual tools, including a list of "~45 tools" that duplicated the schemas and was out of date: 70 existed.

The genuinely always-needed material (honesty rules, data transparency, response rules, identity, date handling) came to about **930 tokens**. That is the real frozen prefix. The rest can be fetched by tool name when that tool is in play, or deleted.

## A 503 is not a death

During the test, a 25,084-character prompt hung past 70 seconds and the health endpoint returned 503. It looked like a crash. It was not: same process ID before, during and after, 503 for about 65 seconds, then 200. She was processing the prefix.

**A health check returning 503 during a long prompt looks exactly like a model loading.** Check the process before concluding anything, and never restart on a 503 alone.
