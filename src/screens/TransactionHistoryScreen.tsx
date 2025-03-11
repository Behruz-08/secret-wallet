


import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../constants/currency';

interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  result: T[];
}

type Props = NativeStackScreenProps<RootStackParamList, 'TransactionHistory'>;

const TransactionHistoryScreen = ({ route }: Props) => {
  const { address, network } = route.params;
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      let apiUrl;
      let apiKey;

            if (network === 'polygonMainnet') {
        apiUrl = 'https://api-polygonscan.com';
        apiKey = 'D76AKR6KAGRA5XSK19UTQWCPAV4J5C7JEM';
      } else if (network === 'ethMainnet') {
        apiUrl = 'https://api.etherscan.io';
        apiKey = '555FINDADVVENJ1DQUNYPJEQZ6KYUV2SFM';
      }



      const sentResponse = await axios.get<ApiResponse<Transaction>>(
        `${apiUrl}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=1000&sort=desc&apikey=${apiKey}`
      );
      const receivedResponse = await axios.get<ApiResponse<Transaction>>(
        `${apiUrl}/api?module=account&action=txlist&toaddress=${address}&startblock=0&endblock=99999999&page=1&offset=1000&sort=desc&apikey=${apiKey}`
      );

      const allTransactions = [
        ...sentResponse.data.result,
        ...receivedResponse.data.result,
      ].filter(transaction => transaction.hash);

      // Удаляем дубли по хэшу
      const transactionMap = new Map<string, Transaction>();
      allTransactions.forEach(transaction => {
        transactionMap.set(transaction.hash, transaction);
      });
      const uniqueTransactions = Array.from(transactionMap.values());

      // Сортируем по убыванию времени
      const sortedTransactions = uniqueTransactions.sort(
        (a, b) => Number(b.timeStamp) - Number(a.timeStamp)
      );

      setTransactions(sortedTransactions);
    };

    fetchTransactions();
  }, [address, network]);

  const getSymbol = (network: string): string => {
    switch (network) {
      case 'polygonMainnet':
        return 'MATIC';
      case 'ethMainnet':
        return 'ETH';
      default:
        return '';
    }
  };

  const formatValue = (value: string, symbol: string): string => {
    const wei = parseInt(value, 10);
    const amount = wei / 1e18;
    return `${amount} ${symbol}`;
  };

  // Формируем ссылку для детальной страницы транзакции
  const openTxLink = (hash: string) => {
    let url = '';
    if (network === 'polygonMainnet') {
      url = `https://polygonscan.com/tx/${hash}`;
    } else if (network === 'ethMainnet') {
      url = `https://etherscan.io/tx/${hash}`;
    }
    Linking.openURL(url).catch(err =>
      console.error('Не удалось открыть ссылку', err),
    );
  };

  return (
    <View>
      <FlatList
        data={transactions}
        keyExtractor={(item, index) => `${item.hash}-${index}`}
        ListEmptyComponent={<Text>No transactions found</Text>}
        renderItem={({ item }) => {
          const symbol = getSymbol(network);
          const formattedValue = formatValue(item.value, symbol);

          return (
            <TouchableOpacity onPress={() => openTxLink(item.hash)}>
              <View style={styles.transactionItem}>
                <Text style={styles.hash}>
                  Tx: {item.hash.substring(0, 16)}...
                </Text>
                <Text>From: {item.from.substring(0, 8)}...</Text>
                <Text>To: {item.to.substring(0, 8)}...</Text>
                <Text>Amount: {formattedValue}</Text>
                <Text>
                  Date:{' '}
                  {new Date(Number(item.timeStamp) * 1000).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  hash: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default TransactionHistoryScreen;
