import React from 'react';
import {View, Text} from 'react-native';
import typography from '../../assets/typography';
import colors from '../../assets/colors';

type Props = {
  name: string;
  surname: string;
  email: string;
};

export default function ProfileHeader({name, surname, email}: Props) {
  const initials = `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();

  return (
    <View className="items-center gap-3">
      <View
        className="w-20 h-20 rounded-full items-center justify-center"
        style={{backgroundColor: colors.cardBackground}}>
        <Text style={[typography.medium, {color: colors.primary}]} className="text-2xl">
          {initials}
        </Text>
      </View>

      <View className="items-center gap-1">
        <Text style={[typography.medium, {color: colors.text}]} className="text-base">
          {name} {surname}
        </Text>
        <Text style={[typography.regular, {color: colors.textMuted}]} className="text-sm">
          {email}
        </Text>
      </View>
    </View>
  );
}
