import { APP_DEFAULT_LANGUAGE } from '@/constants/app';
import { HEADER_ACCEPT_LANGUAGE, HEADER_AUTHORIZATION } from '@/constants/headers';
import { getSession, Session, setSession } from '@/features/auth/session';
import { signOut } from '@/features/auth/state';
import Tokens from '@/features/auth/Tokens/tokens';
import { showNotification } from '@/features/notifications/state';
import { BaseQueryApi } from '@reduxjs/toolkit/query';
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { getLocales } from 'expo-localization';
import { t } from 'i18next';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.EXPO_PUBLIC_API_URL,
  prepareHeaders: (headers) => {
    return prepareHeaders(headers);
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const session = getSession();

        if (session && session.userId) {
          const refreshTokenResult = await fetchRefreshToken(session, api, extraOptions);

          if (refreshTokenResult.data) {
            const tokens: Tokens = refreshTokenResult.data as Tokens;
            setSession({
              ...session,
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
            });

            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch(
              showNotification({
                type: 'error',
                message: t('You have been signed out. Please sign in again'),
              }),
            );

            setSession(null);
            api.dispatch(signOut());
          }
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

const prepareHeaders = (headers: Headers): Headers => {
  const session = getSession();

  if (session) {
    headers.set(HEADER_AUTHORIZATION, `Bearer ${session.accessToken}`);
  }

  headers.set(HEADER_ACCEPT_LANGUAGE, getLocales()[0].languageCode ?? APP_DEFAULT_LANGUAGE);

  return headers;
};

const fetchRefreshToken = async (session: Session, api: BaseQueryApi, extraOptions: object) => {
  return baseQuery(
    {
      url: '/user-access/authentication/tokens/refreshing',
      method: 'POST',
      body: {
        refreshToken: session.refreshToken,
        userId: session.userId,
      },
    },
    api,
    extraOptions,
  );
};
