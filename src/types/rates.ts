export type CurrencyCode = 'USD' | 'EUR' | 'CNY';

export type RatePoint = {
  date: string;
  rates: Record<CurrencyCode, number>;
};
