import getSymbolFromCurrency from 'currency-symbol-map';
import { convertToMajorUnits, getCurrencyMinorUnits } from './currency';

export const formatMoney = (amount: number, currencyCode: string) => {
  const majorUnitsAmount = convertToMajorUnits(amount, currencyCode);
  const currencySymbol = getSymbolFromCurrency(currencyCode);
  const minorUnits = getCurrencyMinorUnits(currencyCode);

  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: minorUnits,
  })
    .format(majorUnitsAmount)
    .replace(/,/g, ' '); // Replace comma thousands separator with space

  return `${formattedNumber}${currencySymbol}`;
};
