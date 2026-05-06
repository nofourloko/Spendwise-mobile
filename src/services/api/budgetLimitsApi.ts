import {baseApi} from '.';
import {BUDGET_TAGS} from './_tags';
import {BudgetLimit, BudgetStatus, SetBudgetLimitPayload} from '../../types/budget';

type MonthYearArgs = {
  userId: string;
  month: number;
  year: number;
};

export const budgetLimitsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getBudgetLimits: build.query<BudgetLimit[], MonthYearArgs>({
      query: ({userId, month, year}) => ({
        url: `budget-limits/users/${userId}`,
        params: {month, year},
      }),
      providesTags: [BUDGET_TAGS.BUDGET_LIMITS],
    }),
    getBudgetStatus: build.query<BudgetStatus[], MonthYearArgs>({
      query: ({userId, month, year}) => ({
        url: `budget-limits/users/${userId}/status`,
        params: {month, year},
      }),
      providesTags: [BUDGET_TAGS.BUDGET_STATUS],
    }),
    setBudgetLimit: build.mutation<BudgetLimit, SetBudgetLimitPayload>({
      query: body => ({url: 'budget-limits', method: 'PUT', body}),
      invalidatesTags: [BUDGET_TAGS.BUDGET_LIMITS, BUDGET_TAGS.BUDGET_STATUS],
    }),
    deleteBudgetLimit: build.mutation<void, string>({
      query: id => ({url: `budget-limits/${id}`, method: 'DELETE'}),
      invalidatesTags: [BUDGET_TAGS.BUDGET_LIMITS, BUDGET_TAGS.BUDGET_STATUS],
    }),
  }),
});

export const {
  useGetBudgetLimitsQuery,
  useGetBudgetStatusQuery,
  useSetBudgetLimitMutation,
  useDeleteBudgetLimitMutation,
} = budgetLimitsApi;
