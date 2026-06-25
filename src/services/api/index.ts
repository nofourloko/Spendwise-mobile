import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import {API_TAG_TYPES} from './_tags';
import {tokenStorage} from '../auth/tokenStorage';
import {clearCredentials, setTokens} from '../slices/authSlice';
import type {AuthTokens} from '../../types/auth';
import type {RootState} from '../store';

export const BASE_URL = 'http://10.0.2.2:3000/api';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  // Attach the JWT access token to every request when present.
  prepareHeaders: (headers, {getState}) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Shared in-flight refresh. If several requests fail with 401 at the same time
 * they all await the same refresh call instead of each firing their own, which
 * avoids rotating the refresh token multiple times in parallel.
 */
let refreshPromise: ReturnType<typeof rawBaseQuery> | null = null;

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // Access token likely expired — try a single silent refresh, then retry.
  if (result.error?.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (refreshToken) {
      if (!refreshPromise) {
        refreshPromise = rawBaseQuery(
          {url: 'auth/refresh', method: 'POST', body: {refreshToken}},
          api,
          extraOptions,
        );
      }

      const refreshResult = await refreshPromise;
      refreshPromise = null;

      const newTokens = (refreshResult.data as {data?: AuthTokens} | undefined)
        ?.data;

      if (newTokens?.accessToken) {
        api.dispatch(setTokens(newTokens));
        await tokenStorage.save(newTokens);
        // Retry the original request with the rotated access token.
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        // Refresh failed: force a clean sign-out.
        api.dispatch(clearCredentials());
        await tokenStorage.clear();
      }
    } else {
      api.dispatch(clearCredentials());
    }
  }

  if (result.error) {
    return result;
  }

  // Successful responses are normally wrapped in a `{ data: <payload> }`
  // envelope, which we unwrap here. Some endpoints (e.g. OCR) may reply without
  // the envelope or with an empty body — tolerate both, otherwise we would hand
  // RTK Query `{ data: undefined }`, which it rejects with "baseQuery returned
  // an object containing neither a valid error and result".
  const body = result.data as {data?: unknown} | null | undefined;
  const payload =
    body && typeof body === 'object' && 'data' in body ? body.data : body;

  return {
    ...result,
    data: payload ?? null,
  };
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: API_TAG_TYPES,
  endpoints: () => ({}),
});
