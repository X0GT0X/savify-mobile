export type TransactionType = 'Income' | 'Transfer' | 'Expense';

export type ItemType = 'Income' | 'Wallet' | 'Expense';

/**
 * Determines the transaction type based on source and target types
 */
export const resolveTransactionType = (
  sourceType: ItemType | null,
  targetType: ItemType,
): TransactionType | null => {
  if (!sourceType) return null;

  if (sourceType === 'Income' && targetType === 'Wallet') return 'Income';
  if (sourceType === 'Wallet' && targetType === 'Wallet') return 'Transfer';
  if (sourceType === 'Wallet' && targetType === 'Expense') return 'Expense';

  return null;
};
