---
title: "Multilingual on paper: Slovak questions fail 2.75× more often"
description: "Our embedder and both rerankers we tested are sold as multilingual. Measured with paired Slovak and English queries, Slovak failed 55% of the time against 20%, and a cross-encoder gave three different documents the identical score."
date: 2026-11-01
category: research
cluster: retrieval-that-works
status: published
topics: [hybrid-retrieval]
tools: [bge-m3]
concepts: [reranker, recall-at-k, embeddings, situational-triggers, negative-control]
sources:
  - { doc_key: "~/memory/2026-10-22-MEASURED-slovak-queries-fail-2-7x-more-than-english.md", title: "Slovak queries fail 2.75× more than English" }
  - { doc_key: "~/memory/measured-cross-encoder-rerankers-2026-08-09.md", title: "two cross-encoder rerankers against our real search results" }
---

Michal works in Slovak and English. Most of our corpus is English. Every model in the retrieval chain is marketed as multilingual. We measured what that means.

## The fixture set

52 labelled retrieval queries, written the way a person would ask **months later**, never in the target document's own words. Nine are in Slovak, and **every Slovak query has an English twin in the set that passes**. A controlled pair, not a vocabulary accident.

| | failed (right document not in top 10) |
| --- | --- |
| Slovak | **5 of 9, 55%** |
| English | 9 of 43, 20% |

**2.75× worse in Slovak.** The embedder, bge-m3, is sold as multilingual.

## The same defect, mirrored

The same week we had found the opposite case in our rules: **85% of rule triggers were written in Slovak**, while every agent run is in English. English situations could not reach Slovak triggers; adding English triggers took one probe from 0.57 to 1.0.

```
rules       Slovak triggers, English questions  → missed
retrieval   English corpus, Slovak questions    → missed
```

Two measurements a day apart, from opposite directions. **A Slovak question against an English corpus is a translation problem dressed as a phrasing problem.**

## The rerankers were worse than weak. They were blind.

Earlier we had tested two off-the-shelf cross-encoders on ten real queries, seven English and three Slovak, scoring the same candidate pairs:

| | English: confident | Slovak: confident | latency |
| --- | --- | --- | --- |
| ms-marco-MiniLM-L-6-v2 (22 MB) | 5 of 7 | 1 of 3 | 81 ms |
| bge-reranker-base (~300 MB) | 6 of 7 | **0 of 3** | 347 ms |

"Confident" means the top score was above zero. The multilingual model was the **worse** one on Slovak.

The clearest probe, same question, same three documents:

```
Slovak    −11.5  −11.5  −11.5     no discrimination at all
English    −3.0  −11.4  −11.5     clean separation, correct winner
```

## A mistake worth publishing

The first time Michal raised the language question, it was dismissed with a measurement: only **11 of 405** knowledge-graph entities carry Slovak diacritics, 2.7%. **Wrong denominator.** What matters is the language of the *question*, not of the corpus.

## Three kinds of hard query

The fixture set's real deliverable:

- **Language:** a Slovak question with a passing English twin.
- **Indirect:** described by consequence, never by name. *"The thing that keeps the model from answering twice at once"* returned a liveness module, adjacent and wrong; the answer was the mutex. This is what a cross-encoder is for.
- **No target:** the answer is one line inside a larger record, so no document is *about* it. No reranker fixes a question whose answer was never written down as its own record.

## What we do now

- **Report recall split by language.** An aggregate hides a 2.75× gap.
- **Validate fixtures against the live index first.** Our first pass failed 20 of 52, and most were our own wrong labels. An unvalidated fixture measures the labeller.
- **Translate Slovak queries before retrieval**, or route around the reranker for them. Not yet shipped.
