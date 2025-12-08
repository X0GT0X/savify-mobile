export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
  isArchived: boolean;
}

export type CategoryType = 'Expense' | 'Income';
