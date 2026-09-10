export type ValueType = 'integer' | 'decimal' | 'percentage' | 'currency' | 'duration' | 'count';

interface FormatOptions {
  locale: string;
  valueType: ValueType;
  unit?: string;
  precision?: number;
}

export function formatStatisticValue(value: number, options: FormatOptions): string {
  const { locale, valueType, unit, precision = 0 } = options;

  switch (valueType) {
    case 'percentage':
      return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(value / 100);

    case 'currency':
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: unit || 'EUR',
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(value);

    case 'decimal':
      return new Intl.NumberFormat(locale, {
        style: 'decimal',
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(value);

    case 'integer':
    case 'count':
      return new Intl.NumberFormat(locale, {
        style: 'decimal',
        maximumFractionDigits: 0,
      }).format(value);

    case 'duration':
      // Basic implementation for duration if unit is provided (e.g. 'ms', 's', 'm', 'h')
      const formattedNum = new Intl.NumberFormat(locale, {
        style: 'decimal',
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(value);
      return unit ? `${formattedNum} ${unit}` : formattedNum;

    default:
      return String(value);
  }
}

/**
 * Formats a price value provided in minor units (e.g. 9900 for 99.00 EUR).
 * Uses Intl.NumberFormat to determine the correct fraction digits for the currency.
 */
export function formatMinorAmount(minorAmount: number, currency: string, locale: string): string {
  if (!Number.isInteger(minorAmount) || minorAmount < 0) {
    throw new Error('minorAmount must be a positive integer');
  }

  const fractionDigits = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).resolvedOptions().maximumFractionDigits ?? 2;

  const divisor = 10 ** fractionDigits;
  const majorAmount = minorAmount / divisor;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(majorAmount);
}
