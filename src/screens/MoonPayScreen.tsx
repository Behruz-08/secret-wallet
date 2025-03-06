// src/screens/MoonPayScreen.tsx
import React, { useEffect } from 'react';
import {  Button ,Linking, Alert } from 'react-native';
import { useMoonPaySdk } from '@moonpay/react-native-moonpay-sdk';



const MoonPayScreen = () => {
  const { openWithInAppBrowser, generateUrlForSigning, updateSignature } = useMoonPaySdk({
    sdkConfig: {
      flow: 'buy',
      environment: 'sandbox',
      params: {
        apiKey: 'pk_test_123',
        currencyCode: 'usd',
        walletAddress: '0x...',
      },
    },
    browserOpener: {
        open: async (url) => {
          try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
              await Linking.openURL(url);
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to open URL');
          }
        },
      },
  });



  useEffect(() => {
    const fetchSignature = async () => {
      try {
        // Передаём вариант через приведение типа
        const urlToSign = generateUrlForSigning({ variant: 'buy' as any });
        if (!urlToSign) {
          throw new Error('Failed to generate URL for signing');
        }
        const response = await fetch('/sign-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer <your_token>',
          },
          body: JSON.stringify({ url: urlToSign }),
        });
        if (!response.ok) {
          throw new Error('Error signing URL');
        }
        const data = await response.json();
        updateSignature(data.signature);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        Alert.alert('Error', errorMessage);
      }
    };

    fetchSignature();
  }, [generateUrlForSigning, updateSignature]);


  return (
    <Button
    title="Buy Crypto"
    onPress={async () => {
      try {
        await openWithInAppBrowser();
      } catch (error) {
        Alert.alert('Error', 'Failed to open MoonPay');
      }
    }}
  />
  );
};
 export default MoonPayScreen;




