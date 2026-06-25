import React from 'react';
import {View, Text} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import typography from '../../assets/typography';
import colors from '../../assets/colors';
import {formatCurrency} from '../../utils/finance';
import {BudgetStatus} from '../../types/budget';
import {IoniconsName} from '../../assets/icons';

type Props = {
  status: BudgetStatus;
};

export default function BudgetCard({status}: Props) {
  const limit = status.monthly_limit ?? 0;
  const spent = status.spent;
  const remaining = limit - spent;
  const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const isOverBudget = spent > limit && limit > 0;
  const hasNoBudget = status.monthly_limit === null;

  const barColor = isOverBudget ? colors.danger : status.category_color;

  return (
    <View
      className="rounded-2xl p-4"
      style={{
        backgroundColor: isOverBudget ? '#FDECEC' : colors.cardBackground,
      }}>
      <View className="flex-row items-center gap-3 mb-3">
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{backgroundColor: status.category_color}}>
          <Ionicons
            name={status.category_icon as IoniconsName}
            size={18}
            color={colors.white}
          />
        </View>
        <Text
          style={[typography.medium, {color: colors.text}]}
          className="text-sm flex-1">
          {status.category_name}
        </Text>
        {isOverBudget && (
          <Ionicons name="warning-outline" size={20} color={colors.danger} />
        )}
      </View>

      {hasNoBudget ? (
        <Text style={[typography.regular, {color: colors.textMuted}]} className="text-xs">
          Brak ustawionego budżetu
        </Text>
      ) : (
        <>
          <View className="flex-row justify-between mb-1">
            <Text style={[typography.regular, {color: colors.textMuted}]} className="text-xs">
              Budżet: {formatCurrency(limit)}
            </Text>
            <Text style={[typography.regular, {color: colors.textMuted}]} className="text-xs">
              {Math.round(status.usage_percent ?? 0)}%
            </Text>
          </View>

          <View
            className="h-2.5 rounded-full overflow-hidden mb-3"
            style={{backgroundColor: colors.neutral}}>
            <View
              className="h-full rounded-full"
              style={{
                width: `${percent}%`,
                backgroundColor: barColor,
              }}
            />
          </View>

          <View className="flex-row justify-between">
            <View>
              <Text style={[typography.regular, {color: colors.textMuted}]} className="text-xs">
                Wydano
              </Text>
              <Text style={[typography.medium, {color: colors.text}]} className="text-sm">
                {formatCurrency(spent)}
              </Text>
            </View>
            <View className="items-end">
              <Text style={[typography.regular, {color: colors.textMuted}]} className="text-xs">
                Pozostało
              </Text>
              <Text
                style={[
                  typography.medium,
                  {color: isOverBudget ? colors.danger : colors.text},
                ]}
                className="text-sm">
                {formatCurrency(remaining)}
              </Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
