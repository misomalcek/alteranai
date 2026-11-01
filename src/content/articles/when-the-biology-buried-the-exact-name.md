---
title: "When the biology buried the exact name"
description: "Ask our memory for a record by its own name: 93% rank-1 on plain semantic search, 43% after the biological rescore. Why a smarter score lost the easiest query, and the fix we chose."
date: 2026-11-01
category: research
cluster: retrieval-that-works
status: published
topics: [hybrid-retrieval]
tools: [bge-m3]
concepts: [reranker, negative-control, intent-routing, phyto-memory]
cites: [schubert]
sources:
  - { doc_key: "hive chat #356", title: "UNRESOLVED 1: exact-name retrieval 93% to 43%" }
  - { doc_key: "~/memory/retrieval-revise-blueprint-map-2026-10-31.md", title: "decision B1: biology after the rerank, gated by intent" }
---

The easiest retrieval test there is: take a record, query it by its own declared name. It should come back first.

## The measurement

30 fixtures, each queried by its own frontmatter name:

| ranking | rank 1 | top 3 |
| --- | --- | --- |
| plain semantic | **28/30 (93%)** | 30/30 (100%) |
| default, with biological rescore | **13/30 (43%)** | 22/30 (73%) |

The default path, the one every agent and the UI use, **lost more than half of all name lookups.**

## One live example

Query: *"newest suno august 2026"*.

```
plain semantic   the right file at ranks 1, 2 and 3          similarity 0.551
default          a review note       similarity 0.431 → final 0.604
                 an archived plan    similarity 0.374 → final 0.587
                 the right file: gone from the top 3
```

## Why

The rescore multiplies in **decay, importance and a "soul" weight**: biology meant to favour what is alive and important. For exploration that is useful. For an exact lookup it is noise: a record marked low-importance or superseded cannot beat a high-importance planning document, even at a much lower similarity.

**A smarter score lost the easiest query**, because it ran on every query.

## The decision

```
B1   biology moves AFTER the cross-encoder rerank, as a tie-break or prior,
     gated by intent:
       exact lookup, operational how-to    → biology off
       exploratory                         → biology on
```

Approved on 31 October 2026. Routing on intent before retrieval is established practice in industrial RAG [@schubert]; the new part is using it to switch a prior off. It lands in the next retrieval phase. **Not yet shipped**, so the 43% is still the live number on the default path.

## The general lesson

If your ranker has a prior (recency, popularity, importance), measure it on the query type it should not affect. Exact-name lookup is the cheapest negative control there is: every record in your store is already a fixture.
