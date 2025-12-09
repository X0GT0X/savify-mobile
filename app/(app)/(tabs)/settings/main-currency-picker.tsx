import { HapticTab } from '@/components/haptic-tab';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import {
  useGetSupportedCurrenciesQuery,
  useGetUserSettingsQuery,
} from '@/features/finance-tracking/settings/api';
import { useColorScheme } from '@/hooks/use-color-scheme';
import IonIcons from '@expo/vector-icons/Ionicons';
import { code as getCurrencyByCode } from 'currency-codes';
import getSymbolFromCurrency from 'currency-symbol-map';
import { useTranslation } from 'react-i18next';
import { ColorSchemeName, ScrollView, StyleSheet } from 'react-native';

const MainCurrencyPickerScreen = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const { data: userSettings } = useGetUserSettingsQuery();
  const { data: supportedCurrencies } = useGetSupportedCurrenciesQuery();

  const handleChooseCurrency = (currencyCode: string) => {
    // TODO: Implement currency selection
  };

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
      stickyHeaderIndices={[0]}>
      <ThemedView>
        <ThemedText type="title" style={styles.header}>
          {t('Main currency')}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.currencyList}>
        {supportedCurrencies?.map((currencyCode, index) => {
          const isSelected = userSettings?.defaultCurrency === currencyCode;
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
    </ScrollView>
  );
};

const createStyles = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
      paddingHorizontal: 24,
    },

    header: {
      paddingTop: 40,
      paddingBottom: 24,
    },

    currencyList: {
      backgroundColor: Colors[colorScheme ?? 'light'].containerBackground,
      borderRadius: 32,
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

export default MainCurrencyPickerScreen;
