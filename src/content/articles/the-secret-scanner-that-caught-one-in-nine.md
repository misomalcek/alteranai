---
title: "The secret scanner that caught 1 of 9"
description: "A commit hook had been checking every commit for leaked credentials for months. Tested against nine real credential shapes, it caught one. A pattern in its own list could never match, and the error went to /dev/null."
date: 2026-11-01
category: practice
cluster: working-with-claude
status: published
topics: [habits-rules]
tools: [claude]
concepts: [silent-failure, negative-control]
sources:
  - { doc_key: "~/memory/MEASURED-the-secret-hook-caught-one-of-nine-2026-09-01.md", title: "the secret hook caught 1 of 9" }
---

A repository meant to stay private had been pushed public, with an OAuth client secret in its history. The credentials were already revoked. Michal set the priority right: the leak was not the issue. **The routine was missing.**

A routine supposedly existed. A commit hook, `hook-block-secrets.sh`, ran on every commit and had for months. Nobody had ever tried to get something past it.

## The measurement

Nine real credential shapes, fed to the hook:

| shape | result |
| --- | --- |
| AWS access key | **blocked** |
| Google OAuth secret, the shape that leaked | passed |
| Google OAuth client id | passed |
| Google refresh token | passed |
| Google access token | passed |
| GitHub fine-grained token | passed |
| Slack webhook | passed |
| generic long hex API key | passed |
| private key block, **its pattern was in the list** | passed |

**1 of 9.**

## The bug worse than the missing patterns

```bash
grep -nE "$pattern" 2>/dev/null    # pattern = "-----BEGIN RSA PRIVATE KEY-----"
```

`grep` reads a leading dash as an option and fails. The hook sent that failure to `/dev/null`. **A scan that could not run looked exactly like a scan that found nothing.** Every pattern starting with a dash checked nothing, for months, silently.

The fix that matters is not `grep -e`. It is that **a scan error now blocks the commit.** A check that cannot run is not a pass.

## Then the first fix failed the other way

The tightened pattern flagged a scraped blog post as a leak. The match was the English word *task-specific*.

**A scanner that cries wolf gets switched off, and then it protects nothing.** Same failure, arriving later. The patterns were anchored to real key prefixes and measured again.

## What exists now

| | |
| --- | --- |
| the hook | 24 patterns, on commit **and** push, no override flag |
| its test | 26 cases: 19 must block, 7 must pass, plus a deliberately broken pattern proving a failed scan blocks |
| an audit | every repository, public versus private, with full history |

Audit after the fixes: **0 public repositories carrying credentials.**

## Two lessons that fail differently

1. **A guard that has never been attacked is a claim, not a control.** Four holes were found that day in two hooks, every one by trying to defeat them.
2. **Deleting a file does not delete the secret.** The leaked repo had a commit titled *"redact sensitive files before public push"*. It removed the file going forward and left the credential in every commit before. Only a history scan sees that.

If you use hooks with Claude Code or any agent: write the test that tries to get past the hook, and make the hook fail closed.
