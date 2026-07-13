// Pure eligibility/progress logic + shared shapes, decoupled from any data
// source. Shapes mirror the locked schema in architecture/DECISIONS.md.

export type ThresholdType = "percent" | "amount";

export type Company = {
  id: string;
  name: string;
  ticker: string;
};

export type Benefit = {
  id: string;
  companyId: string;
  title: string;
  description: string;
  thresholdType: ThresholdType;
  thresholdValue: number;
};

export type Holding = {
  companyId: string;
  percentage: number; // % of the user's own portfolio held in this company
};

export function isEligible(benefit: Benefit, portfolioWorth: number, holdings: Holding[]) {
  const holding = holdings.find((h) => h.companyId === benefit.companyId);
  if (!holding) return false;

  if (benefit.thresholdType === "percent") {
    return holding.percentage >= benefit.thresholdValue;
  }

  const amountHeld = (holding.percentage / 100) * portfolioWorth;
  return amountHeld >= benefit.thresholdValue;
}

export type BenefitProgress = {
  eligible: boolean;
  progressRatio: number; // 0..1, how close the user is to unlocking
  missingPercentagePoints: number; // extra % of portfolio still needed
  missingAmount: number; // extra $ still needed
};

// How close a user is to claiming a benefit, expressed in both % and $.
// Reuses isEligible so the eligible flag never diverges from the feed coloring.
export function benefitProgress(
  benefit: Benefit,
  portfolioWorth: number,
  holdings: Holding[],
): BenefitProgress {
  const heldPercentage =
    holdings.find((h) => h.companyId === benefit.companyId)?.percentage ?? 0;
  const eligible = isEligible(benefit, portfolioWorth, holdings);

  if (benefit.thresholdType === "percent") {
    const missingPercentagePoints = Math.max(0, benefit.thresholdValue - heldPercentage);
    return {
      eligible,
      progressRatio:
        benefit.thresholdValue <= 0
          ? 1
          : Math.min(1, heldPercentage / benefit.thresholdValue),
      missingPercentagePoints,
      missingAmount: (missingPercentagePoints / 100) * portfolioWorth,
    };
  }

  const amountHeld = (heldPercentage / 100) * portfolioWorth;
  const missingAmount = Math.max(0, benefit.thresholdValue - amountHeld);
  return {
    eligible,
    progressRatio:
      benefit.thresholdValue <= 0 ? 1 : Math.min(1, amountHeld / benefit.thresholdValue),
    missingPercentagePoints:
      portfolioWorth > 0 ? (missingAmount / portfolioWorth) * 100 : 0,
    missingAmount,
  };
}
