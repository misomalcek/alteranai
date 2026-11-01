---
title: "A mycelial world in 190 kilobytes"
description: "The Wisdomkeeper generates its hero, world, music and sound in code. Underneath, a 70-weight network reads how you play and reshapes the next region."
date: 2026-11-01
category: nature
cluster: fractals-and-worlds
tags: [games, procedural, three-js, mycelium, local-ai]
status: published
sources:
  - { doc_key: "github.com/misomalcek/the-wisdomkeeper/README.md", title: "Wisdomkeeper README, browser and desktop editions" }
  - { doc_key: "the-wisdomkeeper/src/systems/mind.ts", title: "MycelialMind, 5→8→4 feed-forward network" }
  - { doc_key: "~/content/alteranai-content/01-Wisdomkeeper Physics, Phyto-Mycelial Intelligence, and Infinite Fractal Worlds.md", title: "Wisdomkeeper physics and phyto-mycelial intelligence" }
---

The Wisdomkeeper is an over-the-shoulder action RPG set in fractal worlds. You are a bioluminescent seed-spirit rooted in the soil of code, carrying a story home. [Play it in the browser](https://misomalcek.github.io/the-wisdomkeeper/).

## Nothing to download

The browser edition loads **no 3D asset files**. The hero, enemies, world, music and sound effects are generated in code, about **190 KB gzipped**.

- **Hero:** lathe geometry, layered armour plates, a thruster pack.
- **Look:** shaders compute rim light, vein networks and bioluminescence at runtime.
- **World:** recursive fractal trees and rivers of light from instanced meshes.

## Three ways to move

| mode | how it behaves |
| --- | --- |
| **Ground** | walk, dash, slopes limited to about 45° |
| **Free flight** | six axes; look to steer, `Space` up, `C` down, `Shift` to boost |
| **Levitation** | step onto a river of light and the current carries you |

## The mycelial mind

Under the game sits a deliberately tiny neural network: **5 inputs → 8 hidden → 4 outputs, about 70 weights, seeded per run.**

```
inputs   aggression · accuracy · roaming · evasion · …   (how you actually play)
outputs  a latent world code
effect   terrain ruggedness, enemy behaviour, drops, corruption in the next region
```

Its output is blended with a hand-written heuristic, 60% rules and 40% network, so the world adapts without ever becoming unplayable. The same principle as the desktop edition: **when the model is unsure, the game's own rules take the turn.**

## A choice with weight

Each region holds Remembrances, corrupted story nodes. Clearing one forces a choice:

- **Purify:** heal, grow an echo-tree, push back the corruption.
- **Embrace the Null:** take raw power and lose health. Embrace enough of them and the story ends at **The Hollow Crown**.

## Grounded in real fungal research

The premise, that fungal networks process information, comes from published biocomputing work. Mycelium produces action-potential-like spikes. Models of those networks implement logic gates. Dried mycelium behaves as a memristor usable for reservoir computing. The game does not simulate any of this. It borrows the idea that **a network without a brain can still decide where to grow.**

## The desktop edition

[Infinite Evolutions 0.1.2](https://github.com/misomalcek/the-wisdomkeeper/releases/tag/desktop-0.1.2), for macOS and Windows, adds a local mind: two small models that play the Warden and the forest, about 1.3 GB, downloaded only after you agree. No account, no telemetry. Both models run on an 8 GB Windows laptop with integrated graphics, at the Low preset.
