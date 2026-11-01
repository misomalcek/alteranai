---
title: "The dream that only ever saw one fact"
description: "Every night our memory runs a consolidation phase and reports ok:true. It runs. It also could only ever reach 0.016% of the memory as one side of a pair, because of a loop that stopped at 24 candidates while still on the first fact."
date: 2026-11-01
category: engineering
cluster: phyto
status: published
topics: [phyto]
tools: [launchd]
concepts: [phyto-memory, silent-failure, forgetting]
sources:
  - { doc_key: "~/memory/2026-10-03-MEASURED-dream-phase-runs-and-sees-0.016-percent-of-the-organism.md", title: "the dream phase runs, and sees 0.016% of the organism" }
---

At 04:00 every night our organic memory runs a **dream** phase: it proposes a link between two facts that are not yet connected. If the link is used the next morning, it is confirmed. If not, it sediments. Consolidation, borrowed from sleep.

The open question was whether it ran at all. If the nights had produced nothing, every idea built on top of them was a proposal over a mechanism of unknown health.

## It runs

```
scheduled job       loaded, 04:00, error log 0 bytes
nights recorded     3 of 5   (the machine was off on the other two)
last fire           ok: true
dream log           10 proposed · 2 confirmed · 7 sedimented
```

Healthy end to end.

## What the nights actually paired

```
night 1   fact A  ↔  a cloudflare fact
night 2   fact A  ↔  another cloudflare fact
night 3   fact A  ↔  a fact from two days earlier
```

**Side A identical three nights running.** Side B different each time.

## Why, and it is not the randomness

The final pick is genuinely random among the candidates. The skew is in how the candidates are built:

```js
for (let i = 0; i < pool.length; i++) {
  for (let j = i + 1; j < pool.length; j++) {
    candidates.push([pool[i], pool[j]]);
    if (candidates.length >= 24) break;
  }
  if (candidates.length >= 24) break;
}
```

`pool[0]` alone supplies 24 partners, so the cap is hit while `i` is still 0. **Side A is whichever fact sorts first.** Randomness only ever chooses side B.

Measured and simulated with the real pool:

| | |
| --- | --- |
| facts in the dream pool | 6,168 |
| candidates built | 24 |
| distinct side A | **1** |
| share of the memory reachable as side A | **0.016%** |

Production and simulation agree.

## The shape

Not a zero that looks like a measurement. **A healthy-looking report over a search that never happened.** Every night returns `ok: true` with a plausible dream, while structurally never seeing the organism it is dreaming about.

It also reorders the roadmap. We had been asking what *input* the dream lacks: intent, context, a better prompt. That still stands, but a richer input into a 24-pair window still lands on the first fact. **The dream first has to be able to reach the memory at all.**

## The fix, in principle

Sample pairs across the whole pool (or reservoir-sample the candidate list) instead of filling a capped list in index order, and log the **number of distinct side-A facts per night** next to `ok: true`. A dream that reports its reach can be checked. One that reports only success cannot.

## Instrument notes earned along the way

- Our generic database tool had no graph extension loaded; graph queries had to go through the memory's own API.
- The graph API's edge fields were `source_id` / `target_id`, not `source` / `target`. **Parsing the wrong key returns a confident zero.**
