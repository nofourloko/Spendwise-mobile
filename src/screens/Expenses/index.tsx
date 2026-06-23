import React from 'react';
import { ScrollView, View } from 'react-native';
import ExpensesHeader from './ExpensesHeader';
import { useAppSelector } from '../../redux/hooks';
import { useGetUserExpensesQuery } from '../../services/api/expensesApi';
import TransactionRow from '../../components/TransactionRow';
import { toTransactions } from '../../utils/expansesUtlis';

export default function Expenses() {
  const userId = useAppSelector(state => state.auth.user?.id);

  const { data: recentExpenses = [], isLoading: expensesLoading } =
    useGetUserExpensesQuery({ userId: userId!, limit: 10 }, { skip: !userId });

  const transactions = toTransactions(recentExpenses);

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-4 p-4"
      showsVerticalScrollIndicator={false}
    >
      <ExpensesHeader />
      {transactions.map((item, index) => (
        <View key={item.id}>
          {index > 0 && <View className="border-t border-gray-100" />}
          <TransactionRow item={item} />
        </View>
      ))}
    </ScrollView>
  );
}
