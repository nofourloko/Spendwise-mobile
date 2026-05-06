import React from 'react';
import { View, Text } from 'react-native';
import typography from '../../assets/typography';
import colors from '../../assets/colors';
import { formatCurrency } from '../../utils/finance';
import { ExpenseCategory } from '../../types/expense';

type Props = {
  categories: ExpenseCategory[];
};

export default function ExpenseLegendList({ categories }: Props) {
  return (
    <View className="flex-1 justify-center gap-2">
      {categories.map(cat => (
        <View key={cat.name} className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2 flex-1">
            <View
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            <Text
              style={[typography.regular, { color: colors.text }]}
              className="text-xs"
            >
              {cat.name}
            </Text>
          </View>
          <Text
            style={[typography.regular, { color: colors.textMuted }]}
            className="text-xs w-8 text-right"
          >
            {cat.percentage}%
          </Text>
          <Text
            style={[typography.medium, { color: colors.text }]}
            className="text-xs w-20 text-right"
          >
            {formatCurrency(cat.amount)}
          </Text>
        </View>
      ))}
    </View>
  );
}
