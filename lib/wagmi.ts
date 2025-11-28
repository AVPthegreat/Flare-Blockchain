import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { Chain } from 'wagmi/chains';

const flareCoston2 = {
  id: 114,
  name: 'Flare Coston2',
  nativeCurrency: {
    decimals: 18,
    name: 'Coston2 Flare',
    symbol: 'C2FLR',
  },
  rpcUrls: {
    public: { http: ['https://coston2-api.flare.network/ext/C/rpc'] },
    default: { http: ['https://coston2-api.flare.network/ext/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Coston2 Explorer', url: 'https://coston2-explorer.flare.network' },
  },
  testnet: true,
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: 'NourishAI',
  projectId: 'YOUR_PROJECT_ID', // Replace with a real WalletConnect Project ID if needed
  chains: [flareCoston2],
  ssr: true,
});
