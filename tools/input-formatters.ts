import { getCurrencyMinorUnits } from './currency';

/**
 * Parses formatted currency input to a numeric value
 * Removes spaces (thousands separators) and replaces commas with dots
 *
 * @param value - The formatted currency input string
 * @returns Numeric value
 *
 * @example
 * parseCurrencyInput('1 234 567.89') // returns 1234567.89
 * parseCurrencyInput('1,234.56') // returns 1234.56
 * parseCurrencyInput('-100.50') // returns -100.50
 * parseCurrencyInput('12 345') // returns 12345
 */
export const parseCurrencyInput = (value: string): number => {
  if (!value) return 0;

  // Remove spaces and replace commas with dots
  const normalized = value.replace(/\s/g, '').replace(/,/g, '.');

  return parseFloat(normalized) || 0;
};

/**
 * Normalizes decimal input by replacing commas with dots
 * Useful for handling different regional decimal separators
 *
 * @param value - The input value to normalize
 * @returns Normalized value with dots instead of commas
 *
 * @example
 * normalizeDecimalInput('1,45') // returns '1.45'
 * normalizeDecimalInput('1.45') // returns '1.45'
 * normalizeDecimalInput('1 000,45') // returns '1 000.45'
 */
export const normalizeDecimalInput = (value: string): string => {
  // Replace comma with dot for consistent decimal separator
  return value.replace(/,/g, '.');
};

/**
 * Normalizes numeric input by removing all non-numeric characters except dots
 * Useful for strict numeric inputs
 *
 * @param value - The input value to normalize
 * @returns Normalized value with only numbers and dots
 *
 * @example
 * normalizeNumericInput('1,45€') // returns '1.45'
 * normalizeNumericInput('$ 1 000.45') // returns '1000.45'
 */
export const normalizeNumericInput = (value: string): string => {
  // First replace commas with dots
  let normalized = normalizeDecimalInput(value);

  // Remove all characters except digits, dots, and minus sign
  normalized = normalized.replace(/[^\d.-]/g, '');

  // Ensure only one dot exists (keep the first one)
  const parts = normalized.split('.');
  if (parts.length > 2) {
    normalized = parts[0] + '.' + parts.slice(1).join('');
  }

  return normalized;
};

/**
 * Formats currency input based on currency's decimal places
 * Prevents entering more decimal places than the currency supports
 * Adds thousands separators (spaces) for readability
 * Optionally allows negative values
 *
 * @param value - The input value to format
 * @param currencyCode - ISO 4217 currency code (e.g., 'USD', 'JPY')
 * @param allowNegative - Whether to allow negative values (default: false)
 * @returns Formatted value respecting currency's minor units with thousands separators
 *
 * @example
 * formatCurrencyInput('1234567.89', 'USD', false) // returns '1 234 567.89'
 * formatCurrencyInput('123.456', 'USD', false) // returns '123.45' (max 2 decimals)
 * formatCurrencyInput('12345.5', 'JPY', false) // returns '12 345' (no decimals)
 * formatCurrencyInput('-100.50', 'USD', true) // returns '-100.50'
 * formatCurrencyInput('-100.50', 'USD', false) // returns '100.50' (negative not allowed)
 * formatCurrencyInput('1.2345', 'BHD', false) // returns '1.234' (max 3 decimals)
 */
export const formatCurrencyInput = (
  value: string,
  currencyCode: string,
  allowNegative: boolean = false,
): string => {
  if (!value) return '';

  // First normalize: replace commas with dots and remove spaces (from previous formatting)
  let normalized = value.replace(/,/g, '.').replace(/\s/g, '');

  // Handle negative sign
  const isNegative = normalized.startsWith('-');
  if (isNegative && !allowNegative) {
    // Remove negative sign if not allowed
    normalized = normalized.substring(1);
  }

  // Remove all characters except digits, dots, and minus sign (if allowed)
  if (allowNegative) {
    normalized = normalized.replace(/[^\d.-]/g, '');
    // Ensure minus sign is only at the start
    const hasMinusAtStart = normalized.startsWith('-');
    normalized = normalized.replace(/-/g, '');
    if (hasMinusAtStart) {
      normalized = '-' + normalized;
    }
  } else {
    normalized = normalized.replace(/[^\d.]/g, '');
  }

  // Split into integer and decimal parts
  const parts = normalized.split('.');
  let integerPart = parts[0] || '';
  let decimalPart = parts.length > 1 ? parts[1] : '';

  // Handle negative sign in integer part
  const hasNegative = integerPart.startsWith('-');
  if (hasNegative) {
    integerPart = integerPart.substring(1);
  }

  // Remove leading zeros from integer part (but keep single '0' if that's all there is)
  if (integerPart.length > 1) {
    integerPart = integerPart.replace(/^0+/, '') || '0';
  }

  // Add thousands separators to integer part
  // Use space as separator, matching formatMoney behavior
  if (integerPart.length > 3) {
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  // Get currency's decimal places
  const minorUnits = getCurrencyMinorUnits(currencyCode);

  // Limit decimal places based on currency
  if (minorUnits === 0) {
    // No decimals allowed for currencies like JPY, KRW
    return (hasNegative ? '-' : '') + integerPart;
  } else {
    // Limit decimal places
    if (decimalPart.length > minorUnits) {
      decimalPart = decimalPart.substring(0, minorUnits);
    }

    // Return formatted value
    if (parts.length > 1) {
      // User typed a dot, keep it even if decimal part is empty
      return (hasNegative ? '-' : '') + integerPart + '.' + decimalPart;
    } else {
      return (hasNegative ? '-' : '') + integerPart;
    }
  }
};
