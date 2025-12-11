import { HapticTab } from '@/components/haptic-tab';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import IonIcons from '@expo/vector-icons/Ionicons';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ColorSchemeName,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

const COLORS_PER_PAGE = 6;
const COLOR_SWATCH_SIZE = 48;
const COLOR_SWATCH_GAP = 0;
const HORIZONTAL_PADDING = 16;

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

  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const pageWidth = Dimensions.get('window').width - 24 * 2;

  const pages = useMemo(() => {
    const result: string[][] = [];
    for (let i = 0; i < colors.length; i += COLORS_PER_PAGE) {
      result.push(colors.slice(i, i + COLORS_PER_PAGE));
    }
    return result;
  }, [colors]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const page = Math.round(offsetX / pageWidth);
      setCurrentPage(page);
    },
    [pageWidth],
  );

  const handleColorSelect = useCallback(
    (color: string) => {
      onSelectColor(color);
    },
    [onSelectColor],
  );

  const renderPage = (pageColors: string[], pageIndex: number) => {
    return (
      <View key={pageIndex} style={[styles.page, { width: pageWidth }]}>
        <View style={styles.row}>
          {pageColors.map((color) => {
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
          {pageColors.length < COLORS_PER_PAGE &&
            Array(COLORS_PER_PAGE - pageColors.length)
              .fill(null)
              .map((_, i) => (
                <View key={`empty-${i}`} style={[styles.colorSwatch, styles.emptySlot]} />
              ))}
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="defaultSemiBold" style={styles.label}>
        {t('Color')}
      </ThemedText>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={pageWidth}
        snapToAlignment="start"
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {pages.map((pageColors, pageIndex) => renderPage(pageColors, pageIndex))}
      </ScrollView>

      {pages.length > 1 && (
        <View style={styles.pagination}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    currentPage === index ? themeColors.primary : themeColors.neutral,
                  opacity: currentPage === index ? 1 : 0.4,
                },
              ]}
            />
          ))}
        </View>
      )}
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
    },
    scrollView: {
      flexGrow: 0,
      overflow: 'visible',
    },
    scrollContent: {
      alignItems: 'flex-start',
    },
    page: {
      paddingHorizontal: HORIZONTAL_PADDING,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: COLOR_SWATCH_GAP,
    },
    colorSwatch: {
      width: COLOR_SWATCH_SIZE,
      height: COLOR_SWATCH_SIZE,
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
