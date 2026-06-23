import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  type KeyboardTypeOptions,
  type TextInputProps,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {IoniconsName} from '../assets/icons';
import typography from '../assets/typography';
import colors from '../assets/colors';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon?: IoniconsName;
  error?: string | null;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
};

/**
 * Reusable labelled input used across the auth forms. Mirrors the project's
 * `SearchInput` look (rounded, icon-prefixed field) and adds a label, inline
 * validation message and an optional show/hide toggle for password fields.
 */
export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  error,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize = 'none',
  autoComplete,
}: Props) {
  const [hidden, setHidden] = useState(secureTextEntry);
  const hasError = Boolean(error);

  return (
    <View className="gap-1.5">
      <Text
        style={[typography.medium, {color: colors.text}]}
        className="text-sm">
        {label}
      </Text>

      <View
        className="flex-row items-center gap-2 px-3 rounded-xl bg-gray-100 border"
        style={{borderColor: hasError ? colors.danger : 'transparent'}}>
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={hasError ? colors.danger : colors.textMuted}
          />
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          style={[typography.regular, {color: colors.text}]}
          className="flex-1 py-3 text-sm"
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setHidden(prev => !prev)}
            hitSlop={8}
            activeOpacity={0.7}>
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>

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
