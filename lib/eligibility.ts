// Pure eligibility/progress logic + shared shapes, decoupled from any data
// source. Shapes mirror the locked schema in architecture/DECISIONS.md.
//
// Membership tier system: every user has a GLOBAL tier (Silver/Gold/Platinum)
// based on total portfolioWorth. Benefit eligibility is gated purely by
// userTier.rank vs the benefit's required tier — NOT by which company the
// user holds. Holdings are visualization-only (the donut).

export type Sector =
  | "security"
  | "aviation"
  | "tourism"
  | "leisure_entertainment"
  | "technology"
  | "retail";

export type Company = {
  id: string;
  name: string;
  ticker: string;
  sector: Sector;
};

export type MembershipTier = {
  id: string;
  name: "Silver" | "Gold" | "Platinum";
  minPortfolioValue: number;
  rank: number;
};

export type Benefit = {
  id: string;
  companyId: string;
  title: string;
  description: string;
  minTierId: string;
};

export type Holding = {
  companyId: string;
  percentage: number; // % of the user's own portfolio held in this company — visualization only
};

// The highest-rank tier the user qualifies for.
export function getUserTier(portfolioWorth: number, tiers: MembershipTier[]): MembershipTier {
  return [...tiers]
    .filter((t) => portfolioWorth >= t.minPortfolioValue)
    .sort((a, b) => b.rank - a.rank)[0];
}

// The tier one rank above the given one, or null if it's already the highest.
export function getNextTier(
  currentTier: MembershipTier,
  tiers: MembershipTier[],
): MembershipTier | null {
  return tiers.find((t) => t.rank === currentTier.rank + 1) ?? null;
}

export function isEligible(benefit: Benefit, userTier: MembershipTier, tiers: MembershipTier[]) {
  const requiredTier = tiers.find((t) => t.id === benefit.minTierId);
  if (!requiredTier) return false;
  return userTier.rank >= requiredTier.rank;
}

export type BenefitProgress = {
  eligible: boolean;
  requiredTierName: MembershipTier["name"] | null;
  progressRatio: number; // 0..1 toward the benefit's required tier
  amountToRequiredTier: number; // ₪ still needed to reach the benefit's required tier
};

// How close a user is to claiming a benefit, expressed as a ₪ gap to the
// benefit's required tier (tier-gap only — no per-company % framing, since
// eligibility no longer depends on which company is held). Reuses isEligible
// so the eligible flag never diverges from the feed coloring.
export function benefitProgress(
  benefit: Benefit,
  portfolioWorth: number,
  tiers: MembershipTier[],
): BenefitProgress {
  const requiredTier = tiers.find((t) => t.id === benefit.minTierId);
  const userTier = getUserTier(portfolioWorth, tiers);
  const eligible = requiredTier ? userTier.rank >= requiredTier.rank : false;

  return {
    eligible,
    requiredTierName: requiredTier?.name ?? null,
    progressRatio: !requiredTier
      ? 0
      : requiredTier.minPortfolioValue <= 0
        ? 1
        : Math.min(1, portfolioWorth / requiredTier.minPortfolioValue),
    amountToRequiredTier: requiredTier
      ? Math.max(0, requiredTier.minPortfolioValue - portfolioWorth)
      : 0,
  };
}

export type TierProgress = {
  currentTier: MembershipTier;
  nextTier: MembershipTier | null;
  progressRatio: number; // 0..1 toward nextTier, 1 if there's no next tier
  amountToNextTier: number; // ₪ still needed to reach nextTier, 0 if there's no next tier
};

// Progress toward the user's NEXT tier, for the badge/bar next to the donut.
export function tierProgress(portfolioWorth: number, tiers: MembershipTier[]): TierProgress {
  const currentTier = getUserTier(portfolioWorth, tiers);
  const nextTier = getNextTier(currentTier, tiers);

  if (!nextTier) {
    return { currentTier, nextTier: null, progressRatio: 1, amountToNextTier: 0 };
  }

  const span = nextTier.minPortfolioValue - currentTier.minPortfolioValue;
  const progressRatio =
    span <= 0 ? 1 : Math.min(1, (portfolioWorth - currentTier.minPortfolioValue) / span);

  return {
    currentTier,
    nextTier,
    progressRatio,
    amountToNextTier: Math.max(0, nextTier.minPortfolioValue - portfolioWorth),
  };
}
