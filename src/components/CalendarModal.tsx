import React, {useEffect, useState} from 'react';
import {Modal, View, Text, TouchableOpacity, Pressable} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import typography from '../assets/typography';
import colors from '../assets/colors';

const WEEKDAYS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
const MONTHS = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];

const pad = (n: number) => String(n).padStart(2, '0');
const toIso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

type Props = {
  visible: boolean;
  /** Currently selected date as ISO `YYYY-MM-DD`, or null. */
  value: string | null;
  onSelect: (iso: string) => void;
  onClose: () => void;
  /** Optional inclusive upper bound (ISO); later days are disabled. */
  maxDate?: string;
};

/**
 * Dependency-free day picker. A month grid (Monday-first, Polish labels) with
 * month navigation; tapping a day returns its ISO date. The visible month syncs
 * to `value` each time the modal opens, so reusing one instance for several
 * fields (e.g. "from"/"to") always opens on the right month.
 */
export default function CalendarModal({
  visible,
  value,
  onSelect,
  onClose,
  maxDate,
}: Props) {
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());

  useEffect(() => {
    if (visible) {
      const base = value ? new Date(value) : new Date();
      setViewYear(base.getFullYear());
      setViewMonth(base.getMonth());
    }
  }, [visible, value]);

  const startOffset = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({length: daysInMonth}, (_, i) => i + 1),
  ];

  const goPrev = () =>
    viewMonth === 0
      ? (setViewMonth(11), setViewYear(y => y - 1))
      : setViewMonth(m => m - 1);
  const goNext = () =>
    viewMonth === 11
      ? (setViewMonth(0), setViewYear(y => y + 1))
      : setViewMonth(m => m + 1);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-center items-center bg-black/40" onPress={onClose}>
        <Pressable
          className="w-80 rounded-2xl p-5"
          style={{backgroundColor: colors.white}}
          onPress={() => {}}>
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity onPress={goPrev} hitSlop={12} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={22} color={colors.text} />
            </TouchableOpacity>
            <Text style={[typography.medium, {color: colors.text}]} className="text-base">
              {MONTHS[viewMonth]} {viewYear}
            </Text>
            <TouchableOpacity onPress={goNext} hitSlop={12} activeOpacity={0.7}>
              <Ionicons name="chevron-forward" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View className="flex-row">
            {WEEKDAYS.map(day => (
              <View key={day} className="items-center" style={{width: `${100 / 7}%`}}>
                <Text style={[typography.regular, {color: colors.textMuted}]} className="text-xs">
                  {day}
                </Text>
              </View>
            ))}
          </View>

          <View className="flex-row flex-wrap mt-1">
            {cells.map((day, index) => {
              if (day === null) {
                return <View key={`e${index}`} style={{width: `${100 / 7}%`}} />;
              }
              const iso = toIso(viewYear, viewMonth, day);
              const isSelected = iso === value;
              const isDisabled = maxDate ? iso > maxDate : false;

              return (
                <View key={iso} className="items-center py-1" style={{width: `${100 / 7}%`}}>
                  <TouchableOpacity
                    onPress={() => onSelect(iso)}
                    disabled={isDisabled}
                    activeOpacity={0.7}
                    className="w-9 h-9 rounded-full items-center justify-center"
                    style={{
                      backgroundColor: isSelected ? colors.primary : 'transparent',
                      opacity: isDisabled ? 0.3 : 1,
                    }}>
                    <Text
                      style={[
                        isSelected ? typography.medium : typography.regular,
                        {color: isSelected ? colors.white : colors.text},
                      ]}
                      className="text-sm">
                      {day}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
