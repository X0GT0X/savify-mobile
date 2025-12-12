export type TransactionType = 'income' | 'transfer' | 'expense';

export type ItemType = 'income' | 'wallet' | 'expense';

/**
 * Determines the transaction type based on source and target types
 */
export const resolveTransactionType = (
  sourceType: ItemType | null,
  targetType: ItemType,
): TransactionType | null => {
  if (!sourceType) return null;

  if (sourceType === 'income' && targetType === 'wallet') return 'income';
  if (sourceType === 'wallet' && targetType === 'wallet') return 'transfer';
  if (sourceType === 'wallet' && targetType === 'expense') return 'expense';

  return null;
};
