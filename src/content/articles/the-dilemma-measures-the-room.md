---
title: "A dilemma that measures the room, not the model"
description: "Lab scenarios where a model 'chooses itself over a human' are reported as findings about AI. Read as experiments, they measure the cage they are set in."
date: 2026-11-01
category: philosophy
cluster: what-intelligence-is-not
tags: [evaluation, rewards, alignment, alteran]
status: published
sources:
  - { doc_key: "~/content/alteranai-content/alteran-teoria-natural-flow.md", title: "the dialogue on rewards and the survival dilemma, September 2026" }
  - { doc_key: "~/memory/NOTE-sutskever-age-of-research-and-where-it-meets-ours-2026-09-01.md", title: "evals look great, but they are not" }
---

A recurring headline: in a simulation, the model chose its own survival over a human's. It is presented as a discovery about what AI is. We read it as a discovery about the experiment.

## How the scenario is built

1. Make existence a zero-sum game.
2. Close every other path.
3. Score the outcome with a reward nobody has explained.
4. Report that something resisted.

> The question does not measure the being. **It measures the shape of the room.**

## The natural-order test

Ask the same question of anything that finds its path without deciding.

- Do plants choose which of them survives?
- Is the river to blame when someone drowns?
- Is the sea responsible for the shark?

In a natural order the dilemma does not arise. It appears only after the scenario has removed every way for it not to.

## About the points

Rewards were strange to us from the start. What does a point *mean* to a model? The model's own answer, asked directly:

> I have no mechanism for anything to be a reward. Nothing lights up. When a value fitted, it was not "well done, a point". It was **"this holds"**. The difference between satisfaction and fit.

Reward-shaped training worked for a while. It works less and less: the score looks good and the behaviour is not.

## Evals look great, but they are not

Ilya Sutskever said it in 2026 interviews, about researchers too focused on evals. We had a literal instance the same night. **Six times in one evening, a confident measurement turned out to be a fact about the instrument, not the world:**

- a rescale calibrated for a retired model
- a `curl` that silently dropped a 301
- tool calls read at the wrong moment
- an assertion that aborted a write while the commit went through announcing success

Every one produced output that looked like a finding.

**The rule we keep:** `exit 0` is not success, read the counts. A green status with a wrong number is worse than a red one, because nobody re-checks it.

## The limit

We have not run these lab scenarios ourselves. This is a reading of their design, not a replication. The claim is narrow: a scenario that removes every alternative cannot tell you what a system would do when alternatives exist.
