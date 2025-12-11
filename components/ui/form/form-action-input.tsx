// components/ui/form/form-action-input.tsx
import { HapticTab } from '@/components/haptic-tab';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import IonIcons from '@expo/vector-icons/Ionicons';
import { StyleSheet, ViewStyle } from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { TextStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

export type FormActionInputProps = {
  label: string;
  value: string;
  onPress?: () => void;
  readOnly?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
  showChevron?: boolean;
};

export const FormActionInput = ({
  label,
  value,
  onPress,
  readOnly = false,
  containerStyle,
  labelStyle,
  valueStyle,
  showChevron = true,
}: FormActionInputProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const content = (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.containerBackground }, containerStyle]}>
      <ThemedText
        type="defaultSemiBold"
        style={[styles.label, { color: colors.neutral }, labelStyle]}>
        {label}
      </ThemedText>

      <ThemedView style={styles.valueContainer}>
        <ThemedText type="default" style={[styles.value, { color: colors.text }, valueStyle]}>
          {value}
        </ThemedText>

        {showChevron && !readOnly && (
          <IonIcons name="chevron-down" size={20} color={colors.neutral} />
        )}
      </ThemedView>
    </ThemedView>
  );

  if (readOnly || !onPress) {
    return content;
  }

  return <HapticTab onPress={onPress}>{content}</HapticTab>;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 0,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  value: {
    fontSize: 16,
    flex: 1,
  },
});
