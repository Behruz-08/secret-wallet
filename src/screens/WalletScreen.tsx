

import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import useWallet from '../hooks/useWallet';
import { WalletCard } from '../components/WalletCard';
import { Button } from 'react-native-paper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { currencyByNetwork, NetworkType, RootStackParamList } from '../constants/currency';
import NetworkModal from '../components/NetworkModal';

const networks: { name: string; key: NetworkType }[] = [
  { name: 'Ethereum Mainnet', key: 'ethMainnet' },
  { name: 'Base Mainnet', key: 'baseMainnet' },
  { name: 'Linea Mainnet', key: 'lineaMainnet' },
  { name: 'Polygon Mainnet', key: 'polygonMainnet' },
  { name: 'zkSync Era Mainnet', key: 'zksyncMainnet' },
  { name: 'Arbitrum One', key: 'arbitrumMainnet' },
  { name: 'Scroll', key: 'scrollMainnet' },
  { name: 'Binance Smart Chain', key: 'bscMainnet' },
  { name: 'Gnosis Chain', key: 'gnosisMainnet' },
  { name: 'Optimism Mainnet', key: 'optimismMainnet' },
  { name: 'Avalanche C-Chain', key: 'avalancheMainnet' },
  { name: 'zkEVM Mainnet', key: 'zkevmMainnet' },
  { name: 'Sepolia Testnet', key: 'sepolia' },
  { name: 'Polygon Testnet', key: 'polygonTestnet' },
  { name: 'zkEVM Testnet', key: 'zkevmTestnet' },
];

const WalletScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  // const { currentAccount, balance, network, setNetwork, clearWallet } = useWallet();
  const { addAccount, switchAccount, accounts, currentAccountIndex,currentAccount,clearWallet,setNetwork,network,balance } = useWallet();
  const [modalVisible, setModalVisible] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const handleSendPress = useCallback(() => {
    currentAccount && navigation.navigate('Send', { network });
  }, [navigation, currentAccount, network]);

  const handleTransactionHistoryPress = useCallback(() => {
    currentAccount && navigation.navigate('TransactionHistory', { address: currentAccount.address, network });
  }, [navigation, currentAccount, network]);

  const handleLogout = useCallback(async () => {
    await clearWallet();
    setForceUpdate(prev => !prev);
    // navigation.navigate('Registration');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Registration' }],
    });
  }, [clearWallet, navigation]);

  return (
    <View style={styles.container}>
      {currentAccount && (
        <WalletCard
          address={currentAccount.address}
          balance={balance}
          currency={currencyByNetwork[network]}
          loading={false}
        />
      )}


<Button mode="outlined" onPress={() => addAccount()} style={styles.button}>
  Добавить новый кошелек
</Button>

// Добавить список аккаунтов для переключения
{accounts.map((account, index) => (
  <Button
    key={index}
    mode="outlined"
    onPress={() => switchAccount(index)}
    style={styles.button}
    disabled={currentAccountIndex === index}
  >
    wallet {index + 1}
  </Button>
))}

      <Button mode="contained" onPress={handleSendPress} style={styles.button}>
        Send {currencyByNetwork[network]}
      </Button>

      {currentAccount && (
        <Button mode="contained" onPress={handleTransactionHistoryPress} style={styles.button}>
          View Transaction History
        </Button>
      )}

      <Button mode="outlined" onPress={() => navigation.navigate('MoonPay')} style={styles.button}>
        Buy Crypto
      </Button>

      <Text style={styles.networkLabel}>Select Network:</Text>

      <Button mode="outlined" onPress={() => setModalVisible(true)}>
        {networks.find(n => n.key === network)?.name || 'Select Network'}
      </Button>

      <Button mode="outlined" onPress={handleLogout} style={styles.button}>
        Выйти
      </Button>

      <NetworkModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        networks={networks}
        selectedNetwork={network}
        onSelect={(key: NetworkType) => setNetwork(key)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    marginTop: 55,
  },
  button: {
    marginTop: 15,
  },
  networkLabel: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default WalletScreen;
