import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';

import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';

import { WagmiConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ⚠️ Recomendo criar um Project ID real no WalletConnect Cloud e setar no Vercel.
// Por enquanto seguimos com "demo" (funciona, mas mostra warnings em build).
const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'demo';

// RainbowKit v2 + Wagmi v2
const config = getDefaultConfig({
  appName: 'Base Activity Dashboard',
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [base, baseSepolia],
  ssr: true,
});

// Query Client (React Query)
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <RainbowKitProvider
          theme={darkTheme({ borderRadius: 'small' })}
          modalSize="compact"
        >
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
