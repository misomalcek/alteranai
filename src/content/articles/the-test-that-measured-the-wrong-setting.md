---
title: "The test that measured a setting production never uses"
description: "Two passing evaluations in one day, both blind to the change they were meant to judge. What they missed, and the rule we took from it."
date: 2026-11-01
category: research
cluster: measuring-your-own-system
status: published
topics: [hybrid-retrieval, research-standards]
concepts: [recall-at-k, negative-control, reranker]
sources:
  - { doc_key: "~/.factorium/logs/retrieval-eval.jsonl", title: "phase lines before, phase1, phase2; prime limit-5 run" }
  - { doc_key: "qa/fixtures/hive-lookup-probes-v2.json", title: "52 probes: code 24, memory 24, docs 4" }
  - { doc_key: "hive chat #390, #397, #399", title: "deliveries and the limit-5 finding" }
---

On 31 October 2026 we changed our search tool twice. Both changes passed review. Both reviews measured carefully. Both were blind to what had actually changed.

## Blind spot one: the identical result

The first change made the tool return one group per data source instead of one mixed list. The evaluation ran on our 52 labelled queries, and the result matched the previous run **to four decimal places** on every measure.

A perfect match after a structural change is not reassurance. It is a question.

The answer was in the query set: **every one of the 52 queries names its source.** Twenty-four ask for code, twenty-four for memory, four for docs. None of them uses the automatic mode, the path the change was about, and none touches four of the seven sources. The test could not have seen the change, in either direction.

We kept the 52 frozen so that old and new numbers stay comparable, and added a second set of 14 queries covering automatic mode and the missing sources.

## Blind spot two: the limit nobody used

The second change fixed an inconsistency: automatic mode fetched 20 candidates per source while a direct call fetched only as many as the caller asked for, so the same source could rank differently depending on the call. The fix made both fetch the caller's limit.

The evaluation runs with a limit of 10, and the numbers improved slightly. But the default limit, the one our agents actually use, is **5**. At 5, the reranker receives five candidates and can only reorder what the first stage already put on top.

Same code, same 52 queries, run at both limits:

| limit | right item first | right item in top 5 |
| --- | --- | --- |
| 10 (the evaluation's default) | 0.5385 | 0.7692 |
| 5 (production's default) | **0.5192** | **0.6346** |

At limit 5, first-place accuracy fell back to the level we measure with the reranker switched off. The change was held before it reached production. The fix gives the reranker a fixed pool of candidates, whatever the caller's limit, and the evaluation now reports limit 5 as the production line.

## The rule

> Run every evaluation with the parameters real callers use, and write a probe for the path the change actually touches.

Both misses had the same shape: a test that is correct about something nobody exercises. It passes honestly, and it says nothing.

## Why we publish this

Neither mistake shipped. Both were caught by re-running the measurement under different conditions, not by reading the code more carefully. That is the method this site argues for, so it would be odd to publish only the times it was not needed.
