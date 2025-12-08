import { baseQueryWithReauth } from '@/api/savify-api';
import { Wallet } from '@/features/finance-tracking/wallets/wallet';
import { createApi } from '@reduxjs/toolkit/query/react';

const walletsApi = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: 'walletsApi',
  endpoints: (builder) => ({
    getWallets: builder.query<Wallet[], void>({
      query: () => ({
        url: '/finance-tracking/wallets',
      }),
    }),
  }),
});

export default walletsApi;

export const { useGetWalletsQuery } = walletsApi;
