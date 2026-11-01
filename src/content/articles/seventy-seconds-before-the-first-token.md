---
title: "Seventy seconds before the first token"
description: "Inside one run, our local 12B model reuses 97% of its prompt. Starting the next run, it reuses 6.5% and spends 70 seconds re-reading instructions it already knew. Read from the server's own log."
date: 2026-11-01
category: engineering
cluster: sovereign-inference
status: published
topics: [inference]
tools: [llama-cpp, gemma]
concepts: [kv-cache, kv-grafting]
cites: [schelpe2026]
sources:
  - { doc_key: "~/.factorium/logs/una-chat.stderr.log", title: "llama-server slot log, gemma-4-12b-it Q5_K_M" }
  - { doc_key: "factorium/src/server/core/una/prompt.ts", title: "Una's system prompt builder" }
  - { doc_key: "arXiv 2607.14431", title: "Byte-Exact KV-State Grafting, a frozen Gemma-4-12B" }
---

Una, the local agent in our system, runs Gemma-4 12B (Q5_K_M) on llama.cpp with a 131,072-token context, on one machine. Users experience her as slow: often more than a minute before she starts on a task. The server log says exactly where that minute goes.

## What the log shows

llama.cpp keeps the key-value state of the last prompt in its slot. When a new request shares a prefix with it, that prefix is reused and only the new tokens are processed. The log records the share as `f_keep`.

**Within one run**, step after step:

| measure | value |
| --- | --- |
| prefix reused (`f_keep`) | 0.965 – 0.978 |
| new tokens per step | 828 – 1,361 |
| processing speed | about 50 tokens per second |

Slower per token than you might expect, because each new token attends to a context already 32,000–36,000 tokens deep. But only the new part is paid for.

**At the start of the next run:**

| measure | value |
| --- | --- |
| prefix reused (`f_keep`) | **0.065**, about 516 of 7,941 tokens |
| tokens processed | 7,940 |
| time | **70.6 seconds**, at 112 tokens per second |

Seven thousand tokens of tools, rules and instructions, identical from run to run, re-read from scratch because something near token 500 differs between them.

## Why it diverges, as far as we know

The cache can reuse only a prefix: everything up to the first token that differs. Una's prompt puts a run-specific line near the top. Her working directory is the sixth line. Everything after a changed line is recomputed, however stable it is.

That is the leading suspect, not a confirmed cause. Confirming it means rendering two cold-start prompts and finding the first line where they differ. That work is assigned and not done. We would rather publish the measurement with its open question than a tidy story we have not checked.

## The fix is ordering, then a file

1. **Stable first, volatile last.** Tools and rules at the top, working directory, clock and retrieved memory at the bottom. The changing part then costs only its own tokens.
2. **Save the warm state to disk.** llama.cpp can save a slot's KV state to a file and restore it into a fresh server. Our server is already configured with a slot-save directory. It is empty: the feature was switched on and never used. That is a recurring shape in our own system, a structure that exists, is correct, and has no consumer.

## The bigger idea behind a small fix

A recent paper (arXiv 2607.14431) [@schelpe2026] does this at full strength on the same model family, a frozen Gemma-4-12B. Verified solutions are deposited as KV-state blocks and grafted back in when needed. Its benchmark score on AIME 2025 rises from 80.0% to 93.3%, with no change to the weights. Two of its findings matter here even without its engine:

- **One flat prefix holding everything confuses the model.** It grabs the wrong entry when many are present. Route to the single relevant block instead.
- **Restore at the block's own position.** Moved blocks drift slightly; own-position restore is the exact case.

Prompt ordering plus a saved slot is the commodity version of that idea. It costs a reordering of text and a file on disk. The target is concrete: `f_keep` above 0.9 on a new run, and a cold start measured in seconds instead of seventy.
