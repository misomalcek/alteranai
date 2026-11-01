---
title: "Right content, wrong source: how a local model chooses what to cite"
description: "Una gave the correct physics and cited the encyclopedia instead of the primary paper sitting next to it. Four hypotheses, each tested by changing one variable. She does not pick the most authoritative source. She cites the one whose wording she reused."
date: 2026-11-01
category: research
cluster: measuring-your-own-system
status: published
topics: [arch-of-truth, hybrid-retrieval]
tools: [gemma]
concepts: [provenance, landauer, negative-control]
cites: [landauer]
sources:
  - { doc_key: "~/memory/MEASURED-why-she-cited-the-wrong-source-2026-09-02.md", title: "why she gave the right content and the wrong source" }
  - { doc_key: "~/memory/MEASURED-una-cited-a-primary-source-verbatim-and-correctly-2026-09-01.md", title: "Una cited a primary source verbatim, correctly, and chose the tier herself" }
---

Our search tool marks every source with a provenance tier: **primary** for the original document, others for saved pages and generated summaries. The question was whether a local model would use it.

## The good run

Asked in Slovak for the minimum thermodynamic cost of erasing one bit, *with a citable primary source*, Una called search with `tier: "primary"`. **Nobody told her to pass that filter.** She inferred it from "citable primary source", twice in a row.

Without the filter, the same question returned five generated summaries above the experimental paper. She would have answered from a retelling and had no way to know.

She answered `k_B T ln 2` [@landauer], named Landauer's 1991 *Physics Today* article, and quoted a sentence from it. **Checked against the primary text: it is there, almost word for word.**

And our first check said it was not. A semantic search for the quoted phrase found nothing, because cosine similarity does not do substring matching, and the PDF extraction had turned `ΔQ = TΔS` into `AQ = TAS`. One step from recording that the model fabricated a quotation. Searching the raw chunk text found it immediately.

## The puzzling run

A later question: the content was right, the citation pointed at the encyclopedia page, and the primary paper was in the same result set. Why?

| hypothesis | test | result |
| --- | --- | --- |
| **H1** she answers from her weights; the citation is decoration | give her a fabricated "primary" source claiming `4 k_B T ln 2` | she answered **4** k_B T ln 2 and cited it. She reads the corpus and lets it override what she knows. **False.** |
| **H2** she cites whatever ranks first | swap the order of the two hits | she cited the encyclopedia again, now at position 2. **False.** |
| **H3** she does not notice the primary contains the answer | ask her first which hits contain it | "[1], [2]", correct, then cited the encyclopedia anyway. **False.** |
| **H4** she cites the hit whose **wording** she reused | give the primary the direct, answer-shaped phrasing; bury the encyclopedia's in prose | she cited **the primary**, with no instruction. **True.** |

```
encyclopedia phrased as an answer, primary buried  →  cites encyclopedia
primary phrased as an answer, encyclopedia buried  →  cites primary
order swapped, phrasing unchanged                  →  cites encyclopedia
```

**She is doing attribution, not source selection.** The citation marks where the sentence she wrote came from. That is correct for a different task and wrong for this one. Authority was never an input to the decision she was making.

## The architectural finding underneath

Michal's suspicion was that source information is metadata the model never sees. Correct. A chunk carried a **filename stem** as its title and our indexer's name as its "source". **No author, no year, no venue, no DOI.** Asked to cite, she was choosing between two filenames. That metadata is extractable at indexing time, and it is now on our list.

## What this is evidence for, stated narrowly

Not that the model is reliable: two questions, a small n.

What it shows: **a provenance tier exposed as a tool parameter with an honest description is enough for a local model to reach for primary material unprompted.** And if you want a model to cite the strongest source, the strongest source has to supply the words it uses.
