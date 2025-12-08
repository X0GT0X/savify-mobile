import { showNotification } from '@/features/notifications/state';
import { store } from '@/store/store';
import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { t } from 'i18next';

// TODO debug this code
export const ErrorHandlingMiddleware: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload as {
      status: number | string;
      data: { detail: string };
    };
    const statusCode = payload.status;
    const ignoredStatusCodes: (string | number)[] = [400, 401, 403];

    if (statusCode === 404) {
      store.dispatch(
        showNotification({
          type: 'danger',
          message: t('Nothing was found for your request'),
        }),
      );
    } else if (statusCode === 409) {
      store.dispatch(
        showNotification({
          type: 'danger',
          message: payload.data.detail,
        }),
      );
    } else if (!ignoredStatusCodes.includes(statusCode)) {
      store.dispatch(
        showNotification({
          type: 'danger',
          message: t('Something went wrong. Please try again later'),
        }),
      );
    }
  }

  return next(action);
};
