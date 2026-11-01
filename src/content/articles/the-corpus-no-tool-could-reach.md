---
title: "44,196 chunks behind a tool nobody routed to"
description: "Our unified search tool says 'prefer this over individual tools'. Our entire research corpus was not one of its layers. On six topics that live only there, the direct search won 6 of 6. And 75% of our memory had never been retrieved even once."
date: 2026-11-01
category: engineering
cluster: memory-architecture
status: published
topics: [hybrid-retrieval, continuous-thought-machines]
tools: [qdrant, bge-m3]
concepts: [hybrid-search, provenance, silent-failure]
sources:
  - { doc_key: "~/memory/2026-10-28-MEASURED-hiveway-the-corpus-nobody-could-reach.md", title: "44,196 chunks behind a tool nobody routes to" }
---

Our agents have one recommended way to look things up: a unified search across memory, knowledge, code, docs, sessions and plans. Its description says *"prefer this over individual tools"*. They do.

## What it did not search

```
unified search layers   memory · knowledge · code · docs · sessions · plans
missing                 sources: 44,196 chunks · 29 topics · ~500 MB
```

The research corpus, every paper and saved article with its provenance tier, **was not a layer.** It had its own tool. Nothing pointed agents to it.

## The A/B

Six queries on topics whose material lives **only** in the research corpus:

| topic | unified search | sources search |
| --- | --- | --- |
| continuous thought machines | 0.655 | **0.735** |
| L-system plant architecture | 0.519 | **0.655** |
| reciprocal rank fusion | 0.623 | **0.690** |
| ontology platforms | 0.594 | **0.627** |
| neuro-symbolic reasoning | 0.658 | **0.690** |
| thermodynamics of AI flow | 0.612 | **0.618** |

**Sources won 6 of 6.** "Continuous thought machines", a topic with 226 files on disk, returned a constants file from another app and a CV draft at 0.55.

## Second finding: we could not tell who uses retrieval

```
tool-usage counters    all 0. A ledger that records nothing.
retrieval log          3,501 entries: id · name · time · query hash
                       no tool, no actor, no collection
```

Michal's question, *is it available and used by the whole hive?*, had no answer. What the log *could* show was worse:

| | |
| --- | --- |
| memory files | 1,471 |
| ever retrieved | 365 (24.8%) |
| **never retrieved, not once** | **1,106 (75%)** |
| retrieved exactly once | 100 |
| top 12 most retrieved | 8 are plans, handoffs or ledgers |

**The hive was mostly retrieving its own planning notes, not its knowledge.**

## What was not broken, measured so we stop suspecting it

- **Memory ingest:** 1,469 of 1,470 files, 15,768 chunks, no incomplete chunk sets. The one skip is an empty file.
- **The chunker:** paragraph-aware, 200-character overlap, keeps titles. One chunker, imported by both indexers.
- **The flat 0.0164 score:** by design. Six disjoint corpora fused by rank give every first hit 1/(60+1). The field to read is `relevance`.

## Three of our own mistakes in the same session

- "172 unseen records" did not exist: we read the documentation in a hook instead of the code.
- "The score is a degenerate bug" was the documented design: we read `score` instead of `relevance`.
- "The docs corpus has 16 stacks": the folder listing said 16, the tool said 24, and the tool was right.

## What changed

Sources became a layer of the unified search (after the noise fixes, not before), and retrieval logging gained actor and tool fields. Without the second, the first could never be shown to matter.
