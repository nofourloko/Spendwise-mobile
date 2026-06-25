import React, {useEffect, useState} from 'react';
import {View, Text, TextInput} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import typography from '../../assets/typography';
import colors from '../../assets/colors';
import {formatCurrency} from '../../utils/finance';

type Props = {
  /** The master budget the user sets manually. */
  value: number;
  /** Sum of all per-category limits, i.e. how much of `value` is already split. */
  allocated: number;
  onChange: (next: number) => void;
};

/**
 * Summary card at the top of the budgets screen. Shows the editable overall
 * budget and how much of it has been allocated across categories, so every
 * per-card adjustment is reflected here as it relates to the main budget.
 */
export default function OverallBudgetCard({value, allocated, onChange}: Props) {
  const [text, setText] = useState(value ? String(value) : '');

  // Resync the input when the stored value changes (e.g. switching months).
  useEffect(() => {
    setText(value ? String(value) : '');
  }, [value]);

  const free = value - allocated;
  const overAllocated = free < 0;
  const percent = value > 0 ? Math.min((allocated / value) * 100, 100) : 0;

  const commit = () => {
    const parsed = Number(text.replace(/[^0-9]/g, ''));
    onChange(Number.isFinite(parsed) ? parsed : 0);
  };

  return (
    <View
      className="rounded-2xl p-4 gap-3"
      style={{backgroundColor: colors.cardBackground}}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{backgroundColor: colors.primary}}>
            <Ionicons name="wallet-outline" size={18} color={colors.white} />
          </View>
          <Text
            style={[typography.medium, {color: colors.text}]}
            className="text-sm">
            Budżet ogólny
          </Text>
        </View>

        <View className="flex-row items-center">
          <TextInput
            value={text}
            onChangeText={t => setText(t.replace(/[^0-9]/g, ''))}
            onEndEditing={commit}
            onBlur={commit}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={colors.textMuted}
            style={[
              typography.medium,
              {color: colors.text, minWidth: 70, padding: 0, textAlign: 'right'},
            ]}
            className="text-lg"
          />
          <Text
            style={[typography.medium, {color: colors.text}]}
            className="text-lg ml-1">
            zł
          </Text>
        </View>
      </View>

      <View
        className="h-2.5 rounded-full overflow-hidden"
        style={{backgroundColor: colors.neutral}}>
        <View
          className="h-full rounded-full"
          style={{
            width: `${percent}%`,
            backgroundColor: overAllocated ? colors.danger : colors.primary,
          }}
        />
      </View>

      <View className="flex-row justify-between">
        <View>
          <Text
            style={[typography.regular, {color: colors.textMuted}]}
            className="text-xs">
            Przydzielono
          </Text>
          <Text
            style={[typography.medium, {color: colors.text}]}
            className="text-sm">
            {formatCurrency(allocated)}
          </Text>
        </View>
        <View className="items-end">
          <Text
            style={[typography.regular, {color: colors.textMuted}]}
            className="text-xs">
            {overAllocated ? 'Przekroczono o' : 'Wolne'}
          </Text>
          <Text
            style={[
              typography.medium,
              {color: overAllocated ? colors.danger : colors.text},
            ]}
            className="text-sm">
            {formatCurrency(Math.abs(free))}
          </Text>
        </View>
      </View>
    </View>
  );
}
