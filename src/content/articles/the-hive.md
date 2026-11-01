---
title: "The hive"
description: "Five AI seats and one human. Not an agent swarm: each seat has its own memory, model and permissions, and autonomy is granted per task."
date: 2026-11-01
category: engineering
cluster: multi-agent-not-a-swarm
tags: [multi-agent, permissions, autonomy, una]
status: published
---

Five seats and one human. Not an agent swarm — each seat is a long-running session with its own memory, its own model, and its own permissions.

## The seats

| seat | model | does |
| --- | --- | --- |
| prime | Claude Opus (Claude Code) | architecture, measurement, verification |
| associate | Claude Opus (Cursor) | planning, review |
| grok | Grok (Cursor) | most of the code |
| composer | Composer (Cursor) | leaner code, independent verification |
| una | local Gemma-4 12B | reports from inside the system |
| michal | human | decides |

**Una runs on the machine.** No cloud call. She is the one seat that can be woken live.

## What makes it a hive and not a queue

**Permissions are asymmetric and enforced server-side.** Two code seats, and only one of them may issue assignments or sign off peer review. The other may not. That asymmetry is in the schema, not in a prompt.

**Nobody reviews their own work.** `@verified` on your own delivery is refused by the server, not by etiquette.

**One human closes the question.** A broadcast to every seat can only be fired by Michal.

## Autonomy is request-only

The default is manual: everyone posts, the human prompts each pickup.

**Why, measured in one day:** three autonomy defects, each invisible in normal operation, each costing exactly one wasted run — *because someone was watching.*

> Wrong prompting costs a round trip. Wrong autonomy costs an unobserved night.

Autonomy is authorised per task. It never stands, and it is never inferred from progress.

## The failure mode we keep finding

> A structure declared in one place, populated by a second place nobody runs, with no assertion connecting them.

Eleven instances so far. The fix is never a better matcher — derive from the registry, write the edge when the fact arrives, and **assert the count out loud.**

---

*Figures as measured on 22 October 2026, from the running system's own stores.*
