import Link from "next/link";
import type { Benefit, BenefitProgress, Company } from "@/lib/domain/eligibility";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BenefitProgressSummary } from "@/features/benefits/components/BenefitProgressSummary";
import { SECTOR_META } from "@/features/benefits/components/sector-meta";
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
  const { label: sectorLabel, Icon: SectorIcon } = SECTOR_META[company.sector];

  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <SectorIcon size={22} aria-hidden />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{company.name}</p>
              <p className="text-xs text-foreground/60">{sectorLabel}</p>
            </div>
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
        </div>
      </div>
    </Card>
  );
}
