import { GridItem } from '@/components/overview/overview-grid';
import { ItemType, TransactionType } from '@/features/finance-tracking/transactions/transaction';

export interface DraggedItemData {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  type: ItemType;
}

export interface DropTargetLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  type: ItemType;
  itemData: GridItem;
}

export interface ValidDropTarget {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  type: ItemType;
  transactionType: TransactionType;
}

export interface DragPosition {
  x: number;
  y: number;
}
