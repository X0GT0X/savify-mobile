import {
  DraggedItemData,
  DragPosition,
  DropTargetLayout,
  ItemType,
  TransactionType,
  ValidDropTarget,
} from '@/types/drag-drop';
import React, { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react';

interface DragDropContextType {
  isDragging: boolean;
  draggedItem: DraggedItemData | null;
  dragPosition: DragPosition;
  sourceType: ItemType | null;
  isOverInvalidTarget: boolean;

  startDrag: (item: DraggedItemData, sourceType: ItemType, position: DragPosition) => void;
  updateDragPosition: (x: number, y: number) => void;
  endDrag: () => ValidDropTarget | null;
  registerDropTarget: (
    id: string,
    layout: Omit<DropTargetLayout, 'itemData'>,
    targetType: ItemType,
    itemData: any,
  ) => void;
  unregisterDropTarget: (id: string) => void;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export const useDragDropContext = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    console.error('useDragDropContext must be used within a DragDropProvider');
    throw new Error('useDragDropContext must be used within a DragDropProvider');
  }
  return context;
};

interface DragDropProviderProps {
  children: ReactNode;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<DraggedItemData | null>(null);
  const [dragPosition, setDragPosition] = useState<DragPosition>({ x: 0, y: 0 });
  const [sourceType, setSourceType] = useState<ItemType | null>(null);
  const [isOverInvalidTarget, setIsOverInvalidTarget] = useState(false);

  const dropTargetsRef = useRef<Map<string, DropTargetLayout>>(new Map());

  const startDrag = useCallback(
    (item: DraggedItemData, itemSourceType: ItemType, position: DragPosition) => {
      setIsDragging(true);
      setDraggedItem(item);
      setSourceType(itemSourceType);
      setDragPosition(position);
      setIsOverInvalidTarget(false);
    },
    [],
  );

  const updateDragPosition = useCallback(
    (x: number, y: number) => {
      setDragPosition({ x, y });

      // Check collision and update invalid target state
      const validTarget = getValidDropTargetInternal(x, y);
      if (validTarget === null && hasCollision(x, y)) {
        setIsOverInvalidTarget(true);
      } else {
        setIsOverInvalidTarget(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sourceType, draggedItem],
  );

  const hasCollision = (dragX: number, dragY: number): boolean => {
    for (const target of dropTargetsRef.current.values()) {
      const { x, y, width, height } = target;
      if (dragX >= x && dragX <= x + width && dragY >= y && dragY <= y + height) {
        return true;
      }
    }
    return false;
  };

  const getValidDropTargetInternal = (dragX: number, dragY: number): ValidDropTarget | null => {
    console.log(`Checking collision at (${dragX}, ${dragY})`);

    for (const [id, target] of dropTargetsRef.current.entries()) {
      const { x, y, width, height, type, itemData } = target;

      // Check if drag position is inside target bounds
      const isInside = dragX >= x && dragX <= x + width && dragY >= y && dragY <= y + height;

      if (isInside) {
        console.log(`Inside target ${id} (${type}), bounds: (${x}, ${y}, ${width}, ${height})`);

        // Validate drop combination
        const transactionType = getTransactionType(sourceType, type);
        console.log(`Transaction type for ${sourceType} -> ${type}: ${transactionType}`);

        if (transactionType && draggedItem && id !== draggedItem.id) {
          // Extract color from containerStyle if it's an object
          let color: string | undefined;
          if (itemData.containerStyle && typeof itemData.containerStyle === 'object') {
            // @ts-expect-error - accessing backgroundColor from ViewStyle
            color = itemData.containerStyle.backgroundColor;
          }

          console.log(`Valid drop target found: ${id}`);
          return {
            id,
            name: itemData.label,
            icon: itemData.icon,
            color,
            type,
            transactionType,
          };
        } else {
          console.log(`Drop rejected: transactionType=${transactionType}, draggedItem=${draggedItem?.id}, targetId=${id}`);
        }
      }
    }

    console.log('No collision detected');
    return null;
  };

  const endDrag = useCallback((): ValidDropTarget | null => {
    console.log(`endDrag called at position (${dragPosition.x}, ${dragPosition.y}), sourceType: ${sourceType}, draggedItem: ${draggedItem?.id}`);
    console.log(`Total drop targets: ${dropTargetsRef.current.size}`);

    const validTarget = getValidDropTargetInternal(dragPosition.x, dragPosition.y);
    console.log('Valid target found:', validTarget);

    // Reset state
    setIsDragging(false);
    setDraggedItem(null);
    setSourceType(null);
    setDragPosition({ x: 0, y: 0 });
    setIsOverInvalidTarget(false);

    return validTarget;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragPosition, sourceType, draggedItem]);

  const registerDropTarget = useCallback(
    (id: string, layout: Omit<DropTargetLayout, 'itemData'>, targetType: ItemType, itemData: any) => {
      dropTargetsRef.current.set(id, {
        ...layout,
        type: targetType,
        itemData,
      });

      console.log(`Registered drop target: ${id} (${targetType}) at (${layout.x}, ${layout.y}), size: ${layout.width}x${layout.height}, name: ${itemData.label}, total targets: ${dropTargetsRef.current.size}`);
    },
    [],
  );

  const unregisterDropTarget = useCallback((id: string) => {
    dropTargetsRef.current.delete(id);
  }, []);

  const value: DragDropContextType = {
    isDragging,
    draggedItem,
    dragPosition,
    sourceType,
    isOverInvalidTarget,
    startDrag,
    updateDragPosition,
    endDrag,
    registerDropTarget,
    unregisterDropTarget,
  };

  return <DragDropContext.Provider value={value}>{children}</DragDropContext.Provider>;
};

/**
 * Determines the transaction type based on source and target types
 */
function getTransactionType(
  sourceType: ItemType | null,
  targetType: ItemType,
): TransactionType | null {
  if (!sourceType) return null;

  if (sourceType === 'income' && targetType === 'wallet') return 'income';
  if (sourceType === 'wallet' && targetType === 'wallet') return 'transfer';
  if (sourceType === 'wallet' && targetType === 'expense') return 'expense';

  return null;
}
