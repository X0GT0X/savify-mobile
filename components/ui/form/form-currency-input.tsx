import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FormActionInput } from '@/components/ui/form/form-action-input';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatCurrencyInput } from '@/tools/input-formatters';
import { SymbolView } from 'expo-symbols';
import { ErrorMessage } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

export type FormCurrencyInputProps = {
  label: string;
  amountValue: string;
  currencyValue: string;
  onAmountChange: (value: string) => void;
  onAmountBlur?: () => void;
  onCurrencyPress: () => void;
  hasError?: boolean;
  allowNegative?: boolean;
  name?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
};

export const FormCurrencyInput = ({
  label,
  amountValue,
  currencyValue,
  onAmountChange,
  onAmountBlur,
  onCurrencyPress,
  hasError = false,
  allowNegative = false,
  name = 'amount',
  containerStyle,
  labelStyle,
  errorStyle,
}: FormCurrencyInputProps) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Track whether the current value is negative
  const [isNegative, setIsNegative] = useState(false);

  const handleAmountChange = (value: string) => {
    // Format input based on currency's decimal places and negative value setting
    const formattedValue = formatCurrencyInput(value, currencyValue, allowNegative);
    onAmountChange(formattedValue);

    // Update negative state based on the formatted value
    setIsNegative(formattedValue.startsWith('-'));
  };

  const handleToggleSign = () => {
    if (!allowNegative) return;

    const currentValue = amountValue || '0';
    let newValue: string;

    if (currentValue.startsWith('-')) {
      // Remove negative sign
      newValue = currentValue.substring(1);
    } else if (currentValue === '' || currentValue === '0') {
      // Don't add negative to empty or zero value
      return;
    } else {
      // Add negative sign
      newValue = '-' + currentValue;
    }

    onAmountChange(newValue);
    setIsNegative(!isNegative);
  };

  return (
    <ThemedView style={[styles.container, containerStyle]}>
      <ThemedView style={styles.inputRow}>
        <ThemedView
          style={[
            styles.amountInputWrapper,
            { backgroundColor: hasError ? '#fff7f7' : colors.containerBackground },
            hasError && { borderColor: colors.danger, borderWidth: 1 },
          ]}>
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.label,
              { color: colors.neutral },
              labelStyle,
              hasError && { color: colors.danger },
            ]}>
            {label}
          </ThemedText>

          <TextInput
            style={[styles.amountInput, { color: colors.text }]}
            placeholder="0.00"
            placeholderTextColor={colors.neutral}
            keyboardType={'decimal-pad'}
            value={amountValue}
            onChangeText={handleAmountChange}
            onBlur={onAmountBlur}
          />

          {allowNegative && (
            <TouchableOpacity style={[styles.signToggle]} onPress={handleToggleSign}>
              <SymbolView name="plusminus" size={20} tintColor={colors.neutral} />
            </TouchableOpacity>
          )}
        </ThemedView>

        <ThemedView style={styles.currencyInputWrapper}>
          <FormActionInput
            label={t('Currency')}
            value={currencyValue}
            onPress={onCurrencyPress}
            showChevron={true}
            containerStyle={[styles.currencyInput]}
            valueStyle={styles.currencyValue}
          />
        </ThemedView>
      </ThemedView>

      {hasError && (
        <ThemedText style={[styles.error, { color: colors.danger }, errorStyle]}>
          <ErrorMessage name={name} />
        </ThemedText>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'transparent',
  },
  amountInputWrapper: {
    flex: 1.5,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  amountInput: {
    fontSize: 16,
    flex: 1,
  },
  signToggle: {
    position: 'absolute',
    right: 16,
    bottom: 18,
  },
  currencyInputWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  currencyInput: {
    paddingVertical: 16,
    justifyContent: 'center',
  },
  currencyValue: {
    fontSize: 16,
    textAlign: 'center',
  },
  error: {
    marginTop: 6,
    marginLeft: 16,
    fontSize: 13,
  },
});
