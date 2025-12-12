import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { getIconName } from '@/constants/icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TransactionType } from '@/types/drag-drop';
import IonIcons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ColorSchemeName, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AddTransactionParams {
  sourceId: string;
  sourceName: string;
  sourceType: string;
  sourceIcon?: string;
  sourceColor?: string;
  targetId: string;
  targetName: string;
  targetType: string;
  targetIcon?: string;
  targetColor?: string;
  transactionType: TransactionType;
}

const AddTransactionScreen = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = createStyles(colorScheme);

  const params = useLocalSearchParams<AddTransactionParams>();

  const {
    sourceName,
    sourceIcon,
    sourceColor,
    targetName,
    targetIcon,
    targetColor,
    transactionType,
  } = params;

  const getTransactionTitle = () => {
    switch (transactionType) {
      case 'income':
        return t('Add Income');
      case 'transfer':
        return t('Transfer');
      case 'expense':
        return t('Add Expense');
      default:
        return t('Add transaction');
    }
  };

  const getTransactionTypeLabel = () => {
    switch (transactionType) {
      case 'income':
        return t('Income');
      case 'transfer':
        return t('Transfer');
      case 'expense':
        return t('Expense');
      default:
        return transactionType;
    }
  };

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          {getTransactionTitle()}
        </ThemedText>

        {/* Source */}
        <ThemedView style={styles.itemRow}>
          <ThemedText type="subtitle" style={styles.rowLabel}>
            {t('From')}:
          </ThemedText>
          <View style={styles.itemInfo}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: sourceColor || colors.containerBackground },
              ]}>
              <IonIcons
                name={getIconName(sourceIcon || 'help-circle') as keyof typeof IonIcons.glyphMap}
                size={24}
                color={sourceColor ? colors.white : colors.text}
              />
            </View>
            <ThemedText style={styles.itemName}>{sourceName}</ThemedText>
          </View>
        </ThemedView>

        {/* Arrow */}
        <View style={styles.arrowContainer}>
          <IonIcons name="arrow-down" size={32} color={colors.neutral} />
        </View>

        {/* Target */}
        <ThemedView style={styles.itemRow}>
          <ThemedText type="subtitle" style={styles.rowLabel}>
            {t('To')}:
          </ThemedText>
          <View style={styles.itemInfo}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: targetColor || colors.containerBackground },
              ]}>
              <IonIcons
                name={getIconName(targetIcon || 'help-circle') as keyof typeof IonIcons.glyphMap}
                size={24}
                color={targetColor ? colors.white : colors.text}
              />
            </View>
            <ThemedText style={styles.itemName}>{targetName}</ThemedText>
          </View>
        </ThemedView>

        {/* Transaction Type */}
        <ThemedView style={styles.typeRow}>
          <ThemedText type="subtitle" style={styles.rowLabel}>
            {t('Type')}:
          </ThemedText>
          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor:
                  transactionType === 'income'
                    ? colors.success + '20'
                    : transactionType === 'expense'
                      ? colors.danger + '20'
                      : colors.info + '20',
              },
            ]}>
            <ThemedText
              style={[
                styles.typeText,
                {
                  color:
                    transactionType === 'income'
                      ? colors.success
                      : transactionType === 'expense'
                        ? colors.danger
                        : colors.info,
                },
              ]}>
              {getTransactionTypeLabel()}
            </ThemedText>
          </View>
        </ThemedView>

        {/* Placeholder message */}
        <ThemedView style={styles.placeholderContainer}>
          <ThemedText style={[styles.placeholderText, { color: colors.neutral }]}>
            {t('Full transaction form will be implemented here')}
          </ThemedText>
        </ThemedView>

        <Button label={t('Close')} onPress={() => router.dismiss()} />
      </ThemedView>
    </SafeAreaView>
  );
};

const createStyles = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 32,
      backgroundColor: 'transparent',
    },
    title: {
      marginBottom: 32,
      textAlign: 'center',
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
      backgroundColor: 'transparent',
    },
    rowLabel: {
      width: 80,
      fontSize: 16,
    },
    itemInfo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemName: {
      fontSize: 18,
      fontWeight: '600',
    },
    arrowContainer: {
      alignItems: 'center',
      marginVertical: 16,
    },
    typeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 32,
      backgroundColor: 'transparent',
    },
    typeBadge: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
    },
    typeText: {
      fontSize: 16,
      fontWeight: '600',
    },
    placeholderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      marginBottom: 24,
    },
    placeholderText: {
      fontSize: 14,
      textAlign: 'center',
      fontStyle: 'italic',
    },
  });

export default AddTransactionScreen;
