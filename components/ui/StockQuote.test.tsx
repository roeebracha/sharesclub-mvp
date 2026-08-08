import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { StockQuote } from "./StockQuote";
import { resetStockQuoteCache } from "@/lib/stock-quote";

function mockFetchResolved(body: unknown, ok = true) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok, json: () => Promise.resolve(body) }));
}

beforeEach(() => resetStockQuoteCache());
afterEach(() => vi.unstubAllGlobals());

describe("StockQuote", () => {
  it("renders the placeholder while the quote is loading", () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {}))); // never resolves
    render(<StockQuote ticker="ELAL" isIsraeli />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renders the formatted price and change once resolved", async () => {
    mockFetchResolved({ price: 303, changePercent: 1, currency: "USD" });
    render(<StockQuote ticker="WIX" isIsraeli={false} />);
    expect(await screen.findByText("$303.00")).toBeInTheDocument();
    expect(await screen.findByText("+1.0%")).toBeInTheDocument();
  });

  it("renders the placeholder when the quote resolves to null", async () => {
    mockFetchResolved(null);
    render(<StockQuote ticker="ARKIA" isIsraeli />);
    expect(await screen.findByText("—")).toBeInTheDocument();
  });

  it("colors a positive change with text-success", async () => {
    mockFetchResolved({ price: 303, changePercent: 1, currency: "USD" });
    render(<StockQuote ticker="WIX" isIsraeli={false} />);
    expect(await screen.findByText("+1.0%")).toHaveClass("text-success");
  });

  it("colors a negative change with text-danger, with a minus sign", async () => {
    mockFetchResolved({ price: 304, changePercent: -5, currency: "USD" });
    render(<StockQuote ticker="ELAL" isIsraeli />);
    expect(await screen.findByText("-5.0%")).toHaveClass("text-danger");
  });

  it("passes the isIsraeli prop through to the fetched URL as the israeli query param", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ price: 16.29, changePercent: 0.5, currency: "ILS" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<StockQuote ticker="ELAL" isIsraeli={false} />);
    await screen.findByText("₪16.29");
    expect(fetchMock).toHaveBeenCalledWith("/stock-quote/ELAL?israeli=false");
  });
});
