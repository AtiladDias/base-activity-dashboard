import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';

import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { http } from 'viem';

const { chains, publicClient } = configureChains(
  [base, baseSepolia], // use Base mainnet e testnet
  [http()] // usa RPC público por enquanto; depois podemos configurar Alchemy/Infura
);

const { connectors } = getDefaultWallets({
  appName: 'Base Activity Dashboard',
  projectId: 'wagmi', // pode substituir por um WalletConnect Project ID depois
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        theme={darkTheme({ borderRadius: 'small' })}
        modalSize="compact"
      >
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
