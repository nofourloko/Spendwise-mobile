import React from 'react';
import { View } from 'react-native';
import colors from '../../assets/colors';
import { calculateSaldo, formatCurrency } from '../../utils/finance';
import StatItem from '../../components/balanceBanner/StatItem';

type BalanceBannerProps = {
  budget: number;
  expenses: number;
};

export default function BalanceBanner({
  budget,
  expenses,
}: BalanceBannerProps) {
  const saldo = calculateSaldo(budget, expenses);

  return (
    <View
      className="rounded-2xl p-5"
      style={{ backgroundColor: colors.primary }}
    >
      <StatItem
        label="Twoje saldo"
        value={formatCurrency(saldo)}
        valueClassName="text-3xl"
      />

      <View className="flex-row mt-5 gap-6">
        <View className="flex-1">
          <StatItem
            label="Dochody w tym miesiącu"
            value={formatCurrency(budget)}
          />
        </View>
        <View className="flex-1">
          <StatItem
            label="Wydatki w tym miesiącu"
            value={formatCurrency(expenses)}
          />
        </View>
      </View>
    </View>
  );
}
