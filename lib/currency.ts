export type Currency = "ILS" | "USD";

export const DEFAULT_CURRENCY: Currency = "ILS";
export const CURRENCY_STORAGE_KEY = "displayCurrency";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  ILS: "₪",
  USD: "$",
};

export function resolveCurrency(stored: string | null): Currency {
  if (stored === "ILS" || stored === "USD") return stored;
  return DEFAULT_CURRENCY;
}

export function convertFromILS(amountILS: number, currency: Currency, usdPerIls: number): number {
  return currency === "USD" ? amountILS * usdPerIls : amountILS;
}

export function formatAmount(amountILS: number, currency: Currency, usdPerIls: number): string {
  const converted = convertFromILS(amountILS, currency, usdPerIls);
  return `${CURRENCY_SYMBOLS[currency]}${Math.round(converted).toLocaleString()}`;
}
