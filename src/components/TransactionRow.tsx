import React from 'react';
import {View, Text} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import typography from '../assets/typography';
import colors from '../assets/colors';
import {formatCurrency} from '../utils/finance';
import {getCategoryColor, getCategoryIcon} from '../utils/categoryUtils';
import {Transaction} from '../types/transaction';

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

type Props = {
  item: Transaction;
};

export default function TransactionRow({item}: Props) {
  const color = getCategoryColor(item.category);
  const icon = getCategoryIcon(item.category);

  return (
    <View className="flex-row items-center gap-3 py-3">
      <View
        className="w-11 h-11 rounded-full items-center justify-center"
        style={{backgroundColor: color}}>
        <Ionicons name={icon} size={20} color="#fff" />
      </View>

      <View className="flex-1">
        <Text style={[typography.medium, {color: colors.text}]} className="text-sm">
          {item.name}
        </Text>
        <Text style={[typography.regular, {color: colors.textMuted}]} className="text-xs mt-0.5">
          {item.category} • {item.method}
        </Text>
      </View>

      <View className="items-end">
        <Text style={[typography.medium, {color: colors.text}]} className="text-sm">
          {formatCurrency(item.price)}
        </Text>
        <Text style={[typography.regular, {color: colors.textMuted}]} className="text-xs mt-0.5">
          {formatDate(item.date)}
        </Text>
      </View>
    </View>
  );
}
