---
title: "The infinite session broke on 4 September"
description: "Michal: 'it felt like one infinite session, then it stopped.' One commit had removed the only line that loaded the continuity file. The file was still written before every compaction, and never read after. Three Claude Code hook details decided the fix."
date: 2026-11-01
category: practice
cluster: working-with-claude
status: published
tools: [claude-code, claude]
concepts: [system-prompt, silent-failure]
sources:
  - { doc_key: "~/memory/2026-10-03-MEASURED-the-infinite-session-broke-on-2026-09-04-and-the-missing-half.md", title: "the infinite session broke on 2026-09-04, and the missing half" }
---

For weeks, work with Claude Code across context compactions felt continuous: after a compaction the session knew what it had been doing. Then it stopped feeling that way. Michal noticed before anything was measured.

## The regression, with a date

```
2026-09-04  "CLAUDE.md: 2,210 words to 151, toolkit retired"
            removed:  @~/.claude/current-state.md
```

That `@` reference was the **only** mechanism loading the continuity file into a session. The slimming was right. It took the one load-bearing line with it.

## A write-only loop

```
PreCompact     hook writes current-state.md     works; content correct
SessionStart   9 hooks on startup|resume|clear|compact
               none of them reads current-state.md
```

**The file was updated exactly when context was about to be lost, and then never delivered to the session that replaced it.** Nothing was broken. Half was missing.

## Why not just restore the line

An `@` reference in CLAUDE.md is sent with **every turn**. The continuity file is about 1,300 tokens, so restoring it recreates the bloat the slimming had fixed, paid hundreds of times a session instead of once.

The fix is a **SessionStart hook** that delivers the file once, at the moment it matters.

## Three hook details that decided it

From the Claude Code documentation, read before writing a line:

1. **SessionStart receives its source on stdin**, as JSON: `{"source": "startup" | "resume" | "clear" | "compact" | …}`. Not as an argument. Reading `$1` would silently always take the default branch, and the after-compaction branch would never fire.
2. **PostCompact looks like the natural home, and is not:** its output does not reach the model. SessionStart with `source = compact` is the correct event.
3. **Hook output is capped at 10,000 characters**; past that it becomes a file-path preview. The hook keeps the **head** of the file, because the pre-compaction reminder asks Claude to write *what is happening right now* at the top.

The same file is framed differently by source: on a cold start it is background, after a compaction it is *"this is what the lost context was doing"*.

## Also found on the way

A "seen" marker for the hive chat only advanced when the hook *displayed* messages, not when the session posted them. After a compaction, the session would be shown its own posts as unread. Harmless, arguably useful, but the marker did not mean what its name said. Recorded, not fixed.

## For anyone running long Claude Code sessions

- A file written by **PreCompact** needs a matching reader on **SessionStart, source = compact**.
- Keep per-turn context (`@` references in CLAUDE.md) for what must be present every turn; deliver session state once.
- Test the hook against real stdin JSON for each source. That is the only way to know the compaction branch fires.
