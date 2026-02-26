import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';

import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';

import { WagmiConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

// ⚠️ Quando puder, crie um Project ID gratuito no WalletConnect e troque a string abaixo.
const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'demo';

// RainbowKit v2 + Wagmi v2: cria a config completa (sem configureChains)
const config = getDefaultConfig({
  appName: 'Base Activity Dashboard',
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [base, baseSepolia],
  ssr: true, // Next.js
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider theme={darkTheme({ borderRadius: 'small' })} modalSize="compact">
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
