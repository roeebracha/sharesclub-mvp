import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PortfolioDonut } from "@/features/portfolio/components/PortfolioDonut";
import type { Company, Holding } from "@/lib/domain/eligibility";

const companies: Company[] = [
  { id: "c1", name: "Aurora Airlines", ticker: "AURA", sector: "aviation" },
];
const holdings: Holding[] = [
  { companyId: "c1", rawName: null, ticker: null, isIsraeli: true, percentage: 40 },
];

describe("PortfolioDonut", () => {
  it("shows the portfolio total by default", () => {
    render(<PortfolioDonut holdings={holdings} companies={companies} portfolioWorth={10000} />);
    expect(screen.getByText("Portfolio")).toBeInTheDocument();
    // portfolioWorth is always ₪ data; the previous hardcoded "$" here was
    // asserting a display bug (see PortfolioDonut.tsx), not real behavior.
    expect(screen.getByText("₪10,000")).toBeInTheDocument();
  });

  it("tap reveals the same info a hover would (touch has no hover) and tapping again clears it", () => {
    render(<PortfolioDonut holdings={holdings} companies={companies} portfolioWorth={10000} />);
    const slice = screen.getByTestId("donut-slice-AURA");

    fireEvent.click(slice);
    expect(screen.getByText("AURA")).toBeInTheDocument();
    expect(screen.getByText("40%")).toBeInTheDocument();
    expect(screen.queryByText("Portfolio")).not.toBeInTheDocument();

    fireEvent.click(slice);
    expect(screen.getByText("Portfolio")).toBeInTheDocument();
    expect(screen.queryByText("AURA")).not.toBeInTheDocument();
  });

  it("falls back to the imported file's raw ticker for an unmatched holding, not 'Unknown'", () => {
    const unmatched: Holding[] = [
      { companyId: null, rawName: "ADV MICRO(AMD)", ticker: "AMD", isIsraeli: false, percentage: 25 },
    ];
    render(<PortfolioDonut holdings={unmatched} companies={companies} portfolioWorth={1000} />);
    fireEvent.click(screen.getByTestId("donut-slice-AMD"));
    expect(screen.getByText("AMD")).toBeInTheDocument();
  });

  it("falls back to '—' only when neither a company match nor a raw ticker exists", () => {
    const noTicker: Holding[] = [
      { companyId: null, rawName: null, ticker: null, isIsraeli: false, percentage: 10 },
    ];
    render(<PortfolioDonut holdings={noTicker} companies={companies} portfolioWorth={1000} />);
    fireEvent.click(screen.getByTestId("donut-slice-—"));
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
