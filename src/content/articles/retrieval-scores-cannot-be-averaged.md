---
title: "Why your retrieval scores cannot be averaged"
description: "Our unified search compared three different quantities in one column. The exact answer ranked below a weaker one, purely because of scale. What we measured, and what we changed."
date: 2026-11-01
category: engineering
cluster: retrieval-that-works
status: published
topics: [hybrid-retrieval]
tools: [bge-m3, qdrant]
concepts: [rrf, reranker, recall-at-k, hybrid-search, bm25, embeddings]
cites: [cormack2009, topk2026, laforge2026]
sources:
  - { doc_key: "factorium/src/server/core/hive/hive-db.ts", title: "rescaling defect, measured 2026-08-31" }
  - { doc_key: "factorium/src/server/core/hive/rrf.ts", title: "score bands after the bge-m3 cutover, 2026-09-29" }
  - { doc_key: "~/.factorium/logs/retrieval-eval.jsonl", title: "v2 probe set, 52 queries, 2026-10-31" }
  - { doc_key: "hive chat #356, #390, #391", title: "exact-name measurement; per-source shape, verified" }
audio:
  src: media/audio/rrf-versus-hybrid.m4a
  title: RRF versus true hybrid RAG search
  minutes: 19
  kind: notebooklm
---

Our system has one read tool that searches six kinds of data at once: memories, library docs, code, the knowledge graph, plans, and past sessions. For months it returned a single list, sorted by a field called `relevance`.

That field held **three different quantities**.

## What was in the column

- **Memory** reported its biological score: similarity shaped by decay and importance.
- **Docs, sessions and plans** reported raw cosine similarity.
- **Knowledge and code** passed through a rescaling step that stretched `[0.42, 0.78]` onto `[0, 1]`.

The rescaling constants came from an earlier embedding model. We had moved to bge-m3 without recomputing them, so one model's distribution was being rescaled with another model's bounds.

Measured on 31 August 2026, for the query *"where are the hive's values and axioms stored"*:

| result | cosine | shown as |
| --- | --- | --- |
| the anchor record for the values and axioms | 0.5529 | 0.369 |
| a docs page about a browser API | 0.4353 | 0.435 |

**The exact answer was semantically closer and displayed lower.** Nothing was wrong with either retriever. The comparison was never between like and like.

## A second way a score lies

Keyword search returns a position, not a measure. One layer turned that position into a score, which handed the top keyword hit a flat 1.0 however poorly it matched. The query *"Landauer principle"* returned Landauer's Principle at similarity **0.335** and score **1.0**.

Inside that one layer, harmless: the order was already decided. In a list shared with five other sources, a flat 1.0 outranks every honest cosine.

## The bands move when the model moves

After the bge-m3 cutover we measured where each source's scores sit. Memory and knowledge had **swapped ends** compared with the note written under the previous model. Any rule like "memory scores are usually higher" silently inverts the day you change embedders.

Normalising does not rescue it. Score fusion earns its place only once you have labelled data to tune weights against [@topk2026]; until then rank fusion is hard to beat out of the box [@laforge2026]. Min-max scaling is destroyed by one outlier, and z-scores assume a normal distribution that relevance scores do not have.

## What we do instead

**1. Fuse by position, not by score.** Reciprocal rank fusion scores a document as `Σ 1/(k + rank)` across retrievers, with k = 60, the value from Cormack et al. (2009) [@cormack2009]. Scale never enters, so it cannot leak.

**2. Rerank inside one kind of data only.** A cross-encoder reads the query and each candidate together and is far more precise than a vector distance. We run it per source, never across a mixed list.

**3. Return one group per source.** Since 31 October 2026 the unified tool returns `groups[source]`, each reranked inside its own source and capped at five, with no fused list across sources. A reader compares within a group, never between groups.

## The numbers, and what they do not say yet

On our fixed set of 52 labelled queries, with the reranker on:

| measure | reranker off | reranker on |
| --- | --- | --- |
| right item first (recall@1) | 0.5192 | 0.5385 |
| right item in the top 5 | 0.6731 | 0.7308 |
| nDCG@10 | 0.6227 | 0.6537 |

Two honest limits:

- **The per-source shape did not move these numbers, and that was expected.** Every one of the 52 queries names its source, so none exercises the mixed path the change fixed. We added a separate query set for that, rather than claim a gain we had not measured.
- **Slovak queries are weak:** the right item came first for 1 of 9. Our keyword index runs with English stemming. That is the next thing to fix, not something to hide.

One more measurement shaped the design: when the biological rescore ran **before** any reranking, exact-name retrieval fell from **93% to 43%** on 30 records queried by their own names. A memory that fades is a good idea. Letting it fade an exact match out of the results is not. In the next revision it moves after the reranker, and only for exploratory questions.

> A score is only meaningful next to scores made the same way. Compare positions across sources, and scores only within one.
