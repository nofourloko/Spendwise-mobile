import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import typography from '../../assets/typography';
import colors from '../../assets/colors';
import {Category} from '../../types/category';

type Props = {
  categories: Category[];
  /** Selected category id, or null for "all". */
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  loading?: boolean;
};

/**
 * Horizontal category filter pills backed by the real categories API. The first
 * chip ("Wszystkie") clears the filter; selecting a category drives the
 * `categoryId` query param on the expenses list.
 */
export default function CategoryFilter({
  categories,
  selectedId,
  onSelect,
  loading = false,
}: Props) {
  if (loading) {
    return <ActivityIndicator color={colors.primary} className="self-start" />;
  }

  const renderChip = (
    key: string,
    label: string,
    isSelected: boolean,
    onPress: () => void,
    dotColor?: string,
  ) => (
    <TouchableOpacity
      key={key}
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center gap-2 px-4 py-2 rounded-full border"
      style={{
        borderColor: isSelected ? colors.primary : '#E5E7EB',
        backgroundColor: isSelected ? colors.cardBackground : 'transparent',
      }}>
      {dotColor && (
        <View className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: dotColor}} />
      )}
      <Text
        style={[
          isSelected ? typography.medium : typography.regular,
          {color: isSelected ? colors.primary : colors.text},
        ]}
        className="text-sm">
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2">
      {renderChip('all', 'Wszystkie', selectedId === null, () => onSelect(null))}
      {categories.map(cat =>
        renderChip(
          cat.id,
          cat.name,
          cat.id === selectedId,
          () => onSelect(cat.id),
          cat.color,
        ),
      )}
    </ScrollView>
  );
}
