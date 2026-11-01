import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkReceipts from './scripts/remark-receipts.mjs';

export default defineConfig({
  site: 'https://degenreceipts.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    processor: unified({ remarkPlugins: [remarkReceipts] }),
  },
});
