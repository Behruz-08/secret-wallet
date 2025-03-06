// import { useEffect, useState, useCallback } from 'react';
// import { ethers, formatEther } from 'ethers';
// import { generateMnemonic, storeMnemonic, loadMnemonic, createHDWallet } from '../lib/WalletCore';
// import { getProvider } from '../providers/blockChainProvaider';
// import { NetworkType } from '../constants/currency';
// import { currencyByNetwork } from '../constants/currency';

// const useWallet = () => {
//   const [wallet, setWallet] = useState<ethers.HDNodeWallet | null>(null);
//   console.log(wallet);

//   const [balance, setBalance] = useState<string>('0');
//   const [network, setNetwork] = useState<NetworkType>('polygonMainnet');

//   const currency = currencyByNetwork[network];

//   const initWallet = useCallback(async () => {
//     try {
//       let mnemonic = await loadMnemonic();
//       if (!mnemonic) {
//         mnemonic = generateMnemonic();
//         await storeMnemonic(mnemonic);
//       }
//       const newWallet = createHDWallet(mnemonic);
//       setWallet(newWallet);
//     } catch (error) {
//       console.error('Wallet init error:', error);
//     }
//   }, []);

//   const refreshBalance = useCallback(async () => {
//     if (wallet?.address) {
//       const provider = getProvider(network);
//       const newBalance = await provider.getBalance(wallet.address);
//       setBalance(formatEther(newBalance));
//     }
//   }, [wallet, network]);

//   useEffect(() => {
//     refreshBalance();
//   }, [network, refreshBalance]);

//   useEffect(() => {
//     initWallet();
//   }, [initWallet]);



//   useEffect(() => {
//     let isMounted = true;
//     const updateBalance = async () => {
//       if (wallet?.address) {
//         try {
//           const provider = getProvider(network);
//           const bal = await provider.getBalance(wallet.address);
//           if (isMounted) {
//             setBalance(formatEther(bal));
//           }
//         } catch (error) {
//           if (error instanceof Error) {
//             console.error('Balance update error:', error.message);
//           } else {
//             console.error('Non-Error object caught during balance update:', error);
//           }
//         }
//       }
//     };
//     const interval = setInterval(updateBalance, 15000);
//     return () => {
//       isMounted = false;
//       clearInterval(interval);
//     };
//   }, [wallet, network]);

//   return { wallet, balance, network, setNetwork, refreshBalance, currency };
// };

// export default useWallet;



import { useEffect, useState, useCallback } from 'react';
import { ethers, HDNodeWallet } from 'ethers';
import {
  generateMnemonic,
  storeMnemonic,
  loadMnemonic,
  createHDWallet,
  validateMnemonic,
  deleteWallet,
} from '../lib/WalletCore';
import { getProvider } from '../providers/blockChainProvaider';
import { NetworkType } from '../constants/currency';
import { isFirstRun } from '../lib/SecureStorage';

type WalletState = {
  isInitialized: boolean;
  accounts: HDNodeWallet[];
  currentAccountIndex: number;
  balance: string;
  network: NetworkType;
  mnemonic: string | null;
  isRegistered: boolean;
};

const useWallet = () => {
  const [state, setState] = useState<WalletState>({
    isInitialized: false,
    accounts: [],
    currentAccountIndex: 0,
    balance: '0',
    network: 'polygonMainnet',
    mnemonic: null,
    isRegistered: false,
  });

  const initializeWallet = useCallback(async () => {
    try {
      const mnemonic = await loadMnemonic();
      const accounts = [createHDWallet(mnemonic)];
      const firstRun = await isFirstRun();
      if (firstRun){
      setState(prev => ({
        ...prev,
        isInitialized: true,
        accounts,
        mnemonic,
        isRegistered:false ,
      }));
      return;
    }
    } catch (error) {
      setState(prev => ({ ...prev, isInitialized: false }));
    }
  }, []);

  const createNewWallet = useCallback(async () => {
    const mnemonic = generateMnemonic();
    await storeMnemonic(mnemonic);
    const accounts = [createHDWallet(mnemonic)];

    setState(prev => ({
      ...prev,
      isRegistered: true,

      accounts,
      mnemonic,
    }));

    return mnemonic;
  }, []);

  const restoreWallet = useCallback(async (phrase: string) => {
    if (!validateMnemonic(phrase)) {throw new Error('Invalid phrase');}
    await storeMnemonic(phrase);
    initializeWallet();
    setState(prev => ({
      ...prev,
      isRegistered: true,
    }));
  }, [initializeWallet]);

  const addAccount = useCallback(() => {
    if (!state.mnemonic) {return;}

    const newAccount = createHDWallet(
      state.mnemonic,
      state.accounts.length
    );

    setState(prev => ({
      ...prev,
      accounts: [...prev.accounts, newAccount],
    }));
  }, [state.accounts.length, state.mnemonic]);

  const updateBalance = useCallback(async () => {
    if (!state.accounts[state.currentAccountIndex]?.address) {return;}

    try {
      const provider = getProvider(state.network);
      const balance = await provider.getBalance(
        state.accounts[state.currentAccountIndex].address
      );

      setState(prev => ({
        ...prev,
        balance: ethers.formatEther(balance),
      }));
    } catch (error) {
      console.error('Balance update failed:', error);
    }
  }, [state.currentAccountIndex, state.network, state.accounts]);

  const switchNetwork = useCallback((network: NetworkType) => {
    setState(prev => ({ ...prev, network }));
  }, []);

  const switchAccount = useCallback((index: number) => {
    if (index >= state.accounts.length) {return;}
    setState(prev => ({ ...prev, currentAccountIndex: index }));
  }, [state.accounts.length]);

  const exportPrivateKey = useCallback(() => {
    return state.accounts[state.currentAccountIndex]?.privateKey || '';
  }, [state.currentAccountIndex, state.accounts]);

  const clearWallet = useCallback(async () => {
    await deleteWallet();
    setState({
      isInitialized: true,
      accounts: [],
      currentAccountIndex: 0,
      balance: '0',
      network: 'ethMainnet',
      mnemonic: null,
      isRegistered: false,
    });
  }, []);

  useEffect(() => {
    let isMounted = true;
    const interval = setInterval(async () => {
      if (isMounted) {await updateBalance();}
    }, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [updateBalance]);

  useEffect(() => {
    if (!state.isInitialized) {initializeWallet();}
  }, [state.isInitialized, initializeWallet]);

  useEffect(() => {
    if (state.accounts[state.currentAccountIndex]?.address) {
      updateBalance();
    }
  }, [state.network, state.accounts, state.currentAccountIndex, updateBalance]);


  return {
    ...state,
    currentAccount: state.accounts[state.currentAccountIndex] || null,
    createNewWallet,
    restoreWallet,
    addAccount,
    switchNetwork,
    switchAccount,
    exportPrivateKey,
    clearWallet,
    updateBalance,
    setNetwork: switchNetwork,
  };
};

export default useWallet;
