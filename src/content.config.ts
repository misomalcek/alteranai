import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { categories, clusters } from './data/site';

const categorySlugs = categories.map((c) => c.slug) as [string, ...string[]];
const clusterSlugs = clusters.map((c) => c.slug) as [string, ...string[]];

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(categorySlugs),
    cluster: z.enum(clusterSlugs),
    tags: z.array(z.string()).default([]),
    /** draft articles build locally but never reach a listing or a route in production. */
    status: z.enum(['draft', 'published']).default('draft'),
    /** Provenance. A verified route (search_routes) can be attached once the citation check runs. */
    route_id: z.string().optional(),
    verified: z.boolean().default(false),
    verified_at: z.coerce.date().optional(),
    sources: z.array(z.object({ doc_key: z.string(), title: z.string() })).default([]),
  }),
});

export const collections = { articles };
