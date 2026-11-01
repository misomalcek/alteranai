---
title: "A corpus that looks indexed"
description: "Every counter said 1,047 memories were indexed. 653 of them were their opening 4,000 characters. 72% of the text never reached the vector store."
date: 2026-11-01
category: engineering
cluster: memory-architecture
status: published
topics: [hybrid-retrieval]
tools: [qdrant, bge-m3]
concepts: [chunking, embeddings, silent-failure]
sources:
  - { doc_key: "~/memory/2026-10-03-MEASURED-72-percent-of-indexed-memory-never-reached-qdrant.md", title: "MEASURED: 72% of indexed hive memory never reached Qdrant" }
  - { doc_key: "~/memory/2026-10-03-ANCHOR-the-prime-recovery-run-what-was-wrong-and-what-is-now-true.md", title: "the recovery run, gates G1–G6" }
---

The memory watcher turns markdown files into vectors. In October 2026 it reported 1,047 records indexed. All 1,047 existed. **653 of them were fragments.**

## The mechanism, two lines

```ts
const embedInput = `${name}: ${body}`.slice(0, 4000);   // what gets embedded
content: body.slice(0, 4000),                            // what gets stored
```

The cap was deliberate: an older embedding model had a 2,048-token context. **The cap was not the bug. The absence of chunking was.** A long memory was not rejected and not split. It was silently reduced to its opening and recorded as a success.

## Measured on disk, then in the live store

| | value |
| --- | --- |
| indexed files | 1,009 |
| larger than 4,000 bytes | 653 (64%) |
| text lost to the cut | 9,190 KB of 12,685 KB = **72%** |
| points sampled from the vector store | 400 |
| content exactly 4,000 characters | 246 (61%) |
| longest content found | 4,000. Nothing longer existed. |

The disk numbers say what the code would do. The store sample says it did.

## Why this is worse than a missing file

A missing file is honestly absent: no point, no score, nothing claims it is there. **A truncated file has a point, a name, a vector and a score**, and every counter reports it as indexed. The status line said 1,047. The stats endpoint said 1,047. Nothing could go red.

## The order of the fix mattered

391 more files had no frontmatter and were not indexed at all. Backfilling them first would have added 7.5 MB of fresh truncation into the same hole, and every one would then report healthy too. **Truncation first, then backfill.** One reindex, nothing indexed twice.

## After

```
memory      chunked, not cut: 1,015 files → 9,282 chunks, 0 missing
recall      8/10 at rank 1, 10/10 in top 3 on known-answer probes
deep text   chunk 71 and chunk 166 of a 669-chunk file are retrievable
tests       6 new, each verified to go red when the bug is reintroduced
```

Today the memory store holds about **1,470 files in 15,768 chunks**, with 0 incomplete chunk sets.

## The transferable rule

> A green counter is a claim about the counter.

If your indexer reports a count, also report the **length distribution** of what it stored. A wall at exactly your cap is the signature of this bug, and it is invisible to every count.
