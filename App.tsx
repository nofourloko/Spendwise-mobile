import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import StoreProvider from './src/redux/StoreProvider';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <StoreProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </StoreProvider>
  );
}
