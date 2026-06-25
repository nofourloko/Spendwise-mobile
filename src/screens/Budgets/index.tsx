import React, {useState} from 'react';
import {ScrollView, View, ActivityIndicator, Text} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import colors from '../../assets/colors';
import typography from '../../assets/typography';
import {useAppSelector} from '../../redux/hooks';
import {useGetBudgetStatusQuery} from '../../services/api/budgetLimitsApi';
import useBudgetMonth from '../../hooks/useBudgetMonth';
import BudgetsHeader from './BudgetsHeader';
import MonthPicker from './MonthPicker';
import BudgetCard from './BudgetCard';

export default function Budgets() {
  const userId = useAppSelector(state => state.auth.user?.id);
  const {selected, select, label} = useBudgetMonth();
  const [pickerVisible, setPickerVisible] = useState(false);

  const {data: budgetStatus = [], isLoading} = useGetBudgetStatusQuery(
    {userId: userId!, month: selected.month, year: selected.year},
    {skip: !userId},
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 p-4"
        showsVerticalScrollIndicator={false}>
        <BudgetsHeader
          label={label}
          onCalendarPress={() => setPickerVisible(true)}
        />

        {budgetStatus.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20 gap-3">
            <Ionicons name="wallet-outline" size={48} color={colors.neutral} />
            <Text
              style={[typography.regular, {color: colors.textMuted}]}
              className="text-sm text-center">
              Brak danych budżetowych{'\n'}dla wybranego miesiąca
            </Text>
          </View>
        ) : (
          budgetStatus.map(status => (
            <BudgetCard key={status.category_id} status={status} />
          ))
        )}
      </ScrollView>

      <MonthPicker
        visible={pickerVisible}
        month={selected.month}
        year={selected.year}
        onSelect={select}
        onClose={() => setPickerVisible(false)}
      />
    </>
  );
}
