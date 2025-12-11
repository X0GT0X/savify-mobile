import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';

const OverviewLayout = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />

      <Stack.Screen
        name="add-category"
        options={{
          title: t('Add category'),
          headerTitleStyle: { color: Colors[colorScheme ?? 'light'].text },
          headerShown: true,
          headerBackground: () => <ThemedView collapsable={false} />,
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: 'fitToContents',
          sheetInitialDetentIndex: 0,
          contentStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
        }}
      />

      <Stack.Screen
        name="icon-picker"
        options={{
          title: t('Choose icon'),
          headerTitleStyle: { color: Colors[colorScheme ?? 'light'].text },
          headerShown: false,
          headerBackground: () => (
            <ThemedView
              style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}
              collapsable={false}
            />
          ),
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [1],
          contentStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
        }}
      />
    </Stack>
  );
};

export default OverviewLayout;
