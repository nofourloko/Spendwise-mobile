export const USER_TAGS = {
  USERS: 'USERS',
} as const;

export const CATEGORY_TAGS = {
  CATEGORIES: 'CATEGORIES',
} as const;

export const EXPENSE_TAGS = {
  EXPENSES: 'EXPENSES',
  EXPENSE_SUMMARY: 'EXPENSE_SUMMARY',
} as const;

export const BUDGET_TAGS = {
  BUDGET_LIMITS: 'BUDGET_LIMITS',
  BUDGET_STATUS: 'BUDGET_STATUS',
} as const;

export const API_TAG_TYPES = [
  ...Object.values(USER_TAGS),
  ...Object.values(CATEGORY_TAGS),
  ...Object.values(EXPENSE_TAGS),
  ...Object.values(BUDGET_TAGS),
] as const;

export type ApiTagType = (typeof API_TAG_TYPES)[number];
