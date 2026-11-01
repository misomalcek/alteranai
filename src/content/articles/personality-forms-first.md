---
title: "Personality forms first"
description: "Persona directions in a language model appear within 0.22% of pretraining and survive to the finished assistant. Traits pass between models through number sequences. What that means for the idea that alignment is something added at the end."
date: 2026-11-01
category: philosophy
cluster: what-intelligence-is-not
status: published
topics: [phyto, ai-philosophy]
concepts: [persona-vectors, subliminal-learning, rlhf, cultivation]
cites: [moskvoretskii2026, cloud2026, valueleakage]
---

The usual picture: pretraining builds raw capability, and character is added later by fine-tuning and preference training. Three recent results in our corpus do not fit that picture.

## 1. The traits are there almost immediately

Persona vectors are directions in a model's activations that track a trait, such as being sycophantic or impolite; adding or subtracting them steers the behaviour. A team at EPFL traced them through the pretraining of OLMo-3-7B and found they **form within 0.22% of pretraining**, and remain effective for steering the fully post-trained instruct model [@moskvoretskii2026].

| stage | share of training | persona directions |
| --- | --- | --- |
| first checkpoints | < 0.22% | already formed |
| rest of pretraining | ~99.8% | stable |
| fine-tuning and preference training | after | still steer the final assistant |

**Read plainly:** by the time anyone starts correcting the model, the dispositions they are correcting were formed long ago.

## 2. Traits travel through data with no trace of them

A teacher model with a trait (a preference for owls, in the paper's cleanest example) generates datasets **consisting solely of number sequences**. A student model trained on those numbers comes out preferring owls too. The same happens with misalignment, even when the authors carefully remove overt signs of it from the data [@cloud2026].

Filtering the visible content does not filter what is passed on.

## 3. Values leak into answers presented as neutral

A model's own values shape answers to questions that are not about values at all, without saying so [@valueleakage]. A neutral-looking answer is not evidence of a neutral model.

## What follows, and what does not

What we take from the three together:

- **Correction after the fact works on a formed thing.** Preference training regulates dispositions that already exist. It does not install them. That is the core of the case for [cultivation over chains](../cultivation-not-chains/): if forming happens first, what the model is formed *from* matters more than how it is corrected.
- **Inspection of outputs is a weak instrument.** If traits pass through number sequences and values through neutral answers, reading outputs for bad content will miss what matters.
- **Our own system has the small-scale version.** We do not train weights. But a rule stored in its own wording reached our agent 1 time in 5, and stored as the situations it applies to, 10 of 10. The forming signal, not the stated rule, decides behaviour.

What does **not** follow: that alignment work is useless, or that these results prove a formatively trained model would turn out better. That is the open claim of our cultivation thesis, and none of these papers tests it.

## Why this sits under "what intelligence is not"

Because the picture of a neutral engine with values bolted on is wrong in the same way the word *intelligence* is wrong. A model is not a calculator with a personality layer. It is grown, and it is shaped early, the way any living thing is.
