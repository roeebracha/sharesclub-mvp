import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { LiveHoldingsPanel } from "./LiveHoldingsPanel";
import { resetStockQuoteCache } from "@/lib/stock-quote";
import type { Company, Holding } from "@/lib/domain/eligibility";

const companies: Company[] = [
  { id: "c1", name: "Aurora Airlines", ticker: "AURA", sector: "aviation" },
];

function mockFetchResolved(body: unknown = { price: 10, changePercent: 1, currency: "ILS" }) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(body) }));
}

beforeEach(() => {
  resetStockQuoteCache();
  mockFetchResolved();
});
afterEach(() => vi.unstubAllGlobals());

describe("LiveHoldingsPanel", () => {
  it("shows an empty-state message when there are no holdings", () => {
    render(<LiveHoldingsPanel holdings={[]} companies={companies} />);
    expect(screen.getByText("No holdings yet.")).toBeInTheDocument();
  });

  it("renders one row per holding, resolving a catalog-matched holding's name from companies", async () => {
    const holdings: Holding[] = [
      { companyId: "c1", rawName: null, ticker: null, isIsraeli: true, percentage: 40 },
    ];
    render(<LiveHoldingsPanel holdings={holdings} companies={companies} />);
    expect(screen.getByText("Aurora Airlines")).toBeInTheDocument();
    await screen.findByText("₪10.00"); // wait out StockQuote's pending fetch before finishing
  });

  it("falls back to the imported file's raw name for an unmatched holding", async () => {
    const holdings: Holding[] = [
      { companyId: null, rawName: "ADV MICRO(AMD)", ticker: "AMD", isIsraeli: false, percentage: 25 },
    ];
    render(<LiveHoldingsPanel holdings={holdings} companies={companies} />);
    expect(screen.getByText("ADV MICRO(AMD)")).toBeInTheDocument();
    await screen.findByText("₪10.00"); // wait out StockQuote's pending fetch before finishing
  });

  it("shows a muted placeholder, without fetching, for a holding with no ticker at all", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const holdings: Holding[] = [
      { companyId: null, rawName: null, ticker: null, isIsraeli: false, percentage: 10 },
    ];
    render(<LiveHoldingsPanel holdings={holdings} companies={companies} />);
    expect(screen.getByText("Unknown")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("treats a catalog-matched holding as Israeli regardless of the holding's own flag", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve({ price: 10, changePercent: 1, currency: "ILS" }) });
    vi.stubGlobal("fetch", fetchMock);
    // isIsraeli: false on the row itself — should still be overridden to true by the company match.
    const holdings: Holding[] = [
      { companyId: "c1", rawName: null, ticker: null, isIsraeli: false, percentage: 40 },
    ];
    render(<LiveHoldingsPanel holdings={holdings} companies={companies} />);
    await screen.findByText("Aurora Airlines");
    expect(fetchMock).toHaveBeenCalledWith("/stock-quote/AURA?israeli=true");
  });

  it("passes the holding's own isIsraeli flag through for an unmatched holding", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve({ price: 10, changePercent: 1, currency: "USD" }) });
    vi.stubGlobal("fetch", fetchMock);
    const holdings: Holding[] = [
      { companyId: null, rawName: "AMD Inc.", ticker: "AMD", isIsraeli: false, percentage: 10 },
    ];
    render(<LiveHoldingsPanel holdings={holdings} companies={companies} />);
    await screen.findByText("AMD Inc.");
    expect(fetchMock).toHaveBeenCalledWith("/stock-quote/AMD?israeli=false");
  });
});
