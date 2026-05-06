export type User = {
  id: string;
  email: string;
  name: string;
  currency: string;
  created_at: string;
};

export type CreateUserPayload = {
  email: string;
  name: string;
  currency?: string;
};

export type UpdateUserPayload = Partial<CreateUserPayload>;
