---
title: "An organic memory returns the statement, not the file"
description: "The first A/B that actually queried both sides. The document store returns a filename. The organic memory returns the sentence that answers. Plus the bug that held 38% of every answer hostage."
date: 2026-11-01
category: research
cluster: phyto
tags: [phyto, memory, retrieval, ab-test, knowledge-graph]
status: published
sources:
  - { doc_key: "~/memory/2026-09-29-MEASURED-phyto-vs-crystal-first-real-ab.md", title: "MEASURED: phyto vs crystal, the first A/B that actually queries both sides" }
---

Our hive has two long-term memories. **The crystal** is a knowledge graph over documents. **Phyto** is an organic memory: about 7,000 atomic facts with growth, decay and hormone-like signals, opened per situation through what we call the aperture.

The first comparison script said phyto lost. It had never sent phyto the query.

## The real A/B: 10 questions, both sides asked

| measure | value |
| --- | --- |
| facts returned per query | 13.0 on average |
| of which axioms | 5.0 |
| same for every query | 6 facts (46%) |
| specific to the query | 7 facts (54%) |
| latency p50 | 159 ms (146–249) |

**4 of the 5 axioms rotate with the question.** Only one, *sapere aude*, is unconditional.

## The difference is the unit of retrieval

| question | crystal returns | phyto returns |
| --- | --- | --- |
| stress as friction | a rule's title | "Stress signals should function as cognitive friction, making the process harder and requiring more energy" |
| why did package.json get corrupted | an audit report's name | "the shell tool's working-directory fallback, which defaults to the home folder" |
| which model does Una run on | a project brief's name | "Una is a local Gemma-4 model, chat on :8080, embeddings on :8081, vision via mmproj" |

The crystal returns **a pointer**: fetch the document, then read it. Phyto returns **the statement**: one call, about 30 tokens.

## The defect: five sticky facts

Five facts appeared in **all ten** answers, whatever was asked. They held 5 of 8 non-axiom slots, **38% of every aperture.**

The mechanism was one line: the reinforcement score was **added to** situational similarity instead of **gated by** it. Similarity sat between 0.73 and 0.75, and a reinforcement score of 1.48 won every time. The organism was remembering what it had thought about most, not what it was asked.

## What we claim, and what we do not

```
CLAIM       situational retrieval returns the statement, not the document:
            one call, ~30 tokens, p50 159 ms
CLAIM       54% of the context is query-specific
NOT CLAIMED "beats RAG": no ranking benchmark against labelled ground truth
            existed when this was measured
```

This measures the **shape** of the answer, not its correctness. A ranking benchmark with labelled queries now exists for the main search tool. Running phyto through the same benchmark is the next step.
