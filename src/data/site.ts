/**
 * The site's taxonomy. Source of truth: ~/projects/alteranai/STRUCTURE-v2.md
 * (v1 clusters 1–10 unchanged, AXIS II clusters 11–14 added 2026-10-28).
 * Articles reference a category and a cluster by slug; the schema in
 * content.config.ts derives its enums from these lists, so a slug that is not
 * here fails the build.
 */

export const categories = [
  { slug: 'engineering', name: 'Engineering', axis: 'I', line: 'How it is actually built. Measurement over explanation.' },
  { slug: 'practice', name: 'Practice', axis: 'I', line: 'Working with Claude and local models, from real sessions.' },
  { slug: 'research', name: 'Research', axis: 'I', line: 'Papers, A/B results, and what we disproved.' },
  { slug: 'philosophy', name: 'Philosophy', axis: 'II', line: 'The Alteran line: axioms, the Dispozitiv, Mecha and Alteran.' },
  { slug: 'nature', name: 'Nature', axis: 'II', line: 'Flow, fractals, plant intelligence, thermodynamics. A gradient, not a brain.' },
] as const;

export const clusters = [
  { n: 1, slug: 'retrieval-that-works', name: 'Retrieval that works', axis: 'I', line: 'RRF, hybrid search, reranking, and why scores are not comparable.' },
  { n: 2, slug: 'memory-architecture', name: 'Memory architecture', axis: 'I', line: 'Facts, decay, anchors, importance.' },
  { n: 3, slug: 'failure-modes', name: 'Failure modes', axis: 'I', line: 'A structure that exists, is correct, and has no consumer.' },
  { n: 4, slug: 'sovereign-inference', name: 'Sovereign inference', axis: 'I', line: 'llama.cpp, caches, a Rust runtime, and what costs what.' },
  { n: 5, slug: 'multi-agent-not-a-swarm', name: 'Multi-agent, not a swarm', axis: 'I', line: 'Seats, permissions, wake paths, request-only autonomy.' },
  { n: 6, slug: 'working-with-claude', name: 'Working with Claude', axis: 'I', line: 'Prompts, hooks, skills versus rules.' },
  { n: 7, slug: 'the-stack', name: 'The stack', axis: 'I', line: 'Twenty-four stacks from the docs corpus, in real use.' },
  { n: 8, slug: 'measuring-your-own-system', name: 'Measuring your own system', axis: 'I', line: 'Gates, negative controls, and when a test lies.' },
  { n: 9, slug: 'phyto', name: 'Phyto', axis: 'I', line: 'An organic memory: aperture, hormones, consolidation.' },
  { n: 10, slug: 'products', name: 'Products', axis: 'I', line: 'The apps, with installers.' },
  { n: 11, slug: 'natural-flow', name: 'Natural flow', axis: 'II', line: 'A gradient, not a brain. River, mycelium and melting snow find the optimal path with no IQ.' },
  { n: 12, slug: 'what-intelligence-is-not', name: 'What intelligence is not', axis: 'II', line: 'The Socratic line, AGI preconditions, systems thinking.' },
  { n: 13, slug: 'the-dispozitiv', name: 'The Dispozitiv', axis: 'II', line: 'Formal limits, the apparatus, and why meaning needs a guardian.' },
  { n: 14, slug: 'fractals-and-worlds', name: 'Fractals and worlds', axis: 'II', line: 'Mandelbrot and AdamW, infinite fractal worlds, phyto-mycelial intelligence.' },
] as const;

export type CategorySlug = (typeof categories)[number]['slug'];
export type ClusterSlug = (typeof clusters)[number]['slug'];

/** The four nodes of the design system's information architecture. */
export const nodes = [
  { slug: 'topics', label: 'AI Topics', short: 'Topics', color: 'var(--cyan)', line: 'What intelligence is, and what it must not become.' },
  { slug: 'engineering', label: 'AI Engineering', short: 'Engine', color: 'var(--purple)', line: 'Stack, decisions, measurements.' },
  { slug: 'portfolio', label: 'AI Portfolio', short: 'Folio', color: 'var(--green)', line: 'Apps with installers, systems, games, repos.' },
  { slug: 'about', label: '.com', short: '.com', color: 'var(--cyan)', line: 'Who builds this, the offer, contact.' },
] as const;

/** AXIS II categories live under Topics, AXIS I under Engineering. */
export const topicCategories: CategorySlug[] = ['philosophy', 'nature'];
export const engineeringCategories: CategorySlug[] = ['engineering', 'practice', 'research'];

export const profiles = [
  { name: 'GitHub', href: 'https://github.com/misomalcek' },
  { name: 'CV', href: 'https://misomalcek.github.io/cyber-cv/' },
  { name: 'aisvet.sk', href: 'https://aisvet.sk' },
  { name: 'YouTube', href: 'https://www.youtube.com/@aisvet-sk' },
  { name: 'HearThis', href: 'https://hearthis.at/aisvet/' },
] as const;
