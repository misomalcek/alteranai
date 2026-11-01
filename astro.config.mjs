import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages serves the project from /alteranai/ until the domain points here.
// When alteranai.com is switched to this build: SITE_URL=https://www.alteranai.com SITE_BASE=/
const site = process.env.SITE_URL ?? 'https://misomalcek.github.io';
const base = process.env.SITE_BASE ?? '/alteranai';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: { shikiConfig: { theme: 'github-dark-dimmed' } },
});
