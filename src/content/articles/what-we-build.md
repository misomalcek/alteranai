---
title: "What we build"
description: "Sovereign AI systems: they run on hardware you own, and the data never leaves it. What that buys, what it costs, and the numbers."
date: 2026-11-01
category: engineering
cluster: sovereign-inference
tags: [sovereign, local-ai, dependencies, offer]
status: published
---

Sovereign AI systems — they run on hardware you own, and the data never leaves it.

## What sovereign means here

**Not:** a cloud API with a privacy policy.
**Is:** a 12-billion-parameter model doing real agentic work on one machine, with no inference call leaving the building.

**What that buys:**
- No per-token bill that scales with success
- No vendor deprecating your system
- No compliance question about where the data went

**What it costs:** engineering. A cloud call is one line. This is not.

## Measured, from the system we run

| | |
| --- | --- |
| native tools | 69 |
| TypeScript | 64,644 lines on 29 runtime dependencies |
| written by hand instead of imported | 2,005 lines, replacing 12 dependencies |
| retrieval over 6,346 facts | ~150 ms |
| custom inference runtime | 2,841 lines of Rust |

Twenty-nine dependencies is the number worth looking at twice. Each one removed is a supply chain you no longer inherit.

## One result that changed the architecture

We asked the system to retrieve a behavioural rule.

- **Stored as the rule's own words:** found 1 time in 5.
- **Stored as the situations that trigger it:** found 10 times out of 10.

The technique is weaker on tool selection — 7 out of 10. We report that too.

**Knowing where your own method stops is part of the method.**

## The offer

Custom AI systems: sovereign, cloud, or both where it makes sense. Consultations and workshops.

**Base rate 100 €/h.** All three need preparation and research, reported with the artifacts produced and charged at 50% of base rate.

Non-commercial project. The offer exists because the work has to be paid for, not because this is a funnel.

---

*Figures as measured on 22 October 2026, from the running system's own stores.*
