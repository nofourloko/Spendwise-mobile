import AsyncStorage from '@react-native-async-storage/async-storage';
import type {AuthTokens} from '../../types/auth';

/**
 * Single responsibility: persist the JWT token pair on the device and abstract
 * away the underlying storage engine. The rest of the app depends on this small
 * interface rather than on AsyncStorage directly, so the storage backend can be
 * swapped (e.g. for an encrypted keychain) without touching callers.
 */
const ACCESS_TOKEN_KEY = '@spendwise/access_token';
const REFRESH_TOKEN_KEY = '@spendwise/refresh_token';
const USER_ID_KEY = '@spendwise/user_id';

/** Persisted session: the token pair plus the id needed to refetch the user. */
export type StoredSession = AuthTokens & {userId: string | null};

async function save(tokens: AuthTokens, userId?: string): Promise<void> {
  const ops = [
    AsyncStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken),
    AsyncStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken),
  ];
  if (userId) {
    ops.push(AsyncStorage.setItem(USER_ID_KEY, userId));
  }
  await Promise.all(ops);
}

async function load(): Promise<StoredSession | null> {
  const [accessToken, refreshToken, userId] = await Promise.all([
    AsyncStorage.getItem(ACCESS_TOKEN_KEY),
    AsyncStorage.getItem(REFRESH_TOKEN_KEY),
    AsyncStorage.getItem(USER_ID_KEY),
  ]);

  if (!accessToken || !refreshToken) {
    return null;
  }

  return {accessToken, refreshToken, userId};
}

async function clear(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
    AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
    AsyncStorage.removeItem(USER_ID_KEY),
  ]);
}

export const tokenStorage = {save, load, clear};
