
export type NetworkType =
  | 'ethMainnet'
  | 'lineaMainnet'
  | 'baseMainnet'
  | 'polygonMainnet'
  | 'polygonTestnet'
  | 'zksyncMainnet'
  | 'arbitrumMainnet'
  | 'scrollMainnet'
  | 'avalancheMainnet'
  | 'gnosisMainnet'
  | 'bscMainnet'
  | 'optimismMainnet'
  | 'sepolia'
  | 'zkevmMainnet'
  | 'zkevmTestnet';


export const currencyByNetwork: Record<NetworkType, string> = {
  ethMainnet: 'ETH',
  lineaMainnet: 'ETH',
  baseMainnet: 'ETH',
  polygonMainnet: 'MATIC',
  polygonTestnet: 'MATIC',
  zksyncMainnet: 'ETH',
  arbitrumMainnet: 'ETH',
  scrollMainnet: 'ETH',
  avalancheMainnet: 'AVAX',
  gnosisMainnet: 'xDAI',
  bscMainnet: 'BNB',
  optimismMainnet: 'ETH',
  sepolia: 'ETH',
  zkevmMainnet: 'ETH',
  zkevmTestnet: 'ETH',
} as const;

export type RootStackParamList = {
  Registration: undefined;
  Wallet: undefined;
  Send: { network: NetworkType };
  MoonPay: undefined;
  TransactionHistory: {
    address: string;
    network: NetworkType;
  };
};
