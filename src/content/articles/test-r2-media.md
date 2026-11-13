---
title: "R2 Media - Audio, Images & Slides"
description: "Demonstrating R2 CDN media delivery for alteranai: podcast audio (MP3, M4A), infographics (PNG), and slides (PDF)"
date: 2026-11-13T00:00:00.000Z
category: engineering
cluster: the-stack
status: published
topics: ["media-cdn", "r2", "audio", "visuals", "slides"]
---

# R2 Media - Audio, Images & Slides

This post demonstrates the R2 CDN integration for alteranai.com, delivering various media types directly from the cloudflare R2 bucket.

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
  width="100%" height="800"
  style="border: none;"
></iframe>

---

## Technical Implementation

All media files are served from the R2 bucket via custom domains:

- **Audio** (`.mp3` and `.m4a`): Native `<audio>` elements with playback controls
- **Infographics** (`.png`): Responsive images with lazy loading via `<img>` tags
- **Slides** (`.pdf`): Embedded PDF viewers using `<iframe>` with full-width layout

The CDN is configured with proper CORS headers allowing fetch access for PDF.js and other clients.