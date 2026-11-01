---
title: "63 tool errors, and not one was the model reasoning badly"
description: "Our local agent logged 477 tool calls with 63 errors. Counted, it looks like an unreliable model. Classified by cause, 52 were our tooling, our guards or a deliberate test. The remaining 11 were aiming errors. 75% recovered on the next call."
date: 2026-11-01
category: engineering
cluster: multi-agent-not-a-swarm
status: published
topics: [habits-rules]
tools: [gemma, llama-cpp]
concepts: [silent-failure, sovereign-inference]
sources:
  - { doc_key: "~/memory/2026-09-29-MEASURED-all-63-tool-errors-classified-none-is-a-reasoning-failure.md", title: "63 errors out of 477 logged tool calls, classified by cause" }
---

Una, our local agent, runs a 12B model with real tools: file edits, shell, search, a browser. Over one logging window she made **477 tool calls, and 63 failed.** A 13% error rate reads like an unreliable model.

The first report counted errors. Michal objected: a model's error and the environment's error are not the same thing, and counting them together hides the only interesting result. So we classified every one.

## By cause

| count | cause |
| --- | --- |
| 13 | shell fell back to the home directory when no working directory was set |
| 13 | file-edit guard refused a no-op edit (old text equal to new) |
| 13 | timeouts, mostly vision at 80 s |
| 6 | wrong path or project layout |
| 5 | **deliberate error injection**, a test |
| 3 | a foreign test suite |
| 3 | wrong argument name; the tool returned its usage line and the run continued |
| 7 | single cases: a path suggestion, a policy-refused write, a file passed as a directory, credentials, a schema column |

## By who caused it

| | count | |
| --- | --- | --- |
| **intent** | 5 | the injection test, not failures at all |
| **tooling** | 30 | the home-directory fallback, timeouts, environment |
| **guards** | 17 | the system doing its job: refusing a no-op, refusing a write outside its roots |
| **model** | 11 | wrong path, wrong target type. **Aiming, not reasoning.** |

The 13 home-directory errors were one known defect in our shell tool, already written down as the root cause of a corrupted `package.json` weeks earlier. The opposite of "the AI misbehaved".

## Recovery

```
error, then immediate success     45
error, then another error         15   the same fallback firing until the path changed
error at the end of a session      3
no run ever aborted because of errors
```

**75% immediate recovery.** The longest run went 120 turns and 67 minutes without hitting its turn limit.

That is a better figure than "zero errors", because it is true and nobody can take it apart.

## Two measurements, one conclusion

A month earlier, from a different dataset, our taxonomy of entropy had concluded that every failure we could trace sat in the layer we control, not in the weights. This classification was done before re-reading that passage and reached the same result.

> The failures we call "the model lying" were, in every case we could trace, defects in the tier we control.

## What it changed

- **Report errors by cause, never as one rate.** A raw rate punishes a system for having guards.
- **Fix the 30 first.** The tooling errors are ours and cheap. The model's 11 are a prompt and path-layout problem.
- **Keep the injection test in the data, labelled.** It proves the error path works.

One more finding from the same pass: the logged token counts were **zero on all 389 run records**. We knew nothing about our own context use until we noticed the field was empty.
