import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import navigationElements, { NavItem } from '../utils/navigationElements';
import { Ionicons } from '@react-native-vector-icons/ionicons/static';
import typography from '../assets/typography';

type NavigationBarProps = {
  activeKey: string;
  onPress: (key: string) => void;
};

export default function NavigationBar({
  activeKey,
  onPress,
}: NavigationBarProps) {
  return (
    <View className="flex-row bg-white border-t border-gray-100 pb-8">
      {navigationElements.map((item: NavItem) => {
        const isActive = activeKey === item.key;

        if (item.isCenter) {
          return (
            <TouchableOpacity
              key={item.key}
              className="flex-1 items-center"
              activeOpacity={0.8}
              onPress={() => onPress(item.key)}
            >
              <View className="w-14 h-14 rounded-full bg-teal-500 items-center justify-center -mt-6">
                <Ionicons name="link" size={26} color="#fff" />
              </View>
              <Text
                style={typography.regular}
                className="text-xs text-gray-400 mt-1"
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={item.key}
            className="flex-1 items-center py-3"
            activeOpacity={0.7}
            onPress={() => onPress(item.key)}
          >
            <Ionicons
              name={item.icon}
              size={22}
              color={isActive ? '#14b8a6' : '#9ca3af'}
            />
            <Text
              style={isActive ? typography.medium : typography.regular}
              className={`text-xs mt-1 ${
                isActive ? 'text-teal-500' : 'text-gray-400'
              }`}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
