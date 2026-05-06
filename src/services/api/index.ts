import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import {API_TAG_TYPES} from './_tags';

const BASE_URL = 'http://localhost:3000/api';

const rawBaseQuery = fetchBaseQuery({baseUrl: BASE_URL});

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error) {
    return result;
  }
  return {
    ...result,
    data: (result.data as {data: unknown}).data,
  };
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: API_TAG_TYPES,
  endpoints: () => ({}),
});
