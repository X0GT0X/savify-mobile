import { ErrorHandlingMiddleware } from '@/api/error-handling-middleware';
import authenticationApi from '@/features/auth/api';
import authenticationReducer from '@/features/auth/state';
import notificationsReducer from '@/features/notifications/state';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    [authenticationApi.reducerPath]: authenticationApi.reducer,
    authentication: authenticationReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authenticationApi.middleware, ErrorHandlingMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
