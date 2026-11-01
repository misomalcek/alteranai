---
title: "24.2 seconds to 1.0: one flag in three places"
description: "Our local agent took 24 seconds to say 'OK'. The loop was fine. A cache flag was set to zero, in three places, and the one we edited first was not the live one."
date: 2026-11-01
category: engineering
cluster: sovereign-inference
status: published
topics: [inference]
tools: [llama-cpp, gemma, launchd, rust]
concepts: [kv-cache, sovereign-inference]
sources:
  - { doc_key: "~/memory/2026-10-19-MEASURED-una-loop-latency-root-cause.md", title: "MEASURED: Una is 34x slower than her own model, and --cache-ram 0 is why" }
---

Our local agent, Una, runs Gemma-4 12B on llama.cpp. The complaint was that her agent loop "must be a mess by now". We measured before judging.

## The number that explained everything

| request | prompt tokens | time |
| --- | --- | --- |
| bare prompt, "OK" | 20 | 0.7 s |
| her real system prompt, "OK" | 2,935 | **24.2 s** |
| the same prompt, replayed | 2,935 | 0.2 s |

**34× for the same two-token answer.** The third row is the finding: a repeated prompt costs 0.2 s, so the cache works perfectly. It just was not kept.

The tell was in the process table: **llama-server at 0.1% CPU while "busy"**. Nothing was computing. It was re-ingesting.

## What was not wrong

The loop was 375 lines, built its system prompt once per task, kept about 15 tools visible with a measured comment explaining the ceiling, and ran one task at a time. Better engineered than the symptom suggested. **The symptom was a launch flag:** `--cache-ram 0`, which disables llama.cpp's RAM prompt cache.

## The three places

```
factorium/.env:13                LOCAL_MODEL_CACHE_RAM=0
local-model-server.ts:175        '--cache-ram', env || '0'
com.factorium.una-chat.plist     --cache-ram 0
```

The first edit went into the plist. It changed nothing: the backend **spawns its own llama-server** as a child process, and whichever starts first owns the port. The fix was nearly reported from a cache warmed by our own earlier probes.

## Two more traps

- **`launchctl kickstart -k` restarts the binary, not the definition.** A fresh process still carried the old arguments. Only `bootout` plus `bootstrap` reloads the plist. The only trustworthy check is the live process's command line.
- **A cleanup broke the job silently.** A slot-save directory had been deleted that morning, and the server exited on start.

## After

```
cold, once after a restart     24.2 s
every task after that           1.0 s   → 25× faster
memory cost                     +0.9 GB (10.5 → 11.4 GB)
```

All three places now say 2048.

## Why fix the flag before the rewrite

A Rust rewrite of the inference path was planned. Doing it first would have credited the rewrite with a one-line config fix. **Measure the rewrite against the cached baseline, not the broken one.**

The open part is [the next seventy seconds](../seventy-seconds-before-the-first-token/): the cache is kept now, but a new run still re-reads most of its prompt.
