import { describe, it, expect } from "vitest";
import {
  isEligible,
  getUserTier,
  getNextTier,
  israeliExposure,
  type Benefit,
  type Holding,
  type MembershipTier,
} from "@/lib/domain/eligibility";

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

describe("israeliExposure", () => {
  it("is 0 for an empty portfolio", () => {
    expect(israeliExposure([])).toBe(0);
  });

  it("sums percentage only across Israeli-flagged holdings", () => {
    const holdings: Holding[] = [
      { companyId: "c1", rawName: null, ticker: null, isIsraeli: true, percentage: 10 },
      { companyId: null, rawName: "ADV MICRO(AMD)", ticker: "AMD", isIsraeli: false, percentage: 20 },
    ];
    expect(israeliExposure(holdings)).toBe(10);
  });

  it("counts an unmatched holding as Israeli exposure — matching the catalog is not required (e.g. Teva)", () => {
    const holdings: Holding[] = [
      { companyId: null, rawName: "טבע תעשיות", ticker: "TEVA", isIsraeli: true, percentage: 12 },
    ];
    expect(israeliExposure(holdings)).toBe(12);
  });
});

describe("isEligible", () => {
  it("is not eligible when the user's tier ranks below the benefit's required tier", () => {
    const userTier = getUserTier(5000, tiers); // Silver
    expect(isEligible(goldBenefit, userTier, tiers, 100)).toBe(false);
  });

  it("is eligible when the user's tier ranks exactly at the benefit's required tier", () => {
    const userTier = getUserTier(20000, tiers); // Gold
    expect(isEligible(goldBenefit, userTier, tiers, 100)).toBe(true);
  });

  it("is eligible when the user's tier ranks above the benefit's required tier", () => {
    const userTier = getUserTier(50000, tiers); // Platinum
    expect(isEligible(goldBenefit, userTier, tiers, 100)).toBe(true);
  });

  it("ignores which company the user holds — eligibility is tier-only (aside from the Israeli-exposure gate)", () => {
    const userTier = getUserTier(20000, tiers); // Gold
    const otherCompanyBenefit: Benefit = { ...goldBenefit, companyId: "some-other-company" };
    expect(isEligible(otherCompanyBenefit, userTier, tiers, 100)).toBe(true);
  });

  it("is not eligible with a qualifying tier but 0% Israeli exposure — additive gate", () => {
    const userTier = getUserTier(20000, tiers); // Gold
    expect(isEligible(goldBenefit, userTier, tiers, 0)).toBe(false);
  });

  it("is eligible via Israeli exposure that never matched a catalog company", () => {
    // A real holding (e.g. Teva) can be Israeli without being one of our curated benefit
    // companies — israeliExposure() reflects that, so a caller passing it through here should
    // still see the gate pass even though no specific company match drove it.
    const userTier = getUserTier(20000, tiers); // Gold
    const unmatchedButIsraeliExposure = 12; // e.g. a single unmatched Israeli holding at 12%
    expect(isEligible(goldBenefit, userTier, tiers, unmatchedButIsraeliExposure)).toBe(true);
  });
});
