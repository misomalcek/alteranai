---
title: "Repetition is the mother of wisdom, not wisdom itself"
description: "Four filters that ranked our memory by volume put plans and run logs on top. Measuring novelty instead put them at the bottom, where they belong. Then the criterion hit a wall: our register of known concepts was a list of filenames."
date: 2026-11-01
category: research
cluster: memory-architecture
status: published
topics: [systems-design, phyto]
concepts: [phyto-memory, entropy, negative-control]
sources:
  - { doc_key: "~/memory/MEASURED-novelty-not-volume-the-rosicky-criterion.md", title: "novelty, not volume: the Rosický criterion" }
---

Which records in a memory are knowledge, and which are a log of knowledge being used? Four filters failed to tell them apart. Then Michal put it in one sentence:

> When a record contains many entities that already exist and not one new one, it is a log, a record of how we used knowledge on the way, running the same neural paths we already have. **Repetition is the mother of wisdom, but not wisdom itself.**

Behind it is Prof. Antonín Rosický's systems question: what is a *source* of knowledge, and what is merely a *record of activity* in which knowledge was used?

We had been measuring **volume**. The right quantity is **increment**.

## The measurement

Walking the memory chronologically, for each file: what share of its terms had never appeared before?

| family | share of terms that are new |
| --- | --- |
| concepts | 69% |
| design | 65% |
| lessons | 63% |
| findings | 62% |
| plans | 56% |
| **run logs** | **48%** |

## The confound, removed

Novelty falls with position, because early files see an emptier corpus:

```
1st quarter 70% · 2nd 58% · 3rd 47% · 4th 64%
```

Compared **within** each quarter, the order holds. Run logs come last in the first three quarters. **The signal is real and not an artefact of ordering.** The first of five filters that points the right way: volume put plans and runs on top; novelty puts them at the bottom.

## Why it cannot be a threshold yet

48% against 69% will not separate cleanly. Pushing further, asking which new terms later *took hold* (appeared in three or more files), the order flips:

```
runs 15% · plans 12% · concepts 6% · design 6% · findings 4% · lessons 0%
```

What runs introduce: component filenames, a backup command, template headings like *"Written by:"*. They recur because the **template** recurs. Lessons score zero because they are short: one sentence of hard-won truth can carry no new noun at all.

**The counter measures strings, not concepts.** That is the honest limit of pattern matching over prose.

## The decisive test

Apply the criterion literally: compare each file against the register of known concepts, the knowledge graph.

```
known concepts in the register        1,025
median known concepts found per file  0     (every family, all 986 files)
```

**Zero.** Because 45% of the "concepts" were filenames and event titles, strings that never occur in the prose of other files.

## The conclusion that closes the loop

**The criterion is correct and currently unmeasurable.** It needs exactly what distillation is meant to produce: a register of real concepts instead of a list of files. Until then, any filter for "knowledge versus log" measures the wrong thing, however clever it looks.
