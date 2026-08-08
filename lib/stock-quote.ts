// Live stock-quote fetch+cache, mirroring lib/fx-rate.ts's defensive style (never throws,
// null-safe) but WITHOUT a last-resort default value — unlike an FX rate, there's no sensible
// constant to fall back to for an arbitrary stock's price, so `null` ("no live data") is the
// correct terminal state here, not a guessed number.
//
// Two layers, because Yahoo's endpoint sends no Access-Control-Allow-Origin header (confirmed via
// a direct header check) — a direct browser fetch() to query*.finance.yahoo.com is CORS-blocked
// even though curl/server-to-server calls succeed. The actual Yahoo call must happen server-side,
// behind our own Route Handler (app/stock-quote/[ticker]/route.ts):
//   - resolveStockQuote(ticker, isIsraeli) — SERVER-SIDE ONLY, called by the Route Handler. Talks
//     to Yahoo directly, implements the .TA/bare fallback in whichever order isIsraeli suggests.
//   - getStockQuote(ticker, isIsraeli) — CLIENT-SIDE, called by <StockQuote>. Talks to OUR OWN
//     /stock-quote/{ticker} route (same-origin, no CORS issue) and owns the 60s in-memory cache.

import type { Currency } from "@/lib/currency";

export type StockQuote = {
  price: number; // already ILA->NIS converted where relevant; native currency of the listing
  changePercent: number; // daily % change, e.g. 1.23 or -0.6 (sign, not pre-formatted)
  currency: Currency;
};

const YAHOO_CHART_URL = (symbol: string) =>
  `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`;

// "Live" data - much shorter than fx-rate's 12h (daily-updating FX). In-memory only (a Map, not
// localStorage): no need to persist a live price across reloads/sessions.
export const STOCK_QUOTE_CACHE_TTL_MS = 60 * 1000;

// Tel Aviv Stock Exchange (.TA-suffixed symbols) quotes in Agorot ("ILA"), not shekels - e.g.
// ELAL.TA returning regularMarketPrice: 1629.0 means NIS 16.29, not NIS 1629. Divide by 100.
// US-listed symbols return "USD" at face value, no conversion.
function normalizePrice(rawPrice: number, rawCurrency: string): number {
  return rawCurrency === "ILA" ? rawPrice / 100 : rawPrice;
}

// Pure parser — handles the ILA->NIS conversion, extracts price/changePercent/currency, and never
// throws: returns null for the documented error shape ({chart:{result:null,error:{...}}}), any
// other malformed shape, or an unrecognized currency.
export function parseYahooChartResponse(json: unknown): StockQuote | null {
  try {
    const result = (json as { chart?: { result?: unknown[] | null } })?.chart?.result?.[0] as
      | { meta?: Record<string, unknown> }
      | undefined;
    const meta = result?.meta;
    if (!meta) return null;

    const rawCurrency = meta.currency;
    if (rawCurrency !== "USD" && rawCurrency !== "ILA") return null;

    const rawPrice = meta.regularMarketPrice;
    const rawPreviousClose = meta.previousClose;
    if (typeof rawPrice !== "number" || typeof rawPreviousClose !== "number") return null;
    if (rawPreviousClose === 0) return null; // avoid dividing by zero on a degenerate response

    const price = normalizePrice(rawPrice, rawCurrency);
    const previousClose = normalizePrice(rawPreviousClose, rawCurrency);
    const changePercent = ((price - previousClose) / previousClose) * 100;

    if (!Number.isFinite(price) || !Number.isFinite(changePercent)) return null;

    return { price, changePercent, currency: rawCurrency === "ILA" ? "ILS" : "USD" };
  } catch {
    return null;
  }
}

async function fetchYahooQuote(symbol: string): Promise<StockQuote | null> {
  try {
    const res = await fetch(YAHOO_CHART_URL(symbol), { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return parseYahooChartResponse(json);
  } catch {
    return null;
  }
}

// SERVER-SIDE ONLY (called from app/stock-quote/[ticker]/route.ts) — talks to Yahoo directly.
// isIsraeli picks which form to try first; either way, falls back to the other form on a 404, so
// a misclassified holding still resolves. Never throws.
export async function resolveStockQuote(
  ticker: string,
  isIsraeli: boolean,
): Promise<StockQuote | null> {
  const first = isIsraeli ? `${ticker}.TA` : ticker;
  const second = isIsraeli ? ticker : `${ticker}.TA`;
  const firstQuote = await fetchYahooQuote(first);
  if (firstQuote) return firstQuote;
  return fetchYahooQuote(second);
}

type CacheEntry = { quote: StockQuote | null; fetchedAt: number };
const cache = new Map<string, CacheEntry>();

// CLIENT-SIDE — used by components/ui/StockQuote.tsx. Cached-if-fresh, else fetch our own
// same-origin route, else null. Never throws.
export async function getStockQuote(
  ticker: string,
  isIsraeli: boolean,
): Promise<StockQuote | null> {
  const cacheKey = `${ticker}:${isIsraeli}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < STOCK_QUOTE_CACHE_TTL_MS) {
    return cached.quote;
  }

  let quote: StockQuote | null = null;
  try {
    const res = await fetch(`/stock-quote/${encodeURIComponent(ticker)}?israeli=${isIsraeli}`);
    if (res.ok) quote = await res.json();
  } catch {
    quote = null;
  }

  cache.set(cacheKey, { quote, fetchedAt: Date.now() });
  return quote;
}

// Test-only: the cache above is in-memory module state, so tests need an explicit way to reset it
// between cases.
export function resetStockQuoteCache(): void {
  cache.clear();
}
