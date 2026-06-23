import {useEffect} from 'react';
import {useAppDispatch} from '../redux/hooks';
import {tokenStorage} from '../services/auth/tokenStorage';
import {clearCredentials, restoreSession} from '../services/slices/authSlice';

/**
 * On app start, read any persisted JWT pair and move the auth slice out of its
 * `bootstrapping` state. If tokens exist the session is restored (the auth
 * screen is skipped); otherwise we mark the user unauthenticated.
 */
export function useAuthBootstrap(): void {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const tokens = await tokenStorage.load();
      if (cancelled) {
        return;
      }
      if (tokens) {
        dispatch(restoreSession(tokens));
      } else {
        dispatch(clearCredentials());
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);
}
