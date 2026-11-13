---
title: "R2 Media Test - All File Types"
description: "Test post demonstrating all 4 media types from R2 bucket: audio (mp3, m4a), infographics (png), and slides (pdf)"
date: 2026-11-13T00:00:00.000Z
category: engineering
status: draft
---

# R2 Media Test - All File Types

This post tests the R2 CDN integration for alteranai.com, displaying all supported media types directly from the cloudflare R2 bucket.

## Audio (MP3)

<audio controls preload="metadata"
  src="https://media.alteranai.com/alteranai/audio/episode-01.mp3">
Your browser does not support the audio element.
</audio>

## Audio (M4A)

<audio controls preload="metadata"
  src="https://media.alteranai.com/alteranai/audio/demo.m4a">
Your browser does not support the audio element.
</audio>

## Infographic (PNG)

<img
  src="https://media.alteranai.com/alteranai/infographics/chart-01.png"
  alt="Alteran AI infographic chart"
  loading="lazy"
/>

## Slides (PDF)

<iframe
  src="https://media.alteranai.com/alteranai/slides/deck-01.pdf"
  width="100%" height="600"
  style="border: none;"
></iframe>

---

*All media served from R2 bucket via custom CDN domains:
- **Audio:** `.mp3` and `.m4a` files play natively with the `<audio>` tag
- **Infographics:** `.png` images display with lazy loading
- **Slides:** `.pdf` files embed in an `<iframe>` (CORS configured for fetch access)*