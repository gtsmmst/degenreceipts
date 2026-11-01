import data from '../data/casinos.json';

export type Proof = { hash: string; amount: string; date: string; usd?: string; chain?: string; to?: string };
export type Casino = {
  slug: string; name: string; ref: string | null; ref_code: string | null;
  verdict: string | null; rank: number | null; status: string;
  tier: 'great' | 'good' | 'neutral' | 'negative' | 'none'; tier_label: string;
  summary: string; wagered_label: string; wagered_usd?: number | null; vip?: string; joined?: string;
  deposits_usd?: number; withdrawals_usd?: number; net_usd?: number; deposits_n?: number; withdrawals_n?: number;
  proof_deposit?: Proof; proof_withdrawal?: Proof; note?: string;
};

export const casinos = (data.casinos as Casino[]).slice().sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));
export const bySlug = Object.fromEntries(casinos.map((c) => [c.slug, c])) as Record<string, Casino>;

export function txUrl(p: Proof): string {
  return p.chain === 'solana' ? `https://solscan.io/tx/${p.hash}` : `https://etherscan.io/tx/${p.hash}`;
}
export function txSite(p: Proof): string {
  return p.chain === 'solana' ? 'Solscan' : 'Etherscan';
}

export function usd(n: number | null | undefined, opts: { sign?: boolean; compact?: boolean } = {}): string {
  if (n == null) return '—';
  const abs = Math.abs(n);
  let s: string;
  if (opts.compact && abs >= 1_000_000) s = `$${(abs / 1_000_000).toFixed(2)}M`;
  else if (opts.compact && abs >= 10_000) s = `$${Math.round(abs / 1000)}K`;
  else s = `$${Math.round(abs).toLocaleString('en-US')}`;
  if (opts.sign) return (n < 0 ? '−' : '+') + s;
  return (n < 0 ? '−' : '') + s;
}

export function shortDate(d: string): string {
  const m = d.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);
  if (!m) return d;
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const mon = months[parseInt(m[2], 10) - 1];
  return m[3] ? `${mon} ${m[3]}, ${m[1]}` : `${mon} ${m[1]}`;
}
