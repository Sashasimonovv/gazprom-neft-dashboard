import { exchangeRatesData } from '../data/data';
import type { CurrencyCode, RatePoint } from '../types/rates';

const RATES_API_URL = process.env.REACT_APP_RATES_API_URL;

const CURRENCY_CODES: CurrencyCode[] = ['USD', 'EUR', 'CNY'];

function normalizeApiRow(row: unknown): RatePoint | null {
  if (!row || typeof row !== 'object') return null;
  const o = row as Record<string, unknown>;
  if (typeof o.date !== 'string') return null;

  if (o.rates && typeof o.rates === 'object' && o.rates !== null) {
    const rates = o.rates as Record<string, unknown>;
    const nums = CURRENCY_CODES.map((code) => {
      const v = rates[code] ?? rates[code.toLowerCase()];
      return typeof v === 'number' ? v : null;
    });
    if (nums.every((n) => n !== null)) {
      return { date: o.date, rates: { USD: nums[0]!, EUR: nums[1]!, CNY: nums[2]! } };
    }
  }

  const USD = o.USD ?? o.usd;
  const EUR = o.EUR ?? o.eur;
  const CNY = o.CNY ?? o.cny;
  if (typeof USD === 'number' && typeof EUR === 'number' && typeof CNY === 'number') {
    return { date: o.date, rates: { USD, EUR, CNY } };
  }

  return null;
}

function parseRatesArray(data: unknown): RatePoint[] | null {
  if (!Array.isArray(data)) return null;
  const out: RatePoint[] = [];
  for (const row of data) {
    const p = normalizeApiRow(row);
    if (!p) return null;
    out.push(p);
  }
  return out;
}

function sortByDate(points: RatePoint[]): RatePoint[] {
  return [...points].sort((a, b) => a.date.localeCompare(b.date));
}

export async function fetchRates(): Promise<{ data: RatePoint[]; fromApi: boolean }> {
  if (!RATES_API_URL) {
    return { data: sortByDate(exchangeRatesData), fromApi: false };
  }

  const response = await fetch(RATES_API_URL, { method: 'GET' });
  if (!response.ok) {
    throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
  }

  const json: unknown = await response.json();
  const parsed = parseRatesArray(json);
  if (!parsed) {
    throw new Error('Неверный формат ответа API');
  }

  return { data: sortByDate(parsed), fromApi: true };
}
