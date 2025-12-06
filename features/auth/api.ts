import HttpMethod from '@/api/http-method';
import { baseQueryWithReauth } from '@/api/savify-api';
import { SignInWithAppleRequest } from '@/features/auth/Tokens/sign-in';
import { createApi } from '@reduxjs/toolkit/query/react';
import RefreshToken from './Tokens/refresh-token';
import Tokens from './Tokens/tokens';
import User from './user';

const authenticationApi = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: 'authenticationApi',
  endpoints: (builder) => ({
    signInWithApple: builder.mutation<Tokens, SignInWithAppleRequest>({
      query: ({ identityToken, email, name }) => ({
        url: '/user-access/authentication/sign-in/apple',
        method: HttpMethod.POST,
        body: {
          identityToken,
          email,
          name,
        },
      }),
    }),

    refresh: builder.mutation<Tokens, RefreshToken>({
      query: ({ userId, refreshToken }) => ({
        url: '/user-access/authentication/token/refreshing',
        method: HttpMethod.POST,
        body: {
          userId,
          refreshToken,
        },
      }),
    }),

    getAuthenticatedUser: builder.query<User, void>({
      query: () => ({
        url: '/user-access/users/me',
      }),
    }),

    signOut: builder.mutation<void, void>({
      query: () => ({
        url: '/user-access/authentication/sign-out',
        method: HttpMethod.POST,
      }),
    }),
  }),
});

export default authenticationApi;

export const {
  useSignInWithAppleMutation,
  useGetAuthenticatedUserQuery,
  useLazyGetAuthenticatedUserQuery,
  useSignOutMutation,
} = authenticationApi;
