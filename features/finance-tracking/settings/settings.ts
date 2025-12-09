export interface UserFinanceTrackingSettings {
  id: string;
  userId: string;
  defaultCurrency: string;
  budgetingPeriod: BudgetingPeriod;
  periodStartsOnDay: number;
}

export type BudgetingPeriod = 'Weekly' | 'Biweekly' | 'Monthly';
