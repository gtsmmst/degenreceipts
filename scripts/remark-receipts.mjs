// Remark plugin for review pages:
//  - consecutive image paragraphs -> <div class="shots"> of <figure> with caption + link to full size
//  - a paragraph starting with **Best for:** and containing **Not for:** -> two verdict cards
import { visit } from 'unist-util-visit';

function text(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value;
  return (node.children || []).map(text).join('');
}
function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default function remarkReceipts() {
  return (tree, file) => {
    const kids = tree.children;
    const out = [];
    let i = 0;
    const imgPara = (n) => n.type === 'paragraph' && n.children.length > 0 &&
      n.children.every((ch) => ch.type === 'image' || (ch.type === 'text' && !ch.value.trim()));
    while (i < kids.length) {
      const n = kids[i];
      if (imgPara(n)) {
        const group = [];
        while (i < kids.length && imgPara(kids[i])) {
          group.push(...kids[i].children.filter((ch) => ch.type === 'image'));
          i++;
        }
        const html = group.map((img) =>
          `<figure class="shot"><a href="${esc(img.url)}" target="_blank" rel="noopener"><img src="${esc(img.url)}" alt="${esc(img.alt || '')}" loading="lazy" decoding="async"></a><figcaption>${esc(img.alt || '')}</figcaption></figure>`
        ).join('');
        out.push({ type: 'html', value: `<div class="shots">${html}</div>` });
        continue;
      }
      if (n.type === 'paragraph' && n.children[0]?.type === 'strong' && /^Best for:/i.test(text(n.children[0]))) {
        const full = text(n);
        const m = full.match(/^Best for:\s*([\s\S]*?)\s*Not for:\s*([\s\S]*)$/i);
        if (m) {
          out.push({ type: 'html', value:
            `<div class="verdict-cards"><div class="verdict-card best"><div class="eyebrow">Best for</div>${esc(m[1])}</div><div class="verdict-card not"><div class="eyebrow">Not for</div>${esc(m[2])}</div></div>` });
          i++;
          continue;
        }
      }
      out.push(n);
      i++;
    }
    tree.children = out;
  };
}
