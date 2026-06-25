import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import typography from '../../assets/typography';
import colors from '../../assets/colors';
import CalendarModal from '../../components/CalendarModal';
import {todayIso} from '../../utils/ocr';

type Field = 'from' | 'to';

type Props = {
  from: string | null;
  to: string | null;
  onChange: (from: string | null, to: string | null) => void;
};

/**
 * "Od / Do" date-range filter. Each pill opens the shared calendar; selections
 * are lightly clamped so the range stays valid (from ≤ to) and never runs into
 * the future.
 */
export default function DateRangeFilter({from, to, onChange}: Props) {
  const [open, setOpen] = useState<Field | null>(null);

  const handleSelect = (iso: string) => {
    if (open === 'from') {
      onChange(iso, to && iso > to ? iso : to);
    } else if (open === 'to') {
      onChange(from && iso < from ? iso : from, iso);
    }
    setOpen(null);
  };

  const renderPill = (label: string, valueIso: string | null, field: Field) => (
    <TouchableOpacity
      onPress={() => setOpen(field)}
      activeOpacity={0.7}
      className="flex-1 flex-row items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-100">
      <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
      <View className="flex-1">
        <Text style={[typography.regular, {color: colors.textMuted}]} className="text-xs">
          {label}
        </Text>
        <Text style={[typography.medium, {color: colors.text}]} className="text-sm">
          {valueIso ?? '—'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-row items-center gap-2">
      {renderPill('Od', from, 'from')}
      {renderPill('Do', to, 'to')}

      {(from || to) && (
        <TouchableOpacity
          onPress={() => onChange(null, null)}
          hitSlop={8}
          activeOpacity={0.7}
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{backgroundColor: colors.cardBackground}}>
          <Ionicons name="close" size={18} color={colors.primary} />
        </TouchableOpacity>
      )}

      <CalendarModal
        visible={open !== null}
        value={open === 'from' ? from : to}
        maxDate={todayIso()}
        onSelect={handleSelect}
        onClose={() => setOpen(null)}
      />
    </View>
  );
}
