import Link from "next/link";
import type { Benefit, BenefitProgress, Company } from "@/lib/dummy-data";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

function formatPct(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export function BenefitCard({
  benefit,
  company,
  eligible,
  progress,
  onClaim,
}: {
  benefit: Benefit;
  company: Company;
  eligible: boolean;
  progress?: BenefitProgress;
  onClaim?: () => void;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <span className="text-xs font-[family-name:var(--font-geist-mono)] text-foreground/60">
          {company.name} · {company.ticker}
        </span>
        {eligible ? (
          <Badge variant="success">Eligible</Badge>
        ) : (
          <Badge variant="muted">Locked</Badge>
        )}
      </div>

      <h3 className="mt-2 text-lg font-semibold">
        <Link href={`/benefits/${benefit.id}`} className="hover:text-primary">
          {benefit.title}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-foreground/70">{benefit.description}</p>

      {progress && !eligible && (
        <div className="mt-4">
          <ProgressBar value={progress.progressRatio} />
          <p className="mt-2 text-xs text-foreground/60">
            Need {formatPct(progress.missingPercentagePoints)}% more (~$
            {Math.round(progress.missingAmount).toLocaleString()}) in {company.ticker}
          </p>
        </div>
      )}

      {eligible && onClaim && (
        <div className="mt-4">
          <Button variant="primary" onClick={onClaim}>
            Claim
          </Button>
        </div>
      )}
    </Card>
  );
}
