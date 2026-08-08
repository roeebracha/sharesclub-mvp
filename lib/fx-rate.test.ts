import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getUsdPerIls, DEFAULT_USD_PER_ILS, FX_RATE_CACHE_KEY, FX_RATE_STALE_MS } from "./fx-rate";

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
