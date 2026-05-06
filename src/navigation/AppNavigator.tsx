import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import NavigationBar from '../components/NavigationBar';
import Dashboard from '../screens/Dashboard';

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
    <Tab.Navigator
      tabBar={props => <TabBar {...props} />}
      screenOptions={{headerShown: false}}>
      <Tab.Screen name="Dashboard" component={Dashboard} />
    </Tab.Navigator>
  );
}
