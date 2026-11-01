---
title: "RSS lied by four gigabytes"
description: "A plan blamed our local model for 13 GB of wired memory. Measured: its real footprint was 4.3 GB, its RSS said 0.19. Generation ran at a flat 11.5 tokens per second, and swap did not move during decode. A hypothesis of ours fell on the way."
date: 2026-11-01
category: engineering
cluster: sovereign-inference
status: published
topics: [inference]
tools: [llama-cpp, gemma, launchd, cursor, claude]
concepts: [sovereign-inference, negative-control, silent-failure]
sources:
  - { doc_key: "~/memory/2026-10-24-MEASURED-una-adversary-stroj-swapuje-ale-nie-pocas-decode.md", title: "adversarial review: the machine swaps, but not during decode" }
---

A plan to speed up Una, our local 12B model, rested on one premise: the machine is starved of memory, and she is why. We reviewed it adversarially, measuring on the live server, not reading logs.

## Generation is flat; short answers lie

```
max_tokens   10 → 12.75 tok/s
             50 → 11.49
            200 → 11.54
            400 → 11.51
```

The very first probe, on 5 tokens, gave 22.38 tok/s, and it nearly went into the review as "11 is an artefact". It is the reverse: fixed overhead divided by fewer tokens. **Measure generation on answers long enough to amortise the overhead.** Checked before posting, not after.

## The machine is full, and not because of the model

```
wired 12.97 GB · free 0.08 GB · compressor 5.90 GB · swap 88% used

desktop apps (editor, browser, Claude)   4.55 GB resident
the whole hive (model, node, db, vectors) 0.25 GB resident
```

## The hypothesis we had to drop

Ours: *"with 88% swap, decode is throttled through compression."*

```
swap before a 150-token run   4,546 MB
swap during                   4,546 MB    delta 0
```

**Decode does not run through swap.** The 8–13 tok/s band stays unexplained. No new defect found, the same conclusion the other reviewer reached independently.

## RSS is the wrong instrument

```
model server   RSS                  0.19 GB
model server   physical footprint   4.30 GB   (vmmap -summary)
```

The plan attributed the whole 13 GB wired block to the model. Its footprint is 4.3 GB. Most likely because memory mapped for the GPU is not counted as resident. **Never budget memory on Apple Silicon from RSS.** Use the physical footprint.

## Blind instruments, found on the way

| instrument | problem |
| --- | --- |
| the server's error log | written to `/tmp`, wiped at every reboot |
| eviction messages | none today, so no evidence either way |
| the offload line at startup | not printed at all at the build's log level |
| `/metrics` | off; the flag was never set |
| `/props` | reports `vision: false`, which is evidence from the server rather than from the launch arguments |

## A decision, not a bug

The plan also called it a bug that only Michal's messages wake Una directly, while everyone else's queue up (35 were pending). It is the recorded decision that **autonomy is request-only**. Changing it is a change of decision, not a fix.

> Find out whether the thing you are fixing is a defect or a decision before you fix it.
