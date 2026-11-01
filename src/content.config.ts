import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { categories, clusters } from './data/site';
import { TOOLS, CONCEPTS } from './data/entities';
import corpus from './data/corpus.json';

const categorySlugs = categories.map((c) => c.slug) as [string, ...string[]];
const clusterSlugs = clusters.map((c) => c.slug) as [string, ...string[]];
const topicSlugs = corpus.topics.map((t) => t.slug) as [string, ...string[]];
const toolSlugs = TOOLS.map((t) => t.slug) as [string, ...string[]];
const conceptSlugs = CONCEPTS.map((c) => c.slug) as [string, ...string[]];

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(categorySlugs),
    cluster: z.enum(clusterSlugs),
    /** Typed tags, as on aisvet.sk. Topics are corpus folder names (corpus.json), never free text;
     *  a cited source adds its own folder automatically. Tools and concepts are entities. */
    topics: z.array(z.enum(topicSlugs)).default([]),
    tools: z.array(z.enum(toolSlugs)).default([]),
    concepts: z.array(z.enum(conceptSlugs)).default([]),
    /** Bibliography ids from src/data/sources.ts, in citation order; `[@id]` in the text. */
    cites: z.array(z.string()).default([]),
    /** draft articles build locally but never reach a listing or a route in production. */
    status: z.enum(['draft', 'published']).default('draft'),
    /** Provenance. A verified route (search_routes) can be attached once the citation check runs. */
    route_id: z.string().optional(),
    verified: z.boolean().default(false),
    verified_at: z.coerce.date().optional(),
    /** Our own records the numbers come from (hive memory, logs, code). */
    sources: z.array(z.object({ doc_key: z.string(), title: z.string() })).default([]),
    /** A listenable episode for this article. `kind` says what it is, so a generated discussion
     *  is never mistaken for a measurement: notebooklm = AI audio overview of the sources. */
    audio: z.object({
      src: z.string().url(),
      title: z.string(),
      minutes: z.number().int().positive(),
      kind: z.enum(['notebooklm', 'own']).default('notebooklm'),
    }).optional(),
  }),
});

export const collections = { articles };
