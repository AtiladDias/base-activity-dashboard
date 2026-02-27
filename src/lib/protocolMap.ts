// Minimal protocol map for Base chain.
// The goal is to recognize popular protocol contracts by address
// so we can attribute activity in the score.
// This list is intentionally small and easy to extend via PRs.

export type ProtocolInfo = {
  id: string; // stable id/slug
  name: string;
  tags?: string[];
  addresses: string[]; // checksummed or lowercased; we compare in lowercase
};

const L = (s: string) => s.toLowerCase();

export const PROTOCOLS: ProtocolInfo[] = [
  // --- DEXes ---
  {
    id: 'uniswap',
    name: 'Uniswap',
    tags: ['dex', 'swap'],
    // Uniswap V3 SwapRouter02 is commonly 0x68B3... across many EVM chains (including Base)
    addresses: [L('0x68B3465833fb72A70ecDF485E0e4C7bD8665Fc45')],
  },
  // Aerodrome (add known routers/factories as discovered)
  // {
  //   id: 'aerodrome',
  //   name: 'Aerodrome',
  //   tags: ['dex', 'amm'],
  //   addresses: [L('0x...')],
  // },

  // --- NFT / Marketplace ---
  {
    id: 'seaport',
    name: 'Seaport',
    tags: ['nft', 'marketplace'],
    // Canonical Seaport 1.5 deploy
    addresses: [L('0x00000000006c3852cbeF3e08E8dF289169EdE581')],
  },

  // --- Tokens / System ---
  {
    id: 'weth',
    name: 'WETH',
    tags: ['token'],
    // OP Stack WETH on Base
    addresses: [L('0x4200000000000000000000000000000000000006')],
  },
  {
    id: 'usdc',
    name: 'USDC',
    tags: ['token', 'stable'],
    // Native USDC on Base
    addresses: [L('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913')],
  },
];

const ADDR_TO_PROTOCOL: Record<string, ProtocolInfo> = PROTOCOLS.reduce((acc, p) => {
  for (const a of p.addresses) acc[a.toLowerCase()] = p;
  return acc;
}, {} as Record<string, ProtocolInfo>);

export function resolveProtocolByAddress(address?: string | null): ProtocolInfo | null {
  if (!address) return null;
  return ADDR_TO_PROTOCOL[address.toLowerCase()] ?? null;
}
