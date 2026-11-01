// Copies review pages, data and proof screenshots from the panda-trading-stack
// repo (casino/) into this site. Source of truth stays there; run this before
// committing content changes here.
//
//   node scripts/sync-content.mjs [path-to-panda-trading-stack/casino]

import { cpSync, mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const src = resolve(process.argv[2] ?? '../panda-trading-stack/casino');
const here = resolve(new URL('..', import.meta.url).pathname);

// 1. pages/*.md -> src/content/casinos/*.md
const pagesDir = join(src, 'pages');
const outDir = join(here, 'src/content/casinos');
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const file of readdirSync(pagesDir).filter((f) => f.endsWith('.md'))) {
  const raw = readFileSync(join(pagesDir, file), 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`no frontmatter: ${file}`);
  let [, fm, body] = m;

  // first H1 -> title; "Updated … · by Panda …" line -> byline
  const h1 = body.match(/^# (.+)$/m);
  const title = h1 ? h1[1].trim() : file.replace('.md', '');
  if (h1) body = body.replace(h1[0], '');
  const by = body.match(/^Updated [^\n]+$/m);
  let byline = '';
  if (by) {
    const parts = by[0].trim().split(' · **');
    byline = parts[0];
    let extra = parts.length > 1 ? '**' + parts.slice(1).join(' · **') : '';
    extra = extra.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    body = body.replace(by[0], extra ? `<p class="page-note">${extra}</p>` : '');
  }

  // "## Proof" -> "## Receipts"; image paths ../proof/x -> /proof/x
  body = body.replace(/^## Proof$/m, '## Receipts');
  body = body.replace(/\]\(\.\.\/proof\//g, '](/proof/');
  body = body.replace(/^\n{2,}/, '\n');

  const q = (s) => JSON.stringify(s);
  fm = `${fm}\ntitle: ${q(title)}\nbyline: ${q(byline)}`;
  writeFileSync(join(outDir, file), `---\n${fm}\n---\n${body.trimStart()}`);
  console.log('page', file, '->', title);
}

// 2. data/casinos.json -> src/data/casinos.json (as is)
mkdirSync(join(here, 'src/data'), { recursive: true });
cpSync(join(src, 'data/casinos.json'), join(here, 'src/data/casinos.json'));
if (existsSync(join(src, 'data/stake_flows.json'))) {
  cpSync(join(src, 'data/stake_flows.json'), join(here, 'src/data/stake_flows.json'));
}

// 3. proof/** -> public/proof/**
rmSync(join(here, 'public/proof'), { recursive: true, force: true });
cpSync(join(src, 'proof'), join(here, 'public/proof'), { recursive: true });
console.log('proof copied');
