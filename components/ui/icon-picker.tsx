import { HapticTab } from '@/components/haptic-tab';
import { ThemedView } from '@/components/themed-view';
import { AVAILABLE_ICONS } from '@/constants/icons';
import { Colors } from '@/constants/theme';
import IonIcons from '@expo/vector-icons/Ionicons';
import { useCallback, useMemo, useRef, useState } from 'react';
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

const ICONS_PER_ROW = 5;
const ICON_BUTTON_SIZE = 56;
const ICON_BUTTON_GAP = 12;
const HORIZONTAL_PADDING = 24;

interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
}

export const IconPicker = ({ selectedIcon, onSelectIcon }: IconPickerProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = createStyles(colorScheme);

  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const pageWidth = Dimensions.get('window').width;

  const rowsPerPage = useMemo(() => {
    const availableHeight = Dimensions.get('window').height - 160;
    const rowHeight = ICON_BUTTON_SIZE + ICON_BUTTON_GAP;
    return Math.max(1, Math.floor(availableHeight / rowHeight));
  }, []);

  const iconsPerPage = ICONS_PER_ROW * rowsPerPage;

  const pages = useMemo(() => {
    const result: (keyof typeof IonIcons.glyphMap)[][] = [];
    for (let i = 0; i < AVAILABLE_ICONS.length; i += iconsPerPage) {
      result.push(AVAILABLE_ICONS.slice(i, i + iconsPerPage));
    }
    return result;
  }, [iconsPerPage]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const page = Math.round(offsetX / pageWidth);
      setCurrentPage(page);
    },
    [pageWidth],
  );

  const handleIconSelect = useCallback(
    (icon: string) => {
      onSelectIcon(icon);
    },
    [onSelectIcon],
  );

  const renderPage = (pageIcons: (keyof typeof IonIcons.glyphMap)[], pageIndex: number) => {
    const rows: (keyof typeof IonIcons.glyphMap)[][] = [];
    for (let i = 0; i < pageIcons.length; i += ICONS_PER_ROW) {
      rows.push(pageIcons.slice(i, i + ICONS_PER_ROW));
    }

    return (
      <View key={pageIndex} style={[styles.page, { width: pageWidth }]}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((icon) => {
              const isSelected = selectedIcon === icon;
              return (
                <HapticTab
                  key={icon}
                  onPress={() => handleIconSelect(icon)}
                  style={styles.iconButton}>
                  <IonIcons name={icon} size={28} color={colors.neutral} />
                  {isSelected && (
                    <View style={styles.checkmarkContainer}>
                      <IonIcons name="checkmark-circle" size={24} color={colors.primary} />
                    </View>
                  )}
                </HapticTab>
              );
            })}
            {row.length < ICONS_PER_ROW &&
              Array(ICONS_PER_ROW - row.length)
                .fill(null)
                .map((_, i) => (
                  <View key={`empty-${i}`} style={[styles.iconButton, styles.emptySlot]} />
                ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
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
        {pages.map((pageIcons, pageIndex) => renderPage(pageIcons, pageIndex))}
      </ScrollView>

      <View style={styles.pagination}>
        {pages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: currentPage === index ? colors.primary : colors.neutral,
                opacity: currentPage === index ? 1 : 0.4,
              },
            ]}
          />
        ))}
      </View>
    </ThemedView>
  );
};

const createStyles = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorScheme ?? 'light'].background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      alignItems: 'flex-start',
      marginTop: 24,
      marginBottom: 24,
    },
    page: {
      paddingHorizontal: HORIZONTAL_PADDING,
      paddingTop: ICON_BUTTON_GAP,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: ICON_BUTTON_GAP,
    },
    iconButton: {
      width: ICON_BUTTON_SIZE,
      height: ICON_BUTTON_SIZE,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors[colorScheme ?? 'light'].containerBackground,
    },
    checkmarkContainer: {
      position: 'absolute',
      top: -8,
      right: -8,
    },
    emptySlot: {
      backgroundColor: 'transparent',
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
  });

export default IconPicker;
