import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import {
  parseYahooChartResponse,
  resolveStockQuote,
  getStockQuote,
  resetStockQuoteCache,
  STOCK_QUOTE_CACHE_TTL_MS,
} from "./stock-quote";

const OK_ILA_BODY = {
  chart: {
    result: [
      {
        meta: {
          currency: "ILA",
          symbol: "ELAL.TA",
          regularMarketPrice: 1629.0,
          previousClose: 1620.0,
          longName: "El Al Israel Airlines Ltd.",
        },
      },
    ],
    error: null,
  },
};

const OK_USD_BODY = {
  chart: {
    result: [
      { meta: { currency: "USD", symbol: "WIX", regularMarketPrice: 303, previousClose: 300 } },
    ],
    error: null,
  },
};

// TASE index quotes (e.g. TA-125, TA-35) report "ILS" directly, unlike individual TASE-listed
// shares which report "ILA" (Agorot) — an index has no /100 quirk, it's a point value already in
// shekel-equivalent units.
const OK_ILS_INDEX_BODY = {
  chart: {
    result: [
      {
        meta: {
          currency: "ILS",
          symbol: "^TA125.TA",
          instrumentType: "INDEX",
          regularMarketPrice: 4065.6,
          previousClose: 4032.47,
        },
      },
    ],
    error: null,
  },
};

const NOT_FOUND_BODY = {
  chart: {
    result: null,
    error: { code: "Not Found", description: "No data found, symbol may be delisted" },
  },
};

function mockFetchResolved(body: unknown, ok = true) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok, json: () => Promise.resolve(body) }));
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("parseYahooChartResponse", () => {
  it("converts an ILA (Agorot) price to real shekels by dividing by 100", () => {
    const quote = parseYahooChartResponse(OK_ILA_BODY);
    expect(quote?.price).toBe(16.29);
    expect(quote?.currency).toBe("ILS");
    expect(quote?.changePercent).toBeCloseTo(0.5556, 3);
  });

  it("returns a USD price at face value, no conversion", () => {
    const quote = parseYahooChartResponse(OK_USD_BODY);
    expect(quote).toEqual({ price: 303, changePercent: 1, currency: "USD" });
  });

  it("returns an ILS index price at face value, no /100 conversion (unlike ILA shares)", () => {
    const quote = parseYahooChartResponse(OK_ILS_INDEX_BODY);
    expect(quote?.price).toBe(4065.6);
    expect(quote?.currency).toBe("ILS");
    expect(quote?.changePercent).toBeCloseTo(0.8218, 3);
  });

  it("returns null for the documented Not Found error shape", () => {
    expect(parseYahooChartResponse(NOT_FOUND_BODY)).toBeNull();
  });

  it("returns null for a malformed/unrecognized shape, without throwing", () => {
    expect(parseYahooChartResponse({})).toBeNull();
    expect(parseYahooChartResponse(null)).toBeNull();
    expect(parseYahooChartResponse("not json")).toBeNull();
    expect(
      parseYahooChartResponse({ chart: { result: [{ meta: { currency: "EUR" } }] } }),
    ).toBeNull();
  });
});

describe("resolveStockQuote", () => {
  it("when isIsraeli, tries the .TA-suffixed symbol first", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve(OK_ILA_BODY) });
    vi.stubGlobal("fetch", fetchMock);
    const quote = await resolveStockQuote("ELAL", true);
    expect(quote?.price).toBe(16.29);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("ELAL.TA");
  });

  it("when isIsraeli and .TA isn't found, falls back to the bare ticker", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(NOT_FOUND_BODY) }) // WIX.TA
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(OK_USD_BODY) }); // WIX
    vi.stubGlobal("fetch", fetchMock);
    const quote = await resolveStockQuote("WIX", true);
    expect(quote).toEqual({ price: 303, changePercent: 1, currency: "USD" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).not.toContain(".TA");
  });

  it("when not isIsraeli, tries the bare ticker first (e.g. an imported AMD position)", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve(OK_USD_BODY) });
    vi.stubGlobal("fetch", fetchMock);
    const quote = await resolveStockQuote("AMD", false);
    expect(quote).toEqual({ price: 303, changePercent: 1, currency: "USD" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).not.toContain(".TA");
  });

  it("when not isIsraeli and the bare ticker isn't found, falls back to .TA", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(NOT_FOUND_BODY) }) // bare
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(OK_ILA_BODY) }); // .TA
    vi.stubGlobal("fetch", fetchMock);
    const quote = await resolveStockQuote("ELAL", false);
    expect(quote?.currency).toBe("ILS");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toContain(".TA");
  });

  it("returns null when both attempts fail (e.g. ARKIA — not traded)", async () => {
    mockFetchResolved(NOT_FOUND_BODY);
    expect(await resolveStockQuote("ARKIA", true)).toBeNull();
  });

  it("never throws even if fetch itself rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    await expect(resolveStockQuote("IAI", true)).resolves.toBeNull();
  });
});

describe("getStockQuote", () => {
  beforeEach(() => resetStockQuoteCache());

  it("fetches from our own same-origin /stock-quote/{ticker} route with the israeli query param", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ price: 16.29, changePercent: 0.56, currency: "ILS" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    expect(await getStockQuote("ELAL", true)).toEqual({
      price: 16.29,
      changePercent: 0.56,
      currency: "ILS",
    });
    expect(fetchMock).toHaveBeenCalledWith("/stock-quote/ELAL?israeli=true");
  });

  it("passes israeli=false through for a known-foreign holding", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ price: 303, changePercent: 1, currency: "USD" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    await getStockQuote("AMD", false);
    expect(fetchMock).toHaveBeenCalledWith("/stock-quote/AMD?israeli=false");
  });

  it("returns null without throwing when our own route responds not-ok", async () => {
    mockFetchResolved({}, false);
    expect(await getStockQuote("ARKIA", true)).toBeNull();
  });

  it("returns the cached quote without calling fetch again within the 60s TTL", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ price: 303, changePercent: 1, currency: "USD" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    await getStockQuote("WIX", true);
    await getStockQuote("WIX", true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("re-fetches once the cache entry is older than the TTL", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ price: 303, changePercent: 1, currency: "USD" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    await getStockQuote("WIX", true);
    vi.advanceTimersByTime(STOCK_QUOTE_CACHE_TTL_MS + 1);
    await getStockQuote("WIX", true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("caches isIsraeli=true and isIsraeli=false separately for the same ticker", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ price: 303, changePercent: 1, currency: "USD" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    await getStockQuote("ELAL", true);
    await getStockQuote("ELAL", false);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("never throws even if fetch itself rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    await expect(getStockQuote("ELAL", true)).resolves.toBeNull();
  });
});
