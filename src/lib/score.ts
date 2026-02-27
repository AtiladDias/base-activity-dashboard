import { type NormalizedTx } from './getTransactions';
import { resolveProtocolByAddress } from './protocolMap';

export type ActivitySummary = {
  txCount: number;
  activeDays: number;
  protocolsUsed: string[]; // protocol names (unique)
  score: number; // 0-100 (v1)
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
};

function toUTCDateKey(ts: number): string {
  const d = new Date(ts * 1000);
  // YYYY-MM-DD (UTC)
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

function computeActiveDays(transactions: NormalizedTx[]): number {
  const days = new Set<string>();
  for (const t of transactions) days.add(toUTCDateKey(t.timeStamp));
  return days.size;
}

function detectProtocols(transactions: NormalizedTx[]): string[] {
  const names = new Set<string>();
  for (const t of transactions) {
    const candidates = [t.to, t.from].filter(Boolean) as string[];
    for (const a of candidates) {
      const p = resolveProtocolByAddress(a);
      if (p) names.add(p.name);
    }
  }
  return Array.from(names).sort();
}

export function scoreV1(transactions: NormalizedTx[]): ActivitySummary {
  const txCount = transactions.length;
  const activeDays = computeActiveDays(transactions);
  const protocolsUsed = detectProtocols(transactions);

  // --- Heuristic scoring v1 (simple, transparent) ---
  // Transactions: up to 50 pts (1.5 pts each, cap at 50)
  const txPoints = Math.min(50, txCount * 1.5);

  // Active days: up to 25 pts (2.5 pts per unique day, cap at 25)
  const dayPoints = Math.min(25, activeDays * 2.5);

  // Protocol diversity: up to 25 pts (5 pts per protocol, cap at 25)
  const protoPoints = Math.min(25, protocolsUsed.length * 5);

  let total = Math.round(txPoints + dayPoints + protoPoints);
  if (Number.isNaN(total)) total = 0;
  total = Math.max(0, Math.min(100, total));

  let tier: ActivitySummary['tier'] = 'Bronze';
  if (total >= 85) tier = 'Diamond';
  else if (total >= 70) tier = 'Platinum';
  else if (total >= 55) tier = 'Gold';
  else if (total >= 40) tier = 'Silver';

  return {
    txCount,
    activeDays,
    protocolsUsed,
    score: total,
    tier,
  };
}

export function summarizeActivity(transactions: NormalizedTx[]): ActivitySummary {
  return scoreV1(transactions);
}
