import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack } from 'expo-router';

const SettingsLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />

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
        name="main-currency-picker"
        options={{
          headerShown: false,
          presentation: 'formSheet',
          contentStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
          sheetGrabberVisible: true,
        }}
      />
    </Stack>
  );
};

export default SettingsLayout;
