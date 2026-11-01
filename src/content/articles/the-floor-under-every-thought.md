---
title: "The floor under every thought"
description: "Erasing one bit costs at least kT·ln 2 of heat, about 2.9 × 10⁻²¹ joules at room temperature. Measured in 2012. Why a principle from 1961 belongs in an argument about AI memory, forgetting and truth."
date: 2026-11-01
category: nature
cluster: natural-flow
status: published
topics: [arch-of-truth]
concepts: [landauer, entropy, forgetting, provenance]
cites: [landauer, berut2012, miao2024]
---

Information is physical. That sentence sounds like philosophy. It is a measured result with a number attached.

## The floor

**Landauer's principle:** erasing one bit of information dissipates at least

```
E ≥ k_B · T · ln 2
```

At room temperature that is about **0.018 eV, or 2.9 × 10⁻²¹ joules** [@landauer]. Tiny. Not zero.

In 2012 a team from Lyon, Augsburg and Kaiserslautern **measured it**: the heat released when a single bit, a colloidal particle in a double-well trap, was erased, approaching the Landauer bound [@berut2012]. The floor is not a thought experiment any more.

## How far above it we compute

As of 2012, ordinary computers used about **a billion times** the Landauer energy per operation [@landauer]. Almost all of that is not thinking. It is moving data and throwing information away carelessly.

| | energy per bit operation |
| --- | --- |
| Landauer floor, room temperature | 2.9 × 10⁻²¹ J |
| ordinary computers, 2012 | about 10⁹ × the floor |

That gap is the room architecture works in. It is why we keep saying the next large gains come from architecture before they come from bigger models.

## Three things it changes in how we build

**1. Forgetting is not free, and not optional.** Every erasure costs heat, so a system that never forgets is not "lossless": it has pushed the cost somewhere else, into a store that grows until nothing in it can be found. Our memory design treats forgetting as metabolism, the price of usability. The graph-memory literature reaches the same place from engineering: shard what you know, retrain only what a forgetting request touches [@miao2024].

**2. Truth is a property of matter, not only of text.** If information is physical, it depends on the substrate it runs on. A number on this site is a claim about a database, a log or a measurement on one machine. That is why every article names its record. Provenance is not decoration on a physical claim. It is the claim's address.

**3. Low entropy is the target, not maximum intelligence.** Water reaching the valley is not clever. It is following the gradient to a lower energy state. The systems we want behave the same way: efficient, near the floor, and indifferent to looking smart.

## Where this stops

Landauer bounds *erasure*, not computation as such. Reversible computing can in principle compute without erasing and so below this floor. And nothing here says how much of an AI system's energy is *avoidable* in practice; the billion-fold figure is a 2012 statement about general-purpose computers, not a measurement of any model.

What it does give us is a direction. There is a floor, it has been measured, and everything above it is design.
