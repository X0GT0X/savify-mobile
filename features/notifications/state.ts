import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type NotificationType = 'success' | 'danger' | 'warning' | 'info';

export interface Notification {
  type: NotificationType;
  message: string;
}

export interface NotificationState {
  isVisible: boolean;
  type?: NotificationType;
  message?: string;
}

const initialState: NotificationState = {
  isVisible: false,
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (state, action: PayloadAction<Notification>) => {
      state.isVisible = true;
      state.type = action.payload.type;
      state.message = action.payload.message;
    },
    closeNotification: (state) => {
      state.isVisible = false;
    },
  },
});

export const { showNotification, closeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
