import { HapticTab } from '@/components/haptic-tab';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import IonIcons from '@expo/vector-icons/Ionicons';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ColorSchemeName, ScrollView, StyleSheet, useColorScheme } from 'react-native';

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  colors: string[];
}

const ColorPicker = ({ selectedColor, onSelectColor, colors }: ColorPickerProps) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const styles = createStyles(colorScheme);

  const handleColorSelect = useCallback(
    (color: string) => {
      onSelectColor(color);
    },
    [onSelectColor],
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="defaultSemiBold" style={styles.label}>
        {t('Color')}
      </ThemedText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate="fast"
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {colors.map((color) => {
          const isSelected = selectedColor === color;
          return (
            <HapticTab
              key={color}
              onPress={() => handleColorSelect(color)}
              style={[styles.colorSwatch, { backgroundColor: color }]}>
              {isSelected && <IonIcons name="checkmark" size={24} color={themeColors.white} />}
            </HapticTab>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
};

const createStyles = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors[colorScheme ?? 'light'].containerBackground,
      borderRadius: 24,
      paddingVertical: 16,
      overflow: 'hidden',
    },
    label: {
      paddingHorizontal: 16,
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: Colors[colorScheme ?? 'light'].neutral,
      marginBottom: 4,
    },
    scrollView: {},
    scrollContent: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      gap: 8,
    },
    colorSwatch: {
      width: 48,
      height: 48,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptySlot: {
      backgroundColor: 'transparent',
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      marginTop: 16,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
  });

export default ColorPicker;
