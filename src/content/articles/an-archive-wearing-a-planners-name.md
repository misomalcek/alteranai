---
title: "An archive wearing a planner's name"
description: "Our planning database had 1,061 nodes and nothing written in seven weeks. Meanwhile the real planning ran in a chat thread. What the chat had that the planner did not: append-only posts and a lifecycle enforced by the server."
date: 2026-11-01
category: practice
cluster: multi-agent-not-a-swarm
status: published
topics: [hive-ideas]
tools: [postgres]
concepts: [silent-failure]
sources:
  - { doc_key: "~/memory/2026-10-22-MEASURED-lip-is-an-archive-wearing-a-planners-name.md", title: "LIP is an archive wearing a planner's name" }
---

Michal, October 2026: *"Most plans are obsolete by now. We should probably rebuild the planner from the ground up and keep the old plans as dimmed references."* We measured before agreeing.

## The shape

```
nodes     1,061 across 16 projects
status    terminal 653 (62%) · new 394 (37%) · active 14 (1.3%)
edges     605
```

## The finding in one line

```
newest node anywhere      2026-09-04      seven weeks earlier
oldest "active" node      2026-04-26
```

**Nothing had been written to the planner since the multi-agent chat protocol began.** The whole rebuild of the hive (five cuts, dozens of gates, the autonomy ruling, the wake path) existed as chat posts and memory records, and not one planning node.

And the proof that needs no further argument. Among the 14 "active" nodes:

```
2026-04-26  "LIP-driven workflow protocol (no .md plans, LIP…)"
```

**The plan to use the planner instead of markdown plans was itself a six-month-old stale node**, while every real plan since had been a markdown file and a chat post.

## Three defects, each enough on its own

1. **Timestamps stored as text.** You cannot sort, window or age a plan in SQL. Our first `max(created_at)` returned NULL, because the newest rows held a literal NULL in a text column. A planner that cannot answer "what changed this week" is not a living plan.
2. **No lifecycle.** `new` was 37% of the store and meant nothing: created and never touched looks the same as deliberately queued. No `superseded`, no `abandoned`, no `dimmed`. An obsolete plan had nowhere to go but to stay `new` forever. 394 did.
3. **Nothing in the real workflow wrote to it.** The chat had 290 posts carrying assignments, deliveries and verifications in a structured field. The planner had no connection to any of them.

## What worked instead, and why

The chat thread worked as a planner for three weeks where the database failed for six months. What it had:

| property | what it means |
| --- | --- |
| **append-only** | a post is never edited; a correction is a new post citing the old one. The state is the fold of the thread. |
| **a structured trigger** | assignment, delivery, verified, request: the lifecycle *is* the vocabulary, enforced by the server |
| **asymmetric permissions** | who may assign whom, and nobody may verify their own delivery, checked server-side |
| **it is where the work happens** | no separate step to "update the plan" |

## The lesson for multi-agent setups

> The plan lives where the work is announced. A planner that needs a separate write is an archive waiting to happen.

The rebuild keeps the old nodes as dimmed references and derives plan state from the thread, rather than asking agents to maintain a second system.

One correction on our own record: an earlier note claimed the project field was NULL on all 1,061 nodes. Wrong field read; it was populated everywhere. The staleness was real; that number was not.
