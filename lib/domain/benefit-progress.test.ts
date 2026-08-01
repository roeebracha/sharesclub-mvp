import { describe, it, expect } from "vitest";
import { benefitProgress, tierProgress, type Benefit, type MembershipTier } from "@/lib/domain/eligibility";

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

describe("benefitProgress", () => {
  it("reports the full ₪ gap when far below the required tier", () => {
    const p = benefitProgress(goldBenefit, 5000, tiers, 100);
    expect(p.eligible).toBe(false);
    expect(p.requiredTierName).toBe("Gold");
    expect(p.amountToRequiredTier).toBe(15000);
    expect(p.progressRatio).toBeCloseTo(0.25);
  });

  it("is complete exactly at the required tier's threshold", () => {
    const p = benefitProgress(goldBenefit, 20000, tiers, 100);
    expect(p.eligible).toBe(true);
    expect(p.amountToRequiredTier).toBe(0);
    expect(p.progressRatio).toBe(1);
  });

  it("stays complete above the required tier's threshold", () => {
    const p = benefitProgress(goldBenefit, 50000, tiers, 100);
    expect(p.eligible).toBe(true);
    expect(p.amountToRequiredTier).toBe(0);
    expect(p.progressRatio).toBe(1);
  });

  it("gives the same ₪ gap for every benefit that requires the same tier", () => {
    const otherGoldBenefit: Benefit = { ...goldBenefit, id: "b2", companyId: "c2" };
    const p1 = benefitProgress(goldBenefit, 5000, tiers, 100);
    const p2 = benefitProgress(otherGoldBenefit, 5000, tiers, 100);
    expect(p1.amountToRequiredTier).toBe(p2.amountToRequiredTier);
  });

  it("is not eligible at a qualifying tier with 0% Israeli exposure — additive gate", () => {
    const p = benefitProgress(goldBenefit, 20000, tiers, 0);
    expect(p.eligible).toBe(false);
  });
});

describe("tierProgress", () => {
  it("reports progress toward the next tier from the start of the current tier", () => {
    const p = tierProgress(0, tiers);
    expect(p.currentTier.name).toBe("Silver");
    expect(p.nextTier?.name).toBe("Gold");
    expect(p.progressRatio).toBe(0);
    expect(p.amountToNextTier).toBe(20000);
  });

  it("reports partial progress toward the next tier", () => {
    const p = tierProgress(10000, tiers);
    expect(p.progressRatio).toBeCloseTo(0.5);
    expect(p.amountToNextTier).toBe(10000);
  });

  it("has no next tier at Platinum — highest tier reached", () => {
    const p = tierProgress(50000, tiers);
    expect(p.currentTier.name).toBe("Platinum");
    expect(p.nextTier).toBeNull();
    expect(p.progressRatio).toBe(1);
    expect(p.amountToNextTier).toBe(0);
  });
});
