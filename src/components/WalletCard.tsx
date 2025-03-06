

import React from 'react';
import { Card, Title, Paragraph} from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';


export const WalletCard = ({ address, balance, loading, currency }:{
  address: string;
  balance: string|number;
  loading: boolean;
  currency: string;
}) => (
  <Card>
    <Card.Content>
      {loading ? (
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item width={200} height={24} />
          <SkeletonPlaceholder.Item width={150} height={20} marginTop={8} />
        </SkeletonPlaceholder>
      ) : (
        <>
          <Title>Wallet Address</Title>
          <Paragraph selectable>{address}</Paragraph>
          <Title>Balance</Title>
          <Paragraph>{balance} {currency}</Paragraph>
        </>
      )}
    </Card.Content>
  </Card>
);
