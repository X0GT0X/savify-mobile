export interface Wallet {
  id: string;
  name: string;
  currentBalanceAmount: number;
  currency: string;
  color: string;
  icon: string;
  includeInTotalBalance: boolean;
  isArchived: boolean;
  createdAt: Date;
}
