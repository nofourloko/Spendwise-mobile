import React from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import typography from '../assets/typography';
import colors from '../assets/colors';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

/** Controlled search field with a clear button. */
export default function SearchInput({
  value,
  onChangeText,
  placeholder = 'Szukaj wydatków',
}: Props) {
  return (
    <View className="flex-row items-center gap-2 px-3 rounded-xl bg-gray-100">
      <Ionicons name="search-outline" size={18} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        returnKeyType="search"
        style={[typography.regular, {color: colors.text}]}
        className="flex-1 py-3 text-sm"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          hitSlop={8}
          activeOpacity={0.7}>
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}
