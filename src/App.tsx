import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WalletScreen from './screens/WalletScreen';
import SendScreen from './screens/SendScreen';
import MoonPayScreen from './screens/MoonPayScreen';



import 'react-native-get-random-values';
import { PaperProvider } from 'react-native-paper';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';
import { RootStackParamList } from './constants/currency';
import RegistrationScreen from './screens/RegistrationScreen';


const Stack = createNativeStackNavigator<RootStackParamList>();


export function App() {
  return (
    <PaperProvider>
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Registration">
          <Stack.Screen
            name="Registration"
            component={RegistrationScreen}
            options={{ headerShown: false }}
          />
        <Stack.Screen
          name="Wallet"
          component={WalletScreen}
          options={{ title: 'My  Wallet' }}
        />
        <Stack.Screen
          name="Send"
          component={SendScreen}
          options={{ title: 'Send CRIPTO' }}
        />
        <Stack.Screen
          name="MoonPay"
          component={MoonPayScreen}
          options={{ title: 'Buy FIAT' }}
        />
         <Stack.Screen
           name="TransactionHistory"
           component={TransactionHistoryScreen}
           options={{ title: 'Transaction History' }}
          />
      </Stack.Navigator>
    </NavigationContainer>
  </PaperProvider>
  );
}
