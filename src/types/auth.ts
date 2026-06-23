import {User} from './user';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

/**
 * Shape returned by the login / register endpoints: the freshly issued token
 * pair together with the authenticated user profile.
 */
export type AuthResponse = AuthTokens & {
  user: User;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type AuthStatus = 'bootstrapping' | 'authenticated' | 'unauthenticated';
