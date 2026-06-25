import {useEffect} from 'react';
import {useAppDispatch} from '../redux/hooks';
import {tokenStorage} from '../services/auth/tokenStorage';
import {
  clearCredentials,
  setTokens,
  setUser,
} from '../services/slices/authSlice';
import {clearUser, setUserId} from '../services/slices/userSlice';
import {usersApi} from '../services/api/usersApi';

/**
 * On app start, restore a persisted session — but only trust it if it maps to
 * real user data. A token (even a refresh token) on its own is not enough: we
 * keep the splash up (`bootstrapping`) while we actually fetch the user behind
 * it. Only a successful fetch flips the app to `authenticated`; missing tokens,
 * a missing user id, a rejected token or an empty user all force a clean
 * sign-out so the user has to log in again.
 */
export function useAuthBootstrap(): void {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let cancelled = false;

    const forceLogin = async () => {
      dispatch(clearCredentials());
      dispatch(clearUser());
      await tokenStorage.clear();
    };

    (async () => {
      const session = await tokenStorage.load();
      if (cancelled) {
        return;
      }

      // No persisted tokens, or we don't know which user they belong to.
      if (!session || !session.userId) {
        await forceLogin();
        return;
      }

      // Make the access token available to the validation request while the UI
      // stays on the splash (status remains `bootstrapping`).
      dispatch(
        setTokens({
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
        }),
      );

      const request = dispatch(
        usersApi.endpoints.getUserById.initiate(session.userId),
      );
      try {
        const user = await request.unwrap();
        if (cancelled) {
          return;
        }
        if (!user?.id) {
          throw new Error('Session has no user data');
        }
        dispatch(setUser(user));
        dispatch(setUserId(user.id));
      } catch {
        if (!cancelled) {
          await forceLogin();
        }
      } finally {
        request.unsubscribe();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);
}
