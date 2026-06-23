import React from 'react';
import {TouchableOpacity, View, Text, ActivityIndicator} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import typography from '../../assets/typography';
import colors from '../../assets/colors';

type Props = {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

/**
 * Entry point for the receipt-OCR flow. Presentational only: it surfaces the
 * scan affordance and a loading state, while the screen owns the capture +
 * `scanReceipt` logic and prefills the form from the result.
 */
export default function OcrScanButton({
  onPress,
  loading = false,
  disabled = false,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      className="flex-row items-center gap-3 p-4 rounded-2xl"
      style={{backgroundColor: colors.cardBackground, opacity: isDisabled ? 0.7 : 1}}>
      <View
        className="w-11 h-11 rounded-full items-center justify-center"
        style={{backgroundColor: colors.primary}}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <Ionicons name="scan-outline" size={22} color={colors.white} />
        )}
      </View>

      <View className="flex-1">
        <Text style={[typography.medium, {color: colors.text}]} className="text-sm">
          Zeskanuj paragon
        </Text>
        <Text
          style={[typography.regular, {color: colors.textMuted}]}
          className="text-xs">
          Uzupełnimy formularz automatycznie (OCR)
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}
