# Currency Input Auto-Formatting Guide

## Overview

The currency input system now automatically formats user input based on the currency's decimal places (minor units) and optionally supports negative values.

## Features

### 1. **Auto-Formatting Based on Currency**
- **Thousands Separators**: Large numbers display with spaces (e.g., `1 234 567.89`)
- **USD, EUR, PLN** (2 decimals): User can enter `100.67`, but not `100.678`
- **JPY, KRW** (0 decimals): User can only enter whole numbers like `12 345`, decimals are automatically removed
- **BHD, KWD** (3 decimals): User can enter `1.234`, but not `1.2345`

### 2. **Negative Value Support**
- Optional `allowNegative` prop controls whether users can enter negative amounts
- When enabled, keyboard shows numbers-and-punctuation (includes +/- button)
- When disabled (default), keyboard shows decimal-pad (numbers and decimal point only)

### 3. **Input Validation**
- Real-time formatting prevents invalid input
- Form validation using Yup ensures data integrity
- Automatic removal of leading zeros
- Handles comma-to-dot conversion for regional formats

## Usage

### FormCurrencyInput Component

```tsx
import { FormCurrencyInput } from '@/components/ui/form/form-currency-input';

// Basic usage (positive values only, auto-formats based on currency)
<FormCurrencyInput
  label="Amount"
  amountValue={values.amount}
  currencyValue={values.currency}
  onAmountChange={handleChange('amount')}
  onAmountBlur={handleBlur('amount')}
  onCurrencyPress={handleOpenCurrencyPicker}
  hasError={!!(errors.amount && touched.amount)}
/>

// With negative values enabled
<FormCurrencyInput
  label="Transaction Amount"
  amountValue={values.amount}
  currencyValue={values.currency}
  onAmountChange={handleChange('amount')}
  onAmountBlur={handleBlur('amount')}
  onCurrencyPress={handleOpenCurrencyPicker}
  allowNegative={true}  // Enables +/- keyboard and negative input
  hasError={!!(errors.amount && touched.amount)}
/>
```

### Validation with Yup

```tsx
import { validateCurrencyAmount } from '@/tools/validation';

const validationSchema = Yup.object().shape({
  amount: Yup.string()
    .required('This field is required')
    .test('is-valid-amount', 'Amount must be a valid number', function (value) {
      if (!value) return false;

      const currency = this.parent.currency as string;
      const allowNegative = false; // Set to true if negative values are allowed

      return validateCurrencyAmount(value, currency, allowNegative);
    }),
});
```

### Manual Currency Formatting

```tsx
import { formatCurrencyInput, parseCurrencyInput } from '@/tools/input-formatters';

// Format user input with thousands separators
const formatted = formatCurrencyInput('1234567.89', 'USD', false);
// Result: '1 234 567.89' (thousands separated with spaces)

const formatted2 = formatCurrencyInput('100.678', 'USD', false);
// Result: '100.67' (limited to 2 decimals)

const formatted3 = formatCurrencyInput('12345.5', 'JPY', false);
// Result: '12 345' (no decimals for JPY, thousands separated)

const formatted4 = formatCurrencyInput('-100.50', 'USD', true);
// Result: '-100.50' (negative allowed)

const formatted5 = formatCurrencyInput('-100.50', 'USD', false);
// Result: '100.50' (negative removed)

// Parse formatted input back to number
const parsed = parseCurrencyInput('1 234 567.89');
// Result: 1234567.89

const parsed2 = parseCurrencyInput('12 345');
// Result: 12345
```

### Currency Conversion Utilities

```tsx
import { convertToMinorUnits, convertToMajorUnits } from '@/tools/currency';
import { parseCurrencyInput } from '@/tools/input-formatters';

// Parse formatted input and convert to minor units for API submission
const formattedAmount = '1 234.67'; // User input with formatting
const numericAmount = parseCurrencyInput(formattedAmount); // 1234.67
const minorUnits = convertToMinorUnits(numericAmount, 'USD');
// Result: 123467 (cents)

// Direct conversion examples
const minorUnits2 = convertToMinorUnits(100.67, 'USD');
// Result: 10067 (cents)

const minorUnits3 = convertToMinorUnits(12345, 'JPY');
// Result: 12345 (yen has no minor units)

// Convert from minor units for display
const majorUnits = convertToMajorUnits(10067, 'USD');
// Result: 100.67

const majorUnits2 = convertToMajorUnits(12345, 'JPY');
// Result: 12345
```

## Implementation Details

### New Files Created

1. **`/tools/currency.ts`** - Currency utility functions
   - `getCurrencyMinorUnits(currencyCode)` - Returns decimal places for currency
   - `getCurrencyDivisor(currencyCode)` - Returns conversion factor (10^minorUnits)
   - `convertToMinorUnits(amount, currencyCode)` - Converts major → minor units
   - `convertToMajorUnits(amount, currencyCode)` - Converts minor → major units

