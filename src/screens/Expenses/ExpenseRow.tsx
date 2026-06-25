import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import typography from '../../assets/typography';
import colors from '../../assets/colors';
import {formatCurrency} from '../../utils/finance';
import {ExpenseInDb} from '../../types/expense';
import {IoniconsName} from '../../assets/icons';

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

type Props = {
  expense: ExpenseInDb;
  onPress: () => void;
};

/**
 * Tappable expense row. Uses the category colour/icon returned with the expense
 * (rather than the hard-coded name map) and carries the full record up via
 * `onPress` so the edit modal can prefill from it.
 */
export default function ExpenseRow({expense, onPress}: Props) {
  const amount = Number(expense.amount) || 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center gap-3 py-3">
      <View
        className="w-11 h-11 rounded-full items-center justify-center"
        style={{backgroundColor: expense.category_color}}>
        <Ionicons
          name={expense.category_icon as IoniconsName}
          size={20}
          color={colors.white}
        />
      </View>

      <View className="flex-1">
        <Text style={[typography.medium, {color: colors.text}]} className="text-sm">
          {expense.description || expense.category_name}
        </Text>
        <Text
          style={[typography.regular, {color: colors.textMuted}]}
          className="text-xs mt-0.5">
          {expense.category_name} • {expense.source === 'ocr' ? 'OCR' : 'Manualnie'}
        </Text>
      </View>

      <View className="items-end">
        <Text style={[typography.medium, {color: colors.text}]} className="text-sm">
          -{formatCurrency(amount)}
        </Text>
        <Text
          style={[typography.regular, {color: colors.textMuted}]}
          className="text-xs mt-0.5">
          {formatDate(new Date(expense.expense_date))}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
