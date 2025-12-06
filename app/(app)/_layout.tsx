import { Colors } from '@/constants/theme';
import { RootState } from '@/store/store';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';
import { useSelector } from 'react-redux';

const RootLayout = () => {
  const colorScheme = useColorScheme();

  const isAuthenticated = useSelector((state: RootState) => state.authentication.isAuthenticated);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
          <Stack.Screen
            name="terms"
            options={{
              headerShown: false,
              presentation: 'formSheet',
              contentStyle: {
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                paddingHorizontal: 24,
                paddingTop: 40,
              },
              sheetGrabberVisible: true,
            }}
          />
          <Stack.Screen
            name="privacy-policy"
            options={{
              headerShown: false,
              presentation: 'formSheet',
              contentStyle: {
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                paddingHorizontal: 24,
                paddingTop: 40,
              },
              sheetGrabberVisible: true,
            }}
          />
        </Stack.Protected>
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
};

export default RootLayout;
