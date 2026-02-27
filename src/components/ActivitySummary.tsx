"use client";

import * as React from 'react';
import { useAccount } from 'wagmi';
import { getTransactions, type NormalizedTx } from '@/lib/getTransactions';
import { summarizeActivity, type ActivitySummary as ActivitySummaryType } from '@/lib/score';

// Simple, dependency-free UI card styles (works with or without Tailwind)
const card: React.CSSProperties = {
  border: '1px solid var(--border, #e5e7eb)',
  borderRadius: 12,
  padding: 16,
  background: 'var(--card, #fff)',
};
const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: 12,
};
const labelStyle: React.CSSProperties = { color: '#6b7280', fontSize: 12 };
const valueStyle: React.CSSProperties = { fontSize: 24, fontWeight: 700 };

export function ActivitySummary() {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [summary, setSummary] = React.useState<ActivitySummaryType | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function run(addr: `0x${string}`) {
      setLoading(true);
      setError(null);
      try {
        // Try Blockscout first (usually CORS-friendly), fallback handled in lib
        const txs: NormalizedTx[] = await getTransactions(addr, { limit: 300, use: 'auto' });
        const s = summarizeActivity(txs);
        if (!cancelled) setSummary(s);
      } catch (e: any) {
        console.error(e);
        if (!cancelled) setError(e?.message || 'Failed to load activity');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (isConnected && address) run(address);
    else {
      setSummary(null);
      setError(null);
    }
    return () => {
      cancelled = true;
    };
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <div style={card}>
        <div style={{ ...labelStyle, marginBottom: 8 }}>Activity Summary</div>
        <div>Connect your wallet to see your Base activity.</div>
      </div>
    );
  }

  return (
    <div style={card}>
      <div style={{ ...labelStyle, marginBottom: 12 }}>Activity Summary</div>
      {loading && <div>Loading activity…</div>}
      {error && (
        <div style={{ color: '#b91c1c', marginBottom: 8 }}>
          {error}
        </div>
      )}
      {summary && (
        <div style={grid}>
          <Metric label="Tx count" value={summary.txCount.toLocaleString()} />
          <Metric label="Active days" value={summary.activeDays.toLocaleString()} />
          <Metric label="Protocols" value={summary.protocolsUsed.length.toString()} tooltip={summary.protocolsUsed.join(', ')} />
          <Metric label="Score" value={`${summary.score}`} sub={summary.tier} />
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, sub, tooltip }: { label: string; value: string; sub?: string; tooltip?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }} title={tooltip}>
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>{value}</span>
      {sub ? <span style={{ color: '#6b7280' }}>{sub}</span> : null}
    </div>
  );
}

export default ActivitySummary;
