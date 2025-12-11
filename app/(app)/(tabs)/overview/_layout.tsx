import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { DragDropProvider } from '@/contexts/drag-drop-context';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';

const OverviewLayout = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  return (
    <DragDropProvider>
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

        <Stack.Screen
          name="add-wallet"
          options={{
            title: t('Add wallet'),
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
          name="currency-picker"
          options={{
            title: t('Choose currency'),
            headerTitleStyle: { color: Colors[colorScheme ?? 'light'].text },
            headerShown: true,
            headerBackground: () => (
              <ThemedView
                collapsable={false}
                style={{ backgroundColor: Colors[colorScheme ?? 'light'].containerBackground }}
              />
            ),
            presentation: 'formSheet',
            sheetGrabberVisible: true,
            sheetAllowedDetents: [1],
            contentStyle: {
              backgroundColor: Colors[colorScheme ?? 'light'].containerBackground,
            },
          }}
        />

        <Stack.Screen
          name="add-transaction"
          options={{
            title: t('Add transaction'),
            headerTitleStyle: { color: Colors[colorScheme ?? 'light'].text },
            headerShown: true,
            headerBackground: () => <ThemedView collapsable={false} />,
            presentation: 'formSheet',
            sheetGrabberVisible: true,
            sheetAllowedDetents: 'fitToContents',
            contentStyle: {
              backgroundColor: Colors[colorScheme ?? 'light'].background,
            },
          }}
        />
      </Stack>
    </DragDropProvider>
  );
};

export default OverviewLayout;
