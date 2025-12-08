import getSymbolFromCurrency from 'currency-symbol-map';

export const formatMoney = (amount: number, currencyCode: string) => {
  const majorUnitsAmount = amount / 100; // TODO: add support for currencies with different number of minor units
  const currencySymbol = getSymbolFromCurrency(currencyCode);

  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
    .format(majorUnitsAmount)
    .replace(/,/g, ' '); // Replace comma thousands separator with space

  return `${formattedNumber}${currencySymbol}`;
};
