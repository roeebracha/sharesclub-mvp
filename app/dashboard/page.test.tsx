import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardPage from "./page";

vi.mock("@/features/benefits/data/catalog-client", () => ({
  getCompanies: vi.fn().mockResolvedValue([]),
}));
vi.mock("@/features/portfolio/data/holdings", () => ({
  getHoldings: vi.fn().mockResolvedValue([]),
  getPortfolioWorth: vi.fn().mockResolvedValue(12345),
  setPortfolioWorth: vi.fn(),
  addHolding: vi.fn(),
  updateHolding: vi.fn(),
  deleteHolding: vi.fn(),
}));

describe("DashboardPage", () => {
  it("labels the portfolio-worth input with ₪, not $ (entry is always ILS)", async () => {
    render(<DashboardPage />);
    expect(await screen.findByText("₪")).toBeInTheDocument();
    expect(screen.queryByText("$")).not.toBeInTheDocument();
  });

  it("shows the currently-saved portfolio worth formatted as a currency amount", async () => {
    render(<DashboardPage />);
    expect(await screen.findByText("₪12,345")).toBeInTheDocument();
  });
});
