import React from 'react';
import { View, Text } from 'react-native';
import typography from '../../assets/typography';
import Ionicons from '@react-native-vector-icons/ionicons';

type Props = {
  name: string;
};

export default function WelcomeHeader({ name }: Props) {
  return (
    <View>
      <Text style={typography.medium} className="text-lg text-gray-900">
        Cześć, {name}! <Ionicons name="sparkles-outline" />
      </Text>
      <Text style={typography.regular} className="text-sm text-gray-500">
        Miło Cię widzieć z powrotem.
      </Text>
    </View>
  );
}
