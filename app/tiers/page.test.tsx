import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import TiersPage from "./page";
import { tiers, benefits } from "@/lib/test-utils/fixtures";

const getMembershipTiers = vi.fn();
const getBenefits = vi.fn();
const getPortfolioWorth = vi.fn();

vi.mock("@/features/benefits/data/catalog-client", () => ({
  getMembershipTiers: () => getMembershipTiers(),
  getBenefits: () => getBenefits(),
}));
vi.mock("@/features/portfolio/data/holdings", () => ({
  getPortfolioWorth: () => getPortfolioWorth(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  getMembershipTiers.mockResolvedValue(tiers);
  getBenefits.mockResolvedValue(benefits);
  // $25,000 -> Gold tier, same fixture convention as demoUser elsewhere.
  getPortfolioWorth.mockResolvedValue(25000);
});

describe("TiersPage", () => {
  it("lists all three tiers with their ₪ threshold", async () => {
    render(<TiersPage />);
    expect(await screen.findByText("Silver")).toBeInTheDocument();
    expect(screen.getByText("Gold")).toBeInTheDocument();
    expect(screen.getByText("Platinum")).toBeInTheDocument();
    // CurrencyAmount renders in a nested <span>, so the "+" suffix lands in a
    // separate text node from the ₪ amount — match on the parent's recursive
    // textContent instead (same documented workaround used throughout this repo,
    // e.g. BenefitProgressSummary.test.tsx).
    expect(
      screen.getByText(
        (_content, element) => !!element?.textContent?.includes("₪20,000+"),
        { selector: "p" },
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (_content, element) => !!element?.textContent?.includes("₪50,000+"),
        { selector: "p" },
      ),
    ).toBeInTheDocument();
  });

  it("marks the user's actual tier as Current and lower tiers as Reached", async () => {
    render(<TiersPage />);
    await screen.findByText("Gold");
    expect(screen.getByText("Current")).toBeInTheDocument();
    expect(screen.getByText("Reached")).toBeInTheDocument(); // Silver, already cleared
  });

  it("lists which perks unlock at each tier", async () => {
    render(<TiersPage />);
    const silverBenefit = benefits.find((b) => b.minTierId === "t-silver")!;
    expect(await screen.findByText(silverBenefit.title)).toBeInTheDocument();
  });

  it("shows the tier progress summary toward the next tier", async () => {
    render(<TiersPage />);
    expect(await screen.findByText(/more to reach Platinum/)).toBeInTheDocument();
  });
});
