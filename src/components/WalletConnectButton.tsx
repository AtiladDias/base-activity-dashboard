import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function WalletConnectButton() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '16px 0' }}>
      <ConnectButton
        showBalance={false}
        accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
      />
    </div>
  );
}
