export type BudgetLimit = {
  id: string;
  user_id: string;
  category_id: string;
  monthly_limit: number;
  month: number;
  year: number;
};

export type BudgetStatus = {
  category_id: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  monthly_limit: number | null;
  spent: number;
  usage_percent: number | null;
};

export type SetBudgetLimitPayload = {
  user_id: string;
  category_id: string;
  monthly_limit: number;
  month: number;
  year: number;
};
