import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {SafeAreaView} from 'react-native-safe-area-context';
import NavigationBar from '../components/NavigationBar';
import Dashboard from '../screens/Dashboard';
import Expenses from '../screens/Expenses';
import AddExpense from '../screens/AddExpense';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

function TabBar({state, navigation}: BottomTabBarProps) {
  const activeKey = state.routes[state.index].name;
  const registeredRoutes = new Set(state.routes.map(r => r.name));

  const handlePress = (key: string) => {
    if (registeredRoutes.has(key)) {
      navigation.navigate(key);
    }
  };

  return <NavigationBar activeKey={activeKey} onPress={handlePress} />;
}

export default function AppNavigator() {
  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <Tab.Navigator
        tabBar={props => <TabBar {...props} />}
        screenOptions={{headerShown: false}}>
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="Expenses" component={Expenses} />
        <Tab.Screen name="Scanner" component={AddExpense} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
