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

async function save(tokens: AuthTokens): Promise<void> {
  await Promise.all([
    AsyncStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken),
    AsyncStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken),
  ]);
}

async function load(): Promise<AuthTokens | null> {
  const [accessToken, refreshToken] = await Promise.all([
    AsyncStorage.getItem(ACCESS_TOKEN_KEY),
    AsyncStorage.getItem(REFRESH_TOKEN_KEY),
  ]);

  if (!accessToken || !refreshToken) {
    return null;
  }

  return {accessToken, refreshToken};
}

async function clear(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
    AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
  ]);
}

export const tokenStorage = {save, load, clear};
