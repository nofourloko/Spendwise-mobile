import React, {useCallback} from 'react';
import {ScrollView, View, ActivityIndicator} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import colors from '../../assets/colors';
import {useAppSelector} from '../../redux/hooks';
import {useGetUserByIdQuery} from '../../services/api/usersApi';
import {useGetExpenseSummaryQuery, useGetUserExpensesQuery} from '../../services/api/expensesApi';
import {useGetBudgetStatusQuery} from '../../services/api/budgetLimitsApi';
import {ExpenseCategory} from '../../types/expense';
import {BudgetStatus} from '../../types/budget';
import {toTransactions} from '../../utils/expansesUtlis';
import useOverallBudget from '../../hooks/useOverallBudget';
import WelcomeHeader from './WelcomeHeader';
import BalanceBanner from './BalanceBanner';
import ExpenseBreakdown from './ExpenseBreakdown';
import RecentTransactions from './RecentTransactions';

const now = new Date();
const CURRENT_MONTH = now.getMonth() + 1;
const CURRENT_YEAR = now.getFullYear();
const RECENT_LIMIT = 5;

function toExpenseCategories(
  summary: {category_name: string; category_color: string; total: number}[],
): ExpenseCategory[] {
  // `total` arrives from the backend as a numeric string (SQL SUM), so coerce
  // before any arithmetic — otherwise `+` concatenates instead of adding.
  const totalAll = summary.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
  if (totalAll === 0) {return [];}
  return summary
    .filter(s => (Number(s.total) || 0) > 0)
    .map(s => {
      const amount = Number(s.total) || 0;
      return {
        name: s.category_name,
        amount,
        color: s.category_color,
        percentage: Math.round((amount / totalAll) * 100),
      };
    });
}

function toMonthExpenses(status: BudgetStatus[]): number {
  return status.reduce((sum, s) => sum + (Number(s.spent) || 0), 0);
}

export default function Dashboard() { 
  const userId = useAppSelector(state => state.auth.user?.id);

  const {data: user} = useGetUserByIdQuery(userId!, {skip: !userId});

  const {
    data: summary = [],
    isLoading: summaryLoading,
    refetch: refetchSummary,
  } = useGetExpenseSummaryQuery(
    {userId: userId!, month: CURRENT_MONTH, year: CURRENT_YEAR},
    {skip: !userId},
  );

  const {
    data: budgetStatus = [],
    isLoading: budgetLoading,
    refetch: refetchBudget,
  } = useGetBudgetStatusQuery(
    {userId: userId!, month: CURRENT_MONTH, year: CURRENT_YEAR},
    {skip: !userId},
  );

  const {
    data: recentExpenses = [],
    isLoading: expensesLoading,
    refetch: refetchRecent,
  } = useGetUserExpensesQuery(
    {userId: userId!, limit: RECENT_LIMIT},
    {skip: !userId},
  );

  // Master monthly budget, shared via Redux so edits on the Budgets screen
  // refresh the banner here live.
  const {value: budget} = useOverallBudget(userId, CURRENT_MONTH, CURRENT_YEAR);

  // Re-fetch the dashboard data from the backend every time the screen regains
  // focus, so the banner/breakdown reflect expenses and budgets changed on
  // other tabs without waiting for cache invalidation.
  useFocusEffect(
    useCallback(() => {
      if (!userId) {
        return;
      }
      refetchSummary();
      refetchBudget();
      refetchRecent();
    }, [userId, refetchSummary, refetchBudget, refetchRecent]),
  );

  const isLoading = summaryLoading || budgetLoading || expensesLoading;

  const expenses = toMonthExpenses(budgetStatus);
  const categories = toExpenseCategories(summary);
  const transactions = toTransactions(recentExpenses);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-4 p-4"
      showsVerticalScrollIndicator={false}>
      <WelcomeHeader name={user?.name ?? ''} />
      <BalanceBanner budget={budget} expenses={expenses} />
      <ExpenseBreakdown categories={categories} />
      <RecentTransactions transactions={transactions} />
    </ScrollView>
  );
}
