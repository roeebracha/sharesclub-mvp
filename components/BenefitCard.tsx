import Link from "next/link";
import type { Benefit, BenefitProgress, Company } from "@/lib/eligibility";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BenefitProgressSummary } from "@/components/BenefitProgressSummary";
import { ShareModal } from "@/components/ShareModal";

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
          <BenefitProgressSummary progress={progress} />
        </div>
      )}

      {eligible && (
        <div className="mt-4 flex items-center gap-2">
          {onClaim && (
            <Button variant="primary" onClick={onClaim}>
              Claim
            </Button>
          )}
          <ShareModal
            variant="benefit"
            benefitTitle={benefit.title}
            companyName={company.name}
            trigger={<Button variant="secondary">Share</Button>}
          />
        </div>
      )}
    </Card>
  );
}
