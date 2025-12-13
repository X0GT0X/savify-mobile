import { HapticTab } from '@/components/haptic-tab';
import LoadableScreenView from '@/components/loading/loadable-screen-view';
import { FloatingDragPreview } from '@/components/overview/floating-drag-preview';
import OverviewGrid, { Budget } from '@/components/overview/overview-grid';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useDragDropContext } from '@/contexts/drag-drop-context';
import { useGetCategoriesQuery } from '@/features/finance-tracking/categories/api';
import { useGetWalletsQuery } from '@/features/finance-tracking/wallets/api';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatMoney } from '@/tools/money';
import IonIcons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ColorSchemeName, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OverviewScreen = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);
  const { isDragging } = useDragDropContext();

  const { data: categories, isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const { data: wallets, isLoading: isLoadingWallets } = useGetWalletsQuery();

  const incomeCategories = useMemo(
    () => categories?.filter((category) => category.type === 'Income') ?? [],
    [categories],
  );

  const expenseCategories = useMemo(
    () => categories?.filter((category) => category.type === 'Expense') ?? [],
    [categories],
  );

  // TODO: temporary; should be replaced with actual budgets data
  const budgets: Record<string, Budget> = {
    '5ddac834-c5bd-4e0a-be52-efaac42d39d9': {
      value: formatMoney(3500000, 'PLN'),
      percentage: 50,
      status: 'onTrack',
    },
    '981db711-9af8-4b9f-b810-607200491c90': {
      value: formatMoney(250000, 'PLN'),
      percentage: 75,
      status: 'over',
    },
    '5d264567-c577-46b1-8112-f094af541e58': {
      value: formatMoney(75000, 'PLN'),
      percentage: 50,
      status: 'onTrack',
    },
    '5e48b4ca-1e45-434a-b7dd-b14e3630e1ac': {
      value: formatMoney(10000, 'PLN'),
      percentage: 25,
      status: 'under',
    },
  };

  return (
    <LoadableScreenView isLoading={isLoadingCategories || isLoadingWallets}>
      <SafeAreaView edges={['top']} style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">{t('Overview')}</ThemedText>
          <HapticTab onPress={() => {}} style={styles.manageButton}>
            <ThemedText type="defaultSemiBold" style={styles.manageButtonLabel}>
              {t('Manage')}
            </ThemedText>
            <IonIcons name="chevron-forward" size={20} />
          </HapticTab>
        </ThemedView>
        <OverviewGrid
          items={[
            ...incomeCategories
              .filter((category) => !category.isArchived)
              .map((category) => ({
                id: category.id,
                label: category.name,
                value: '0zł', // TODO: get actual value
                icon: category.icon,
                iconColor: Colors[colorScheme ?? 'light'].info,
                fillColor: Colors[colorScheme ?? 'light'].info + '50',
                budget: budgets[category.id],
              })),
            {
              id: 'new-income',
              label: t('Income'),
              value: '',
              onPress: () =>
                router.navigate({
                  pathname: '/(app)/(tabs)/overview/add-category',
                  params: { categoryType: 'Income' },
                }),
              icon: 'add@ion',
              iconColor: Colors[colorScheme ?? 'light'].primary,
              containerStyle: {
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                borderColor: Colors[colorScheme ?? 'light'].primary,
                borderWidth: 1,
              },
            },
          ]}
          gridHorizontalCount={4}
          gridVerticalCount={1}
          enableDragDrop={true}
          gridType="Income"
        />

        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: '#dadada',
            marginTop: 16,
            marginBottom: 8,
          }}
        />

        <OverviewGrid
          items={[
            ...(wallets ?? [])
              .filter((wallet) => !wallet.isArchived)
              .map((wallet) => ({
                id: wallet.id,
                label: wallet.name,
                value: formatMoney(wallet.currentBalanceAmount, wallet.currency),
                icon: wallet.icon,
                iconColor: Colors[colorScheme ?? 'light'].white,
                containerStyle: {
                  backgroundColor: wallet.color,
                },
              })),
            {
              id: 'new-wallet',
              label: t('Wallet'),
              value: '',
              onPress: () => router.navigate('/(app)/(tabs)/overview/add-wallet'),
              icon: 'add@ion',
              iconColor: Colors[colorScheme ?? 'light'].primary,
              containerStyle: {
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                borderColor: Colors[colorScheme ?? 'light'].primary,
                borderWidth: 1,
              },
            },
          ]}
          gridHorizontalCount={4}
          gridVerticalCount={1}
          enableDragDrop={true}
          gridType="Wallet"
        />

        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: '#dadada',
            marginTop: 16,
            marginBottom: 8,
          }}
        />

        <OverviewGrid
          items={[
            ...expenseCategories
              .filter((category) => !category.isArchived)
              .map((category) => ({
                id: category.id,
                label: category.name,
                value: formatMoney(0, 'PLN'), // TODO: get actual value and currency
                icon: category.icon,
                budget: budgets[category.id],
              })),
            {
              id: 'new-expense',
              label: t('Expense'),
              value: '',
              icon: 'add@ion',
              onPress: () =>
                router.navigate({
                  pathname: '/(app)/(tabs)/overview/add-category',
                  params: { categoryType: 'Expense' },
                }),
              iconColor: Colors[colorScheme ?? 'light'].primary,
              containerStyle: {
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                borderColor: Colors[colorScheme ?? 'light'].primary,
                borderWidth: 1,
              },
            },
          ]}
          gridHorizontalCount={4}
          gridVerticalCount={3}
          enableDragDrop={true}
          gridType="Expense"
        />

        {isDragging && <FloatingDragPreview />}
      </SafeAreaView>
    </LoadableScreenView>
  );
};

const createStyles = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorScheme ?? 'light'].background,
    },
    header: {
      paddingHorizontal: 24,
      paddingBottom: 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    manageButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    manageButtonLabel: {
      fontSize: 14,
      lineHeight: 20,
    },
  });

export default OverviewScreen;
