import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import typography from '../../assets/typography';
import colors from '../../assets/colors';
import { ExpenseCategory } from '../../types/expense';
import ExpenseDonutChart from '../../components/expenseBreakdown/ExpenseDonutChart';
import ExpenseLegendList from '../../components/expenseBreakdown/ExpenseLegendList';

type Props = {
  categories: ExpenseCategory[];
};

export default function ExpenseBreakdown({ categories }: Props) {
  const total = categories.reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <View
      className="rounded-2xl p-4"
      style={{ backgroundColor: colors.cardBackground }}
    >
      <Text
        style={[typography.medium, { color: colors.text }]}
        className="text-sm mb-4"
      >
        Wydatki w tym miesiącu
      </Text>

      <View className="flex-row items-center gap-4">
        <ExpenseDonutChart categories={categories} total={total} />
        <ExpenseLegendList categories={categories} />
      </View>

      <View className="border-t border-gray-200 mt-4 pt-3">
        <TouchableOpacity
          className="flex-row items-center gap-1"
          activeOpacity={0.7}
        >
          <Text
            style={[typography.medium, { color: colors.primary }]}
            className="text-sm"
          >
            Zobacz wszystkie
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
