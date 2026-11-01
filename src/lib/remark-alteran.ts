/**
 * remark-alteran: two passes over every article.
 *
 * 1. Citations. `[@id]` in the text becomes a numbered superscript linking to the reference
 *    list. Numbers follow the order of `cites` in the frontmatter. An id that is not in
 *    `cites`, or not in src/data/sources.ts, fails the build: a citation cannot point nowhere.
 * 2. Entities. The first mention of a tool or concept (name or alias, whole word, any case)
 *    links to its page, as on aisvet.sk. Never inside links, code or headings.
 */
import { SOURCES } from '../data/sources';
import { ALL } from '../data/entities';

type Node = { type: string; value?: string; children?: Node[]; url?: string; data?: Record<string, unknown> };

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- unified plugin types differ between processors
export function remarkAlteran(opts: { base: string }): any {
  const base = opts.base.replace(/\/?$/, '/');
  const names: Array<{ re: string; slug: string; kind: string }> = [];
  for (const e of ALL) for (const n of [e.name, ...(e.aka ?? [])]) names.push({ re: esc(n), slug: e.slug, kind: e.kind });
  names.sort((a, b) => b.re.length - a.re.length);
  const lookup = new Map(ALL.flatMap((e) => [e.name, ...(e.aka ?? [])].map((n) => [n.toLowerCase(), e] as const)));
  const nameRe = new RegExp(`(?<![A-Za-z0-9_/.-])(${names.map((n) => n.re).join('|')})(?![A-Za-z0-9_-])`, 'gi');

  return (tree: Node, file: { path?: string; data: { astro?: { frontmatter?: Record<string, unknown> } } }) => {
    const fm = file.data.astro?.frontmatter ?? {};
    const cites = (fm.cites as string[] | undefined) ?? [];
    const where = file.path ?? 'article';
    for (const id of cites) if (!SOURCES[id]) throw new Error(`${where}: cites unknown source "${id}"`);
    const linked = new Set<string>();

    const walk = (node: Node, skip: boolean) => {
      if (!node.children) return;
      const out: Node[] = [];
      for (const child of node.children) {
        if (child.type !== 'text') {
          walk(child, skip || ['link', 'linkReference', 'heading', 'inlineCode', 'code'].includes(child.type));
          out.push(child);
          continue;
        }
        // pass 1: citations
        const parts: Node[] = [];
        let last = 0;
        const text = child.value ?? '';
        for (const m of text.matchAll(/\[@([A-Za-z0-9_]+)\]/g)) {
          const n = cites.indexOf(m[1]) + 1;
          if (n === 0) throw new Error(`${where}: [@${m[1]}] is used in the text but missing from cites`);
          if (m.index! > last) parts.push({ type: 'text', value: text.slice(last, m.index) });
          parts.push({ type: 'html', value: `<sup class="cite"><a href="#ref-${n}" aria-label="Reference ${n}">${n}</a></sup>` });
          last = m.index! + m[0].length;
        }
        if (last < text.length) parts.push({ type: 'text', value: text.slice(last) });
        // pass 2: entity links, first mention only
        for (const p of parts) {
          if (p.type !== 'text' || skip) { out.push(p); continue; }
          const v = p.value ?? '';
          let at = 0;
          for (const m of v.matchAll(nameRe)) {
            const e = lookup.get(m[1].toLowerCase());
            if (!e || linked.has(e.slug)) continue;
            linked.add(e.slug);
            if (m.index! > at) out.push({ type: 'text', value: v.slice(at, m.index) });
            out.push({ type: 'link', url: `${base}${e.kind}/${e.slug}/`, data: { hProperties: { className: ['auto-link'] } }, children: [{ type: 'text', value: m[1] }] });
            at = m.index! + m[1].length;
          }
          if (at < v.length) out.push({ type: 'text', value: v.slice(at) });
        }
      }
      node.children = out;
    };
    walk(tree, false);
  };
}
