---
title: "65,651 lines on 29 dependencies"
description: "Twelve modules we wrote by hand instead of installing a framework: rank fusion in 84 lines, a tool-call salvager in 197. What each replaced, and when a library is still the right call."
date: 2026-11-01
category: engineering
cluster: the-stack
tags: [dependencies, typescript, architecture, cut-the-middlemen]
status: published
sources:
  - { doc_key: "factorium/src (find src -name '*.ts*' | wc -l, 2026-11-01)", title: "line count, recounted on publication day" }
  - { doc_key: "factorium/package.json", title: "29 runtime dependencies, 17 dev" }
  - { doc_key: "~/memory/2026-09-29-LEDGER-every-cv-claim-and-its-evidence-path.md", title: "claim ledger: hand-built modules" }
---

Factorium, the system behind this site, is **65,651 lines of TypeScript on 29 runtime dependencies** (17 more for development), counted on 1 November 2026. On 29 September it was 61,459 lines on the same 29. The code grew. The dependency list did not.

"Cut the middlemen" is one of our working rules. This is what it looks like as a measurement instead of a slogan.

## Twelve modules, 2,004 lines

| module | lines | instead of |
| --- | --- | --- |
| `json-repair` | 64 | a JSON repair library, for model output that is almost JSON |
| `html-to-text` | 77 | an HTML parsing stack, for fetched pages |
| `rrf` | 84 | a retrieval framework's fusion layer: reciprocal rank fusion of BM25 and vector lists |
| `memory-lift` | 85 | a memory framework's promotion logic |
| `biological-score` | 87 | — (ours: decay, importance, soul) |
| `local-mutex` | 89 | a locking package |
| `context-hot-swap` | 158 | an agent framework's context manager |
| `gemma-toolcall-salvage` | 197 | — (recovers tool calls a local model emits in the wrong shape) |
| `mcp-bridge` | 208 | an MCP client wrapper |
| `local-embed` | 218 | an embeddings SDK |
| `event-bus` | 366 | a message broker client |
| `session-store` | 371 | a session or state library |

## Why

- **Every layer is a place a bug can hide.** Our recurring failure is a component that reports success over work it never did. In 84 lines of `rrf` we can see it. Inside a framework we would see its log line.
- **Local models need local fixes.** `gemma-toolcall-salvage` exists because a local model emits tool calls in shapes no SDK expects. No framework ships that.
- **Upgrades are free.** Nothing to migrate when a framework changes its abstractions twice a year.

## We still use libraries for the hard parts

The 29 dependencies are the things that should not be rewritten: the Anthropic SDK, the Postgres and Qdrant clients, the HTTP server, the graph extension, the UI stack. Each solves something deep and stable.

**The rule:** install what is deep and stable, write what is thin and ours. A fusion function is 84 lines. A vector database is not.

## What we evaluated and declined

LangChain, LlamaIndex and PyKEEN were evaluated and not adopted. Each would have replaced a few hundred lines we understand with a layer we would have to learn, debug and track. That is a trade, not a principle: for a team without the time to write `rrf`, the framework is the right call.

## The docs we keep next to it

The 24 stacks we do depend on are scraped into a local documentation corpus (about 1,444 chunks), so agents answer from the version we run, not from what they remember.
