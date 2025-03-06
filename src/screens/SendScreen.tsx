import React, { useState } from 'react';
import { Button, TextInput, View, Alert } from 'react-native';
import useWallet from '../hooks/useWallet';
import { ethers, parseEther } from 'ethers';
import { getProvider } from '../providers/blockChainProvaider';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../constants/currency';
import { currencyByNetwork } from '../constants/currency';

export default function SendScreen() {
  const { currentAccount } = useWallet();

  const route = useRoute<RouteProp<RootStackParamList, 'Send'>>();
  const { network } = route.params;
  const currency = currencyByNetwork[network];

  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  const validateInputs = () => {
    if (!ethers.isAddress(to)) {
      Alert.alert('Ошибка', 'Некорректный адрес получателя');
      return false;
    }
    if (Number(amount) <= 0 || isNaN(Number(amount))) {
      Alert.alert('Ошибка', 'Некорректная сумма');
      return false;
    }
    return true;
  };

  const sendTransaction = async () => {
    if (!validateInputs()) { return; }
    if (!currentAccount) {
      Alert.alert('Ошибка', 'Кошелек еще не загружен');
      return;
    }
    try {
      const provider = getProvider(network);
      const signer = currentAccount.connect(provider);
      const tx = { to, value: parseEther(amount) };
      const txResponse = await signer.sendTransaction(tx);
      Alert.alert('Успех', `Транзакция отправлена: ${txResponse.hash}`);
      console.log('Хэш транзакции:', txResponse.hash);
    } catch (error: any) {
      console.error('Ошибка отправки транзакции:', error);
      Alert.alert('Ошибка', error.message || 'Не удалось отправить транзакцию');
    }
  };

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Адрес получателя"
        value={to}
        onChangeText={setTo}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <TextInput
        placeholder={`Сумма (${currency})`}
        value={amount}
        onChangeText={setAmount}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="Отправить" onPress={sendTransaction} />
    </View>
  );
}
