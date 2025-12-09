import { BudgetingPeriod } from '@/features/finance-tracking/settings/settings';

export interface UpdateUserFinanceTrackingSettingsRequest {
  defaultCurrency?: string;
  budgetingPeriod?: BudgetingPeriod;
  periodStartsOnDay?: number;
}
