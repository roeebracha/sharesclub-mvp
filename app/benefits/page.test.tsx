import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BenefitsPage from "@/app/benefits/page";
import { benefitProgress, israeliExposure } from "@/lib/domain/eligibility";
import { benefits, companies, tiers, demoUser } from "@/lib/test-utils/fixtures";

// canvas-confetti touches the DOM/canvas; it's only called on click, but stub
// it so importing the page never trips over jsdom's missing canvas support.
vi.mock("canvas-confetti", () => ({ default: vi.fn() }));

vi.mock("@/features/benefits/data/catalog-client", () => ({
  getCompanies: vi.fn(() => Promise.resolve(companies)),
  getBenefits: vi.fn(() => Promise.resolve(benefits)),
  getMembershipTiers: vi.fn(() => Promise.resolve(tiers)),
}));

vi.mock("@/features/portfolio/data/holdings", () => ({
  getHoldings: vi.fn(() => Promise.resolve(demoUser.holdings)),
  getPortfolioWorth: vi.fn(() => Promise.resolve(demoUser.portfolioWorth)),
}));

describe("BenefitsPage", () => {
  it("groups benefits into ready-to-claim and locked sections", async () => {
    render(<BenefitsPage />);
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
    render(<BenefitsPage />);
    const beautyBox = benefits.find((b) => b.id === "b6")!; // Platinum-gated
    const p = benefitProgress(
      beautyBox,
      demoUser.portfolioWorth,
      tiers,
      israeliExposure(demoUser.holdings),
    );
    const amount = Math.round(p.amountToRequiredTier).toLocaleString();

    // Same recursive-textContent workaround as BenefitProgressSummary.test.tsx —
    // the amount lives in a nested <CurrencyAmount> <span>.
    expect(
      await screen.findByText(
        (_content, element) =>
          !!element?.textContent?.includes("more in portfolio value") &&
          !!element?.textContent?.includes(amount),
        { selector: "p" },
      ),
    ).toBeInTheDocument();
  });

  it("filters the feed by sector", async () => {
    render(<BenefitsPage />);
    await screen.findByText("10% off any flight");

    fireEvent.click(await screen.findByRole("button", { name: "Aviation" }));

    expect(await screen.findByText("10% off any flight")).toBeInTheDocument();
    expect(screen.queryByText("Free drink every visit")).not.toBeInTheDocument();
  });

  it("offers a share-your-progress action", async () => {
    render(<BenefitsPage />);
    expect(await screen.findByRole("button", { name: "Share your progress" })).toBeInTheDocument();
  });
});
