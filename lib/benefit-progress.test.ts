import { describe, it, expect } from "vitest";
import { benefitProgress, type Benefit, type Holding } from "@/lib/dummy-data";

const percentBenefit: Benefit = {
  id: "b",
  companyId: "c1",
  title: "t",
  description: "d",
  thresholdType: "percent",
  thresholdValue: 10,
};

const amountBenefit: Benefit = {
  ...percentBenefit,
  thresholdType: "amount",
  thresholdValue: 500,
};

const holding = (percentage: number): Holding[] => [{ companyId: "c1", percentage }];

describe("benefitProgress — percent threshold", () => {
  it("reports the full gap when the user holds nothing", () => {
    const p = benefitProgress(percentBenefit, 1000, []);
    expect(p.eligible).toBe(false);
    expect(p.progressRatio).toBe(0);
    expect(p.missingPercentagePoints).toBe(10);
    expect(p.missingAmount).toBe(100); // 10% of $1000
  });

  it("reports partial progress below the threshold", () => {
    const p = benefitProgress(percentBenefit, 1000, holding(4));
    expect(p.eligible).toBe(false);
    expect(p.progressRatio).toBeCloseTo(0.4);
    expect(p.missingPercentagePoints).toBe(6);
    expect(p.missingAmount).toBe(60);
  });

  it("is complete exactly at the threshold", () => {
    const p = benefitProgress(percentBenefit, 1000, holding(10));
    expect(p.eligible).toBe(true);
    expect(p.progressRatio).toBe(1);
    expect(p.missingPercentagePoints).toBe(0);
    expect(p.missingAmount).toBe(0);
  });

  it("clamps progress to 1 above the threshold", () => {
    const p = benefitProgress(percentBenefit, 1000, holding(25));
    expect(p.eligible).toBe(true);
    expect(p.progressRatio).toBe(1);
    expect(p.missingPercentagePoints).toBe(0);
    expect(p.missingAmount).toBe(0);
  });
});

describe("benefitProgress — amount threshold", () => {
  it("reports the full gap when the user holds nothing", () => {
    const p = benefitProgress(amountBenefit, 1000, []);
    expect(p.eligible).toBe(false);
    expect(p.progressRatio).toBe(0);
    expect(p.missingAmount).toBe(500);
    expect(p.missingPercentagePoints).toBe(50); // $500 of a $1000 portfolio
  });

  it("reports partial progress below the threshold", () => {
    const p = benefitProgress(amountBenefit, 1000, holding(30)); // $300
    expect(p.eligible).toBe(false);
    expect(p.progressRatio).toBeCloseTo(0.6);
    expect(p.missingAmount).toBe(200);
    expect(p.missingPercentagePoints).toBe(20);
  });

  it("is complete exactly at the threshold", () => {
    const p = benefitProgress(amountBenefit, 1000, holding(50)); // $500
    expect(p.eligible).toBe(true);
    expect(p.progressRatio).toBe(1);
    expect(p.missingAmount).toBe(0);
    expect(p.missingPercentagePoints).toBe(0);
  });
});
