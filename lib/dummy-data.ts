// Hardcoded placeholder data for the Phase 1 UI shell.
// Shapes mirror the locked schema in architecture/DECISIONS.md.
// Replace with real Supabase queries in Phase 3 (benefits catalog wired to real data).

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

export const companies: Company[] = [
  { id: "c1", name: "Aurora Airlines", ticker: "AURA" },
  { id: "c2", name: "Beacon Coffee Co.", ticker: "BEAN" },
  { id: "c3", name: "Cascade Outdoors", ticker: "CSCO" },
  { id: "c4", name: "NovaTech Cloud", ticker: "NVTC" },
  { id: "c5", name: "Solstice Beauty", ticker: "SLST" },
  { id: "c6", name: "Pinnacle Fitness", ticker: "PNCL" },
  { id: "c7", name: "Meridian Books", ticker: "MRDN" },
];

export const benefits: Benefit[] = [
  {
    id: "b1",
    companyId: "c1",
    title: "10% off any flight",
    description: "Redeem a one-time discount code for domestic or international flights.",
    thresholdType: "percent",
    thresholdValue: 1,
  },
  {
    id: "b2",
    companyId: "c2",
    title: "Free drink every visit",
    description: "Show your redemption code at any Beacon Coffee location for a free drink.",
    thresholdType: "amount",
    thresholdValue: 500,
  },
  {
    id: "b3",
    companyId: "c3",
    title: "20% off gear",
    description: "One-time discount code for any in-store or online purchase.",
    thresholdType: "amount",
    thresholdValue: 2000,
  },
  {
    id: "b4",
    companyId: "c4",
    title: "Free cloud storage upgrade",
    description: "Bump your storage tier at no extra cost, for as long as you hold.",
    thresholdType: "percent",
    thresholdValue: 5,
  },
  {
    id: "b5",
    companyId: "c4",
    title: "Priority support line",
    description: "Skip the queue with a dedicated support line for shareholders.",
    thresholdType: "amount",
    thresholdValue: 120,
  },
  {
    id: "b6",
    companyId: "c5",
    title: "Quarterly beauty box",
    description: "A curated box of new releases shipped to your door every quarter.",
    thresholdType: "percent",
    thresholdValue: 50,
  },
  {
    id: "b7",
    companyId: "c6",
    title: "Free personal training session",
    description: "One complimentary 1:1 session at any Pinnacle Fitness location.",
    thresholdType: "percent",
    thresholdValue: 5,
  },
  {
    id: "b8",
    companyId: "c7",
    title: "10% off any book order",
    description: "A standing discount code for online and in-store purchases.",
    thresholdType: "percent",
    thresholdValue: 10,
  },
];

// Placeholder "logged in" user, used only to demo the eligibility coloring.
export const demoUser = {
  portfolioWorth: 1000,
  holdings: [
    { companyId: "c1", percentage: 5 }, // $50 in Aurora
    { companyId: "c2", percentage: 60 }, // $600 in Beacon
    { companyId: "c4", percentage: 10 }, // $100 in NovaTech
    { companyId: "c5", percentage: 15 }, // $150 in Solstice
    { companyId: "c6", percentage: 5 }, // $50 in Pinnacle
    // c7 (Meridian Books) intentionally has zero holdings — exercises the
    // fully-locked/zero-progress state. Remaining 5% stays unallocated cash.
  ] satisfies Holding[],
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
