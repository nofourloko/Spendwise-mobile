import React from 'react';
import {View, TextInput} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import typography from '../assets/typography';
import colors from '../assets/colors';

export default function SearchInput() {
  return (
    <View className="flex-row items-center gap-2 px-3 rounded-xl bg-gray-100">
      <Ionicons name="search-outline" size={18} color={colors.textMuted} />
      <TextInput
        placeholder="Szukaj transakcji"
        placeholderTextColor={colors.textMuted}
        style={[typography.regular, {color: colors.text}]}
        className="flex-1 py-3 text-sm"
        editable={false}
      />
    </View>
  );
}
