---
title: "Search is retrosynthesis"
description: "Retrieval finds the nearest item. Search composes an answer from parts, the way a chemist plans a molecule backwards from what is on the shelf. The map we took from the chemistry, and what it changes in an agent."
date: 2026-11-01
category: research
cluster: retrieval-that-works
status: published
topics: [hybrid-retrieval]
concepts: [hybrid-search, recall-at-k, kv-cache, kv-grafting, provenance]
cites: [jiang2023retro, khattab2022, anthropic2025research, schelpe2026]
sources:
  - { doc_key: "~/memory/core-channels-retrieve-search-graft-2026-10-31.md", title: "Core channels: retrieve, search, graft" }
---

There are three ways information gets into a model's context. We kept calling all of them "retrieval". They are not the same thing, and they fail differently.

| channel | does | logic | succeeds when | fails as |
| --- | --- | --- | --- | --- |
| **Retrieve** | query → nearest stored items, one step | OR: any good hit is enough | the right item is in the top k | noise, wrong source, lost exact names |
| **Search** | a policy over many retrieve steps: decompose, choose, prune, stop | AND: every part is needed | every leaf is grounded and the answer round-trips | wandering, no stop, one ungrounded leaf |
| **Graft** | verified knowledge enters as state, not as text read again | — | the model starts already knowing | a flat prefix of everything, a stale block |

This article is about the middle one, and where its shape comes from.

## The chemist works backwards

Retrosynthesis plans how to make a target molecule by working backwards: disconnect it into precursors, then precursors of those, until every branch ends in something you can buy [@jiang2023retro]. The review we work from lays out the search methods used for it: Monte Carlo tree search as in AlphaGo, best-first search, depth-first proof-number search [@jiang2023retro].

The structure transfers. The chemistry does not.

| retrosynthesis | an agent answering a question |
| --- | --- |
| target molecule | the question |
| disconnection into precursors | decomposition into sub-questions |
| **stock**: building blocks on the shelf, where search stops | **grounded leaves**: a retrieval hit above a calibrated gate, a primary source, an axiom |
| maximum depth; an unsolved precursor there means failure | a step budget; "not found" is an honest result |
| AND–OR tree: a reaction needs *all* its precursors, a molecule needs *any one* reaction | every sub-question must be answered; any source may answer one |
| round-trip: a forward model checks the precursors really make the target | citation round-trip: every claim maps back to a retrieved passage |

**Stock is the idea we lacked.** An agent without a defined stock does not know when to stop searching. Ours now stops at a grounded leaf, and treats a branch that reaches its budget without one as a result, not as an embarrassment.

## Learning from its own successful routes

The strongest planners learn their heuristic from routes that worked. Information retrieval found the same loop independently: Demonstrate-Search-Predict runs search and prediction, and **keeps a trace only when the prediction matches the answer**. The kept traces become the demonstrations [@khattab2022]. Nothing in between is labelled by hand.

For us that means: a verified route is worth storing, an unverified one is not, and the store of verified routes is what the next search learns from.

## Many searchers, at a price

Parallel search pays off on breadth. Anthropic's multi-agent research system, a lead agent with subagents, beat a single agent by **90.2%** on their internal research evaluation, and does best on queries that branch into independent directions. It also uses about **15× the tokens** of a chat [@anthropic2025research]. Fan-out is a tool for wide questions, not a default.

## And the third channel closes the loop

A route that verifies does not need to be searched again. **Graft** loads it as state the next time the same need appears: in llama.cpp terms, a stable prefix restored from disk. A recent paper does this at full strength on the same model family we run [@schelpe2026]; our commodity version is the server's own slot save and restore.

```
retrieve  supplies the leaves
search    composes them into routes, keeps only the ones that verify
graft     preloads a verified route when the same need comes back
```

## Where we are

Retrieve is measured: 52 labelled queries, recall@1 0.5385 with the reranker. Search is designed: the route log and the citation round-trip are the next two build steps. Graft is measured but unused: within a run 97% of the prompt is reused, and on a new run only 6.5%. None of the three is finished. The map is what we follow.
