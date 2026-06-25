import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import typography from '../../assets/typography';
import colors from '../../assets/colors';
import {Transaction} from '../../types/transaction';
import TransactionRow from '../../components/TransactionRow';

type Props = {
  transactions: Transaction[];
};

export default function RecentTransactions({transactions}: Props) {
  return (
    <View>
      <View className="flex-row justify-between items-center mb-1">
        <Text style={[typography.medium, {color: colors.text}]} className="text-sm">
          Ostatnie transakcje
        </Text>
      </View>

      {transactions.map((item, index) => (
        <View key={item.id}>
          {index > 0 && <View className="border-t border-gray-100" />}
          <TransactionRow item={item} />
        </View>
      ))}
    </View>
  );
}
