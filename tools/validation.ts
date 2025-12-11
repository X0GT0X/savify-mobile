import { getCurrencyMinorUnits } from './currency';

/**
 * Creates a regex pattern for validating currency amounts
 * with support for space thousands separators.
 */
export const createCurrencyAmountPattern = (
  currencyCode: string,
  allowNegative: boolean = false,
): RegExp => {
  const minorUnits = getCurrencyMinorUnits(currencyCode);
  const negativePrefix = allowNegative ? '-?' : '';

  // Integer part with optional space-separated thousands:
  // - Starts with 1–3 digits
  // - Then zero or more groups of: space + exactly 3 digits
  const integerPart = '\\d{1,3}(?: \\d{3})*';

  if (minorUnits === 0) {
    // No decimals allowed (JPY, KRW)
    return new RegExp(`^${negativePrefix}${integerPart}$`);
  }

  // Currencies with decimals
  const decimalPart = `(?:\\.\\d{1,${minorUnits}})?`;

  return new RegExp(`^${negativePrefix}${integerPart}${decimalPart}$`);
};

/**
 * Validates if a currency amount string is valid for the given currency
 */
export const validateCurrencyAmount = (
  value: string,
  currencyCode: string,
  allowNegative: boolean = false,
): boolean => {
  if (!value) return false;

  const pattern = createCurrencyAmountPattern(currencyCode, allowNegative);
  return pattern.test(value);
};
