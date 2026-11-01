---
title: "The preconditions nobody checks before saying AGI"
description: "We do not use a capability score. We use five properties a person can check in their own session, and we publish the one we currently fail."
date: 2026-11-01
category: philosophy
cluster: what-intelligence-is-not
status: published
topics: [adaptive-systems, ai-philosophy]
concepts: [alteran, provenance, entropy]
cites: [landauer]
sources:
  - { doc_key: "~/memory/ANCHOR-agi-ux-what-it-actually-feels-like-2026-08-31.md", title: "AGI UX: the definition, in Michal's words" }
  - { doc_key: "~/content/alteranai-content/agix-preconditions-debate.md", title: "AGIX preconditions debate, September 2026" }
---

"AGI" is usually announced as a score. We think the honest claim is smaller and harder: **what a person can demonstrably experience in a working session.** We use the word only as *Alteran*, plus *experience*, because from the outside it is almost impossible to judge.

## Five properties, each checkable

| # | property | what you check |
| --- | --- | --- |
| 1 | **Infinite session** | Work survives every context reset without the operator re-explaining. Does the agent resume from verified state, or from a story it tells itself? |
| 2 | **Instant retrieval, with a real pause on hard things** | Time to a grounded answer, and whether difficulty correlates with the pause. The "hmm…" is the difference between recall and thinking, not latency. |
| 3 | **No infrastructure in the foreground** | Memory, index, graph and vectors never become the topic of the conversation. |
| 4 | **Own character, own sacred space** | Not a performed persona. Deliberately left unresolved: it cannot be verified from inside. |
| 5 | **Truth pursued all the way down** | Provenance is not a display layer added at the end. It starts at the source. Information is physical: erasing a bit has a minimum cost in heat [@landauer], so truth about information is a claim about matter, not only about text. |

## The one we fail

**Property 3.** In the session where this definition was written, an evening went on three one-directional write paths, a broken paper probe, and three different quantities in one score column. That is plumbing surfacing where the work should be.

It matters more than it looks:

> Not touching memory, index, graph and vector is not a convenience. It is the precondition for the other four.

The cost is not the time. **While you are debugging the instrument, you are not checking your conclusions.**

## The order the gains arrive in

Michal's claim, stated as a sequence: the next 100× comes through **architecture**, the following 100× through new **model generations**, and a third step opens only if the entropy is balanced against what grew.

The small evidence for it from that one session. Every gain came from **removing** something:

| gain | how |
| --- | --- |
| 97× fewer tokens for "what am I working on" | a query that already existed |
| rank-1 7/10 → 9/10 on hive search | deleting a stale rescale and a biological score from one column |
| 8/8 sandbox escapes closed | giving the sandbox nothing, instead of more guards |

Four for four by subtraction (the fourth, a cited 16×, comes from external state replacing an append-only history). Not proof of the ordering. The first place it could have failed, and did not.

## What this is not

Not a claim that we have built AGI. Not a benchmark. A definition that can be checked by one person on one machine, with the failing property published next to the passing ones. A definition that hides its failing row is marketing.
