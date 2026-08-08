import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { CurrencyProvider, useCurrency } from "./CurrencyProvider";
import { CURRENCY_STORAGE_KEY } from "@/lib/currency";

function Consumer() {
  const { currency, usdPerIls, setCurrency } = useCurrency();
  return (
    <div>
      <span data-testid="currency">{currency}</span>
      <span data-testid="rate">{usdPerIls}</span>
      <button onClick={() => setCurrency("USD")}>set-usd</button>
    </div>
  );
}

function mockFetchResolved(rate: number) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ rates: { USD: rate } }) }),
  );
}

beforeEach(() => {
  localStorage.clear();
  mockFetchResolved(0.333);
});
afterEach(() => vi.unstubAllGlobals());

describe("CurrencyProvider", () => {
  it("defaults to ILS when nothing is stored", async () => {
    render(
      <CurrencyProvider>
        <Consumer />
      </CurrencyProvider>,
    );
    await waitFor(() => expect(screen.getByTestId("currency")).toHaveTextContent("ILS"));
  });

  it("resolves the stored currency on mount", async () => {
    localStorage.setItem(CURRENCY_STORAGE_KEY, "USD");
    render(
      <CurrencyProvider>
        <Consumer />
      </CurrencyProvider>,
    );
    await waitFor(() => expect(screen.getByTestId("currency")).toHaveTextContent("USD"));
  });

  it("fetches and applies the live USD-per-ILS rate on mount", async () => {
    mockFetchResolved(0.4);
    render(
      <CurrencyProvider>
        <Consumer />
      </CurrencyProvider>,
    );
    await waitFor(() => expect(screen.getByTestId("rate")).toHaveTextContent("0.4"));
  });

  it("falls back to DEFAULT_USD_PER_ILS without throwing when the fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    render(
      <CurrencyProvider>
        <Consumer />
      </CurrencyProvider>,
    );
    await waitFor(() => expect(screen.getByTestId("rate")).toHaveTextContent("0.333"));
  });

  it("setCurrency updates state and persists the choice to localStorage", async () => {
    render(
      <CurrencyProvider>
        <Consumer />
      </CurrencyProvider>,
    );
    await waitFor(() => expect(screen.getByTestId("currency")).toHaveTextContent("ILS"));
    fireEvent.click(screen.getByRole("button", { name: "set-usd" }));
    expect(screen.getByTestId("currency")).toHaveTextContent("USD");
    expect(localStorage.getItem(CURRENCY_STORAGE_KEY)).toBe("USD");
  });
});
