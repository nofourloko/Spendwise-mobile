import {baseApi} from '.';
import {EXPENSE_TAGS} from './_tags';
import {
  ExpenseInDb,
  CreateExpensePayload,
  UpdateExpensePayload,
  ExpenseQueryParams,
} from '../../types/expense';
import {ExpenseCategory} from '../../types/expense';

type ExpenseSummaryItem = {
  category_id: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  total: number;
};

type GetUserExpensesArgs = {userId: string} & ExpenseQueryParams;

type GetExpenseSummaryArgs = {
  userId: string;
  month: number;
  year: number;
};

export const expensesApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getExpenseById: build.query<ExpenseInDb, string>({
      query: id => `expenses/${id}`,
      providesTags: (_, __, id) => [{type: EXPENSE_TAGS.EXPENSES, id}],
    }),
    getUserExpenses: build.query<ExpenseInDb[], GetUserExpensesArgs>({
      query: ({userId, ...params}) => ({
        url: `expenses/users/${userId}`,
        params,
      }),
      providesTags: [EXPENSE_TAGS.EXPENSES],
    }),
    getExpenseSummary: build.query<ExpenseSummaryItem[], GetExpenseSummaryArgs>({
      query: ({userId, month, year}) => ({
        url: `expenses/users/${userId}/summary`,
        params: {month, year},
      }),
      providesTags: [EXPENSE_TAGS.EXPENSE_SUMMARY],
    }),
    createExpense: build.mutation<ExpenseInDb, CreateExpensePayload>({
      query: body => ({url: 'expenses', method: 'POST', body}),
      invalidatesTags: [EXPENSE_TAGS.EXPENSES, EXPENSE_TAGS.EXPENSE_SUMMARY],
    }),
    updateExpense: build.mutation<ExpenseInDb, {id: string; body: UpdateExpensePayload}>({
      query: ({id, body}) => ({url: `expenses/${id}`, method: 'PATCH', body}),
      invalidatesTags: (_, __, {id}) => [
        EXPENSE_TAGS.EXPENSES,
        EXPENSE_TAGS.EXPENSE_SUMMARY,
        {type: EXPENSE_TAGS.EXPENSES, id},
      ],
    }),
    deleteExpense: build.mutation<void, string>({
      query: id => ({url: `expenses/${id}`, method: 'DELETE'}),
      invalidatesTags: [EXPENSE_TAGS.EXPENSES, EXPENSE_TAGS.EXPENSE_SUMMARY],
    }),
  }),
});

export type {ExpenseSummaryItem, ExpenseCategory};

export const {
  useGetExpenseByIdQuery,
  useGetUserExpensesQuery,
  useGetExpenseSummaryQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expensesApi;
