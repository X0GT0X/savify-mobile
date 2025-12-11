import { baseQueryWithReauth } from '@/api/savify-api';
import { AddWalletRequest } from '@/features/finance-tracking/wallets/add-wallet';
import { Wallet } from '@/features/finance-tracking/wallets/wallet';
import { createApi } from '@reduxjs/toolkit/query/react';

const walletsApi = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: 'walletsApi',
  tagTypes: ['Wallets'],
  endpoints: (builder) => ({
    getWallets: builder.query<Wallet[], void>({
      query: () => ({
        url: '/finance-tracking/wallets',
      }),
      providesTags: ['Wallets'],
    }),

    addWallet: builder.mutation<string, AddWalletRequest>({
      query: (body) => ({
        url: '/finance-tracking/wallets',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Wallets'],
    }),
  }),
});

export default walletsApi;

export const { useGetWalletsQuery, useAddWalletMutation } = walletsApi;
