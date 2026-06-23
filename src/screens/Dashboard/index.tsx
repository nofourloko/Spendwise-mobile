import React from 'react';
import {ScrollView, View, ActivityIndicator} from 'react-native';
import colors from '../../assets/colors';
import {useAppSelector} from '../../redux/hooks';
import {useGetUserByIdQuery} from '../../services/api/usersApi';
import {useGetExpenseSummaryQuery, useGetUserExpensesQuery} from '../../services/api/expensesApi';
import {useGetBudgetStatusQuery} from '../../services/api/budgetLimitsApi';
import {ExpenseCategory, ExpenseInDb} from '../../types/expense';
import {BudgetStatus} from '../../types/budget';
import {Transaction, TransactionCategory} from '../../types/transaction';
import {toTransactions} from '../../utils/expansesUtlis';
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
  const totalAll = summary.reduce((sum, s) => sum + s.total, 0);
  if (totalAll === 0) {return [];}
  return summary
    .filter(s => s.total > 0)
    .map(s => ({
      name: s.category_name,
      amount: s.total,
      color: s.category_color,
      percentage: Math.round((s.total / totalAll) * 100),
    }));
}

function toBudgetTotals(status: BudgetStatus[]): {budget: number; expenses: number} {
  return status.reduce(
    (acc, s) => ({
      budget: acc.budget + (s.monthly_limit ?? 0),
      expenses: acc.expenses + s.spent,
    }),
    {budget: 0, expenses: 0},
  );
}

export default function Dashboard() { 
  const userId = useAppSelector(state => state.auth.user?.id);

  const {data: user} = useGetUserByIdQuery(userId!, {skip: !userId});

  const {data: summary = [], isLoading: summaryLoading} = useGetExpenseSummaryQuery(
    {userId: userId!, month: CURRENT_MONTH, year: CURRENT_YEAR},
    {skip: !userId},
  );

  const {data: budgetStatus = [], isLoading: budgetLoading} = useGetBudgetStatusQuery(
    {userId: userId!, month: CURRENT_MONTH, year: CURRENT_YEAR},
    {skip: !userId},
  );

  const {data: recentExpenses = [], isLoading: expensesLoading} = useGetUserExpensesQuery(
    {userId: userId!, limit: RECENT_LIMIT},
    {skip: !userId},
  );

  const isLoading = summaryLoading || budgetLoading || expensesLoading;

  const {budget, expenses} = toBudgetTotals(budgetStatus);
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
