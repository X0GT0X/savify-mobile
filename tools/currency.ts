/**
 * Currency utility functions for handling currencies with different minor unit counts
 */

/**
 * Map of currency codes to their minor unit count (decimal places)
 *
 * Most currencies use 2 decimal places (USD, EUR, GBP, etc.)
 * Some currencies use 0 decimal places (JPY, KRW, etc.)
 * Some rare currencies use 3 decimal places (BHD, JOD, KWD, etc.)
 *
 * This list includes the most common currencies. For unlisted currencies,
 * we default to 2 decimal places.
 *
 * Based on ISO 4217 standard
 */
const CURRENCY_MINOR_UNITS: Record<string, number> = {
  // Zero decimal places
  BIF: 0, // Burundian Franc
  CLP: 0, // Chilean Peso
  DJF: 0, // Djiboutian Franc
  GNF: 0, // Guinean Franc
  ISK: 0, // Icelandic Króna
  JPY: 0, // Japanese Yen
  KMF: 0, // Comorian Franc
  KRW: 0, // South Korean Won
  PYG: 0, // Paraguayan Guaraní
  RWF: 0, // Rwandan Franc
  UGX: 0, // Ugandan Shilling
  VND: 0, // Vietnamese Dong
  VUV: 0, // Vanuatu Vatu
  XAF: 0, // Central African CFA Franc
  XOF: 0, // West African CFA Franc
  XPF: 0, // CFP Franc

  // Three decimal places
  BHD: 3, // Bahraini Dinar
  IQD: 3, // Iraqi Dinar
  JOD: 3, // Jordanian Dinar
  KWD: 3, // Kuwaiti Dinar
  LYD: 3, // Libyan Dinar
  OMR: 3, // Omani Rial
  TND: 3, // Tunisian Dinar

  // Four decimal places (very rare, mainly for crypto)
  CLF: 4, // Chilean Unit of Account

  // All other currencies default to 2 decimal places
};

/**
 * Get the number of minor units (decimal places) for a currency
 *
 * @param currencyCode - ISO 4217 currency code (e.g., 'USD', 'JPY', 'EUR')
 * @returns Number of decimal places for the currency (default: 2)
 *
 * @example
 * getCurrencyMinorUnits('USD') // returns 2
 * getCurrencyMinorUnits('JPY') // returns 0
 * getCurrencyMinorUnits('BHD') // returns 3
 */
export const getCurrencyMinorUnits = (currencyCode: string): number => {
  const upperCode = currencyCode.toUpperCase();
  return CURRENCY_MINOR_UNITS[upperCode] ?? 2; // Default to 2 decimal places
};

/**
 * Get the divisor/multiplier for converting between major and minor units
 *
 * @param currencyCode - ISO 4217 currency code
 * @returns The divisor (10^minorUnits) for the currency
 *
 * @example
 * getCurrencyDivisor('USD') // returns 100 (10^2)
 * getCurrencyDivisor('JPY') // returns 1 (10^0)
 * getCurrencyDivisor('BHD') // returns 1000 (10^3)
 */
export const getCurrencyDivisor = (currencyCode: string): number => {
  const minorUnits = getCurrencyMinorUnits(currencyCode);
  return Math.pow(10, minorUnits);
};

/**
 * Convert from major units to minor units
 *
 * @param amount - Amount in major units (e.g., 100.67 USD)
 * @param currencyCode - ISO 4217 currency code
 * @returns Amount in minor units (e.g., 10067 cents for USD)
 *
 * @example
 * convertToMinorUnits(100.67, 'USD') // returns 10067
 * convertToMinorUnits(12345, 'JPY') // returns 12345
 * convertToMinorUnits(1.234, 'BHD') // returns 1234
 */
export const convertToMinorUnits = (amount: number, currencyCode: string): number => {
  const divisor = getCurrencyDivisor(currencyCode);
  return Math.round(amount * divisor);
};

/**
 * Convert from minor units to major units
 *
 * @param amount - Amount in minor units (e.g., 10067 cents)
 * @param currencyCode - ISO 4217 currency code
 * @returns Amount in major units (e.g., 100.67 USD)
 *
 * @example
 * convertToMajorUnits(10067, 'USD') // returns 100.67
 * convertToMajorUnits(12345, 'JPY') // returns 12345
 * convertToMajorUnits(1234, 'BHD') // returns 1.234
 */
export const convertToMajorUnits = (amount: number, currencyCode: string): number => {
  const divisor = getCurrencyDivisor(currencyCode);
  return amount / divisor;
};
