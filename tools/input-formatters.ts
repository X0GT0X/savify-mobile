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
