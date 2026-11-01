---
title: "A prompt change with exactly zero effect"
description: "We changed the sampling and added negative examples to a local model's entity-extraction prompt. Same 2.15 entities per file, same 43 kept. And the rule we had suggested would have deleted 18 real concepts. The constraint was not in the prompt."
date: 2026-11-01
category: practice
cluster: working-with-claude
status: published
topics: [neuro-symbolic]
tools: [cursor, gemma]
concepts: [system-prompt, negative-control]
sources:
  - { doc_key: "~/memory/MEASURED-sample2-the-prompt-cannot-fix-this.md", title: "the second distillation sample: the prompt cannot fix this" }
---

Our knowledge graph needed real concepts instead of filenames. A distillation pipeline extracts them: candidates by pattern, a shortlist, then a local model adjudicates which to keep. The first sample kept junk alongside real terms. A Cursor seat revised the pipeline: new sampling across the whole corpus, and a prompt carrying explicit negative examples.

## Cursor's work, verified item by item

| claim | verified |
| --- | --- |
| entity types added: 72 → 77 | ✓ |
| `decision`, `principle`, `origin`, `taxonomy` present | ✓ |
| `thesis-seed` added | **✗ still missing** |
| sampled across the corpus, not just the newest | ✓ |
| nothing written to the graph | ✓ 1,046 entities, 10,060 edges unchanged |

## The result that matters

| | sample 1 | sample 2 |
| --- | --- | --- |
| entities per file | 2.15 | **2.15** |
| kept | 43 | **43** |
| time | 69 s | 91 s |

**Identical**, after a different sampling strategy *and* a prompt with negative cases. Not a coincidence to explain away. The intervention had no effect on the quantity it targeted.

## Our own advice was wrong

We had told the Cursor seat: *a bare all-caps word is not an entity.* Measured on sample 2:

```
all-caps tokens kept: 29 of 43
  real:   GPT · LIP · QDRANT · HIVE · NOUS · OCR · FACTORIUM · AGE · GPU · SEO · MCP · RAM …   (18)
  noise:  GATE · WINNER · PROMPT · NEEXISTUJE · NIE · FLAT · REAL …                          (11)
```

**18 of 29 were real**, several of them core to our system. The rule would have deleted them. The surface does not carry the distinction: two all-caps tokens, one a concept and one a Slovak word for "does not exist". Telling them apart requires knowing what the corpus is about.

A new failure also appeared: **Slovak sentence starts** read as proper nouns, because the candidate patterns treat any capitalised word at a sentence start as a name.

## Where the constraint might be

```
candidates 221 → shortlist 120 → adjudicate → keep 43
```

Two different inputs, the same 43. Three hypotheses, each testable:

1. **The shortlist is the bottleneck.** If it is frequency-driven, no prompt can change what reaches the model.
2. **The local model has a ceiling on this task.** Run the same 120 through a frontier model and compare the keep sets.
3. **Candidate extraction is the defect.** If the patterns emit sentence fragments, no later stage can recover.

## The practice lesson

> When a prompt change moves nothing, the constraint is upstream of the prompt.

Before iterating on wording, hold the input fixed and swap one stage at a time. And measure a proposed rule against the data before giving it to anyone, human or model.
