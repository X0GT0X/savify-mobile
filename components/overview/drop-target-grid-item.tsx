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

  useEffect(() => {
    // Delay initial measurement to ensure component is fully mounted
    const timer = setTimeout(() => {
      measureAndRegister();
    }, 100);

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      unregisterDropTarget(item.id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id, scrollVersion]);

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
        console.error('Failed to measure drop target:', error);
      }
    }
  };

  const handleLayout = () => {
    // Re-measure on layout changes
    measureAndRegister();
  };

  return (
    <View ref={viewRef} onLayout={handleLayout} collapsable={false}>
      {children}
    </View>
  );
};
