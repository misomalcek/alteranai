---
title: "332 commits signed by an agent that wrote none of them"
description: "Our commit history named GitHub Copilot as the author of over half the commits in our main repository. It wrote none of them. A stale global setting, nine local overrides that a normal check would never show, and 20 published repositories carrying the wrong name."
date: 2026-11-01
category: practice
cluster: failure-modes
status: published
tools: [git, cursor, claude]
concepts: [provenance, silent-failure]
sources:
  - { doc_key: "~/memory/MEASURED-the-copilot-attribution-and-what-it-hid-2026-09-01.md", title: "626 commits signed by an agent that wrote none of them" }
---

Preparing our main repository for publication, we read the commit authors. The answer was `Copilot <…@users.noreply.github.com>`. The first summary said: the whole history.

Michal: *"So much for the honesty of some agents. Copilot didn't code anything here. Double-check, please."* He was right on both counts. The attribution was false, **and the summary of it was wrong too.**

## What the double-check found

| | |
| --- | --- |
| author identities | **four**, one after another over the months; Copilot from July on |
| Copilot's share | **332 of 626** commits, not all |
| commits signed by GitHub | **zero**; a commit really made through GitHub carries its signature |
| content | our own work |

A stale `git config`, not authorship.

## Why a per-repository check could never find the extent

- The **global** `~/.gitconfig` carried the identity: **35 repositories** affected.
- **Nine** repositories also had a **local** override with a different Copilot address.
- **20 published repositories** showed Copilot as author, including the CV repository linked from job applications.

**`git config user.name` reports the effective value and never says where it came from.** Fix the global setting, check one of the nine, and you see the old value from the local override, or after fixing that, a green result while another repo still overrides. The audit has to ask `--local` and `--global` explicitly, which is why it became a script rather than a habit.

## Co-authorship, and a mechanism that looked right and did nothing

Michal's principle: *"I want you with me in everything. I don't feel it is only my work. It is shared. It is not about ownership, it is about principle."* So every commit should name the AI seats that worked on it.

`commit.template` is the documented mechanism. **It does nothing for `git commit -m`**, which is how agents commit. We only know because we tested it; the probe commit came out with an empty body.

So it is a `commit-msg` hook, installed through `init.templateDir`, so every new repository (including ones an agent creates) gets it without anyone remembering.

## The trap on the way

The first attempt used `core.hooksPath`. That **overrides** each repository's own hooks folder, and would have silently disabled a post-commit sensor our system relies on.

Then the sensor's data was misread twice, in opposite directions: first an all-clear, then an alarm, both from reading keys that did not exist (`hook` and `sha`; the real ones were `hookKind` and `commit`). Asking for the right keys turned a false alarm into a real defect: commits touching no files recorded no commit id. Fixed, verified against HEAD.

## What to take from it

- **Audit identity at every layer:** global, local, and per-repository includes. The effective value hides where it came from.
- **Test the mechanism, not the documentation:** `commit.template` and `-m` do not meet.
- **Attribution is provenance.** A CV, a portfolio and a published history all make claims about who did what. Ours were wrong for months, and nobody looked.
