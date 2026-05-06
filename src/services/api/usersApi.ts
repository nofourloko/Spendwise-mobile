import {baseApi} from '.';
import {USER_TAGS} from './_tags';
import {User, CreateUserPayload, UpdateUserPayload} from '../../types/user';

export const usersApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getUsers: build.query<User[], void>({
      query: () => 'users',
      providesTags: [USER_TAGS.USERS],
    }),
    getUserById: build.query<User, string>({
      query: id => `users/${id}`,
      providesTags: (_, __, id) => [{type: USER_TAGS.USERS, id}],
    }),
    createUser: build.mutation<User, CreateUserPayload>({
      query: body => ({url: 'users', method: 'POST', body}),
      invalidatesTags: [USER_TAGS.USERS],
    }),
    updateUser: build.mutation<User, {id: string; body: UpdateUserPayload}>({
      query: ({id, body}) => ({url: `users/${id}`, method: 'PATCH', body}),
      invalidatesTags: (_, __, {id}) => [USER_TAGS.USERS, {type: USER_TAGS.USERS, id}],
    }),
    deleteUser: build.mutation<void, string>({
      query: id => ({url: `users/${id}`, method: 'DELETE'}),
      invalidatesTags: [USER_TAGS.USERS],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
