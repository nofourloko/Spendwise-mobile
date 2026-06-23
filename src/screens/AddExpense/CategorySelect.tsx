import React from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import typography from '../../assets/typography';
import colors from '../../assets/colors';
import {Category} from '../../types/category';

type Props = {
  label: string;
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
  loading?: boolean;
  error?: string | null;
};

/**
 * Labelled single-select category picker rendered as wrapping chips. Mirrors the
 * filter pills used in `ExpensesHeader` (colour dot + name) and adds a selected
 * state plus an inline validation message, matching the `TextField` layout.
 */
export default function CategorySelect({
  label,
  categories,
  selectedId,
  onSelect,
  loading = false,
  error,
}: Props) {
  const hasError = Boolean(error);

  return (
    <View className="gap-1.5">
      <Text style={[typography.medium, {color: colors.text}]} className="text-sm">
        {label}
      </Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} className="self-start py-2" />
      ) : (
        <View className="flex-row flex-wrap gap-2">
          {categories.map(cat => {
            const isSelected = cat.id === selectedId;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => onSelect(cat.id)}
                activeOpacity={0.7}
                className="flex-row items-center gap-2 px-4 py-2 rounded-full border"
                style={{
                  borderColor: isSelected ? colors.primary : '#E5E7EB',
                  backgroundColor: isSelected ? colors.cardBackground : 'transparent',
                }}>
                <View
                  className="w-2.5 h-2.5 rounded-full"
                  style={{backgroundColor: cat.color}}
                />
                <Text
                  style={[
                    isSelected ? typography.medium : typography.regular,
                    {color: isSelected ? colors.primary : colors.text},
                  ]}
                  className="text-sm">
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {hasError && (
        <Text
          style={[typography.regular, {color: colors.danger}]}
          className="text-xs">
          {error}
        </Text>
      )}
    </View>
  );
}
