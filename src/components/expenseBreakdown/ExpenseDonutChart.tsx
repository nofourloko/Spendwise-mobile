import React from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import typography from '../../assets/typography';
import colors from '../../assets/colors';
import { formatCurrency } from '../../utils/finance';
import { ExpenseCategory } from '../../types/expense';

type CenterLabelProps = {
  total: number;
};

function DonutCenterLabel({ total }: CenterLabelProps) {
  return (
    <View className="items-center justify-center">
      <Text
        style={[typography.medium, { color: colors.text }]}
        className="text-sm text-center"
      >
        {formatCurrency(total)}
      </Text>
      <Text
        style={[typography.regular, { color: colors.textMuted }]}
        className="text-xs"
      >
        łącznie
      </Text>
    </View>
  );
}

type Props = {
  categories: ExpenseCategory[];
  total: number;
};

export default function ExpenseDonutChart({ categories = [], total }: Props) {
  const data = categories.map(cat => ({
    value: Math.max(0, cat.percentage ?? cat.amount ?? 0),
    color: cat.color ?? colors.textMuted ?? '#ccc',
    text: cat.name,
  }));

  const hasValidData = data.some(item => item.value > 0);

  if (!hasValidData) {
    return (
      <View className="items-center justify-center">
        <DonutCenterLabel total={total} />
        <Text
          style={[typography.regular, { color: colors.textMuted }]}
          className="text-xs mt-2"
        >
          Brak wydatków do wyświetlenia
        </Text>
      </View>
    );
  }

  return (
    <PieChart
      donut
      data={data}
      radius={80}
      innerRadius={56}
      centerLabelComponent={() => <DonutCenterLabel total={total} />}
    />
  );
}
