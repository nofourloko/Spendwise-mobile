import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import StoreProvider from './src/redux/StoreProvider';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <StoreProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </StoreProvider>
  );
}
