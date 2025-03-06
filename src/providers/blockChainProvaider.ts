import { FallbackProvider, JsonRpcProvider } from 'ethers';

/**
 * Тип поддерживаемых сетей для провайдеров.
 */
export type ProviderNetwork =
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

// Используем переменные окружения для API-ключа Infura
const INFURA_API_KEY = '66733f91658c43b0ba82bb7d7ca515c7';
const ALCHEMY_API_KEY = 'G-qxyXSO63yFNRoDFHCHARh5zRBIQxhl';


/**
 * RPC URL-адреса для поддерживаемых сетей.
 */

export const NETWORKS: Record<ProviderNetwork, string[]> = {
  ethMainnet: [
    `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
    'https://rpc.ankr.com/eth',
  ],
  baseMainnet: [`https://base-mainnet.infura.io/v3/${INFURA_API_KEY}`],
  polygonMainnet: [
    `https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`,
    'https://rpc.ankr.com/polygon',
  ],
  polygonTestnet: [
    `https://polygon-amoy.infura.io/v3/${INFURA_API_KEY}`,
    'https://rpc-mumbai.maticvigil.com',
  ],
  // zksyncMainnet: ['https://mainnet.era.zksync.io'],
  zksyncMainnet: [`https://zksync-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`],

  arbitrumMainnet: [
    `https://arbitrum-mainnet.infura.io/v3/${INFURA_API_KEY}`,
    'https://arb1.arbitrum.io/rpc',
  ],
  scrollMainnet: [
    'https://scroll-mainnet.chainstacklabs.com',
    'https://rpc.scroll.io',
  ],
  avalancheMainnet: [
    `https://avalanche-mainnet.infura.io/v3/${INFURA_API_KEY}`,
    'https://api.avax.network/ext/bc/C/rpc',
  ],
  gnosisMainnet: ['https://rpc.gnosischain.com'],
  bscMainnet: [`https://bsc-mainnet.infura.io/v3/${INFURA_API_KEY}`],
  optimismMainnet: [
    `https://optimism-mainnet.infura.io/v3/${INFURA_API_KEY}`,
    'https://mainnet.optimism.io',
  ],
  zkevmMainnet: [
    'https://zkevm-rpc.com',
    'https://1rpc.io/zkevm',
  ],
  zkevmTestnet: [
    'https://rpc.cardona.zkevm-rpc.com',
  ],
  sepolia: [`https://sepolia.infura.io/v3/${INFURA_API_KEY}`],
    lineaMainnet: [
    'https://rpc.linea.build',
    `https://linea-mainnet.infura.io/v3/${INFURA_API_KEY}`,
  ],
};

/**
 * Кэш для провайдеров, чтобы избежать повторного создания.
 */
const providerCache: Partial<Record<ProviderNetwork, FallbackProvider>> = {};

/**
 * Возвращает FallbackProvider для указанной сети.
 * @param network - Название сети
 * @returns FallbackProvider для работы с блокчейном
 */
export const getProvider = (network: ProviderNetwork): FallbackProvider => {
  if (providerCache[network]) {
    return providerCache[network] as FallbackProvider;
  }

  const rpcUrls = NETWORKS[network];

  if (!rpcUrls || rpcUrls.length === 0) {
    console.warn(`⚠️ Неизвестная сеть: ${network}`);
    throw new Error(`RPC не найден для сети: ${network}`);
  }

  const providers = rpcUrls.map((url) => new JsonRpcProvider(url));
  console.log('provider',providers);

  const fallbackProvider = new FallbackProvider(providers);

  providerCache[network] = fallbackProvider;
  return fallbackProvider;
};
