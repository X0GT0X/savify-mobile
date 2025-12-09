import { ErrorHandlingMiddleware } from '@/api/error-handling-middleware';
import authenticationApi from '@/features/auth/api';
import authenticationReducer from '@/features/auth/state';
import categoriesApi from '@/features/finance-tracking/categories/api';
import userSettingsApi from '@/features/finance-tracking/settings/api';
import walletsApi from '@/features/finance-tracking/wallets/api';
import notificationsReducer from '@/features/notifications/state';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    [authenticationApi.reducerPath]: authenticationApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [walletsApi.reducerPath]: walletsApi.reducer,
    [userSettingsApi.reducerPath]: userSettingsApi.reducer,
    authentication: authenticationReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authenticationApi.middleware,
      categoriesApi.middleware,
      walletsApi.middleware,
      userSettingsApi.middleware,
      ErrorHandlingMiddleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
