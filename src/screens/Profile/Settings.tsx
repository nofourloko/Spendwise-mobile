import React from 'react';
import {View, Text, Switch, TouchableOpacity} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import typography from '../../assets/typography';
import colors from '../../assets/colors';
import settingsOptions from '../../utils/settingsOptions';
import { IoniconsName } from '../../assets/icons';


function RowLeft({icon, title}: {icon: IoniconsName; title: string}) {
  return (
    <View className="flex-row items-center gap-3">
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={[typography.regular, {color: colors.text}]} className="text-sm">
        {title}
      </Text>
    </View>
  );
}

function ChevronValue({label}: {label: string}) {
  return (
    <View className="flex-row items-center gap-1">
      <Text style={[typography.regular, {color: colors.textMuted}]} className="text-sm">
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </View>
  );
}

export default function Settings() {
  return (
    <View className="rounded-2xl overflow-hidden" style={{backgroundColor: colors.cardBackground}}>
      {settingsOptions.map((option, index) => (
        <View key={option.key}>
          {index > 0 && <View className="border-t border-gray-200 mx-4" />}

          <View className="flex-row items-center justify-between px-4 py-4">
            <RowLeft icon={option.icon} title={option.title} />

            {option.key === 'currency' && <ChevronValue label="PLN" />}

            {option.key === 'language' && <ChevronValue label="Polski" />}

            {option.key === 'notifications' && (
              <Switch
                value={true}
                thumbColor={colors.white}
                trackColor={{false: colors.neutral, true: colors.primary}}
              />
            )}

            {option.key === 'export' && (
              <View className="flex-row gap-2">
                {['CSV', 'PDF'].map(fmt => (
                  <TouchableOpacity
                    key={fmt}
                    className="px-3 py-1 rounded-lg border"
                    style={{borderColor: colors.primary}}
                    activeOpacity={0.7}>
                    <Text style={[typography.medium, {color: colors.primary}]} className="text-xs">
                      {fmt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {option.key === 'about' && (
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