2. **`/tools/validation.ts`** - Validation helpers
   - `createCurrencyAmountPattern(currencyCode, allowNegative)` - Creates regex pattern
   - `validateCurrencyAmount(value, currencyCode, allowNegative)` - Validates amount string

### Updated Files

1. **`/tools/input-formatters.ts`**
   - Added `formatCurrencyInput()` - Auto-formats input based on currency and negative setting

2. **`/tools/money.tsx`**
   - Updated `formatMoney()` to use `convertToMajorUnits()` and dynamic decimal places

3. **`/components/ui/form/form-currency-input.tsx`**
   - Added `allowNegative` prop
   - Uses `formatCurrencyInput()` for real-time formatting
   - Dynamic keyboard type based on `allowNegative`

4. **`/app/(app)/(tabs)/overview/add-wallet.tsx`**
   - Updated to use `convertToMinorUnits()` for API submission
   - Updated validation to use `validateCurrencyAmount()`

## Supported Currencies

### Zero Decimal Places (0)
BIF, CLP, DJF, GNF, ISK, **JPY**, KMF, **KRW**, PYG, RWF, UGX, VND, VUV, XAF, XOF, XPF

### Two Decimal Places (2) - Default
**USD**, **EUR**, **PLN**, GBP, CAD, AUD, and most other currencies

### Three Decimal Places (3)
BHD, IQD, JOD, KWD, LYD, OMR, TND

### Four Decimal Places (4)
CLF (Chilean Unit of Account)

## Examples

### Example 1: Add Wallet (Positive Only)
```tsx
// User types: "1234567.89" with currency "USD"
// Input auto-formats to: "1 234 567.89" (with thousands separators)
// On submit, parses to: 1234567.89
// Converts to minor units: 123456789 (cents)
```

### Example 2: Small Amount
```tsx
// User types: "100.678" with currency "USD"
// Input auto-formats to: "100.67" (limited to 2 decimals)
// On submit, parses to: 100.67
// Converts to minor units: 10067 (cents)
```

### Example 3: Transaction (Negative Allowed)
```tsx
// User types: "-1500.12" with currency "EUR" and allowNegative=true
// Input auto-formats to: "-1 500.12" (negative with thousands separator)
// On submit, parses to: -1500.12
// Converts to minor units: -150012 (cents)
```

### Example 4: Japanese Yen (No Decimals)
```tsx
// User types: "12345.67" with currency "JPY"
// Input auto-formats to: "12 345" (decimals removed, thousands separated)
// On submit, parses to: 12345
// Converts to minor units: 12345 (yen has no minor units)
```

### Example 5: Bahraini Dinar (Three Decimals)
```tsx
// User types: "1.23456" with currency "BHD"
// Input auto-formats to: "1.234" (limited to 3 decimals)
// On submit, parses to: 1.234
// Converts to minor units: 1234 (fils)
```

### Example 6: Large Japanese Yen Amount
```tsx
// User types: "1234567" with currency "JPY"
// Input auto-formats to: "1 234 567" (with thousands separators)
// On submit, parses to: 1234567
// Converts to minor units: 1234567
```

## Testing the Implementation

1. **Test with USD** (2 decimals):
   - Enter `1234.567` → should format to `1 234.56` (thousands separator + decimal limit)
   - Enter `100.678` → should format to `100.67` (decimal limit)
   - Enter `100.6` → should keep as `100.6`
   - Enter `100.` → should keep as `100.`
   - Enter `10000` → should format to `10 000`

2. **Test with JPY** (0 decimals):
   - Enter `123456` → should format to `123 456` (thousands separator)
   - Enter `12345.5` → should format to `12 345` (decimals removed)
   - Enter `12345.` → should format to `12 345` (decimal point removed)
   - Decimal point should not appear

3. **Test with Negative** (allowNegative=true):
   - Enter `-1000` → should format to `-1 000`
   - Enter `-100.50` → should format to `-100.50`
   - Enter `-` → should keep as `-`
   - Keyboard should show +/- button

4. **Test Leading Zeros**:
   - Enter `00123` → should format to `123`
   - Enter `001234` → should format to `1 234`
   - Enter `0.50` → should keep as `0.50`

5. **Test Thousands Separators**:
   - Enter `1000000` → should format to `1 000 000`
   - Enter `1234567.89` → should format to `1 234 567.89`
   - Spaces should appear every 3 digits from the right

## Benefits

1. **Better UX**: Users get immediate feedback on valid input
2. **Prevents Errors**: Invalid formats are automatically corrected
3. **International Support**: Handles currencies with 0-4 decimal places
4. **Flexibility**: Optional negative value support for transactions
5. **Type Safety**: Full TypeScript support with proper types
6. **Validation**: Built-in validation helpers for Yup schemas
