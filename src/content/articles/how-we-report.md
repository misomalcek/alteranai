---
title: "How we report"
description: "Every figure on this site comes from a running system. The standard, the time it failed us by a factor of eighteen, and where the numbers come from."
date: 2026-11-01
category: research
cluster: measuring-your-own-system
tags: [provenance, measurement, failure-modes]
status: published
---

Every figure on this site comes from a running system. Not from a memory, not from a model.

## The standard

- **Ground consequential claims through a live channel.** A search result is not a measurement.
- **Measure rather than explain.** Two measurements beat one story.
- **Report outcomes as they are**, including partial ones.
- **Mutual adversarial review is not optional.**

## What that looks like when it costs us

This site's own CV was generated from a database. The generator pointed at a store that had been renamed, so it failed loudly — **and nobody re-ran it.**

For two months the page served figures that understated the system eighteen times over.

**The fix was one line. The lesson was not:**

> A generator nobody runs is a generator that lies, quietly.

We publish that because a page claiming perfect provenance would be the least credible page on the site.

## Where numbers come from

| claim | source |
| --- | --- |
| tool success, cost | logged calls over a five-week window |
| line counts, dependencies | the repository, counted at build |
| retrieval latency | the live index, measured per query |
| anything unverified | marked as such, or not published |

## The limit we state out loud

Our retrieval technique is strong on behavioural rules — 10 out of 10 — and **weaker on tool selection, 7 out of 10.**

Knowing where your own method stops is part of the method.

---

*Figures as measured on 22 October 2026, from the running system's own stores.*
