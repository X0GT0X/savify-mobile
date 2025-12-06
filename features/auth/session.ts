import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'session';

export type Session = {
  accessToken: string | null;
  refreshToken: string | null;
  userId?: string | null;
};

export const getSession = (): Session | null => {
  const serializedSession = SecureStore.getItem(SESSION_KEY);

  return serializedSession ? JSON.parse(serializedSession) : null;
};

export const setSession = (session: Session | null) => {
  SecureStore.setItem(SESSION_KEY, JSON.stringify(session));
};
