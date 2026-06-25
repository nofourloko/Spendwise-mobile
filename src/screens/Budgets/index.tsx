import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, View, ActivityIndicator, Text} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import colors from '../../assets/colors';
import typography from '../../assets/typography';
import {useAppSelector} from '../../redux/hooks';
import {
  useGetBudgetStatusQuery,
  useSetBudgetLimitMutation,
} from '../../services/api/budgetLimitsApi';
import useBudgetMonth from '../../hooks/useBudgetMonth';
import useOverallBudget from '../../hooks/useOverallBudget';
import BudgetsHeader from './BudgetsHeader';
import MonthPicker from './MonthPicker';
import BudgetCard from './BudgetCard';
import OverallBudgetCard from './OverallBudgetCard';

// Coalesce a burst of +/- taps into a single backend write per category.
const SAVE_DEBOUNCE_MS = 600;

export default function Budgets() {
  const userId = useAppSelector(state => state.auth.user?.id);
  const {selected, select, label} = useBudgetMonth();
  const [pickerVisible, setPickerVisible] = useState(false);

  const {data: budgetStatus = [], isLoading} = useGetBudgetStatusQuery(
    {userId: userId!, month: selected.month, year: selected.year},
    {skip: !userId},
  );

  const [setBudgetLimit] = useSetBudgetLimitMutation();
  const {value: overall, setValue: setOverall} = useOverallBudget(
    userId,
    selected.month,
    selected.year,
  );

  // Per-category limits are edited optimistically here so the stepper feels
  // instant and "Przydzielono"/"Wolne" update live; the server value re-seeds
  // this map whenever the query data changes.
  const [limits, setLimits] = useState<Record<string, number>>({});
  useEffect(() => {
    const next: Record<string, number> = {};
    budgetStatus.forEach(status => {
      next[status.category_id] = Number(status.monthly_limit) || 0;
    });
    setLimits(next);
  }, [budgetStatus]);

  const allocated = useMemo(
    () => Object.values(limits).reduce((sum, value) => sum + value, 0),
    [limits],
  );

  // Sliders represent each category's slice of the overall budget. Before the
  // user sets one, fall back to a usable ceiling so the sliders still work.
  const sliderMax = overall > 0 ? overall : Math.max(allocated, 5000);

  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  useEffect(() => {
    const pending = timers.current;
    return () => Object.values(pending).forEach(clearTimeout);
  }, []);

  const handleLimitChange = (categoryId: string, next: number) => {
    const safe = Math.max(0, Math.round(next));
    setLimits(prev => ({...prev, [categoryId]: safe}));

    clearTimeout(timers.current[categoryId]);
    timers.current[categoryId] = setTimeout(() => {
      if (!userId) {
        return;
      }
      setBudgetLimit({
        user_id: userId,
        category_id: categoryId,
        monthly_limit: safe,
        month: selected.month,
        year: selected.year,
      });
    }, SAVE_DEBOUNCE_MS);
  };

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

        <OverallBudgetCard
          value={overall}
          allocated={allocated}
          onChange={setOverall}
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
          budgetStatus.map((status, index) => (
            <View key={status.category_id}>
              {index > 0 && <View className="border-t border-gray-100" />}
              <BudgetCard
                status={status}
                limit={limits[status.category_id] ?? 0}
                max={sliderMax}
                onChange={next => handleLimitChange(status.category_id, next)}
              />
            </View>
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
