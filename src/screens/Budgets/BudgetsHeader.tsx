import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import typography from '../../assets/typography';
import colors from '../../assets/colors';

type Props = {
  label: string;
  onCalendarPress: () => void;
};

export default function BudgetsHeader({label, onCalendarPress}: Props) {
  return (
    <View className="flex-row justify-between items-center">
      <Text
        style={[typography.medium, {color: colors.text}]}
        className="text-lg capitalize">
        {label}
      </Text>
      <TouchableOpacity onPress={onCalendarPress} hitSlop={12} activeOpacity={0.7}>
        <Ionicons name="calendar-outline" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}
