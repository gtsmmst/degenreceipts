import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import remarkReceipts from './scripts/remark-receipts.mjs';

export default defineConfig({
  site: 'https://degenreceipts.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  markdown: {
    processor: unified({ remarkPlugins: [remarkReceipts] }),
  },
});
