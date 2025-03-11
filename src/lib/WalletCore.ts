
// import { ethers, HDNodeWallet, Mnemonic } from 'ethers';
// import SecureStorage, { ACCESSIBLE } from 'react-native-secure-key-store';
// // import * as Keychain from 'react-native-keychain';

// const STORAGE_KEY = 'WALLET_MNEMONIC';
// const DERIVATION_PATH = "m/44'/60'/0'/0"; 

// export const generateMnemonic = (): string => {
//   return Mnemonic.fromEntropy(ethers.randomBytes(16)).phrase;
// };

// export const validateMnemonic = (phrase: string): boolean => {
//   return Mnemonic.isValidMnemonic(phrase);
// };

// export const createHDWallet = (
//   mnemonic: string,
//   accountIndex: number = 0
// ): HDNodeWallet => {
//   if (!validateMnemonic(mnemonic)) {
//     throw new Error('Invalid mnemonic phrase');
//   }

//   return ethers.HDNodeWallet.fromMnemonic(
//     Mnemonic.fromPhrase(mnemonic),
//     `${DERIVATION_PATH}/${accountIndex}`
//   );
// };

// export const storeMnemonic = async (mnemonic: string): Promise<void> => {
//   if (!validateMnemonic(mnemonic)) {
//     throw new Error('Invalid mnemonic');
//   }

//   await SecureStorage.set(STORAGE_KEY, mnemonic, {
//     accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
//     // accessible:'AccessibleWhenUnlocked'


//   });
// };

// // export const storeMnemonic = async (mnemonic: string): Promise<void> => {
// //   await Keychain.setGenericPassword('mnemonic', mnemonic, {
// //     service: 'walletMnemonic',
// //   });
// // };

// export const loadMnemonic = async (): Promise<string> => {
//   try {
//     const phrase = await SecureStorage.get(STORAGE_KEY);
//     if (!validateMnemonic(phrase)) {
//       throw new Error('Corrupted mnemonic');
//     }
//     return phrase;
//   } catch (error) {
//     throw new Error('Mnemonic not found');
//   }
// };

// // export const loadMnemonic = async (): Promise<string> => {
// //   const credentials = await Keychain.getGenericPassword({ service: 'walletMnemonic' });
// //   if (!credentials) {
// //     throw new Error('Mnemonic not found');
// //   }
// //   return credentials.password;
// // };

// export const deleteWallet = async (): Promise<void> => {
//   await SecureStorage.remove(STORAGE_KEY);
// };

// // export const deleteWallet = async (): Promise<void> => {
// //   await Keychain.resetGenericPassword({ service: 'walletMnemonic' });
// // };










//==========================================================================================================================//


import { ethers, HDNodeWallet, Mnemonic } from 'ethers';
// import SecureStorage, { ACCESSIBLE } from 'react-native-secure-key-store';
import * as Keychain from 'react-native-keychain';

const STORAGE_KEY = 'WALLET_MNEMONIC';
const DERIVATION_PATH = "m/44'/60'/0'/0"; // BIP-44 для Ethereum

export const generateMnemonic = (): string => {
  return Mnemonic.fromEntropy(ethers.randomBytes(16)).phrase;
};

export const validateMnemonic = (phrase: string): boolean => {
  return Mnemonic.isValidMnemonic(phrase);
};

export const createHDWallet = (
  mnemonic: string,
  accountIndex: number = 0
): HDNodeWallet => {
  if (!validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase');
  }

  return ethers.HDNodeWallet.fromMnemonic(
    Mnemonic.fromPhrase(mnemonic),
    `${DERIVATION_PATH}/${accountIndex}`
  );
};

// export const storeMnemonic = async (mnemonic: string): Promise<void> => {
//   if (!validateMnemonic(mnemonic)) {
//     throw new Error('Invalid mnemonic');
//   }

//   await SecureStorage.set(STORAGE_KEY, mnemonic, {
//     accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
//     // accessible:'AccessibleWhenUnlocked'


//   });
// };

export const storeMnemonic = async (mnemonic: string): Promise<void> => {
  await Keychain.setGenericPassword('mnemonic', mnemonic, {
    service: 'walletMnemonic',
  });
};

// export const loadMnemonic = async (): Promise<string> => {
//   try {
//     const phrase = await SecureStorage.get(STORAGE_KEY);
//     if (!validateMnemonic(phrase)) {
//       throw new Error('Corrupted mnemonic');
//     }
//     return phrase;
//   } catch (error) {
//     throw new Error('Mnemonic not found');
//   }
// };

export const loadMnemonic = async (): Promise<string> => {
  const credentials = await Keychain.getGenericPassword({ service: 'walletMnemonic' });
  if (!credentials) {
    throw new Error('Mnemonic not found');
  }
  return credentials.password;
};

// export const deleteWallet = async (): Promise<void> => {
//   await SecureStorage.remove(STORAGE_KEY);
// };

export const deleteWallet = async (): Promise<void> => {
  await Keychain.resetGenericPassword({ service: 'walletMnemonic' });
};