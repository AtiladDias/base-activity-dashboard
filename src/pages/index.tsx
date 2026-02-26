import dynamic from 'next/dynamic';

// evita SSR do ConnectButton
const WalletConnectButton = dynamic(
  () => import('../components/WalletConnectButton'),
  { ssr: false }
);

export default function Home() {
  return (
    <main style={{ maxWidth: 760, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <WalletConnectButton />

      <h1>Base Activity Dashboard</h1>
      <p>Connect your wallet to explore your onchain activity on Base.</p>

      <ul style={{ marginTop: 16, color: '#555' }}>
        <li>Wallet login (Base)</li>
        <li>Transaction history (BaseScan / Blockscout)</li>
        <li>Protocol detection (e.g., Aerodrome, Uniswap)</li>
        <li>Activity frequency + Airdrop Farmer Score</li>
      </ul>
    </main>
  );
}
