import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { remarkAlteran } from './src/lib/remark-alteran';

// Served from the custom domain root (public/CNAME). The old project URL,
// misomalcek.github.io/alteranai/, is redirected there by GitHub Pages.
// To preview under a sub-path instead: SITE_URL=https://misomalcek.github.io SITE_BASE=/alteranai
const site = process.env.SITE_URL ?? 'https://alteranai.com';
const base = process.env.SITE_BASE ?? '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-dark-dimmed' },
    remarkPlugins: [[remarkAlteran, { base }]],
  },
});
