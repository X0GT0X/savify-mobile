import { TransactionType } from '@/features/finance-tracking/transactions/transaction';

export interface AddTransactionRequest {
  type: TransactionType;
  source: Source;
  target: Target;
  date: string; // 'YYYY-MM-DD'
  comment?: string;
  tags: string[]; // array of tag UUIDs
}

export interface Source {
  id: string; // UUID of source wallet or category
  amount?: number; // in minor units
  currency: string; // currency code (e.g. USD, EUR, etc.)
}

export interface Target {
  id: string; // UUID of source wallet or category
  amount?: number; // in minor units
  currency: string; // currency code (e.g. USD, EUR, etc.)
}
