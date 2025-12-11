import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ErrorMessage } from 'formik';
import { StyleSheet, TextInput, type TextInputProps, ViewStyle } from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { TextStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

export type FormInputProps = TextInputProps & {
  label: string;
  name: string;
  hasError?: boolean;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  errorStyle?: StyleProp<TextStyle>;
};

export const FormTextInput = ({
  label,
  name,
  hasError = false,
  style,
  labelStyle,
  containerStyle,
  errorStyle,
  ...rest
}: FormInputProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={[styles.container, containerStyle]}>
      <ThemedView style={styles.inputWrapper}>
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
          style={[
            styles.input,
            {
              backgroundColor: hasError ? '#fff7f7' : colors.containerBackground,
              color: colors.text,
            },
            hasError && { borderColor: colors.danger, borderWidth: 1 },
            rest.multiline && styles.multilineInput,
            style,
          ]}
          placeholderTextColor={colors.neutral}
          {...rest}
        />

        {rest.multiline && rest.maxLength && (
          <ThemedText style={[styles.counter, { color: colors.neutral }]}>
            {rest.value?.length ?? 0}/{rest.maxLength}
          </ThemedText>
        )}
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
  inputWrapper: {
    position: 'relative',
    backgroundColor: 'transparent',
  },
  label: {
    position: 'absolute',
    top: 12,
    left: 16,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    zIndex: 1,
  },
  input: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 36,
    paddingBottom: 16,
    fontSize: 16,
  },
  multilineInput: {
    paddingBottom: 32,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  counter: {
    position: 'absolute',
    right: 16,
    bottom: 12,
    fontSize: 12,
  },
  error: {
    marginTop: 6,
    marginLeft: 16,
    fontSize: 13,
  },
});
