import { useDragDropContext } from '@/contexts/drag-drop-context';
import { ItemType } from '@/types/drag-drop';
import React, { ReactNode, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { GridItem } from './overview-grid';

interface DropTargetGridItemProps {
  item: GridItem;
  targetType: ItemType;
  children: ReactNode;
}

export const DropTargetGridItem: React.FC<DropTargetGridItemProps> = ({
  item,
  targetType,
  children,
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
  }, [item.id]);

  const measureAndRegister = () => {
    if (viewRef.current) {
      try {
        viewRef.current.measure((x, y, width, height, pageX, pageY) => {
          // Only register if we have valid measurements
          if (width > 0 && height > 0 && pageX !== undefined && pageY !== undefined) {
            registerDropTarget(
              item.id,
              {
                x: pageX,
                y: pageY,
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
