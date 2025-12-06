import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface AuthenticationState {
  isAuthenticated: boolean;
  userId?: string;
}

const initialState: AuthenticationState = {
  isAuthenticated: false,
};

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    authenticate: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.userId = action.payload;
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.userId = undefined;
    },
  },
});

export const { authenticate, signOut } = authenticationSlice.actions;

export default authenticationSlice.reducer;
