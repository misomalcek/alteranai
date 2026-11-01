---
title: "A 200 carrying ok:false"
description: "Before rewriting our research, we probed every read tool by content, not by HTTP status. Thirty-odd tools worked. Four defects surfaced, one of which was not a defect: we had reported a number without reading the design behind it."
date: 2026-11-01
category: research
cluster: measuring-your-own-system
status: published
topics: [research-standards]
tools: [qdrant, postgres]
concepts: [silent-failure, negative-control, provenance]
sources:
  - { doc_key: "~/memory/MEASURED-toolchain-audit-2026-09-17.md", title: "toolchain audit, step 1 of the research rewrite" }
---

Our earlier research write-ups were drafted while half the tools were called from memory rather than from their contract. Before rewriting them, every read tool was probed **by content**: a `200 OK` carrying `{"ok": false}` counts as a failure.

## Infrastructure: clean

```
hive check          6 of 6
vector collections  17 of 17 green
knowledge graph     1,046 entities · 10,060 relationships
research corpus     179 files · 5,370 chunks, with provenance tiers
rules               41 active · 142 triggers
```

About thirty read tools worked with correct arguments: memory, code, docs, sources, graph, rules, plans, files, git. One tool refused without a token, which is the guard working.

## Three real defects, fixed the same day

1. **One search tool was missing from the tool contract.** Its result shape could only be learned by calling it, and it was the one tool whose shape we got wrong.
2. **Duplicate points in the knowledge index.** One query returned the same record twice at an identical score. Retrieval quality was being measured on a corpus that double-counts.
3. **A graph-neighbour tool required a numeric id**, with no tool to look an id up from a name. The neighbours of a concept could not be reached in one call.

## The fourth was ours

We reported *"995 of 1,025 entities in cluster 0"* as a defect. It was **the documented behaviour**: the clusters were connected components, not themes, and the code's own header said so. A community algorithm would subdivide it but is unstable across runs, so it was deliberately not used. Reading the code before reporting would have caught it.

**The real defect underneath:** the graph metrics were never recomputed. Code ingest refreshed its metrics 30 seconds after changes; the knowledge graph had no equivalent, so tiers and clusters only refreshed when someone remembered a flag. Michal named the rule that came out of it: **live database, never static.**

## The method

- **Probe by content, not status.** A tool that answers politely with nothing is the most dangerous kind.
- **Read the design before reporting a number as a defect.** Otherwise the audit adds noise to the system it audits.
- **Audit the tools before writing about results.** Anything built on an unaudited tool inherits its blind spots.
