import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, Switch, TextStyle, ViewStyle } from 'react-native';

export type FormSwitchInputProps = {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  name: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

export const FormSwitchInput = ({
  label,
  description,
  value,
  onValueChange,
  containerStyle,
  labelStyle,
}: FormSwitchInputProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const useDelay = (ms: number) => {
    const [gate, setGate] = useState(false);
    useEffect(() => {
      setTimeout(() => {
        setGate(true);
      }, ms);
    });
    return gate;
  };

  const delayRender = useDelay(10);

  return (
    <ThemedView style={[styles.container, containerStyle]}>
      <ThemedView style={[styles.switchContainer, { backgroundColor: colors.containerBackground }]}>
        <ThemedView style={styles.row}>
          <ThemedText type="defaultSemiBold" style={[styles.label, labelStyle]}>
            {label}
          </ThemedText>

          {delayRender && (
            <Switch
              value={value}
              onValueChange={onValueChange}
              trackColor={{
                false: colors.background,
                true: colors.primary,
              }}
            />
          )}
        </ThemedView>

        {description && (
          <ThemedText style={[styles.description, { color: colors.neutral }]}>
            {description}
          </ThemedText>
        )}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  switchContainer: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    marginBottom: 8,
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
