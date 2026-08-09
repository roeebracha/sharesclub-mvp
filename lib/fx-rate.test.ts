import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getUsdPerIls,
  DEFAULT_USD_PER_ILS,
  FX_RATE_CACHE_KEY,
  FX_RATE_STALE_MS,
  getFxRates,
  DEFAULT_EUR_PER_ILS,
  FX_RATES_CACHE_KEY,
} from "./fx-rate";

function mockFetchResolved(body: unknown, ok = true) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok, json: () => Promise.resolve(body) }));
}

function mockFetchRejected(error: unknown = new Error("network down")) {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(error));
}

function seedCache(rate: number, ageMs: number) {
  localStorage.setItem(
    FX_RATE_CACHE_KEY,
    JSON.stringify({ rate, fetchedAt: Date.now() - ageMs }),
  );
}

beforeEach(() => localStorage.clear());
afterEach(() => vi.unstubAllGlobals());

describe("getUsdPerIls", () => {
  it("returns the cached rate without calling fetch when the cache is fresh", async () => {
    seedCache(0.31, 1000);
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    expect(await getUsdPerIls()).toBe(0.31);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("fetches and caches a live rate when there is no cache", async () => {
    mockFetchResolved({ amount: 1, base: "ILS", date: "2026-08-07", rates: { USD: 0.333 } });
    expect(await getUsdPerIls()).toBe(0.333);
    expect(JSON.parse(localStorage.getItem(FX_RATE_CACHE_KEY)!).rate).toBe(0.333);
  });

  it("re-fetches when the cache is older than the staleness window", async () => {
    seedCache(0.2, FX_RATE_STALE_MS + 1);
    mockFetchResolved({ rates: { USD: 0.35 } });
    expect(await getUsdPerIls()).toBe(0.35);
  });

  it("falls back to a stale cached rate when the live fetch fails", async () => {
    seedCache(0.29, FX_RATE_STALE_MS + 1);
    mockFetchRejected();
    expect(await getUsdPerIls()).toBe(0.29);
  });

  it("falls back to DEFAULT_USD_PER_ILS when there is no cache and the fetch fails", async () => {
    mockFetchRejected();
    expect(await getUsdPerIls()).toBe(DEFAULT_USD_PER_ILS);
  });

  it("falls back to DEFAULT_USD_PER_ILS on a malformed response, without throwing", async () => {
    mockFetchResolved({ rates: {} });
    expect(await getUsdPerIls()).toBe(DEFAULT_USD_PER_ILS);
  });

  it("falls back to DEFAULT_USD_PER_ILS when the response is not ok", async () => {
    mockFetchResolved({ rates: { USD: 0.4 } }, false);
    expect(await getUsdPerIls()).toBe(DEFAULT_USD_PER_ILS);
  });

  it("never throws, even if fetch itself throws synchronously", async () => {
    vi.stubGlobal("fetch", () => {
      throw new Error("boom");
    });
    await expect(getUsdPerIls()).resolves.toBe(DEFAULT_USD_PER_ILS);
  });
});

describe("getFxRates", () => {
  it("fetches and caches both USD and EUR rates in one call", async () => {
    mockFetchResolved({ rates: { USD: 0.27, EUR: 0.25 } });
    expect(await getFxRates()).toEqual({ usdPerIls: 0.27, eurPerIls: 0.25 });
    expect(JSON.parse(localStorage.getItem(FX_RATES_CACHE_KEY)!)).toMatchObject({
      usdPerIls: 0.27,
      eurPerIls: 0.25,
    });
  });

  it("returns the cached rates without calling fetch when the cache is fresh", async () => {
    localStorage.setItem(
      FX_RATES_CACHE_KEY,
      JSON.stringify({ usdPerIls: 0.28, eurPerIls: 0.26, fetchedAt: Date.now() - 1000 }),
    );
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    expect(await getFxRates()).toEqual({ usdPerIls: 0.28, eurPerIls: 0.26 });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("falls back to the defaults when there is no cache and the fetch fails", async () => {
    mockFetchRejected();
    expect(await getFxRates()).toEqual({
      usdPerIls: DEFAULT_USD_PER_ILS,
      eurPerIls: DEFAULT_EUR_PER_ILS,
    });
  });

  it("falls back to the defaults on a malformed response (missing EUR)", async () => {
    mockFetchResolved({ rates: { USD: 0.27 } });
    expect(await getFxRates()).toEqual({
      usdPerIls: DEFAULT_USD_PER_ILS,
      eurPerIls: DEFAULT_EUR_PER_ILS,
    });
  });
});
