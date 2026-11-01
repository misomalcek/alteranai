---
title: "Send the question, not the pixels"
description: "Remote computer use spent five full screenshots to learn that a window was black. One local call to our own vision model answered the question in a sentence, without the image leaving the machine. Local won on cost, speed, privacy and usefulness at once."
date: 2026-11-01
category: practice
cluster: working-with-claude
status: published
topics: [inference]
tools: [claude, gemma]
concepts: [sovereign-inference]
sources:
  - { doc_key: "~/memory/MEASURED-remote-computer-use-cost-vs-local-2026-09-04.md", title: "remote computer use against local tooling" }
---

Mid-debug, Michal: *"I'm burning half my five-hour limit on remote computer use for something we can do locally practically for free."* He was right, and the numbers were on the screen.

## The same question, two ways

**Remote computer use:** five screenshots of the app window, each a full image sent to the cloud, plus clicking through the dock by trial, because the app routes by state and has no URL per screen. **Result: we learned the screen was black.**

**Local:** one call to our own browser tool, answered by the local vision model on this machine:

```
{ url, prompt: "is the dock visible? is the screen blank?" }
→ visionModel: gemma-4-12b-it-Q5_K_M
→ "The dock is visible at the bottom, and the screen shows content."
```

One sentence back. The image never crossed the network.

## Why it is structural, not a preference

The remote path sends **pixels** and asks the cloud to read them. The local path sends **a question** to the machine that already has the pixels.

| | remote computer use | local vision call |
| --- | --- | --- |
| cost | an image per step | a sentence |
| speed | a round trip per step | none |
| privacy | the screen leaves the machine | it does not |
| output | something to interpret | an interpretation |

The usual argument for local tools is "good enough, in exchange for privacy". **Here local wins on all four axes.** That is not the shape of a compromise.

## The part that was ours

Five screenshots before switching. After the second showed the wrong screen, the right move was to stop clicking and read the code. That rule was in our rules table, written two hours earlier: *long debugging with no output means stop.*

**Having a rule and consulting it are different acts.** Our rules are retrievable 9–10 times in 10 when the situation is described to them. Nobody described it. Michal stopped the session, not the rule.

## What shipped

An error boundary per screen: a crash now prints its message, six stack frames and the component stack, keeps the dock alive, and logs so a headless read finds it. It did not fix that bug. It made the next one legible, which is the cheaper thing to own.

**When to use remote computer use:** apps with no local interface and no API. **When not to:** anything a local model on the same machine can look at and answer.
