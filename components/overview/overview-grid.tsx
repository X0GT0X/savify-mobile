import { HapticTab } from '@/components/haptic-tab';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useDragDropContext } from '@/contexts/drag-drop-context';
import { ItemType } from '@/features/finance-tracking/transactions/transaction';
import { useColorScheme } from '@/hooks/use-color-scheme';
import IonIcons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ColorSchemeName,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DraggableGridItem } from './draggable-grid-item';
import { DropTargetGridItem } from './drop-target-grid-item';

export type Budget = {
  value: string;
  percentage: number;
  status: 'over' | 'under' | 'onTrack';
};

export type GridItem = {
  id: string;
  label: string;
  value: string;
  icon: string;
  onPress?: () => void;
  iconColor?: string;
  fillColor?: string;
  budget?: Budget;
  containerStyle?: StyleProp<ViewStyle>;
};

type GridProps = {
  items: GridItem[];
  gridHorizontalCount: number;
  gridVerticalCount: number;
  enableDragDrop?: boolean;
  gridType?: ItemType;
};

const OverviewGrid = ({
  items,
  gridHorizontalCount,
  gridVerticalCount,
  enableDragDrop = false,
  gridType = 'Wallet',
}: GridProps) => {
  const colorScheme = useColorScheme();
  const gridStyles = createStyles(colorScheme);
  const { activeDropTargetId, registerScrollFunction, registerSectionBounds } =
    useDragDropContext();

  const screenWidth = Dimensions.get('window').width;
  const itemsPerPage = gridHorizontalCount * gridVerticalCount;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(0);
  const [scrollVersion, setScrollVersion] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const containerRef = useRef<View>(null);

  const pages: GridItem[][] = [];
  for (let i = 0; i < items.length; i += itemsPerPage) {
    pages.push(items.slice(i, i + itemsPerPage));
  }

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const page = Math.round(offsetX / screenWidth);
      setCurrentPage(page);
    },
    [screenWidth],
  );

  const handleScrollEnd = useCallback(() => {
    // Trigger re-measurement of all drop targets after scroll completes
    setScrollVersion((v) => v + 1);
  }, []);

  const handleEdgeScroll = useCallback(
    (direction: 'left' | 'right') => {
      if (direction === 'left' && currentPage > 0) {
        scrollViewRef.current?.scrollTo({ x: (currentPage - 1) * screenWidth, animated: true });
        setScrollVersion((v) => v + 1);
      } else if (direction === 'right' && currentPage < totalPages - 1) {
        scrollViewRef.current?.scrollTo({ x: (currentPage + 1) * screenWidth, animated: true });
        setScrollVersion((v) => v + 1);
      }
    },
    [currentPage, totalPages, screenWidth],
  );

  // Register scroll function in context
  useEffect(() => {
    registerScrollFunction(gridType, handleEdgeScroll);
  }, [registerScrollFunction, gridType, handleEdgeScroll]);

  // Measure and register section bounds
  useEffect(() => {
    const measureLayout = () => {
      containerRef.current?.measure((_x, _y, _width, height, _pageX, pageY) => {
        registerSectionBounds(gridType, { y: pageY, height });
      });
    };

    // Delay measurement to ensure layout is complete
    const timer = setTimeout(measureLayout, 100);
    return () => clearTimeout(timer);
  }, [gridType, registerSectionBounds, items.length]);

  const resolveStatusColor = (status: Budget['status']) => {
    if (status === 'over') {
      return Colors[colorScheme ?? 'light'].danger;
    }

    if (status === 'under') {
      return Colors[colorScheme ?? 'light'].success;
    }

    return Colors[colorScheme ?? 'light'].warning;
  };

  const resolveIcon = (item: GridItem) => {
    const [iconName, iconType] = item.icon.split('@');

    if (iconType === 'ion') {
      return (
        <IonIcons
          name={iconName as keyof typeof IonIcons.glyphMap}
          size={28}
          style={[
            gridStyles.icon,
            item.budget && { color: resolveStatusColor(item.budget?.status ?? 'onTrack') },
            item.iconColor && { color: item.iconColor },
          ]}
        />
      );
    }

    return <ThemedText>{item.icon}</ThemedText>;
  };

  const renderPage = (pageItems: GridItem[], pageIndex: number) => {
    const rows: GridItem[][] = [];
    for (let i = 0; i < pageItems.length; i += gridHorizontalCount) {
      rows.push(pageItems.slice(i, i + gridHorizontalCount));
    }

    while (rows.length < gridVerticalCount) {
      rows.push([]);
    }

    return (
      <View key={pageIndex} style={[gridStyles.page, { width: screenWidth }]}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={gridStyles.row}>
            {row.map((item) => {
              const percentage = item.budget?.percentage ?? 0;

              const getFillColor = () => {
                if (item.fillColor) {
                  return item.fillColor;
                }

                if (item.budget) {
                  return resolveStatusColor(item.budget.status) + '40';
                }

                return Colors[colorScheme ?? 'light'].containerBackground;
              };
              const fillColor = getFillColor();

              const isAddNew = item.id.startsWith('new-');
              const iconContent = (
                <HapticTab
                  onPress={item.onPress}
                  style={[gridStyles.iconContainer, item.containerStyle]}>
                  {percentage > 0 && (
                    <>
                      {/* Wave on top */}
                      {percentage < 100 && (
                        <Svg
                          height={12}
                          width="100%"
                          viewBox={percentage < 80 ? '0 0 720 200' : '0 0 220 90'}
                          preserveAspectRatio="none"
                          style={{
                            position: 'absolute',
                            bottom: `${percentage}%`,
                            left: 0,
                          }}>
                          <Path
                            fill={fillColor}
                            d="M0,128L40,112C80,96,160,64,240,80C320,96,400,160,480,186.7C560,213,640,203,720,186.7C800,171,880,149,960,154.7C1040,160,1120,192,1200,202.7C1280,213,1360,203,1400,197.3L1440,192L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
                          />
                        </Svg>
                      )}
                      {/* Solid fill below the wave */}
                      <View
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: `${percentage}%`,
                          bottom: 0,
                          left: 0,
                          borderBottomLeftRadius: 24,
                          borderBottomRightRadius: 24,
                          borderTopLeftRadius: percentage >= 100 ? 24 : 0,
                          borderTopRightRadius: percentage >= 100 ? 24 : 0,
                          backgroundColor: fillColor,
                        }}
                      />
                    </>
                  )}
                  {resolveIcon(item)}
                </HapticTab>
              );

              const isActiveDropTarget = enableDragDrop && activeDropTargetId === item.id;

              return (
                <View key={item.id} style={gridStyles.gridItem}>
                  {enableDragDrop && !isAddNew ? (
                    <DraggableGridItem item={item} sourceType={gridType}>
                      <DropTargetGridItem
                        item={item}
                        targetType={gridType}
                        scrollVersion={scrollVersion}>
                        <View
                          style={{
                            alignItems: 'center',
                            transform: isActiveDropTarget ? [{ scale: 0.95 }] : [{ scale: 1 }],
                            opacity: isActiveDropTarget ? 0.5 : 1,
                            backgroundColor: 'transparent',
                          }}>
                          <ThemedText type="default" style={gridStyles.label} numberOfLines={1}>
                            {item.label}
                          </ThemedText>
                          {iconContent}
                          <ThemedText type="defaultSemiBold" style={gridStyles.value}>
                            {item.value}
                          </ThemedText>
                          <ThemedText style={gridStyles.subvalue}>
                            {item.budget && `/${item.budget.value}`}
                          </ThemedText>
                        </View>
                      </DropTargetGridItem>
                    </DraggableGridItem>
                  ) : (
                    <>
                      <ThemedText type="default" style={gridStyles.label} numberOfLines={1}>
                        {item.label}
                      </ThemedText>
                      {iconContent}
                      <ThemedText type="defaultSemiBold" style={gridStyles.value}>
                        {item.value}
                      </ThemedText>
                      <ThemedText style={gridStyles.subvalue}>
                        {item.budget && `/${item.budget.value}`}
                      </ThemedText>
                    </>
                  )}
                </View>
              );
            })}

            {Array.from({ length: gridHorizontalCount - row.length }).map((_, emptyIndex) => (
              <View key={`empty-${emptyIndex}`} style={gridStyles.gridItem} />
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View ref={containerRef} style={gridStyles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={screenWidth}
        snapToAlignment="start">
        {pages.map((pageItems, pageIndex) => renderPage(pageItems, pageIndex))}
      </ScrollView>

      {totalPages > 1 && (
        <View style={gridStyles.pagination}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <View
              key={index}
              style={[
                gridStyles.paginationDot,
                index === currentPage && gridStyles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const createStyles = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    page: {
      paddingHorizontal: 16,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    gridItem: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 4,
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 24,
      backgroundColor: Colors[colorScheme ?? 'light'].containerBackground,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 4,
      overflow: 'hidden',
    },
    icon: {
      color: '#AAAAAA',
    },
    label: {
      fontSize: 13,
      textAlign: 'center',
      marginBottom: 2,
    },
    value: {
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
    },
    subvalue: {
      fontSize: 10,
      lineHeight: 12,
      textAlign: 'center',
      color: Colors[colorScheme ?? 'light'].neutral,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    paginationDot: {
      width: 6,
      height: 6,
      borderRadius: 6,
      backgroundColor: Colors[colorScheme ?? 'light'].text + '40',
      marginHorizontal: 4,
    },
    paginationDotActive: {
      backgroundColor: Colors[colorScheme ?? 'light'].text,
    },
  });

export default OverviewGrid;
