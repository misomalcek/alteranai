import type { APIContext } from 'astro';
import { articles } from '../data/util';

const x = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function GET({ site }: APIContext) {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const root = new URL(base, site).href;
  const items = (await articles()).map((a) => {
    const link = new URL(`${base}articles/${a.id}/`, site).href;
    return `<item><title>${x(a.data.title)}</title><link>${link}</link><guid>${link}</guid><pubDate>${a.data.date.toUTCString()}</pubDate><description>${x(a.data.description)}</description></item>`;
  });
  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>AlteranAI</title><link>${root}</link><description>Engineering notes and philosophy from a sovereign AI system on one machine.</description><language>en</language>${items.join('')}</channel></rss>`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
