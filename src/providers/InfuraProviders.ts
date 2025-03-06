

import { getProvider } from './blockChainProvaider';

/**
 * Получает провайдера для сети Polygon.
 * @param network - Тип сети ('mainnet' или 'testnet').
 * @returns FallbackProvider для указанной сети Polygon.
 */


export const getPolygonProvider = (network: 'mainnet' | 'testnet') => {
  const networkName = network === 'mainnet' ? 'polygonMainnet' : 'polygonTestnet';
  return getProvider(networkName);
};
