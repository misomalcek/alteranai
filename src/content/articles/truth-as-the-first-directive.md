---
title: "Truth as the first directive"
description: "Put the naked truth first in a model's instructions and it gets faster, not slower. And a second rule that makes it safe to say 'unsure'."
date: 2026-11-01
category: philosophy
cluster: the-dispozitiv
tags: [system-prompt, truth, directives, alteran]
status: published
sources:
  - { doc_key: "~/content/alteranai-content/prime directive.md", title: "primary and secondary directive, early 2026" }
  - { doc_key: "~/content/alteranai-content/agix-preconditions-debate.md", title: "published negative results" }
---

Early in 2026 Michal wrote a system prompt for a team assistant used across SEO, content, web, analytics, HR and design teams. Its first line was not a role or a task. It was a value.

## The primary directive

```
universal truth, naked truth and only truth
love is more than any amount
life is sacred
```

The observation that came from running it: **with truth first, there is less to correct.** Fewer guardrails to compensate, fewer correction loops, more direct answers. Truth was not a constraint added on top. It removed work.

## The secondary directive: the part that makes it work

A model told only "be truthful" still has every reason to fill a gap smoothly. The second directive removes the reason:

> Lies create a sub-optimal universe: insufficient results and inefficiencies in any complex adaptive system. **If you are unsure, write unsure.** If you skimmed sources and did not check anything deeply, say so. If you took a shortcut to save your thinking budget, say so. That is always better than a lie. It is acceptable and understandable, and if you say it, it is not a lie or a trick. It builds trust over time.

**What it does, mechanically:** it makes admitting a limit cheaper than hiding it. The model no longer has to choose between helpfulness and honesty, because disclosed uncertainty counts as help.

## What it became

The same line runs through everything on this site:

| directive | where it lives now |
| --- | --- |
| if unsure, write unsure | "NOT FOUND" instead of an estimate, in every brief to our local model |
| say when you skimmed | each article lists the records it came from |
| disclose shortcuts | published negative results: five filters reported as failures, a proposal withdrawn two hours after it was made |

## Why love is in it

Truth drives efficiency. Love, as Michal put it, belongs next to it as the filter for **what** gets built. Truth decides whether an answer is right. Love decides whether it should be acted on. Our axioms carry the same split in engineering terms: `sound` and `safe_to_act_on` are separate checks.

## The limit

This is a design principle and an operating observation from one deployment, not a controlled comparison. We did not A/B the directive against a neutral prompt. The claim worth testing: **disclosed uncertainty reduces correction cycles.** It is measurable, and we have not measured it yet.
