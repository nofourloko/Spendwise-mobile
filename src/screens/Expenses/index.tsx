import React, {useState} from 'react';
import {ScrollView, View, Text, ActivityIndicator} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import typography from '../../assets/typography';
import colors from '../../assets/colors';
import {useAppSelector} from '../../redux/hooks';
import {useGetUserExpensesQuery} from '../../services/api/expensesApi';
import {useGetCategoriesQuery} from '../../services/api/categoriesApi';
import {ExpenseInDb} from '../../types/expense';
import SearchInput from '../../components/SearchInput';
import CategoryFilter from './CategoryFilter';
import DateRangeFilter from './DateRangeFilter';
import ExpenseRow from './ExpenseRow';
import EditExpenseModal from './EditExpenseModal';

export default function Expenses() {
  const userId = useAppSelector(state => state.auth.user?.id);

  const {data: categories = [], isLoading: categoriesLoading} =
    useGetCategoriesQuery();

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [editing, setEditing] = useState<ExpenseInDb | null>(null);

  const {data: expenses = [], isLoading} = useGetUserExpensesQuery(
    {
      userId: userId!,
      categoryId: categoryId ?? undefined,
      from: from ?? undefined,
      to: to ?? undefined,
    },
    {skip: !userId},
  );

  // Category/date filters run server-side; free-text search filters the result
  // by description or category name on the client.
  const query = search.trim().toLowerCase();
  const visibleExpenses = query
    ? expenses.filter(
        e =>
          (e.description ?? '').toLowerCase().includes(query) ||
          e.category_name.toLowerCase().includes(query),
      )
    : expenses;

  return (
    <>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 p-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={[typography.medium, {color: colors.text}]} className="text-xl">
          Wydatki
        </Text>

        <SearchInput value={search} onChangeText={setSearch} />

        <CategoryFilter
          categories={categories}
          selectedId={categoryId}
          onSelect={setCategoryId}
          loading={categoriesLoading}
        />

        <DateRangeFilter
          from={from}
          to={to}
          onChange={(nextFrom, nextTo) => {
            setFrom(nextFrom);
            setTo(nextTo);
          }}
        />

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} className="mt-8" />
        ) : visibleExpenses.length === 0 ? (
          <View className="items-center justify-center py-20 gap-3">
            <Ionicons name="receipt-outline" size={48} color={colors.neutral} />
            <Text
              style={[typography.regular, {color: colors.textMuted}]}
              className="text-sm text-center">
              {query
                ? `Brak wyników dla\n„${search.trim()}”`
                : 'Brak wydatków dla\nwybranych filtrów'}
            </Text>
          </View>
        ) : (
          visibleExpenses.map((expense, index) => (
            <View key={expense.id}>
              {index > 0 && <View className="border-t border-gray-100" />}
              <ExpenseRow expense={expense} onPress={() => setEditing(expense)} />
            </View>
          ))
        )}
      </ScrollView>

      <EditExpenseModal
        expense={editing}
        categories={categories}
        categoriesLoading={categoriesLoading}
        onClose={() => setEditing(null)}
      />
    </>
  );
}
