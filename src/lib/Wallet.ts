
import { ethers } from 'ethers';
import { saveSeedPhrase, getSeedPhrase } from './SecureStorage';

/**
 * Создает новый кошелек, сохраняет seed-фразу и возвращает кошелек.
 */
export const createWallet = async (): Promise<ethers.HDNodeWallet> => {
  const wallet = ethers.Wallet.createRandom();
  if (!wallet.mnemonic) {
    throw new Error('Mnemonic is not available for the created wallet.');
  }
  await saveSeedPhrase(wallet.mnemonic.phrase);
  return wallet;
};

/**
 * Восстанавливает кошелек из сохраненной seed-фразы.
 */

export const getWallet = async (): Promise<ethers.HDNodeWallet> => {
  const phrase = await getSeedPhrase();
  if (!phrase) {
    throw new Error('Seed phrase not found in storage.');
  }
  return ethers.Wallet.fromPhrase(phrase);
};
