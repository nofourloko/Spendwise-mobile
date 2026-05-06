import React from 'react';
import { View, Text } from 'react-native';
import typography from '../../assets/typography';
import colors from '../../assets/colors';

type Props = {
  label: string;
  value: string;
  labelClassName?: string;
  valueClassName?: string;
};

export default function StatItem({
  label,
  value,
  labelClassName = 'text-xs mb-1',
  valueClassName = 'text-base',
}: Props) {
  return (
    <View>
      <Text
        style={[typography.regular, { color: colors.white }]}
        className={labelClassName}
      >
        {label}
      </Text>
      <Text
        style={[typography.medium, { color: colors.white }]}
        className={valueClassName}
      >
        {value}
      </Text>
    </View>
  );
}
