---
title: "Nothing to migrate"
description: "In 2026 Anthropic tightened its consumer terms and then enforced them server-side. Tools built on subscription tokens broke. Team Brain had nothing to change, not because anyone foresaw it, but because the shortcut was never taken."
date: 2026-11-01
category: practice
cluster: working-with-claude
status: published
topics: [ai-philosophy]
tools: [claude, anthropic-sdk]
concepts: [provenance, sovereign-inference]
sources:
  - { doc_key: "~/memory/FACT-tos-timeline-and-why-nothing-broke-2026-08.md", title: "the terms timeline, and the claim that survives checking" }
  - { doc_key: "team-brain git log --reverse", title: "first commit, official SDK, 4 Feb 2026" }
---

A version of this story nearly went into a CV in a form that does not survive checking. The checked version is better, so here it is.

## The dates

| date | what happened |
| --- | --- |
| **4 Feb 2026** | Team Brain's first commit: the official Anthropic SDK, on the paid API |
| **20 Feb 2026** | Anthropic tightened its consumer terms: tokens from Free, Pro and Max accounts may not be used in other products, tools or services |
| **4 Apr 2026** | Server-side enforcement. Tools that wrapped subscription tokens broke; their users faced moving to the paid API |
| 30 Apr 2026 | our own runtime set up, the SDK for the cloud model |
| 24 Jun 2026 | our redlines written out in full |

## The claim that does not hold

*"We were ready from day zero."* In the sense of having foreseen it, **no.** The runtime and the written redlines both came after the change and after enforcement. The dates do not support foresight.

## The claim that does hold, and is stronger

**Nothing had to change, because the shortcut was never taken.** Team Brain was on the official SDK sixteen days before the terms tightened, not from foresight but because that was the only way it was ever built. When enforcement landed, there was nothing to migrate.

Michal's own words, June 2026: *"I want to build, not read the terms. Reading them for loopholes is for speculators."*

## The redlines, set unprompted

- Calls from our system to the coding agent stay local.
- Local agents may call the cloud model **only on a specific human request**, one-off, never for automated tasks or long workflows, even if asked.
- Nothing masked as something else, in public or private projects, not in a demo, not in a workshop.
- **The model keeps a standing right to refuse** any such call at the smallest doubt.

## The precedent

Not new behaviour. Seven to eight years of SEO in a regulated vertical: no black-hat shortcuts, **no domain penalised in that whole period, no legal claim from an official operator**, while competitors kept lawyers on retainer for trademark disputes and domain seizures.

## Why it matters for anyone building on a model provider

The cheapest compliance is the architecture that never needed a workaround. Building on the official SDK and the paid API looked more expensive in February. In April it was the only thing still working. Team Brain later ran for 15 people at about **$30 a month**, with Haiku routing tools and Sonnet writing, which is what the paid path actually cost.
