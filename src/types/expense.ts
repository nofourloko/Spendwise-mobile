export type ExpenseInDb = {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  description?: string;
  expense_date: string;
  source: 'manual' | 'ocr';
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
  source?: 'manual' | 'ocr';
};

export type UpdateExpensePayload = Partial<Omit<CreateExpensePayload, 'user_id'>>;

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
