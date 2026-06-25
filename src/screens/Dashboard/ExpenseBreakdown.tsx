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
  // Coerce defensively: category amounts can originate from string-typed
  // backend sums, and `+` on strings would concatenate (→ NaN in formatting).
  const total = categories.reduce(
    (sum, cat) => sum + (Number(cat.amount) || 0),
    0,
  );

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

    </View>
  );
}
