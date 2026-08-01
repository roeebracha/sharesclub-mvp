import { tierProgress, type MembershipTier } from "@/lib/domain/eligibility";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CountUp } from "@/components/ui/CountUp";

const TIER_VAR: Record<MembershipTier["name"], string> = {
  Silver: "--tier-silver",
  Gold: "--tier-gold",
  Platinum: "--tier-platinum",
};

export function TierBadge({
  portfolioWorth,
  tiers,
}: {
  portfolioWorth: number;
  tiers: MembershipTier[];
}) {
  if (tiers.length === 0) return null;

  const { currentTier, nextTier, progressRatio, amountToNextTier } = tierProgress(
    portfolioWorth,
    tiers,
  );
  const tierVar = TIER_VAR[currentTier.name];

  return (
    <div className="w-full max-w-[280px]">
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{
            backgroundColor: `color-mix(in srgb, var(${tierVar}) 15%, transparent)`,
            color: `var(${tierVar})`,
          }}
        >
          {currentTier.name} member
        </span>
        {nextTier && (
          <span className="text-xs text-foreground/60">
            <CountUp value={Math.round(progressRatio * 100)} suffix="%" /> to {nextTier.name}
          </span>
        )}
      </div>

      <div className="mt-2">
        <ProgressBar value={progressRatio} />
      </div>

      <p className="mt-2 text-center text-xs text-foreground/60">
        {nextTier
          ? `₪${Math.round(amountToNextTier).toLocaleString()} more to reach ${nextTier.name}`
          : "Highest tier reached"}
      </p>
    </div>
  );
}
