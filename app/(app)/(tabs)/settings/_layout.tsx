import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLiquidGlass } from '@/hooks/use-liquid-glass';
import { Stack } from 'expo-router';

const SettingsLayout = () => {
  const colorScheme = useColorScheme();
  const { isLiquidGlassAvailable } = useLiquidGlass();

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
          presentation: 'pageSheet',
          contentStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            flex: 1,
          },
          sheetGrabberVisible: true,
        }}
      />

      <Stack.Screen
        name="budgeting-period-picker"
        options={{
          headerShown: false,
          presentation: 'formSheet',
          contentStyle: {
            backgroundColor: isLiquidGlassAvailable
              ? 'transparent'
              : Colors[colorScheme ?? 'light'].background,
            flex: 1,
          },
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.3],
          sheetInitialDetentIndex: 0,
        }}
      />

      <Stack.Screen
        name="period-start-day-picker"
        options={{
          headerShown: false,
          presentation: 'formSheet',
          contentStyle: {
            backgroundColor: isLiquidGlassAvailable
              ? 'transparent'
              : Colors[colorScheme ?? 'light'].background,
            flex: 1,
          },
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.3],
          sheetInitialDetentIndex: 0,
        }}
      />
    </Stack>
  );
};

export default SettingsLayout;
