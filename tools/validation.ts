import { getCurrencyMinorUnits } from './currency';

/**
 * Creates a regex pattern for validating currency amounts
 *
 * @param currencyCode - ISO 4217 currency code
 * @param allowNegative - Whether to allow negative values
 * @returns RegExp pattern for validating the currency amount
 *
 * @example
 * createCurrencyAmountPattern('USD', false) // /^\d+(\.\d{1,2})?$/
 * createCurrencyAmountPattern('USD', true) // /^-?\d+(\.\d{1,2})?$/
 * createCurrencyAmountPattern('JPY', false) // /^\d+$/
 * createCurrencyAmountPattern('JPY', true) // /^-?\d+$/
 */
export const createCurrencyAmountPattern = (
  currencyCode: string,
  allowNegative: boolean = false,
): RegExp => {
  const minorUnits = getCurrencyMinorUnits(currencyCode);
  const negativePrefix = allowNegative ? '-?' : '';

  if (minorUnits === 0) {
    // No decimals allowed for currencies like JPY, KRW
    return new RegExp(`^${negativePrefix}\\d+$`);
  } else {
    // Allow up to minorUnits decimal places
    return new RegExp(`^${negativePrefix}\\d+(\\.\\d{1,${minorUnits}})?$`);
  }
};

/**
 * Validates if a currency amount string is valid for the given currency
 *
 * @param value - The amount string to validate
 * @param currencyCode - ISO 4217 currency code
 * @param allowNegative - Whether to allow negative values
 * @returns true if valid, false otherwise
 *
 * @example
 * validateCurrencyAmount('100.50', 'USD', false) // true
 * validateCurrencyAmount('100.567', 'USD', false) // false (too many decimals)
 * validateCurrencyAmount('-100.50', 'USD', false) // false (negative not allowed)
 * validateCurrencyAmount('-100.50', 'USD', true) // true
 * validateCurrencyAmount('12345', 'JPY', false) // true
 * validateCurrencyAmount('12345.5', 'JPY', false) // false (decimals not allowed)
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
