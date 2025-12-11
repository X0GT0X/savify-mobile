import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FormActionInput } from '@/components/ui/form/form-action-input';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { StyleProp, StyleSheet, TextInput, TextStyle, ViewStyle } from 'react-native';

export type FormCurrencyInputProps = {
  label: string;
  amountValue: string;
  currencyValue: string;
  onAmountChange: (value: string) => void;
  onAmountBlur?: () => void;
  onCurrencyPress: () => void;
  hasError?: boolean;
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
  name = 'amount',
  containerStyle,
  labelStyle,
  errorStyle,
}: FormCurrencyInputProps) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

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
            keyboardType="decimal-pad"
            value={amountValue}
            onChangeText={onAmountChange}
            onBlur={onAmountBlur}
          />
        </ThemedView>

        <ThemedView style={styles.currencyInputWrapper}>
          <FormActionInput
            label={t('Currency')}
            value={currencyValue}
            onPress={onCurrencyPress}
            showChevron={true}
            containerStyle={[
              styles.currencyInput,
              hasError && { borderColor: colors.danger, borderWidth: 1 },
            ]}
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
