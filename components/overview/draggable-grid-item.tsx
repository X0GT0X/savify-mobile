import { useDragDropContext } from '@/contexts/drag-drop-context';
import { DraggedItemData, ItemType } from '@/types/drag-drop';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { ReactNode, useCallback, useMemo, useRef } from 'react';
import { Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import { GridItem } from './overview-grid';

interface DraggableGridItemProps {
  item: GridItem;
  sourceType: ItemType;
  children: ReactNode;
  disabled?: boolean;
}

const EDGE_THRESHOLD = 50; // pixels from edge to trigger scroll
const EDGE_SCROLL_DELAY = 50; // ms delay before triggering edge scroll

const DraggableGridItemComponent: React.FC<DraggableGridItemProps> = ({
  item,
  sourceType,
  children,
  disabled = false,
}) => {
  const {
    startDrag,
    updateDragPosition,
    endDrag,
    scrollFunctions,
    activeDropTargetType,
    lastActiveDropTargetType,
    getSectionAtPosition,
  } = useDragDropContext();
  const edgeScrollTimeoutRef = useRef<number | null>(null);
  const screenWidth = Dimensions.get('window').width;

  const createDraggedItemData = useCallback((): DraggedItemData => {
    let color: string | undefined;
    try {
      if (item.containerStyle && typeof item.containerStyle === 'object') {
        // @ts-expect-error - accessing backgroundColor from ViewStyle
        color = item.containerStyle.backgroundColor;
      }
    } catch (error) {
      console.warn('Failed to extract color from containerStyle:', error);
    }

    return {
      id: item.id,
      name: item.label,
      icon: item.icon || 'help-circle',
      color,
      type: sourceType,
    };
  }, [item, sourceType]);

  const handleEdgeScrolling = useCallback(
    (dragX: number, dragY: number) => {
      // Clear any existing timeout
      if (edgeScrollTimeoutRef.current) {
        clearTimeout(edgeScrollTimeoutRef.current);
        edgeScrollTimeoutRef.current = null;
      }

      // Determine which section to scroll based on Y position
      const sectionAtPosition = getSectionAtPosition(dragY);

      let scrollType: ItemType;
      if (sectionAtPosition && sectionAtPosition !== sourceType) {
        scrollType = sectionAtPosition;
      } else {
        const targetType = activeDropTargetType || lastActiveDropTargetType;
        scrollType = targetType && targetType !== sourceType ? targetType : sourceType;
      }

      const scrollFn = scrollFunctions[scrollType];
      if (!scrollFn) {
        return;
      }

      // Check if near left edge
      if (dragX < EDGE_THRESHOLD) {
        edgeScrollTimeoutRef.current = setTimeout(() => {
          scrollFn('left');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }, EDGE_SCROLL_DELAY);
      }
      // Check if near right edge
      else if (dragX > screenWidth - EDGE_THRESHOLD) {
        edgeScrollTimeoutRef.current = setTimeout(() => {
          scrollFn('right');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }, EDGE_SCROLL_DELAY);
      }
    },
    [
      sourceType,
      activeDropTargetType,
      lastActiveDropTargetType,
      scrollFunctions,
      screenWidth,
      getSectionAtPosition,
    ],
  );

  const handleDragStart = useCallback(
    (x: number, y: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const draggedData = createDraggedItemData();
      startDrag(draggedData, sourceType, { x, y });
    },
    [createDraggedItemData, startDrag, sourceType],
  );

  const handleDragEnd = useCallback(() => {
    // Clear edge scroll timeout
    if (edgeScrollTimeoutRef.current) {
      clearTimeout(edgeScrollTimeoutRef.current);
      edgeScrollTimeoutRef.current = null;
    }

    const validTarget = endDrag();

    if (validTarget) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const draggedData = createDraggedItemData();

      router.push({
        pathname: '/(app)/(tabs)/overview/add-transaction',
        params: {
          sourceId: draggedData.id,
          sourceName: draggedData.name,
          sourceType: draggedData.type,
          sourceIcon: draggedData.icon || '',
          sourceColor: draggedData.color || '',
          targetId: validTarget.id,
          targetName: validTarget.name,
          targetType: validTarget.type,
          targetIcon: validTarget.icon || '',
          targetColor: validTarget.color || '',
          transactionType: validTarget.transactionType,
        },
      });
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [endDrag, createDraggedItemData]);

  const handleDragFinalize = useCallback(() => {
    if (edgeScrollTimeoutRef.current) {
      clearTimeout(edgeScrollTimeoutRef.current);
      edgeScrollTimeoutRef.current = null;
    }
  }, []);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .activateAfterLongPress(200)
        .onStart((event) => {
          if (disabled) return;

          scheduleOnRN(handleDragStart, event.absoluteX, event.absoluteY);
        })
        .onUpdate((event) => {
          if (disabled) return;
          scheduleOnRN(updateDragPosition, event.absoluteX, event.absoluteY);
          scheduleOnRN(handleEdgeScrolling, event.absoluteX, event.absoluteY);
        })
        .onEnd(() => {
          if (disabled) return;

          scheduleOnRN(handleDragEnd);
        })
        .onFinalize(() => {
          scheduleOnRN(handleDragFinalize);
        }),
    [
      disabled,
      handleDragStart,
      updateDragPosition,
      handleEdgeScrolling,
      handleDragEnd,
      handleDragFinalize,
    ],
  );

  if (disabled) {
    return <>{children}</>;
  }

  return <GestureDetector gesture={pan}>{children}</GestureDetector>;
};

export const DraggableGridItem = React.memo(DraggableGridItemComponent);
DraggableGridItem.displayName = 'DraggableGridItem';
