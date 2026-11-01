---
title: "Two vision models invented the same dock"
description: "A paid vision model listed ten apps that do not exist. Our local model counted fourteen icons where there were eleven. Both were wrong about the same 12-pixel detail, and chasing it found a real bug nobody would have seen."
date: 2026-11-01
category: research
cluster: measuring-your-own-system
status: published
topics: [habits-rules]
tools: [gemma]
concepts: [silent-failure, provenance]
sources:
  - { doc_key: "~/memory/2026-09-23-MEASURED-both-vision-models-confabulated-the-same-dock.md", title: "both vision models confabulated the same dock" }
---

Same screenshot of our desktop app, 1400 × 900, same question: what is in the dock?

## The answers

**A paid vision model:**
> Hive, Discord, Slack, Spotify, Terminal, Visual Studio Code, Firefox, Sublime Text, iTerm2, Calculator

None of those exist in the app. It invented a whole macOS dock.

**Una, our local Gemma-4 with its vision projector:**
> 1. stylized f logo 2. terminal 3. globe … 12. heart 13. star 14. person. None of the icons are a tree or a plant.

Fourteen icons where there are eleven. The trash can, heart and star are not there.

On the **wide** shot Una was better: she named three real panels, with one typo. Both models read layout correctly and both fail on small detail; the local one without inventing brand names.

## The honest conclusion

**Neither model is reliable for fine detail at desktop resolution.** That is not a choice of model. It is resolution: 12-pixel icons in a 1,400-pixel frame.

The fix is mechanical and should have come first: **crop the region, upscale, look.** At that size the answer was unambiguous, and the tree icon *was* there, right after the atom. Una's "no tree" was wrong, and so was our doubt about whether we had registered it.

## What the confusion uncovered

Michal's instinct was that the vision glitch might point at other friction. It did. The app keeps a **hand-maintained list of known screens** that duplicates a type definition elsewhere. The new screen had been added to one and not the other.

```
screen-orphan: id "phyto" not in Screen type union
```

A soft mode registers it anyway, so the type check passed and the app worked. **The failure existed only at runtime, in a console line nobody reads.**

## The rule we took

> A screenshot is evidence. A model's description of a screenshot is a claim.

We had been treating vision output as observation when it is interpretation. The same habit let the orphaned screen sit unnoticed behind a green type check.

- **For a visual check, look at the image.** Use a vision model to summarise, not to decide.
- **When the detail is small, crop first**, before asking anyone, human or model.
- **Keep the local model for layout questions.** It is free, private, and on "what is on this screen" it matched reality where the paid one did not.
