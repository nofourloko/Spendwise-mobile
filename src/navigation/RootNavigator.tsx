import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import colors from '../assets/colors';
import {useAppSelector} from '../redux/hooks';
import {useAuthBootstrap} from '../hooks/useAuthBootstrap';
import AppNavigator from './AppNavigator';
import AuthNavigator from '../screens/Auth';

/**
 * Top-level gate. While the persisted session is being restored we show a
 * splash; afterwards the authenticated user lands in the app and everyone else
 * sees the auth flow. This keeps a logged-in user from ever seeing the login
 * screen on launch.
 */
export default function RootNavigator() {
  useAuthBootstrap();
  const status = useAppSelector(state => state.auth.status);

  if (status === 'bootstrapping') {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return status === 'authenticated' ? <AppNavigator /> : <AuthNavigator />;
}
