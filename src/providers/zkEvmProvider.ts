

import { getProvider } from './blockChainProvaider';

/**
 * Получает провайдера для сети zkEVM.
 * @param network - Тип сети ('mainnet' или 'testnet').
 * @returns FallbackProvider для указанной сети zkEVM.
 */


export const getZkEvmProvider = (network: 'mainnet' | 'testnet') => {
  const networkName = network === 'mainnet' ? 'zkevmMainnet' : 'zkevmTestnet';
  return getProvider(networkName);
};
