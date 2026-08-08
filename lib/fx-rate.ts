// Client-only fetch+cache for the ILS->USD rate. ECB rates (behind
// api.frankfurter.dev) update once a day, so a 12h localStorage cache is
// plenty fresh — no server involvement, no new Route Handler.

const FRANKFURTER_URL = "https://api.frankfurter.dev/v1/latest?base=ILS&symbols=USD";

// Approximate fallback only — used if no cache exists yet AND the live fetch
// fails. Not kept in sync with the real rate; exists purely so a first-ever
// visit with no network never shows a broken/zero conversion.
export const DEFAULT_USD_PER_ILS = 0.333;

export const FX_RATE_CACHE_KEY = "fxRateUsdPerIls";
export const FX_RATE_STALE_MS = 12 * 60 * 60 * 1000; // 12 hours

type FxRateCache = { rate: number; fetchedAt: number };

function readCache(): FxRateCache | null {
  try {
    const raw = localStorage.getItem(FX_RATE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.rate !== "number" || typeof parsed?.fetchedAt !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(rate: number): void {
  try {
    const cache: FxRateCache = { rate, fetchedAt: Date.now() };
    localStorage.setItem(FX_RATE_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage can throw (private mode/quota) — rate still works this
    // session, it just won't be cached for next time.
  }
}

function isFresh(cache: FxRateCache): boolean {
  return Date.now() - cache.fetchedAt < FX_RATE_STALE_MS;
}

// Never throws / never blocks the UI: cached-if-fresh, else live fetch, else
// any cached value even if stale, else DEFAULT_USD_PER_ILS as a last resort.
export async function getUsdPerIls(): Promise<number> {
  const cache = readCache();
  if (cache && isFresh(cache)) return cache.rate;

  try {
    const res = await fetch(FRANKFURTER_URL);
    if (!res.ok) throw new Error(`Frankfurter API responded with ${res.status}`);
    const data = await res.json();
    const rate = data?.rates?.USD;
    if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) {
      throw new Error("Frankfurter API returned an unexpected shape");
    }
    writeCache(rate);
    return rate;
  } catch {
    return cache ? cache.rate : DEFAULT_USD_PER_ILS;
  }
}
