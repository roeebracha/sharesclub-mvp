import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BenefitStockTicker } from "./BenefitStockTicker";
import { resetStockQuoteCache } from "@/lib/stock-quote";

function mockFetchResolved(body: unknown, ok = true) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok, json: () => Promise.resolve(body) }));
}

beforeEach(() => resetStockQuoteCache());
afterEach(() => vi.unstubAllGlobals());

describe("BenefitStockTicker", () => {
  it("renders nothing while the quote is still loading", () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {}))); // never resolves
    const { container } = render(<BenefitStockTicker ticker="ELAL" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the .TA-suffixed ticker once a live quote confirms it's really traded", async () => {
    mockFetchResolved({ price: 16.29, changePercent: 0.5, currency: "ILS" });
    render(<BenefitStockTicker ticker="ELAL" />);
    expect(await screen.findByText("ELAL.TA")).toBeInTheDocument();
  });

  it("renders nothing when the quote resolves to null (not actually publicly traded)", async () => {
    mockFetchResolved(null);
    const { container } = render(<BenefitStockTicker ticker="ARKIA" />);
    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });
});
