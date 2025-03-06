

import { getProvider } from './blockChainProvaider';

/**
 * Получает провайдера для тестнета Sepoia.
 * @returns FallbackProvider для сети Sepoia.
 */

export const getSepoiaProvider = () => {
  return getProvider('sepolia');
};
