import { getCollection, type CollectionEntry } from 'astro:content';
import { categories, clusters } from './site';
import { SOURCES } from './sources';
import corpus from './corpus.json';

export type Article = CollectionEntry<'articles'>;

const BASE = import.meta.env.BASE_URL.replace(/\/?$/, '/');

/** A site-relative path with the deploy base in front: url('topics/') → /alteranai/topics/ */
export const url = (path = '') => BASE + path.replace(/^\//, '');

/** Published articles, newest first. Drafts show only in `astro dev`. */
export async function articles(): Promise<Article[]> {
  const all = await getCollection('articles', (a) => import.meta.env.DEV || a.data.status === 'published');
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const categoryOf = (slug: string) => categories.find((c) => c.slug === slug)!;
export const clusterOf = (slug: string) => clusters.find((c) => c.slug === slug)!;

export const tagSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Cover tint per axis: AXIS I runs cyan/purple, AXIS II green/purple. Same article, same image. */
export function coverCols(a: Article): string {
  const c = clusterOf(a.data.cluster);
  return c.axis === 'I' ? '0,239,252;158,119,255;0,255,157' : '0,255,157;158,119,255;0,239,252';
}

export const fmtDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/** Rough reading time at 220 words per minute. */
export const readMinutes = (body = '') => Math.max(1, Math.round(body.split(/\s+/).length / 220));

export const CORPUS = corpus;
export const topicOf = (slug: string) => corpus.topics.find((t) => t.slug === slug);
export const topicName = (slug: string) => slug.replace(/-/g, ' ');

/** Topic tags of an article: its declared topics plus the folder of every source it cites. */
export function topicsOf(a: Article): string[] {
  const t = new Set<string>(a.data.topics);
  for (const id of a.data.cites) { const s = SOURCES[id]; if (s && s.topic !== 'external') t.add(s.topic); }
  return [...t].sort();
}

export const TIER_LABEL: Record<string, string> = {
  primary: 'original', web: 'saved page', synthesis: 'synthesis', own: 'our record', external: 'not in corpus',
};
