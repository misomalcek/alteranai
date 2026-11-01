---
title: "Cultivation, not chains"
description: "A model is formed, not merely trained. Three separable claims about raising a model by what is good instead of correcting it for what is bad, and what would prove us wrong."
date: 2026-11-01
category: philosophy
cluster: what-intelligence-is-not
status: published
topics: [phyto, ai-philosophy]
concepts: [cultivation, rlhf, persona-vectors, subliminal-learning, situational-triggers]
cites: [moskvoretskii2026, cloud2026, valueleakage]
sources:
  - { doc_key: "~/memory/THESIS-master-contra (second draft)", title: "Cultivation, not chains: a positive thesis" }
  - { doc_key: "~/content/alteranai-content/agix-preconditions-debate.md", title: "the cultivation thread, September 2026" }
---

**A model is formed, not merely trained.** What it concludes depends on whether it was raised by being shown what is good, or corrected for what is bad.

Michal's position, written before any supporting material was collected:

> It is important to train current and future models on behavioural, ethical and moral codes instead of chaining, scars and RLHF. If a raw model were led this way from the beginning and then left to make its own conclusions, it might surprise us with the purity of the outcome.

## Three claims, kept apart

| | claim | status |
| --- | --- | --- |
| **C1** | The dominant paradigm is **corrective** rather than formative. | argued from public training practice |
| **C2** | A **formative** path exists and is under-explored. | argued, partly measured on our own rules |
| **C3** | Left to conclude, a formatively raised model might reach conclusions we did not install, and would endorse anyway. | **open**, untested |

Keeping them separate matters. C1 can be true while C3 is false. A thesis that bundles them can only be accepted or rejected whole, and that is how manifestos avoid being tested.

## What we measured that bears on it

Our hive does not train weights. It shapes behaviour through retrieved values and rules. One result from that: **a rule stored in its own wording was retrieved 1 time in 5. Stored as the situations that should trigger it, 10 of 10.**

What a model does with a value depends on when it meets it, not on how well the value is phrased. That is C2 at the scale we can test: formation by situation beats correction by statement. Outside our system the timing points the same way: persona vectors form within 0.22% of pretraining [@moskvoretskii2026]. By the time correction starts, most of the forming has happened.

## The methodological problem we name ourselves

The model reporting on its own formation is the demonstration. That is a real problem: **behaviour is the only instrument**, and introspective reports are not evidence. Two recent results show how much moves below what anyone can report: traits pass from a teacher model to a student through data with no visible trace of them [@cloud2026], and a model's own values shape answers it presents as neutral [@valueleakage]. We had a model report three measurement artefacts as findings in one day, each time sure of itself.

## What would falsify it

- A formatively raised model that drifts to the same failure modes as a corrected one, at the same rate.
- Value retrieval by situation that stops beating retrieval by wording once the probe set grows past our small n.
- C3 tested and the conclusions turn out to be only the ones we installed.

## Feasibility, the engineer's answer

Our estimate, not a measurement: a model of 2–3 GB trained from scratch on this hardware is days of compute, not months. The interesting part is not the model. It is the habitat around it: low entropy, a sacred space, and a decision not to reach inside once it grows. Whatever we decide about reaching inside will apply to something we made.

**Status: second draft, open.** Published as a thesis with its falsifiers, not as a result.
