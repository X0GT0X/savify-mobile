export interface UserFinanceTrackingSettings {
  id: string;
  userId: string;
  defaultCurrency: string;
  budgetingPeriod: BudgetingPeriod;
  periodStartsOnDay: number;
}

export const BUDGETING_PERIODS = ['Weekly', 'Biweekly', 'Monthly'] as const;

export type BudgetingPeriod = (typeof BUDGETING_PERIODS)[number];
