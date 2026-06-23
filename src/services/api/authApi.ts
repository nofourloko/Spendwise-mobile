import {baseApi} from '.';
import {USER_TAGS} from './_tags';
import {tokenStorage} from '../auth/tokenStorage';
import {
  clearCredentials,
  setCredentials,
} from '../slices/authSlice';
import {clearUser, setUserId} from '../slices/userSlice';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from '../../types/auth';

/**
 * Authentication endpoints. The backend is expected to expose:
 *   POST /auth/register -> { data: { accessToken, refreshToken, user } }
 *   POST /auth/login    -> { data: { accessToken, refreshToken, user } }
 *   POST /auth/refresh  -> { data: { accessToken, refreshToken } }   (used by baseQuery)
 *   POST /auth/logout   -> { data: null }                            (revokes refresh token)
 *
 * Access tokens are short-lived and sent as `Authorization: Bearer <token>`;
 * the long-lived refresh token is rotated on every refresh.
 */
async function onAuthSuccess(
  queryFulfilled: Promise<{data: AuthResponse}>,
  dispatch: (action: unknown) => void,
): Promise<void> {
  const {data} = await queryFulfilled;
  dispatch(setCredentials(data));
  dispatch(setUserId(data.user.id));
  await tokenStorage.save({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
}

export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<AuthResponse, LoginPayload>({
      query: body => ({url: 'auth/login', method: 'POST', body}),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        await onAuthSuccess(queryFulfilled, dispatch);
      },
      invalidatesTags: [USER_TAGS.USERS],
    }),
    register: build.mutation<AuthResponse, RegisterPayload>({
      query: body => ({url: 'auth/register', method: 'POST', body}),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        await onAuthSuccess(queryFulfilled, dispatch);
      },
      invalidatesTags: [USER_TAGS.USERS],
    }),
    logout: build.mutation<void, void>({
      query: () => ({url: 'auth/logout', method: 'POST'}),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        // Clear local session regardless of whether the server call succeeds —
        // the user intent is to sign out either way.
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearCredentials());
          dispatch(clearUser());
          await tokenStorage.clear();
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),
  }),
});

export const {useLoginMutation, useRegisterMutation, useLogoutMutation} =
  authApi;
