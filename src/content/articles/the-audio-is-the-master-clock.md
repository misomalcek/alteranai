---
title: "The audio is the master clock"
description: "Narrated product demos, generated fully locally: speech synthesis, a scripted browser, ffmpeg. The first video had 12 seconds of voice over 8 seconds of picture. The one that passed every gate was 77 seconds of a frozen frame."
date: 2026-11-01
category: engineering
cluster: the-stack
status: published
tools: [playwright, ffmpeg]
concepts: [negative-control, silent-failure]
sources:
  - { doc_key: "~/memory/2026-10-22-MEASURED-video-pipeline-the-clock-must-be-the-audio.md", title: "video pipeline: the clock must be the audio" }
---

The portfolio needed demo videos for five apps. We built the pipeline locally, three stages:

```
1  narrate   script → speech     local text-to-speech (piper, English voice)
2  record    Playwright screen recording, paced to stage 1's duration
3  merge     ffmpeg, h264 + aac   gate: |video − audio| ≤ 2.0 s
```

## The decision that mattered

**Synthesise first, measure the real audio length, then drive the browser for exactly that long.** The reverse order, record then narrate, produced the first sample's defect: 12 seconds of voice over 8 seconds of video.

> The audio is the master clock. The scroll plan is scaled to fit it.

## Three measurements

| what | measured | the trap |
| --- | --- | --- |
| speech rate | 157–187 words per minute at script length | short test phrases gave 150 wpm: short utterances carry more lead-in silence and **understate** the rate |
| counting scroll steps | overshot 57.5 s by **4.34 s** | ~1,300 browser round-trips, each slower than a frame; counted steps drift, a wall-clock deadline does not |
| pre-roll | 1.9–3.0 s | launching and loading the page is recorded video too; charge it to the scroll budget |

The drift fix: scroll **inside** the page with `requestAnimationFrame` against `performance.now()`, eased. **Skew 4.34 s → 0.06 s.**

The duration gate earned itself on run one: it failed on the real 4.34 s overshoot before any video shipped.

## Results

| app | length | audio–video skew |
| --- | --- | --- |
| Crystal RAG | 57.4 s | 0.06 s |
| The Wisdomkeeper | 59.4 s | 0.12 s |
| SEO Brain | 58.7 s | 0.59 s |

## The defect the gate could not see

The fourth app's dashboard is a fixed-viewport app. The page body is exactly as tall as the window, and `window.scrollTo` does nothing; the app scrolls an **inner** container, 1,880 px tall. The recorder measured the body, planned a scroll distance of 0, and produced **77 seconds of a motionless frame**.

It passed the duration gate at 0.19 s skew. Perfectly in sync, completely useless.

The fixes:

- **Find what actually scrolls:** walk every element, pick the one with the most overflow, drive that. 0 → 1,291 px.
- **A second gate on a different property:** ffmpeg scene detection, at least three changes required.
- **A negative control for it:** a 20-second single-frame video scores 0; real takes score 179–586.

> A gate that measures the wrong property passes the defect with full marks. Two gates on different properties, each with a negative control.

## Two notes for anyone doing this with Playwright

- Pin the browser build to your Playwright version; `npx playwright install` fetches the latest, which may not match.
- The video file is written on `context.close()`, not on `page.close()`.
