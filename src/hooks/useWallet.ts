
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
import { getRegistrationStatus, setRegistrationStatus } from '../lib/SecureStorage';

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
      const [mnemonic, registered] = await Promise.all([
        loadMnemonic().catch(() => null),
        getRegistrationStatus(),
      ]);

      if (mnemonic) {
        const accounts = [createHDWallet(mnemonic)];
        setState(prev => ({
          ...prev,
          isInitialized: true,
          isRegistered: registered,
          accounts,
          mnemonic,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        isInitialized: true,
        isRegistered: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isInitialized: true,
        isRegistered: false,
      }));
    }
  }, []);


  const createNewWallet = async () => {
    try {
      const mnemonic = generateMnemonic();
      await storeMnemonic(mnemonic);
      await setRegistrationStatus(true);
      const accounts = [createHDWallet(mnemonic)];
      setState(prev => ({
        ...prev,
        isRegistered: true,
        accounts,
        mnemonic,
        currentAccountIndex: 0,
      }));
      return mnemonic;
    } catch (error) {
      console.error('Ошибка создания кошелька:', error);
      // alert('Ошибка создания кошелька: ' + error.message);
      throw new Error('Ошибка создания кошелька');
    }
  };

  const restoreWallet = useCallback(async (phrase: string) => {
    if (!validateMnemonic(phrase)) {
      throw new Error('Invalid phrase');
    }

    await Promise.all([
      storeMnemonic(phrase),
      setRegistrationStatus(true),
    ]);

    const accounts = [createHDWallet(phrase)];

    setState(prev => ({
      ...prev,
      isRegistered: true,
      accounts,
      mnemonic: phrase,
    }));
  }, []);

  const addAccount = useCallback(() => {
    if (!state.mnemonic) { return; }

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
    if (!state.accounts[state.currentAccountIndex]?.address) { return; }

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
    if (index >= state.accounts.length) { return; }
    setState(prev => ({ ...prev, currentAccountIndex: index }));
  }, [state.accounts.length]);

  const exportPrivateKey = useCallback(() => {
    return state.accounts[state.currentAccountIndex]?.privateKey || '';
  }, [state.currentAccountIndex, state.accounts]);

  const clearWallet = useCallback(async () => {
    try {
      await Promise.all([
        deleteWallet(),
        setRegistrationStatus(false),
      ]);

      setState({
        isInitialized: true,
        accounts: [],
        currentAccountIndex: 0, // Сбрасываем индекс
        balance: '0',
        network: 'polygonMainnet',
        mnemonic: null,
        isRegistered: false,
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const interval = setInterval(async () => {
      if (isMounted) { await updateBalance(); }
    }, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [updateBalance]);

  useEffect(() => {
    if (!state.isInitialized) { initializeWallet(); }
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
function alert(arg0: string) {
  throw new Error('Function not implemented.');
}

