import type { BenefitProgress } from "@/lib/eligibility";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CountUp } from "@/components/ui/CountUp";

const MILESTONES = [0.5, 0.8];

function urgencyLabel(progressRatio: number): string | null {
  if (progressRatio >= 0.8) return "Almost unlocked!";
  if (progressRatio >= 0.5) return "Getting there";
  return null;
}

export function BenefitProgressSummary({ progress }: { progress: BenefitProgress }) {
  const label = urgencyLabel(progress.progressRatio);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        {label ? (
          <span className="text-xs font-semibold text-accent-hot">{label}</span>
        ) : (
          <span />
        )}
        <span className="font-[family-name:var(--font-geist-mono)] text-xs text-foreground/60">
          <CountUp value={Math.round(progress.progressRatio * 100)} suffix="%" />
        </span>
      </div>
      <ProgressBar value={progress.progressRatio} milestones={MILESTONES} />
      <p className="mt-2 text-xs text-foreground/60">
        Reach <span className="font-medium text-foreground/80">{progress.requiredTierName}</span>{" "}
        — ₪{Math.round(progress.amountToRequiredTier).toLocaleString()} more in portfolio value
      </p>
    </div>
  );
}
