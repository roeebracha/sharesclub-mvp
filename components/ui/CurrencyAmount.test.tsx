import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CurrencyAmount } from "./CurrencyAmount";
import { CurrencyContext } from "@/components/CurrencyProvider";

describe("CurrencyAmount", () => {
  it("renders the ILS-formatted amount using the default context (no provider needed)", () => {
    render(<CurrencyAmount amountILS={12345} />);
    expect(screen.getByText("₪12,345")).toBeInTheDocument();
  });

  it("renders the USD-converted amount when the context provides USD", () => {
    render(
      <CurrencyContext.Provider value={{ currency: "USD", usdPerIls: 0.3, setCurrency: () => {} }}>
        <CurrencyAmount amountILS={10000} />
      </CurrencyContext.Provider>,
    );
    expect(screen.getByText("$3,000")).toBeInTheDocument();
  });

  it("rounds to the nearest whole unit", () => {
    render(<CurrencyAmount amountILS={12345.6} />);
    expect(screen.getByText("₪12,346")).toBeInTheDocument();
  });

  it("applies a passed className to the rendered span", () => {
    render(<CurrencyAmount amountILS={100} className="text-lg" />);
    expect(screen.getByText("₪100")).toHaveClass("text-lg");
  });
});
