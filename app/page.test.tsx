import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "@/app/page";
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

vi.mock("@/features/auth/data/auth", () => ({
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
    const p = benefitProgress(
      beautyBox,
      demoUser.portfolioWorth,
      tiers,
      israeliExposure(demoUser.holdings),
    );
    const amount = Math.round(p.amountToRequiredTier).toLocaleString();

    // Testing Library's getByText matcher only sees a node's *direct* text-node
    // children (not nested elements) via its `content` argument — the amount is
    // now rendered inside a nested <CurrencyAmount> <span>, so `content` alone
    // never contains it. Checking `element.textContent` (recursive) inside the
    // matcher instead is the documented workaround for text split across
    // multiple elements (same fix already applied in
    // BenefitProgressSummary.test.tsx for the identical reason).
    //
    // Matching on "Platinum" is ambiguous now that both TierBadge's "X more to
    // reach Platinum" and this benefit's "X more in portfolio value" copy are
    // split the same way — for this fixture they resolve to the identical ₪
    // amount, so both paragraphs match. "more in portfolio value" is the
    // phrase unique to BenefitProgressSummary (TierBadge always says "more to
    // reach {tier}"), so match on that instead to target the intended element.
    expect(
      await screen.findByText(
        (_content, element) =>
          !!element?.textContent?.includes("more in portfolio value") &&
          !!element?.textContent?.includes(amount),
        { selector: "p" },
      ),
    ).toBeInTheDocument();
  });

  it("does not show the 'Connect my investments account' placeholder (Import page only)", async () => {
    render(<Home />);
    await screen.findByText("10% off any flight");
    expect(screen.queryByText("Connect my investments account")).not.toBeInTheDocument();
  });

  it("filters the feed by sector", async () => {
    render(<Home />);
    await screen.findByText("10% off any flight");

    fireEvent.click(await screen.findByRole("button", { name: "Aviation" }));

    expect(await screen.findByText("10% off any flight")).toBeInTheDocument();
    expect(screen.queryByText("Free drink every visit")).not.toBeInTheDocument();
  });
});
