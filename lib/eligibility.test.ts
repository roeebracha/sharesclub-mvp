import { describe, it, expect } from "vitest";
import { isEligible, type Benefit, type Holding } from "@/lib/eligibility";

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

describe("isEligible", () => {
  it("returns false when the user holds nothing in the company", () => {
    expect(isEligible(percentBenefit, 1000, [])).toBe(false);
  });

  it("is eligible when percentage meets a percent threshold", () => {
    const holdings: Holding[] = [{ companyId: "c1", percentage: 10 }];
    expect(isEligible(percentBenefit, 1000, holdings)).toBe(true);
  });

  it("is not eligible when percentage is below a percent threshold", () => {
    const holdings: Holding[] = [{ companyId: "c1", percentage: 9 }];
    expect(isEligible(percentBenefit, 1000, holdings)).toBe(false);
  });

  it("is eligible when dollar amount meets an amount threshold", () => {
    const holdings: Holding[] = [{ companyId: "c1", percentage: 50 }]; // $500 of $1000
    expect(isEligible(amountBenefit, 1000, holdings)).toBe(true);
  });

  it("is not eligible when dollar amount is below an amount threshold", () => {
    const holdings: Holding[] = [{ companyId: "c1", percentage: 40 }]; // $400 of $1000
    expect(isEligible(amountBenefit, 1000, holdings)).toBe(false);
  });
});
