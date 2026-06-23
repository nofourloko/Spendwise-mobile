import React from 'react';
import {TouchableOpacity, Text, ActivityIndicator} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {IoniconsName} from '../assets/icons';
import typography from '../assets/typography';
import colors from '../assets/colors';

type Variant = 'primary' | 'outline';

type Props = {
  onPress: () => void;
  text?: string;
  icon?: IoniconsName;
  /** Accent colour: fill colour for `primary`, border/label colour for `outline`. */
  color?: string;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
};

export default function Button({
  onPress,
  text = 'Wyloguj się',
  icon,
  color,
  variant = 'outline',
  loading = false,
  disabled = false,
}: Props) {
  const accent = color ?? (variant === 'primary' ? colors.primary : colors.danger);
  const isPrimary = variant === 'primary';
  const labelColor = isPrimary ? colors.white : accent;
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      className="flex-row items-center justify-center gap-2 py-4 rounded-2xl border"
      style={{
        borderColor: accent,
        backgroundColor: isPrimary ? accent : 'transparent',
        opacity: isDisabled ? 0.6 : 1,
      }}>
      {loading ? (
        <ActivityIndicator size="small" color={labelColor} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={20} color={labelColor} />}
          <Text style={[typography.medium, {color: labelColor}]} className="text-sm">
            {text}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
