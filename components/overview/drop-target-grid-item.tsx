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

export const DropTargetGridItem: React.FC<DropTargetGridItemProps> = React.memo(
  ({ item, targetType, children, scrollVersion }) => {
    const { registerDropTarget, unregisterDropTarget } = useDragDropContext();
    const viewRef = useRef<View>(null);
    const measureTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const measureRafRef = useRef<number | null>(null);
    const isMountedRef = useRef(true);
    const lastLayoutTimeRef = useRef<number>(0);

    // Initial mount and item.id changes
    useEffect(() => {
      isMountedRef.current = true;

      // Measure immediately on mount, onLayout will refine if needed
      measureAndRegister();

      // Cleanup only on unmount or when item.id changes
      return () => {
        isMountedRef.current = false;
        if (measureTimeoutRef.current) {
          clearTimeout(measureTimeoutRef.current);
        }
        if (measureRafRef.current) {
          cancelAnimationFrame(measureRafRef.current);
        }
        unregisterDropTarget(item.id);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item.id]);

    // Re-measure when scrollVersion changes WITHOUT unregistering
    useEffect(() => {
      if (!isMountedRef.current) return;

      // Clear any pending measurements
      if (measureTimeoutRef.current) {
        clearTimeout(measureTimeoutRef.current);
      }
      if (measureRafRef.current) {
        cancelAnimationFrame(measureRafRef.current);
      }

      // Re-measure immediately without delay
      measureAndRegister();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scrollVersion]);

    const measureAndRegister = () => {
      if (viewRef.current) {
        try {
          viewRef.current.measureInWindow((x, y, width, height) => {
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
            }
          });
        } catch (error) {
          // Silent fail - don't log in production
        }
      }
    };

    const handleLayout = () => {
      // Debounce layout measurements to avoid excessive re-measuring during animations
      const now = Date.now();
      const timeSinceLastLayout = now - lastLayoutTimeRef.current;

      // Skip if measured very recently (within 100ms)
      if (timeSinceLastLayout < 100) {
        return;
      }

      lastLayoutTimeRef.current = now;

      // Re-measure on next frame to ensure layout is complete
      if (measureTimeoutRef.current) {
        clearTimeout(measureTimeoutRef.current);
      }
      if (measureRafRef.current) {
        cancelAnimationFrame(measureRafRef.current);
      }
      // Use requestAnimationFrame for optimal timing
      measureRafRef.current = requestAnimationFrame(() => {
        measureAndRegister();
        measureRafRef.current = null;
      });
    };

    return (
      <View ref={viewRef} onLayout={handleLayout} collapsable={false}>
        {children}
      </View>
    );
  },
);
