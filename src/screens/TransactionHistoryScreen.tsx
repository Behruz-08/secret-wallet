
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../constants/currency';
import { getTransactions } from '../services/apiServices';

type Props = NativeStackScreenProps<RootStackParamList, 'TransactionHistory'>;

interface Transaction {
  hash: string;
}

const TransactionHistoryScreen = ({ route }: Props) => {
  const { address, network } = route.params;
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const txs = await getTransactions(address, 0, 99999999, 1, 10, 'asc', network);
        console.log('Полученные транзакции:', txs);
        setTransactions(txs);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Ошибка загрузки транзакций:', error.message);
        } else {
          console.error('Пойман нестандартный объект ошибки:', error);
        }
      }
    };
    loadTransactions();
  }, [address, network]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.hash}>{item.hash}</Text>
          </View>
        )}
        keyExtractor={(item, index) => (item.hash ? item.hash : index.toString())}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  hash: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
});

export default TransactionHistoryScreen;
