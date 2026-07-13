import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { benefitProgress, type Benefit } from "@/lib/eligibility";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BenefitProgressSummary } from "@/components/BenefitProgressSummary";

export default async function BenefitDetail({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: benefitRow } = await supabase
    .from("benefits")
    .select("id, company_id, title, description, threshold_type, threshold_value")
    .eq("id", params.id)
    .single();

  if (!benefitRow) notFound();

  const { data: companyRow } = await supabase
    .from("companies")
    .select("id, name, ticker")
    .eq("id", benefitRow.company_id)
    .single();

  const benefit: Benefit = {
    id: benefitRow.id,
    companyId: benefitRow.company_id,
    title: benefitRow.title,
    description: benefitRow.description,
    thresholdType: benefitRow.threshold_type,
    thresholdValue: benefitRow.threshold_value,
  };
  const company = companyRow!;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let portfolioWorth = 0;
  let holdings: { companyId: string; percentage: number }[] = [];
  if (user) {
    const { data: userRow } = await supabase
      .from("users")
      .select("portfolio_worth")
      .eq("id", user.id)
      .single();
    portfolioWorth = userRow?.portfolio_worth ?? 0;

    const { data: holdingsRows } = await supabase
      .from("holdings")
      .select("company_id, percentage")
      .eq("user_id", user.id);
    holdings = (holdingsRows ?? []).map(
      (h: { company_id: string; percentage: number }) => ({
        companyId: h.company_id,
        percentage: h.percentage,
      }),
    );
  }

  const progress = benefitProgress(benefit, portfolioWorth, holdings);

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
