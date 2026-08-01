"use client";

import { useState } from "react";
import { tierProgress, type Benefit, type MembershipTier } from "@/lib/domain/eligibility";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CountUp } from "@/components/ui/CountUp";

const TIER_VAR: Record<MembershipTier["name"], string> = {
  Silver: "--tier-silver",
  Gold: "--tier-gold",
  Platinum: "--tier-platinum",
};

// Matches BenefitProgressSummary's milestone points, for the same "getting
// close" visual language across every progress bar in the app.
const MILESTONES = [0.5, 0.8];

export function TierBadge({
  portfolioWorth,
  tiers,
  benefits,
}: {
  portfolioWorth: number;
  tiers: MembershipTier[];
  /** Optional — when provided, the tier pill becomes tappable/clickable to
   * reveal which of these benefits the next tier unlocks. */
  benefits?: Benefit[];
}) {
  const [showUnlocks, setShowUnlocks] = useState(false);

  if (tiers.length === 0) return null;

  const { currentTier, nextTier, progressRatio, amountToNextTier } = tierProgress(
    portfolioWorth,
    tiers,
  );
  const tierVar = TIER_VAR[currentTier.name];
  const unlocks = nextTier ? (benefits ?? []).filter((b) => b.minTierId === nextTier.id) : [];

  const pillClassName =
    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold";
  const pillStyle = {
    backgroundColor: `color-mix(in srgb, var(${tierVar}) 15%, transparent)`,
    color: `var(${tierVar})`,
  };

  return (
    <div className="relative w-full max-w-[280px]">
      <div className="flex items-center justify-between">
        {unlocks.length > 0 ? (
          <button
            type="button"
            className={pillClassName}
            style={pillStyle}
            onClick={() => setShowUnlocks((v) => !v)}
            aria-expanded={showUnlocks}
          >
            {currentTier.name} member
          </button>
        ) : (
          <span className={pillClassName} style={pillStyle}>
            {currentTier.name} member
          </span>
        )}
        {nextTier && (
          <span className="text-xs text-foreground/60">
            <CountUp value={Math.round(progressRatio * 100)} suffix="%" /> to {nextTier.name}
          </span>
        )}
      </div>

      <div className="mt-2">
        <ProgressBar value={progressRatio} milestones={nextTier ? MILESTONES : undefined} />
      </div>

      <p className="mt-2 text-center text-xs text-foreground/60">
        {nextTier
          ? `₪${Math.round(amountToNextTier).toLocaleString()} more to reach ${nextTier.name}`
          : "Highest tier reached"}
      </p>

      {showUnlocks && nextTier && unlocks.length > 0 && (
        <div className="absolute z-10 mt-2 w-full rounded-lg border border-black/10 bg-surface-elevated p-3 text-xs shadow-elevated dark:border-white/15">
          <p className="mb-1.5 font-semibold text-foreground/80">Unlocks at {nextTier.name}</p>
          <ul className="space-y-1 text-foreground/60">
            {unlocks.map((b) => (
              <li key={b.id}>{b.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
