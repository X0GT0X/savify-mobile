import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ErrorMessage } from 'formik';
import { StyleSheet, Switch, ViewStyle } from 'react-native';
import { StyleProp, TextStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

export type FormSwitchInputProps = {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  hasError?: boolean;
  name: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
};

export const FormSwitchInput = ({
  label,
  description,
  value,
  onValueChange,
  hasError = false,
  name,
  containerStyle,
  labelStyle,
  errorStyle,
}: FormSwitchInputProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={[styles.container, containerStyle]}>
      <ThemedView
        style={[
          styles.switchContainer,
          { backgroundColor: colors.containerBackground },
          hasError && { borderColor: colors.danger, borderWidth: 1 },
        ]}>
        <ThemedView style={styles.labelContainer}>
          <ThemedText type="defaultSemiBold" style={[styles.label, labelStyle]}>
            {label}
          </ThemedText>
          {description && (
            <ThemedText style={[styles.description, { color: colors.neutral }]}>
              {description}
            </ThemedText>
          )}
        </ThemedView>

        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{
            false: colors.neutral + '40',
            true: colors.primary + '80',
          }}
          thumbColor={value ? colors.primary : colors.neutral}
          ios_backgroundColor={colors.neutral + '40'}
        />
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  labelContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    marginRight: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  error: {
    marginTop: 6,
    marginLeft: 16,
    fontSize: 13,
  },
});
