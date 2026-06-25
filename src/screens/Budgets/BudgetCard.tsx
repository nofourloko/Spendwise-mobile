import React, {useEffect, useState} from 'react';
import {View, Text, TextInput} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import typography from '../../assets/typography';
import colors from '../../assets/colors';
import {formatCurrency} from '../../utils/finance';
import {BudgetStatus} from '../../types/budget';
import {IoniconsName} from '../../assets/icons';
import BudgetSlider from '../../components/BudgetSlider';

type Props = {
  status: BudgetStatus;
  /** Current (optimistic) limit for this category, owned by the parent screen. */
  limit: number;
  /** Slider upper bound — the overall budget this category draws from. */
  max: number;
  step?: number;
  onChange: (next: number) => void;
};

/**
 * A single category budget: icon + name, an editable amount field and a slider
 * to set this category's slice of the overall budget. The text field and slider
 * are two inputs onto the same `limit`, so editing either updates the parent.
 */
export default function BudgetCard({status, limit, max, step = 50, onChange}: Props) {
  const spent = Number(status.spent) || 0;
  const remaining = limit - spent;
  const isOverBudget = spent > limit && limit > 0;
  const isUnderBudget = remaining < 0;
  const barColor = isOverBudget ? colors.danger : status.category_color;

  const [text, setText] = useState(String(Math.round(limit)));

  // Keep the input in sync when the limit changes elsewhere (slider, re-seed).
  useEffect(() => {
    setText(String(Math.round(limit)));
  }, [limit]);

  const commitText = () => {
    const parsed = Number(text.replace(/[^0-9]/g, ''));
    onChange(Number.isFinite(parsed) ? parsed : 0);
  };

  return (
    <View className="gap-2 py-3">
      <View className="flex-row items-center gap-3">
        <View
          className="w-11 h-11 rounded-full items-center justify-center"
          style={{backgroundColor: status.category_color}}>
          <Ionicons
            name={status.category_icon as IoniconsName}
            size={20}
            color={colors.white}
          />
        </View>
        <Text
          style={[typography.medium, {color: colors.text}]}
          className="text-sm flex-1">
          {status.category_name}
        </Text>
        <View className="flex-row items-center">
          <TextInput
            value={text}
            onChangeText={t => setText(t.replace(/[^0-9]/g, ''))}
            onEndEditing={commitText}
            onBlur={commitText}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={colors.textMuted}
            style={[
              typography.medium,
              {color: colors.text, minWidth: 56, padding: 0, textAlign: 'right'},
            ]}
            className="text-sm"
          />
          <Text
            style={[typography.medium, {color: colors.text}]}
            className="text-sm ml-1">
            zł
          </Text>
        </View>
      </View>

      <BudgetSlider
        value={limit}
        max={max}
        step={step}
        color={barColor}
        onChange={onChange}
      />

      <View className="flex-row justify-between">
        <Text
          style={[typography.regular, {color: colors.textMuted}]}
          className="text-xs">
          Wydano {formatCurrency(spent)}
        </Text>
        <Text
          style={[
            typography.regular,
            {color: isOverBudget || isUnderBudget ? colors.danger : colors.textMuted},
          ]}
          className="text-xs">
          {isOverBudget ? 'Przekroczono' : `${remaining >= 0 ? 'Zostało' : 'Przekroczono'}`} {formatCurrency(remaining)}
        </Text>
      </View>
    </View>
  );
}
