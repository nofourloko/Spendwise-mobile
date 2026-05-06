import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {IoniconsName} from '../assets/icons';
import typography from '../assets/typography';
import colors from '../assets/colors';

type Props = {
  onPress: () => void;
  text?: string;
  icon?: IoniconsName;
  color?: string;
};

export default function Button({
  onPress,
  text = 'Wyloguj się',
  icon = 'log-out-outline',
  color = colors.danger,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center justify-center gap-2 py-4 rounded-2xl border"
      style={{borderColor: color}}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[typography.medium, {color}]} className="text-sm">
        {text}
      </Text>
    </TouchableOpacity>
  );
}
