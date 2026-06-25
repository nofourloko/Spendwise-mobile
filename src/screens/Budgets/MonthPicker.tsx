import React, {useState} from 'react';
import {Modal, View, Text, TouchableOpacity, Pressable} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import typography from '../../assets/typography';
import colors from '../../assets/colors';

const MONTHS = [
  'Sty',
  'Lut',
  'Mar',
  'Kwi',
  'Maj',
  'Cze',
  'Lip',
  'Sie',
  'Wrz',
  'Paź',
  'Lis',
  'Gru',
];

type Props = {
  visible: boolean;
  month: number;
  year: number;
  onSelect: (month: number, year: number) => void;
  onClose: () => void;
};

export default function MonthPicker({
  visible,
  month,
  year,
  onSelect,
  onClose,
}: Props) {
  const [displayYear, setDisplayYear] = useState(year);

  const handleSelect = (m: number) => {
    onSelect(m, displayYear);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable className="flex-1 justify-center items-center bg-black/40" onPress={onClose}>
        <Pressable
          className="w-80 rounded-2xl p-5"
          style={{backgroundColor: colors.white}}
          onPress={() => {}}>
          <View className="flex-row justify-between items-center mb-5">
            <TouchableOpacity
              onPress={() => setDisplayYear(y => y - 1)}
              hitSlop={12}>
              <Ionicons
                name="chevron-back"
                size={22}
                color={colors.text}
              />
            </TouchableOpacity>
            <Text style={[typography.medium, {color: colors.text}]} className="text-base">
              {displayYear}
            </Text>
            <TouchableOpacity
              onPress={() => setDisplayYear(y => y + 1)}
              hitSlop={12}>
              <Ionicons
                name="chevron-forward"
                size={22}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap gap-2">
            {MONTHS.map((name, i) => {
              const m = i + 1;
              const isSelected = m === month && displayYear === year;

              return (
                <TouchableOpacity
                  key={m}
                  onPress={() => handleSelect(m)}
                  activeOpacity={0.7}
                  className="w-[30%] py-3 rounded-xl items-center"
                  style={{
                    backgroundColor: isSelected
                      ? colors.primary
                      : colors.cardBackground,
                  }}>
                  <Text
                    style={[
                      typography.medium,
                      {color: isSelected ? colors.white : colors.text},
                    ]}
                    className="text-sm">
                    {name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
