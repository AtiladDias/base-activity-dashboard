// Utility to fetch and normalize transactions for a Base address
// Sources: Blockscout (preferred) and BaseScan (fallback)
// This module is isomorphic, but some explorers may block CORS. If you hit CORS in the browser,
// consider calling this from a Next.js Route Handler (server) or set up a simple proxy.

export type NormalizedTx = {
  hash: string;
  from: string;
  to: string | null;
  valueWei: string; // decimal string in wei
  timeStamp: number; // seconds since epoch (UTC)
  success?: boolean;
  nonce?: number;
};

export type GetTransactionsOptions = {
  fromTimestamp?: number; // inclusive
  toTimestamp?: number;   // inclusive
  limit?: number;         // max tx to return after filtering (default 200)
  use?: 'blockscout' | 'basescan' | 'auto';
};

const DEFAULT_LIMIT = 200;

const normalizeAddress = (addr?: string | null) => (addr ? addr.toLowerCase() : null);

// ------------------------- Blockscout -------------------------
// Base mainnet blockscout: https://base.blockscout.com
// API v2 docs: https://blockscout.com/docs/api/v2
async function fetchBlockscoutPage(
  address: string,
  cursor?: string,
): Promise<{ items: any[]; next_cursor?: string }>{
  const base = 'https://base.blockscout.com/api/v2';
  const url = new URL(`${base}/addresses/${address}/transactions`);
  // We want both sent and received
  url.searchParams.set('filter', 'all');
  url.searchParams.set('limit', '100');
  if (cursor) url.searchParams.set('cursor', cursor);

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error(`Blockscout error: ${res.status}`);
  const data = await res.json();
  // Blockscout v2 commonly returns { items: Tx[], next_page_params: { cursor: '...' } }
  const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
  const next_cursor = data?.next_page_params?.cursor || data?.next_page_cursor || undefined;
  return { items, next_cursor };
}

function normalizeBlockscoutTx(tx: any): NormalizedTx | null {
  try {
    const hash: string = tx?.hash;
    const from: string = tx?.from?.hash || tx?.from || tx?.sender || '';
    const to: string | null = tx?.to?.hash || tx?.to || tx?.recipient || null;
    const valueWei: string = typeof tx?.value === 'string' ? tx.value : (tx?.value?.toString?.() ?? '0');
    const timeStamp: number = Number(tx?.timestamp || tx?.timeStamp || tx?.block?.timestamp || 0);
    const success: boolean | undefined = typeof tx?.success === 'boolean' ? tx.success : undefined;
    const nonce: number | undefined = tx?.nonce != null ? Number(tx.nonce) : undefined;
    if (!hash || !from || !timeStamp) return null;
    return {
      hash,
      from: from.toLowerCase(),
      to: to ? to.toLowerCase() : null,
      valueWei: valueWei ?? '0',
      timeStamp,
      success,
      nonce,
    };
  } catch {
    return null;
  }
}

async function getFromBlockscout(address: string, opts: GetTransactionsOptions): Promise<NormalizedTx[]> {
  const out: NormalizedTx[] = [];
  const seen = new Set<string>();
  let cursor: string | undefined = undefined;
  const limit = opts.limit ?? DEFAULT_LIMIT;

  while (out.length < limit) {
    const page = await fetchBlockscoutPage(address, cursor);
    if (!page.items.length) break;

    for (const raw of page.items) {
      const tx = normalizeBlockscoutTx(raw);
      if (!tx) continue;
      if (seen.has(tx.hash)) continue;
      seen.add(tx.hash);
      out.push(tx);
      if (out.length >= limit) break;
    }
    if (!page.next_cursor) break;
    cursor = page.next_cursor;
  }
  return out;
}

// ------------------------- BaseScan (Etherscan-compatible) -------------------------
// Docs: https://docs.basescan.org/
// Note: You may need an API key. Add it to .env as NEXT_PUBLIC_BASESCAN_API_KEY (or use a server-side secret).
async function getFromBaseScan(address: string, opts: GetTransactionsOptions): Promise<NormalizedTx[]> {
  const base = 'https://api.basescan.org/api';
  const url = new URL(base);
  url.searchParams.set('module', 'account');
  url.searchParams.set('action', 'txlist');
  url.searchParams.set('address', address);
  url.searchParams.set('sort', 'desc');
  url.searchParams.set('page', '1');
  url.searchParams.set('offset', String(Math.max(opts.limit ?? DEFAULT_LIMIT, 100)));
  const apiKey = process.env.NEXT_PUBLIC_BASESCAN_API_KEY || process.env.BASESCAN_API_KEY;
  if (apiKey) url.searchParams.set('apikey', apiKey);

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error(`BaseScan error: ${res.status}`);
  const data = await res.json();
  if (data?.status === '0' && data?.message) {
    // Etherscan-like APIs return status = '0' when no tx or error
    // We'll treat it as empty list, not an exception
    return [];
  }
  const list = Array.isArray(data?.result) ? data.result : [];
  const out: NormalizedTx[] = [];
  for (const tx of list) {
    const n: NormalizedTx = {
      hash: tx.hash,
      from: String(tx.from).toLowerCase(),
      to: tx.to ? String(tx.to).toLowerCase() : null,
      valueWei: String(tx.value ?? '0'),
      timeStamp: Number(tx.timeStamp || tx.timestamp || 0),
      success: tx.isError != null ? String(tx.isError) === '0' : undefined,
      nonce: tx.nonce != null ? Number(tx.nonce) : undefined,
    };
    if (n.hash && n.from && n.timeStamp) out.push(n);
  }
  return out;
}

function applyTimeFilters(list: NormalizedTx[], opts: GetTransactionsOptions): NormalizedTx[] {
  const fromTs = opts.fromTimestamp ?? -Infinity;
  const toTs = opts.toTimestamp ?? Infinity;
  return list.filter((t) => t.timeStamp >= fromTs && t.timeStamp <= toTs);
}

export async function getTransactions(
  address: string,
  opts: GetTransactionsOptions = {}
): Promise<NormalizedTx[]> {
  if (!address || !address.startsWith('0x') || address.length !== 42) {
    throw new Error('Invalid address');
  }
  const addr = address.toLowerCase();
  const mode = opts.use || 'auto';

  let list: NormalizedTx[] = [];
  if (mode === 'blockscout' || mode === 'auto') {
    try {
      list = await getFromBlockscout(addr, { ...opts, limit: Math.max(opts.limit ?? DEFAULT_LIMIT, 100) });
    } catch (e) {
      if (mode === 'blockscout') throw e;
    }
  }
  if ((!list || list.length === 0) && (mode === 'basescan' || mode === 'auto')) {
    try {
      list = await getFromBaseScan(addr, { ...opts });
    } catch (e) {
      if (mode === 'basescan') throw e;
    }
  }

  const filtered = applyTimeFilters(list, opts);
  // sort desc by time
  filtered.sort((a, b) => b.timeStamp - a.timeStamp);

  const limit = opts.limit ?? DEFAULT_LIMIT;
  return filtered.slice(0, limit);
}
