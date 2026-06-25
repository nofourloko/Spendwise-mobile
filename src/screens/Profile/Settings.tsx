import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import typography from '../../assets/typography';
import colors from '../../assets/colors';
import settingsOptions from '../../utils/settingsOptions';
import { IoniconsName } from '../../assets/icons';
import AboutModal from './AboutModal';


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
  const [aboutVisible, setAboutVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);

  const handlers: Record<string, (() => void) | undefined> = {
    export: () => setExportVisible(true),
    about: () => setAboutVisible(true),
  };

  return (
    <>
      <View className="rounded-2xl overflow-hidden" style={{backgroundColor: colors.cardBackground}}>
        {settingsOptions.map((option, index) => {
          const onPress = handlers[option.key];

          return (
            <View key={option.key}>
              {index > 0 && <View className="border-t border-gray-200 mx-4" />}

              <TouchableOpacity
                className="flex-row items-center justify-between px-4 py-4"
                activeOpacity={0.7}
                disabled={!onPress}
                onPress={onPress}>
                <RowLeft icon={option.icon} title={option.title} />

                {option.key === 'currency' && <ChevronValue label="PLN" />}

                {option.key === 'language' && <ChevronValue label="Polski" />}

              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <AboutModal visible={aboutVisible} onClose={() => setAboutVisible(false)} />
    </>
  );
}
