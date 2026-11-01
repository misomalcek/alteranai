---
title: "A green counter is a claim about the counter"
description: "One recurring bug shape, found at six sites in one recovery run: a component that reports success over work it never did. None had a check that could go red."
date: 2026-11-01
category: engineering
cluster: failure-modes
tags: [failure-modes, testing, observability, silent-failure]
status: published
sources:
  - { doc_key: "~/memory/2026-10-03-ANCHOR-the-prime-recovery-run-what-was-wrong-and-what-is-now-true.md", title: "the recovery run: one disease at four sites" }
  - { doc_key: "~/memory/2026-09-29-MEASURED-phyto-vs-crystal-first-real-ab.md", title: "the A/B script that never sent the query" }
---

Our system has one failure shape that keeps returning in new places. In its shortest form:

> **A structure that exists, is correct, and has no consumer.** Or its twin: **a component that reports success over work it never did.**

## Six sites, one shape

| site | what it reported | what it did |
| --- | --- | --- |
| memory index | 1,047 indexed | cut 653 files at 4,000 characters |
| knowledge index | indexed | same cut, 5,131 points |
| knowledge graph | entities described | 904 descriptions cut at exactly 200 characters |
| text chunker | chunks written | a `length > 40` filter deleted document titles |
| reindex | "1 indexed, 1,015 unchanged, 0 errors" | nothing: freshness compared file times, and a change to indexing *logic* leaves file times untouched |
| nightly consolidation | `ok: true`, every night | searched 0.016% of the pool: a 24-candidate cap pinned one side to item 0 of 6,168 |

Every one passed every check it had. **None had a check that could go red.**

## The same shape in a test harness

A script named `ab_retrieve` compared two retrieval systems. One side received the query. **The other never did:** it read a default context and checked whether any query word happened to be in it. Its verdict for three of four questions was "no hit". Anyone reading that output would conclude the second system loses. It was never asked.

## A slot nobody uses

The newest instance, from this week: our inference server is configured with a slot-save directory, so a warm model state can be written to disk and restored. **The directory is empty.** The feature was switched on and never used. Correct, present, and with no consumer.

## How we test for it now

- **Reintroduce the bug.** A new test counts only after we verify it goes red when the defect is put back. Six such tests came out of that run.
- **Report distributions, not counts.** A wall of values at exactly a cap is the signature.
- **An instrument that reports zero is making a claim about itself**, until something independent agrees. Three times in one day we reported "0 of 7 deep chunks retrieved". The tool was right every time: our parser read a key that did not exist.

## Why it keeps returning

Because it is invisible to the usual question. "Did it run?" says yes. The question that catches it is **"what did it touch?"**, answered from the data, not from the log line.
