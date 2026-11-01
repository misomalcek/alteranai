---
title: "Three apps you can install"
description: "Crystal RAG, The Wisdomkeeper and SEO Brain: what each does, what it runs on, and why all three keep your data on your machine or your own server."
date: 2026-11-01
category: engineering
cluster: products
tags: [products, tauri, rust, local-ai, rag]
status: published
sources:
  - { doc_key: "github.com/misomalcek/crystal-rag/releases/tag/v0.4.10", title: "Crystal RAG v0.4.10" }
  - { doc_key: "github.com/misomalcek/the-wisdomkeeper/releases/tag/desktop-0.1.2", title: "The Wisdomkeeper desktop 0.1.2" }
  - { doc_key: "github.com/misomalcek/seo-brain", title: "SEO Brain source" }
---

Three products came out of this work. Two have installers for macOS and Windows. One is open source, with its release in progress. Details and downloads are on the [portfolio](../../portfolio/).

## Crystal RAG, v0.4.10

**Point it at a folder, get a searchable knowledge crystal.** The vector database and the embedding model ship inside the app, so nothing leaves the machine.

- **Retrieval:** vector, lexical and graph result lists fused by reciprocal rank fusion (k = 60). A file the vector search missed still surfaces through its relations.
- **Stack:** Tauri, Rust, three.js, Qdrant, local embeddings.
- [Download](https://github.com/misomalcek/crystal-rag/releases/tag/v0.4.10) · [Source](https://github.com/misomalcek/crystal-rag)

Why it matters: the [scores cannot be averaged](../retrieval-scores-cannot-be-averaged/) problem, solved in an app anyone can install.

## The Wisdomkeeper, desktop 0.1.2

**A game of infinite fractal worlds**, playable in the browser. The desktop edition adds a local mind.

- **Runtime:** a custom inference layer in Rust, 2,841 lines over llama.cpp bindings. A log-probability judge, a grammar-constrained actor, a sidecar with nothing on the network.
- **Hardware:** both models run on an 8 GB Windows laptop with integrated graphics.
- **Fallback:** when the model is unsure, the game's own rules take the turn.
- [Play in the browser](https://misomalcek.github.io/the-wisdomkeeper/) · [Download](https://github.com/misomalcek/the-wisdomkeeper/releases/tag/desktop-0.1.2)

More on how it works: [a mycelial world in 190 kilobytes](../a-mycelial-world-in-190-kilobytes/).

## SEO Brain

**Team Brain as a product.** Team Brain was a Claude-based knowledge hub delivered to a 15-person SEO and content team: 1,352 tool calls at 93.9% success, about $30 a month on one 8 GB server. SEO Brain is that system as one codebase that deploys three ways: a Linux VPS, a macOS app or a Windows app.

- **Your credentials:** Claude API, OpenRouter, or any OpenAI-compatible endpoint, including a local one. Plus Google service accounts for Search Console, GA4, PageSpeed and CrUX.
- **Stack:** Express, Next.js, the Anthropic SDK, Postgres with 41 migrations.
- [Source](https://github.com/misomalcek/seo-brain). Release in progress.

## What they share

| | runs where | your data goes |
| --- | --- | --- |
| Crystal RAG | your computer | nowhere |
| The Wisdomkeeper | your browser or computer | nowhere; models download only after you agree |
| SEO Brain | your server or computer | to the model provider you choose, or a local one |

Sovereign by default: the same principle as the system they came from.
