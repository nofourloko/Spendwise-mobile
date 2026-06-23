import React from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import typography from '../../assets/typography';
import colors from '../../assets/colors';

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

/**
 * Shared chrome for the auth screens: branded header plus a keyboard-aware,
 * scrollable container so the form stays reachable on small devices.
 */
export default function AuthLayout({title, subtitle, children}: Props) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow justify-center gap-8 p-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className="items-center gap-3">
            <View
              className="w-16 h-16 rounded-2xl items-center justify-center"
              style={{backgroundColor: colors.cardBackground}}>
              <Ionicons name="wallet-outline" size={32} color={colors.primary} />
            </View>
            <Text
              style={[typography.medium, {color: colors.text}]}
              className="text-2xl">
              {title}
            </Text>
            <Text
              style={[typography.regular, {color: colors.textMuted}]}
              className="text-sm text-center">
              {subtitle}
            </Text>
          </View>

          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
