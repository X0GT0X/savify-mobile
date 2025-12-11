import { HapticTab } from '@/components/haptic-tab';
import { DetachedLoader } from '@/components/loading/loadable-screen-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import BottomSafeInset from '@/components/ui/bottom-safe-inset';
import { Colors } from '@/constants/theme';
import { useGetSupportedCurrenciesQuery } from '@/features/finance-tracking/settings/api';
import { useColorScheme } from '@/hooks/use-color-scheme';
import IonIcons from '@expo/vector-icons/Ionicons';
import { useHeaderHeight } from '@react-navigation/elements';
import { code as getCurrencyByCode } from 'currency-codes';
import getSymbolFromCurrency from 'currency-symbol-map';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ColorSchemeName, Dimensions, ScrollView, StyleSheet } from 'react-native';

const CurrencyPickerScreen = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);
  const headerHeight = useHeaderHeight();

  const { selectedCurrency } = useLocalSearchParams<{ selectedCurrency: string }>();
  const { data: supportedCurrencies, isLoading: isLoadingSupportedCurrencies } =
    useGetSupportedCurrenciesQuery();

  const handleChooseCurrency = useCallback((currencyCode: string) => {
    router.dismiss();
    requestAnimationFrame(() => {
      router.setParams({ selectedCurrency: currencyCode });
    });
  }, []);

  const getCurrencyName = (currencyCode: string): string => {
    const currencyInfo = getCurrencyByCode(currencyCode);
    return currencyInfo?.currency ?? currencyCode;
  };

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
      scrollEnabled={!isLoadingSupportedCurrencies}
      bounces={false}>
      <DetachedLoader
        isLoading={isLoadingSupportedCurrencies}
        backgroundOpacity={0.5}
        style={{
          height: Dimensions.get('window').height,
          top: -headerHeight,
        }}
      />

      <ThemedView style={styles.currencyList}>
        {supportedCurrencies?.map((currencyCode, index) => {
          const isSelected = selectedCurrency === currencyCode;
          const isLastItem = index === supportedCurrencies.length - 1;
          const currencySymbol = getSymbolFromCurrency(currencyCode) ?? '';
          const currencyName = getCurrencyName(currencyCode);

          return (
            <HapticTab
              key={currencyCode}
              style={[styles.currencyItem, isLastItem && styles.currencyItemLast]}
              onPress={() => handleChooseCurrency(currencyCode)}>
              <ThemedView style={styles.currencySymbolContainer}>
                <ThemedText style={styles.currencySymbol}>{currencySymbol}</ThemedText>
              </ThemedView>

              <ThemedView style={styles.currencyInfo}>
                <ThemedText type="defaultSemiBold" style={styles.currencyCode}>
                  {currencyCode}
                </ThemedText>
                <ThemedText style={styles.currencyName} numberOfLines={1}>
                  {t(currencyName)}
                </ThemedText>
              </ThemedView>

              {isSelected && (
                <IonIcons
                  name="checkmark-circle"
                  size={24}
                  color={Colors[colorScheme ?? 'light'].primary}
                />
              )}
            </HapticTab>
          );
        })}
      </ThemedView>

      <BottomSafeInset inset={8} />
    </ScrollView>
  );
};

const createStyles = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
      position: 'relative',
    },

    currencyList: {
      backgroundColor: Colors[colorScheme ?? 'light'].containerBackground,
      overflow: 'hidden',
    },

    currencyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      paddingHorizontal: 20,
      gap: 16,
      borderBottomWidth: 1,
      borderBottomColor: Colors[colorScheme ?? 'light'].background,
    },

    currencyItemLast: {
      borderBottomWidth: 0,
    },

    currencySymbolContainer: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: Colors[colorScheme ?? 'light'].background,
      alignItems: 'center',
      justifyContent: 'center',
    },

    currencySymbol: {
      fontSize: 20,
      fontWeight: '500',
    },

    currencyInfo: {
      flex: 1,
      backgroundColor: 'transparent',
    },

    currencyCode: {
      fontSize: 16,
      marginBottom: 2,
    },

    currencyName: {
      fontSize: 14,
      color: Colors[colorScheme ?? 'light'].neutral,
    },
  });

export default CurrencyPickerScreen;
