import HttpMethod from '@/api/http-method';
import { baseQueryWithReauth } from '@/api/savify-api';
import { UserFinanceTrackingSettings } from '@/features/finance-tracking/settings/settings';
import { UpdateUserFinanceTrackingSettingsRequest } from '@/features/finance-tracking/settings/update-settings';
import { createApi } from '@reduxjs/toolkit/query/react';

const userSettingsApi = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: 'userSettingsApi',
  tagTypes: ['UserSettings'],
  endpoints: (builder) => ({
    getUserSettings: builder.query<UserFinanceTrackingSettings, void>({
      query: () => ({
        url: '/finance-tracking/settings',
      }),
      providesTags: ['UserSettings'],
    }),

    getSupportedCurrencies: builder.query<string[], void>({
      query: () => ({
        url: '/finance-tracking/settings/currencies',
      }),
    }),

    updateUserSettings: builder.mutation<void, UpdateUserFinanceTrackingSettingsRequest>({
      query: (settings) => ({
        url: '/finance-tracking/settings',
        method: HttpMethod.PATCH,
        body: settings,
      }),
      invalidatesTags: ['UserSettings'],
    }),
  }),
});

export default userSettingsApi;

export const {
  useGetUserSettingsQuery,
  useGetSupportedCurrenciesQuery,
  useUpdateUserSettingsMutation,
} = userSettingsApi;
