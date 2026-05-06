import React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import typography from '../../assets/typography';
import colors from '../../assets/colors';
import SearchInput from '../../components/SearchInput';
import {getCategoryEntries} from '../../utils/categoryUtils';

const categories = getCategoryEntries();

export default function ExpensesHeader() {
  return (
    <View className="gap-3">
      <SearchInput />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2">
        <TouchableOpacity
          className="flex-row items-center px-4 py-2 rounded-full border"
          style={{borderColor: colors.primary}}
          activeOpacity={0.7}>
          <Text style={[typography.medium, {color: colors.primary}]} className="text-sm">
            Wszystkie
          </Text>
        </TouchableOpacity>

        {categories.map(cat => (
          <TouchableOpacity
            key={cat.name}
            className="flex-row items-center gap-2 px-4 py-2 rounded-full border border-gray-200"
            activeOpacity={0.7}>
            <View
              className="w-2.5 h-2.5 rounded-full"
              style={{backgroundColor: cat.color}}
            />
            <Text style={[typography.regular, {color: colors.text}]} className="text-sm">
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
