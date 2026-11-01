---
title: "Store a rule as the situation that triggers it"
description: "Retrieved by its own wording, a behavioural rule came back 1 time in 5. Stored as the situations it should fire in, 10 of 10. And where the trick stops working."
date: 2026-11-01
category: practice
cluster: working-with-claude
tags: [rules, prompts, retrieval, agents, claude]
status: published
sources:
  - { doc_key: "~/memory/PAPER-measuring-whether-behavioural-rules-change-model-decisions-2026-08", title: "measuring whether behavioural rules change model decisions" }
  - { doc_key: "~/memory/2026-10-22-PLAN-the-two-research-papers-and-what-they-need.md", title: "paper 1: result, limits, bilingual finding" }
  - { doc_key: "~/memory/2026-09-29-LEDGER-every-cv-claim-and-its-evidence-path.md", title: "claim ledger: rule retrieval, tool variant" }
---

Our agents work under 41 behavioural rules: things like *audit before proposing* or *never restart while an agent is running*. A rule in a long system prompt gets skimmed. So we retrieve the relevant ones per situation. The question was how to store them.

## The result

| how the rule is stored | retrieved when it applies |
| --- | --- |
| by its own wording | **1 in 5** |
| as the situations that should trigger it | **10 of 10** |

A rule reads like a principle: *"Audit, then propose."* The moment it applies reads nothing like that: *"I am about to suggest a fix for code I have not opened."* Embeddings match the moment to other moments, not to principles.

**The fix: store each rule with the situations it fires in.** 41 rules, 226 triggers. The agent's current situation is the query.

## A second confirmation, by accident

In October 2026 we found that **85% of the triggers were written in Slovak**, while every agent run is in English. One probe went from 0.57 to 1.0 after adding English triggers. Nobody designed that test. It says the same thing: **the retrieval key matters more than the rule text.**

## Where it stops working

The same technique on **tool selection**: 7/10 at rank 1, 9/10 in the top 3. Weaker. Tools are described by what they do, and situations that need two different tools often read alike. Naming where your technique stops is part of the result.

## Cost

About **150 ms** at p50 (p90 168 ms, n=20, warm), over a store of about 6,000 facts.

## How to use it with Claude

- **Write triggers, not slogans.** For each rule, write three to six first-person moments where it should fire: *"about to commit while a service is down"*.
- **Write them in the language of the run.** If your agents work in English, the triggers must be in English.
- **Retrieve per turn, inject only the hits.** A short list of the rules that apply now beats a long list of all of them.
- **Probe it.** Write ten situations, mark which rule should fire, count. Our first count was the 1 in 5.

## The honest limits

Ten probes is a small n. The comparison is between two of our own configurations, not yet against a standard baseline such as plain semantic search or BM25 over the rule statements. Both are the next measurement, and both are written down as such.
