---
title: "A system must first see itself"
description: "For three and a half hours our agent layer recorded none of five local-model runs. A network sensor that knows nothing about agents recorded all five, to the minute. Self-report was not wrong. It was absent, and absence reads as 'nothing happened'."
date: 2026-11-01
category: research
cluster: measuring-your-own-system
status: published
topics: [hive-ideas]
tools: [llama-cpp, claude, postgres, qdrant]
concepts: [silent-failure, negative-control, provenance]
sources:
  - { doc_key: "~/memory/MEASURED-the-network-saw-runs-the-agent-layer-did-not-2026-09-01.md", title: "the network sensor saw runs the agent layer could not report" }
---

Michal: *"If a system wants to improve itself, it first has to be able to see itself. At least its real, true footprint, not just what the agent sees."*

On 1 September 2026 those two turned out to be measurably different.

## Work modes nobody defined

Our network sensor records, per sample, which processes are talking. Grouping samples by that signature:

| signature | samples | reading |
| --- | --- | --- |
| browser helpers, node, mDNS | 144 | **idle**: no Claude at all |
| + Claude | 36 | working alone |
| Claude + Postgres + Qdrant | 7 | **searching the hive**: graph and vectors together |
| Claude + the local model server | 4 | **the local model is loaded** |

Nobody wrote these categories. They are what co-occurs.

## The hypothesis that failed, and why the failure was the finding

*"The local model server in a signature means Una is running."* Tested against recorded agent start events:

```
model-server samples within 3 minutes of an agent event:   1 of 6
```

False as stated. It nearly ended there. Then the remaining five were checked against the answer files Una had actually written:

```
network saw the model:   15:58    16:24–16:27    17:17
Una's output files:      15:59    16:25          17:19
```

**Exact correspondence.** Those runs left no agent event because a telemetry fix landed only at 16:37; before it, every run through that endpoint discarded its events (`onEvent: () => {}`).

**The agent layer could not report five of its own runs. The network sensor recorded all five anyway.** A layer that knows nothing about agents, tools or sessions, only bytes per process, held the true account.

## Why this is not philosophical

The self-report was not wrong in the usual sense. **It was absent, and absence reads as "nothing happened" rather than "I cannot see".** That is the failure this hive keeps meeting: an empty result that looks like data.

An independent sensor cannot fix an agent's blind spot by reasoning. It fixes it by being somewhere else. Every defect found that week was caught the same way: a second measurement from a different direction, never introspection.

## The corollary

A system meant to improve itself needs its **real footprint**, not its account of its footprint. For three and a half hours those differed, and nothing in the agent layer could have said so.

## What this is not

Six observations of the model server, one machine, one afternoon. The signatures are suggestive, not established. The claim that survives is narrow and checkable: in that window the network record held runs the agent record did not, and the two agree on every run both could see.
