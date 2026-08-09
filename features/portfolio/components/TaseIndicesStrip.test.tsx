import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TaseIndicesStrip } from "./TaseIndicesStrip";
import { resetStockQuoteCache } from "@/lib/stock-quote";

function mockFetchResolved(body: unknown = { price: 4065.6, changePercent: 0.8, currency: "ILS" }) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(body) }));
}

beforeEach(() => {
  resetStockQuoteCache();
  mockFetchResolved();
});
afterEach(() => vi.unstubAllGlobals());

describe("TaseIndicesStrip", () => {
  it("shows a labeled row for both TA-125 and TA-35", async () => {
    render(<TaseIndicesStrip />);
    expect(screen.getByText("TA-125")).toBeInTheDocument();
    expect(screen.getByText("TA-35")).toBeInTheDocument();
    // Both rows resolve their live quote (same mocked value for simplicity here).
    // StockQuote formats via .toFixed(2), no thousands separator.
    const prices = await screen.findAllByText("₪4065.60");
    expect(prices).toHaveLength(2);
  });

  it("queries the real TASE index symbols, not raw unqualified tickers", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve({ price: 1, changePercent: 0, currency: "ILS" }) });
    vi.stubGlobal("fetch", fetchMock);
    render(<TaseIndicesStrip />);
    await screen.findByText("TA-125");
    expect(fetchMock).toHaveBeenCalledWith(`/stock-quote/${encodeURIComponent("^TA125")}?israeli=true`);
    expect(fetchMock).toHaveBeenCalledWith("/stock-quote/TA35?israeli=true");
  });
});
