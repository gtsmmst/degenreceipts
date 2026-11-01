# degenreceipts.com

A gambler's diary with receipts. Static site built with [Astro](https://astro.build), hosted on Cloudflare Pages.

## How it works

- **Content source of truth** lives in `gtsmmst/panda-trading-stack` under `casino/` (review pages in `pages/*.md`, data in `data/casinos.json`, screenshots in `proof/`).
- `node scripts/sync-content.mjs ../panda-trading-stack/casino` copies it here (`src/content/casinos`, `src/data`, `public/proof`), then `python3 scripts/optimize-proof.py` shrinks the screenshots.
- `npm run build` → `dist/`. Cloudflare Pages builds on every push to `main`.

## Layout

- `src/pages/index.astro` — home: ranking table, withdrawal log, leaderboard, three rules
- `src/pages/casinos/[slug].astro` — one review page per casino
- `src/lib/casinos.ts` — data helpers; `src/data/site.json` — site-wide strings and links
- `scripts/remark-receipts.mjs` — turns screenshot lists into captioned receipt grids and "Best for / Not for" into cards
