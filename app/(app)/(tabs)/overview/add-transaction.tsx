import { HapticTab } from '@/components/haptic-tab';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { getIconName } from '@/constants/icons';
import { Colors } from '@/constants/theme';
import { useGetCategoriesQuery } from '@/features/finance-tracking/categories/api';
import {
  ItemType,
  resolveTransactionType,
} from '@/features/finance-tracking/transactions/transaction';
import { useGetWalletsQuery } from '@/features/finance-tracking/wallets/api';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatMoney } from '@/tools/money';
import IonIcons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ColorSchemeName, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AddTransactionParams {
  [key: string]: string;
  sourceId: string;
  targetId: string;
}

interface TransactionItemProps {
  item: {
    name: string;
    icon: string;
    color?: string;
    currentBalanceAmount?: number;
    currency?: string;
  };
  onPress: () => void;
  colors: {
    containerBackground: string;
    white: string;
    text: string;
  };
  styles: {
    itemContainer: any;
    iconContainer: any;
    itemTextContainer: any;
    itemName: any;
    itemBalance: any;
  };
}

const TransactionItem = ({ item, onPress, colors, styles }: TransactionItemProps) => {
  const backgroundColor = item.color || colors.containerBackground;
  const iconColor = item.color ? colors.white : '#AAAAAA';

  return (
    <HapticTab style={styles.itemContainer} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <IonIcons
          name={getIconName(item.icon || 'help-circle') as keyof typeof IonIcons.glyphMap}
          size={24}
          color={iconColor}
        />
      </View>
      <View style={styles.itemTextContainer}>
        <ThemedText style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </ThemedText>
        <ThemedText style={styles.itemBalance} numberOfLines={1} ellipsizeMode="tail">
          {item.currentBalanceAmount !== undefined &&
            item.currency &&
            formatMoney(item.currentBalanceAmount, item.currency)}
        </ThemedText>
      </View>
    </HapticTab>
  );
};

const AddTransactionScreen = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = createStyles(colorScheme);

  const { sourceId, targetId } = useLocalSearchParams<AddTransactionParams>();

  const { data: categories } = useGetCategoriesQuery();
  const { data: wallets } = useGetWalletsQuery();

  const source = useMemo(() => {
    const sourceCategory = categories?.find((category) => category.id === sourceId);
    const sourceWallet = wallets?.find((wallet) => wallet.id === sourceId);

    return sourceCategory || sourceWallet;
  }, [sourceId, categories, wallets]);

  const target = useMemo(() => {
    const targetCategory = categories?.find((category) => category.id === targetId);
    const targetWallet = wallets?.find((wallet) => wallet.id === targetId);

    return targetCategory || targetWallet;
  }, [targetId, categories, wallets]);

  const transactionType = useMemo(() => {
    if (!source || !target) return null;

    const getItemType = (item: typeof source | typeof target): ItemType => {
      if ('currentBalanceAmount' in item) {
        return 'wallet';
      }

      return item.type === 'Income' ? 'income' : 'expense';
    };

    const sourceType = getItemType(source);
    const targetType = getItemType(target);

    return resolveTransactionType(sourceType, targetType);
  }, [source, target]);

  if (!source || !target) {
    return null; // TODO: to change with loader
  }

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
    <SafeAreaView style={[styles.container]}>
      <ThemedView
        style={[
          styles.sourceAndTarget,
          {
            backgroundColor:
              transactionType === 'income'
                ? colors.success + '10'
                : transactionType === 'expense'
                  ? colors.danger + '10'
                  : colors.info + '10',
          },
        ]}>
        <TransactionItem
          item={{
            name: source.name,
            icon: source.icon,
            color: 'color' in source ? source.color : undefined,
            currentBalanceAmount:
              'currentBalanceAmount' in source ? source.currentBalanceAmount : undefined,
            currency: 'currency' in source ? source.currency : undefined,
          }}
          onPress={() => {}}
          colors={colors}
          styles={styles}
        />

        <View style={styles.arrowContainer}>
          <IonIcons
            name="arrow-forward"
            size={24}
            color={
              transactionType === 'transfer'
                ? colors.info
                : transactionType === 'expense'
                  ? colors.danger
                  : colors.success
            }
          />
        </View>

        <TransactionItem
          item={{
            name: target.name,
            icon: target.icon,
            color: 'color' in target ? target.color : undefined,
            currentBalanceAmount:
              'currentBalanceAmount' in target ? target.currentBalanceAmount : undefined,
            currency: 'currency' in target ? target.currency : undefined,
          }}
          onPress={() => {}}
          colors={colors}
          styles={styles}
        />
      </ThemedView>

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

      <Button label={t('Add transaction')} onPress={() => router.dismiss()} />
    </SafeAreaView>
  );
};

const createStyles = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 32,
      backgroundColor: 'transparent',
    },
    sourceAndTarget: {
      backgroundColor: Colors[colorScheme ?? 'light'].containerBackground,
      borderRadius: 24,
      padding: 16,
      marginBottom: 24,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    itemContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      minWidth: 0,
    },
    itemTextContainer: {
      flex: 1,
      minWidth: 0,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
    },
    arrowContainer: {
      paddingHorizontal: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemName: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600',
    },
    itemBalance: {
      fontSize: 13,
      lineHeight: 18,
      color: Colors[colorScheme ?? 'light'].neutral,
    },
    typeBadge: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    typeText: {
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default AddTransactionScreen;
