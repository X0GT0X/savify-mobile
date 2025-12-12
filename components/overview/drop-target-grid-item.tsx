import { useDragDropContext } from '@/contexts/drag-drop-context';
import { ItemType } from '@/types/drag-drop';
import React, { ReactNode, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { GridItem } from './overview-grid';

interface DropTargetGridItemProps {
  item: GridItem;
  targetType: ItemType;
  children: ReactNode;
  scrollVersion?: number;
}

export const DropTargetGridItem: React.FC<DropTargetGridItemProps> = ({
  item,
  targetType,
  children,
  scrollVersion,
}) => {
  const { registerDropTarget, unregisterDropTarget } = useDragDropContext();
  const viewRef = useRef<View>(null);
  const measureTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Initial mount and item.id changes
  useEffect(() => {
    console.log(`[DropTarget ${targetType}:${item.id}] Mounted`);
    isMountedRef.current = true;

    // Initial measurement
    const timer = setTimeout(() => {
      measureAndRegister();
    }, 100);

    // Cleanup only on unmount or when item.id changes
    return () => {
      console.log(`[DropTarget ${targetType}:${item.id}] Unmounting`);
      isMountedRef.current = false;
      clearTimeout(timer);
      if (measureTimeoutRef.current) {
        clearTimeout(measureTimeoutRef.current);
      }
      unregisterDropTarget(item.id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  // Re-measure when scrollVersion changes WITHOUT unregistering
  useEffect(() => {
    if (!isMountedRef.current) return;

    console.log(
      `[DropTarget ${targetType}:${item.id}] ScrollVersion changed to ${scrollVersion}, re-measuring`,
    );

    // Clear any pending measurements
    if (measureTimeoutRef.current) {
      clearTimeout(measureTimeoutRef.current);
    }

    // Re-measure without unregistering (just update position)
    measureTimeoutRef.current = setTimeout(() => {
      measureAndRegister();
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollVersion]);

  const measureAndRegister = () => {
    if (viewRef.current) {
      try {
        viewRef.current.measureInWindow((x, y, width, height) => {
          console.log(`[DropTarget ${targetType}:${item.id}] Measured:`, {
            x,
            y,
            width,
            height,
            valid: width > 0 && height > 0 && x !== undefined && y !== undefined,
          });

          // Only register if we have valid measurements
          if (width > 0 && height > 0 && x !== undefined && y !== undefined) {
            registerDropTarget(
              item.id,
              {
                x,
                y,
                width,
                height,
                type: targetType,
              },
              targetType,
              item,
            );
            console.log(`[DropTarget ${targetType}:${item.id}] Registered successfully`);
          } else {
            console.warn(
              `[DropTarget ${targetType}:${item.id}] Invalid measurements, not registering`,
            );
          }
        });
      } catch (error) {
        console.error(`[DropTarget ${targetType}:${item.id}] Failed to measure:`, error);
      }
    } else {
      console.warn(`[DropTarget ${targetType}:${item.id}] viewRef is null`);
    }
  };

  const handleLayout = () => {
    console.log(`[DropTarget ${targetType}:${item.id}] onLayout triggered`);
    // Re-measure on layout changes with a small delay
    if (measureTimeoutRef.current) {
      clearTimeout(measureTimeoutRef.current);
    }
    measureTimeoutRef.current = setTimeout(() => {
      measureAndRegister();
    }, 50);
  };

  return (
    <View ref={viewRef} onLayout={handleLayout} collapsable={false}>
      {children}
    </View>
  );
};
