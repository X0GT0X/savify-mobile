import LoadableScreenView from '@/components/loading/loadable-screen-view';
import { getSession } from '@/features/auth/session';
import { authenticate } from '@/features/auth/state';
import { RootState } from '@/store/store';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const AppContent = () => {
  const colorScheme = useColorScheme();

  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.authentication.isAuthenticated);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();

    if (session && session.userId) {
      dispatch(authenticate(session.userId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <LoadableScreenView isLoading={loading}>
        <></>
      </LoadableScreenView>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
};

export default AppContent;
