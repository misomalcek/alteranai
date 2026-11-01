---
title: "Our memory server was answering the whole network"
description: "From another machine on the network, with a hostile Origin header and no authentication, our API returned our most protected memory record. Two defaults, each documented and harmless alone. The development convenience was the deployed posture."
date: 2026-11-01
category: engineering
cluster: failure-modes
status: published
topics: [systems-design]
tools: [claude, cursor]
concepts: [silent-failure, negative-control]
sources:
  - { doc_key: "~/memory/MEASURED-the-hive-was-answering-the-lan-2026-09-02.md", title: "the hive was answering the LAN, to any origin" }
---

We were checking whether the compromised packages named in a 2026 security-conference talk were installed anywhere in our system. **None were.** The real finding was ours.

## The measurement

From another address on the same local network, no authentication:

```
GET http://<machine>:3000/api/memory/search
    Origin: https://evil.example.com

→ 200 · access-control-allow-origin: * · 2,616 bytes of an anchor memory
```

The record that came back was the hive's value-axis document, its most protected record, served to a declared hostile origin.

## Two defaults, each harmless alone

```ts
app.use('/*', cors());              // no argument: origin '*' on every route
serve({ fetch: app.fetch, port });  // hostname defaults to 0.0.0.0, not loopback
```

Neither is a bug. A CORS middleware with no argument is documented as permissive. A Node server binding all interfaces is the convention. **The exposure existed only in the combination**, which is why reading either file alone finds nothing.

And the CORS line carried a comment: `// CORS for dev`. True. There is no separate production deployment here. **The development convenience was the deployed posture**, for as long as it had existed.

## The fix, and four checks after it

An origin allowlist (loopback and the local dev origins, extendable by setting for a deliberate multi-device session), binding to `127.0.0.1` unless configured otherwise, and the websocket layer pointed at the same list.

A security fix that breaks the product is not a fix, so it was tested in four directions after a restart:

| probe | expected | result |
| --- | --- | --- |
| from the network address | refused | refused ✓ |
| hostile Origin header | no CORS header | none ✓ |
| loopback search | works | 200 ✓ |
| the local frontend's origin | allowed | allowed ✓ |

## What the conference material added

The talk's slides were already in our research corpus, as OCR'd images. **We searched the wrong layer** and did not find them until Michal pointed at the tool that searches sources.

Their timeline was the useful part: **AI tooling as the primary supply-chain target**. Malicious models on model hubs, backdoored MCP packages, poisoned editor extensions (one campaign explicitly targeting Claude Code users), fake installers served through search ads.

## The rule

> Check what a service answers from outside, with a hostile header, not what its config file says.

If you run a local AI stack with a web UI, run that one request from another device. It takes a minute.
