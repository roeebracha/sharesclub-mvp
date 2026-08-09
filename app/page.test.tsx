import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { benefits, companies, tiers, demoUser } from "@/lib/test-utils/fixtures";

vi.mock("@/features/benefits/data/catalog-client", () => ({
  getCompanies: vi.fn(() => Promise.resolve(companies)),
  getBenefits: vi.fn(() => Promise.resolve(benefits)),
  getMembershipTiers: vi.fn(() => Promise.resolve(tiers)),
}));

vi.mock("@/features/portfolio/data/holdings", () => ({
  getHoldings: vi.fn(() => Promise.resolve(demoUser.holdings)),
  getPortfolioWorth: vi.fn(() => Promise.resolve(demoUser.portfolioWorth)),
}));

vi.mock("@/features/auth/data/auth", () => ({
  getCurrentUser: vi.fn(() =>
    Promise.resolve({ id: "u1", email: "jane@example.com", name: "Jane" }),
  ),
}));

describe("Home", () => {
  it("shows a welcome greeting with the current user's name", async () => {
    render(<Home />);
    expect(await screen.findByText("Welcome to SharesClub, Jane")).toBeInTheDocument();
  });

  it("no longer shows the benefits feed here — it moved to its own page (QA #10)", async () => {
    render(<Home />);
    await screen.findByText("Your portfolio, always in view.");
    expect(screen.queryByText("Ready to claim")).not.toBeInTheDocument();
    expect(screen.queryByText("10% off any flight")).not.toBeInTheDocument();
  });

  it("links to the Benefits page to claim perks", async () => {
    render(<Home />);
    const links = await screen.findAllByRole("link", { name: /benefits/i });
    expect(links.some((link) => link.getAttribute("href") === "/benefits")).toBe(true);
  });

  it("does not show the 'Connect my investments account' placeholder (Import page only)", async () => {
    render(<Home />);
    await screen.findByText("Your portfolio, always in view.");
    expect(screen.queryByText("Connect my investments account")).not.toBeInTheDocument();
  });
});
