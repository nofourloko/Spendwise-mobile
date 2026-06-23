/** How an expense entered the system: typed by hand or parsed from a receipt. */
export type ExpenseSource = 'manual' | 'ocr';

export type ExpenseInDb = {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  description?: string;
  expense_date: string;
  source: ExpenseSource;
  created_at: string;
  category_name: string;
  category_icon: string;
  category_color: string;
};

export type CreateExpensePayload = {
  user_id: string;
  category_id: string;
  amount: number;
  description?: string;
  expense_date: string;
  source?: ExpenseSource;
};

export type UpdateExpensePayload = Partial<Omit<CreateExpensePayload, 'user_id'>>;

/**
 * String-based shape used by the add-expense form. Kept separate from
 * `CreateExpensePayload` because inputs are always strings until validated and
 * coerced on submit (e.g. `amount` becomes a number, empty `description` is
 * dropped).
 */
export type ExpenseFormValues = {
  amount: string;
  category_id: string;
  description: string;
  expense_date: string;
};

export type ExpenseQueryParams = {
  from?: string;
  to?: string;
  categoryId?: string;
  limit?: number;
  offset?: number;
};

export type ExpenseCategory = {
  name: string;
  percentage: number;
  amount: number;
  color: string;
};
