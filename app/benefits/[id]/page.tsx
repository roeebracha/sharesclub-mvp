import Link from "next/link";
import { notFound } from "next/navigation";
import {
  benefits,
  benefitProgress,
  companies,
  demoUser,
} from "@/lib/dummy-data";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BenefitProgressSummary } from "@/components/BenefitProgressSummary";

export default function BenefitDetail({ params }: { params: { id: string } }) {
  const benefit = benefits.find((b) => b.id === params.id);
  if (!benefit) notFound();

  const company = companies.find((c) => c.id === benefit.companyId)!;
  const progress = benefitProgress(
    benefit,
    demoUser.portfolioWorth,
    demoUser.holdings,
  );

  const thresholdCopy =
    benefit.thresholdType === "percent"
      ? `Hold at least ${benefit.thresholdValue}% of your portfolio in ${company.ticker}.`
      : `Hold at least $${benefit.thresholdValue.toLocaleString()} of ${company.ticker}.`;

  return (
    <div className="min-h-screen px-6 py-16 sm:px-12 sm:py-24 max-w-3xl mx-auto">
      <Link
        href="/"
        className="text-sm text-foreground/60 underline underline-offset-4 hover:text-foreground"
      >
        ← Back to feed
      </Link>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-xs font-[family-name:var(--font-geist-mono)] text-foreground/60">
          {company.name} · {company.ticker}
        </span>
        {progress.eligible ? (
          <Badge variant="success">Eligible</Badge>
        ) : (
          <Badge variant="muted">Locked</Badge>
        )}
      </div>

      <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
        {benefit.title}
      </h1>
      <p className="mt-3 text-foreground/70">{benefit.description}</p>

      <Card className="mt-8">
        <h2 className="text-sm font-medium text-foreground/60 uppercase tracking-wide">
          Terms
        </h2>
        <p className="mt-2 text-sm text-foreground/70">{thresholdCopy}</p>
        <p className="mt-1 text-sm text-foreground/70">
          One-time redemption. Self-reported holdings only (v1).
        </p>
      </Card>

      {!progress.eligible && (
        <div className="mt-8">
          <BenefitProgressSummary progress={progress} ticker={company.ticker} />
        </div>
      )}

      <div className="mt-8">
        <Button variant="primary" disabled={!progress.eligible}>
          Redeem
        </Button>
        <p className="mt-2 text-xs text-foreground/50">
          Redemption isn&apos;t wired up yet — this is a visual placeholder.
        </p>
      </div>
    </div>
  );
}
