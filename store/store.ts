import { ErrorHandlingMiddleware } from '@/api/error-handling-middleware';
import notificationsReducer from '@/features/notifications/state';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(ErrorHandlingMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
