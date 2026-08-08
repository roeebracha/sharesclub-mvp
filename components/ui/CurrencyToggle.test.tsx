import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CurrencyToggle } from "./CurrencyToggle";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { CURRENCY_STORAGE_KEY } from "@/lib/currency";

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ rates: { USD: 0.333 } }) }),
  );
});
afterEach(() => vi.unstubAllGlobals());

describe("CurrencyToggle", () => {
  it("shows USD (the switch-to target) when nothing is stored (defaults to ILS)", async () => {
    render(
      <CurrencyProvider>
        <CurrencyToggle />
      </CurrencyProvider>,
    );
    expect(await screen.findByRole("button", { name: "Switch to USD" })).toBeInTheDocument();
  });

  it("shows ILS (the switch-to target) when USD is stored", async () => {
    localStorage.setItem(CURRENCY_STORAGE_KEY, "USD");
    render(
      <CurrencyProvider>
        <CurrencyToggle />
      </CurrencyProvider>,
    );
    expect(await screen.findByRole("button", { name: "Switch to ILS" })).toBeInTheDocument();
  });

  it("switches to USD on click and persists it to localStorage", async () => {
    render(
      <CurrencyProvider>
        <CurrencyToggle />
      </CurrencyProvider>,
    );
    const button = await screen.findByRole("button", { name: "Switch to USD" });
    fireEvent.click(button);
    expect(localStorage.getItem(CURRENCY_STORAGE_KEY)).toBe("USD");
    expect(screen.getByRole("button", { name: "Switch to ILS" })).toBeInTheDocument();
  });

  it("switches back to ILS on a second click", async () => {
    render(
      <CurrencyProvider>
        <CurrencyToggle />
      </CurrencyProvider>,
    );
    const first = await screen.findByRole("button", { name: "Switch to USD" });
    fireEvent.click(first);
    fireEvent.click(screen.getByRole("button", { name: "Switch to ILS" }));
    expect(localStorage.getItem(CURRENCY_STORAGE_KEY)).toBe("ILS");
    expect(screen.getByRole("button", { name: "Switch to USD" })).toBeInTheDocument();
  });
});
