import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "@/app/page";
import { benefitProgress } from "@/lib/eligibility";
import { benefits, companies, tiers, demoUser } from "@/lib/fixtures";

// canvas-confetti touches the DOM/canvas; it's only called on click, but stub
// it so importing the page never trips over jsdom's missing canvas support.
vi.mock("canvas-confetti", () => ({ default: vi.fn() }));

vi.mock("@/lib/catalog-data", () => ({
  getCompanies: vi.fn(() => Promise.resolve(companies)),
  getBenefits: vi.fn(() => Promise.resolve(benefits)),
  getMembershipTiers: vi.fn(() => Promise.resolve(tiers)),
}));

vi.mock("@/lib/holdings-data", () => ({
  getHoldings: vi.fn(() => Promise.resolve(demoUser.holdings)),
  getPortfolioWorth: vi.fn(() => Promise.resolve(demoUser.portfolioWorth)),
}));

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(() =>
    Promise.resolve({ id: "u1", email: "jane@example.com", name: "Jane" }),
  ),
}));

describe("Home", () => {
  it("shows a welcome greeting with the current user's name", async () => {
    render(<Home />);
    // Product renamed ShareClub -> SharesClub; assertion updated to match, not a code fix.
    expect(await screen.findByText("Welcome to SharesClub, Jane")).toBeInTheDocument();
  });

  it("groups benefits into ready-to-claim and locked sections", async () => {
    render(<Home />);
    expect(
      await screen.findByRole("heading", { name: /ready to claim/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /locked \/ almost there/i }),
    ).toBeInTheDocument();

    // demoUser ($25,000 -> Gold tier) is eligible for all Silver/Gold-gated
    // perks (AURA, BEAN, CSCO), locked out of the Platinum-gated one (SLST).
    expect(await screen.findByText("10% off any flight")).toBeInTheDocument();
    expect(screen.getByText("Free drink every visit")).toBeInTheDocument();
    expect(screen.getByText("20% off gear")).toBeInTheDocument();
  });

  it("shows tier-gap progress copy for a locked benefit", async () => {
    render(<Home />);
    const beautyBox = benefits.find((b) => b.id === "b6")!; // Platinum-gated
    const p = benefitProgress(beautyBox, demoUser.portfolioWorth, tiers);
    const amount = Math.round(p.amountToRequiredTier).toLocaleString();

    expect(
      await screen.findByText(
        (content) => content.includes("Platinum") && content.includes(amount),
      ),
    ).toBeInTheDocument();
  });

  it("filters the feed by sector", async () => {
    render(<Home />);
    await screen.findByText("10% off any flight");

    fireEvent.click(await screen.findByRole("button", { name: "Aviation" }));

    expect(await screen.findByText("10% off any flight")).toBeInTheDocument();
    expect(screen.queryByText("Free drink every visit")).not.toBeInTheDocument();
  });
});
