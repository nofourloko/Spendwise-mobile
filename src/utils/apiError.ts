import type {FetchBaseQueryError} from '@reduxjs/toolkit/query';
import type {SerializedError} from '@reduxjs/toolkit';

type RtkError = FetchBaseQueryError | SerializedError | undefined;

/**
 * Best-effort extraction of a user-facing message from an RTK Query error,
 * falling back to a generic Polish message. Assumes the backend returns errors
 * as `{ message: string }` (or `{ error: string }`).
 */
export function getApiErrorMessage(
  error: RtkError,
  fallback = 'Coś poszło nie tak. Spróbuj ponownie.',
): string {
  if (!error) {
    return fallback;
  }

  if ('status' in error) {
    if (error.status === 'FETCH_ERROR') {
      return 'Brak połączenia z serwerem.';
    }
    const data = error.data as {message?: string; error?: string} | undefined;
    return data?.message ?? data?.error ?? fallback;
  }

  return error.message ?? fallback;
}
