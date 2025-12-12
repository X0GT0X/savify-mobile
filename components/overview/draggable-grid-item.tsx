import { useDragDropContext } from '@/contexts/drag-drop-context';
import { DraggedItemData, ItemType } from '@/types/drag-drop';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { ReactNode, useCallback, useMemo, useRef } from 'react';
import { Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { GridItem } from './overview-grid';

interface DraggableGridItemProps {
  item: GridItem;
  sourceType: ItemType;
  children: ReactNode;
  disabled?: boolean;
  onEdgeScroll?: (direction: 'left' | 'right') => void;
}

const EDGE_THRESHOLD = 50; // pixels from edge to trigger scroll
const EDGE_SCROLL_DELAY = 50; // ms delay before triggering edge scroll

export const DraggableGridItem: React.FC<DraggableGridItemProps> = ({
  item,
  sourceType,
  children,
  disabled = false,
  onEdgeScroll,
}) => {
  const { startDrag, updateDragPosition, endDrag } = useDragDropContext();
  const edgeScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const screenWidth = Dimensions.get('window').width;

  const createDraggedItemData = useCallback((): DraggedItemData => {
    // Extract color from containerStyle if it exists
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
    (dragX: number) => {
      if (!onEdgeScroll) return;

      // Clear any existing timeout
      if (edgeScrollTimeoutRef.current) {
        clearTimeout(edgeScrollTimeoutRef.current);
        edgeScrollTimeoutRef.current = null;
      }

      // Check if near left edge
      if (dragX < EDGE_THRESHOLD) {
        edgeScrollTimeoutRef.current = setTimeout(() => {
          onEdgeScroll('left');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }, EDGE_SCROLL_DELAY);
      }
      // Check if near right edge
      else if (dragX > screenWidth - EDGE_THRESHOLD) {
        edgeScrollTimeoutRef.current = setTimeout(() => {
          onEdgeScroll('right');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }, EDGE_SCROLL_DELAY);
      }
    },
    [onEdgeScroll, screenWidth],
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
          runOnJS(handleDragStart)(event.absoluteX, event.absoluteY);
        })
        .onUpdate((event) => {
          if (disabled) return;
          runOnJS(updateDragPosition)(event.absoluteX, event.absoluteY);
          runOnJS(handleEdgeScrolling)(event.absoluteX);
        })
        .onEnd(() => {
          if (disabled) return;
          runOnJS(handleDragEnd)();
        })
        .onFinalize(() => {
          runOnJS(handleDragFinalize)();
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
