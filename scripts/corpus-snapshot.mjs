// Snapshot of the research corpus taxonomy. Topic tags on the site are DERIVED from these
// folder names (hive chat #353/#355): nothing is hand-maintained, so nothing drifts.
// Run before a build when ~/sources or ~/content gains a folder:  node scripts/corpus-snapshot.mjs
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const HOME = homedir();
// Not published: private CV material, school work, tooling scratch, design assets.
const SKIP = /^(_|cv-|school-|slovak-humanizer|public-media|alteranai-design|aisvet-content|wisdomkeeper-assets|factorium-audit|claude-guides-raw|ai-adoption|alteranai-content)/;
// A content folder that continues a sources folder under a shorter name.
const ALIAS = { fol: 'fol-reasoning' };
const DOC = /\.(md|pdf|txt|html)$/i;

function count(dir) {
  let n = 0;
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const s = statSync(p);
    if (s.isDirectory()) n += count(p);
    else if (DOC.test(f) && !/\.pdf\.md$/i.test(f)) n++;
  }
  return n;
}

const topics = {};
for (const [root, kind] of [['sources', 'sources'], ['content', 'content']]) {
  for (const d of readdirSync(join(HOME, root))) {
    const p = join(HOME, root, d);
    if (!statSync(p).isDirectory() || SKIP.test(d)) continue;
    const base = d.replace(/-blueprints$/, '');
    const slug = ALIAS[base] ?? base;
    topics[slug] ??= { slug, sources: 0, content: 0 };
    topics[slug][kind] += count(p);
  }
}
const out = Object.values(topics).filter((t) => t.sources + t.content > 0).sort((a, b) => a.slug.localeCompare(b.slug));
writeFileSync('src/data/corpus.json', JSON.stringify({ taken: new Date().toISOString().slice(0, 10), topics: out }, null, 2) + '\n');
console.log(out.length, 'topics');
