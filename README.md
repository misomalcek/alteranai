# alteranai.com

The AlteranAI magazine: engineering and philosophy written from inside a running sovereign AI system.

- Astro 7, static. Design system: Phyto-Mycelial (tokens in `src/styles/global.css`, canvases in `src/scripts/myc.ts`).
- Taxonomy: 5 categories, 14 clusters in `src/data/site.ts`. An article with an unknown category or cluster fails the build.
- Articles: `src/content/articles/*.md`. `status: draft` builds in `npm run dev` only.

```
npm install
npm run dev        # http://localhost:4321/alteranai/
npm run build && npm run preview
```

Deploys to GitHub Pages on push to `main`. For the custom domain, build with
`SITE_URL=https://www.alteranai.com SITE_BASE=/` and add `public/CNAME`.
