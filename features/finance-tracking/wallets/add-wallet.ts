export interface AddWalletRequest {
  name: string;
  currency: string; // currency code (e.g. USD, EUR, etc.)
  initialAmountBalance: number; // in minor units (e.g. 100$ = 10000 cents)
  color: string; // hex color
  icon: string; // name with source suffix (e.g. cash@ion for cash icon from ionicons)
  includeInTotalBalance: boolean;
}
