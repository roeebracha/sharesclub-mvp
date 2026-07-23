import { describe, it, expect } from "vitest";
import {
  isEligible,
  getUserTier,
  getNextTier,
  type Benefit,
  type MembershipTier,
} from "@/lib/eligibility";

const tiers: MembershipTier[] = [
  { id: "silver", name: "Silver", minPortfolioValue: 0, rank: 1 },
  { id: "gold", name: "Gold", minPortfolioValue: 20000, rank: 2 },
  { id: "platinum", name: "Platinum", minPortfolioValue: 50000, rank: 3 },
];

const goldBenefit: Benefit = {
  id: "b",
  companyId: "c1",
  title: "t",
  description: "d",
  minTierId: "gold",
};

describe("getUserTier", () => {
  it("returns Silver for a portfolio below the Gold threshold", () => {
    expect(getUserTier(5000, tiers).name).toBe("Silver");
  });

  it("returns Gold exactly at the Gold threshold", () => {
    expect(getUserTier(20000, tiers).name).toBe("Gold");
  });

  it("returns Platinum at or above the Platinum threshold", () => {
    expect(getUserTier(50000, tiers).name).toBe("Platinum");
    expect(getUserTier(1_000_000, tiers).name).toBe("Platinum");
  });
});

describe("getNextTier", () => {
  it("returns Gold as the next tier above Silver", () => {
    expect(getNextTier(tiers[0], tiers)?.name).toBe("Gold");
  });

  it("returns null above Platinum — no tier to progress toward", () => {
    expect(getNextTier(tiers[2], tiers)).toBeNull();
  });
});

describe("isEligible", () => {
  it("is not eligible when the user's tier ranks below the benefit's required tier", () => {
    const userTier = getUserTier(5000, tiers); // Silver
    expect(isEligible(goldBenefit, userTier, tiers)).toBe(false);
  });

  it("is eligible when the user's tier ranks exactly at the benefit's required tier", () => {
    const userTier = getUserTier(20000, tiers); // Gold
    expect(isEligible(goldBenefit, userTier, tiers)).toBe(true);
  });

  it("is eligible when the user's tier ranks above the benefit's required tier", () => {
    const userTier = getUserTier(50000, tiers); // Platinum
    expect(isEligible(goldBenefit, userTier, tiers)).toBe(true);
  });

  it("ignores which company the user holds — eligibility is tier-only", () => {
    const userTier = getUserTier(20000, tiers); // Gold
    const otherCompanyBenefit: Benefit = { ...goldBenefit, companyId: "some-other-company" };
    expect(isEligible(otherCompanyBenefit, userTier, tiers)).toBe(true);
  });
});
