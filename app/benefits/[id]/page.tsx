import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { benefitProgress, israeliExposure } from "@/lib/domain/eligibility";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BenefitProgressSummary } from "@/features/benefits/components/BenefitProgressSummary";
import {
  getBenefitById,
  getCompanyById,
  getMembershipTiers,
} from "@/features/benefits/data/catalog-server";
import { getHoldingsForCurrentUser } from "@/features/portfolio/data/holdings-server";

export default async function BenefitDetail({ params }: { params: { id: string } }) {
  const benefit = await getBenefitById(params.id);
  if (!benefit) notFound();

  const company = (await getCompanyById(benefit.companyId))!;
  const tiers = await getMembershipTiers();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let portfolioWorth = 0;
  if (user) {
    const { data: userRow } = await supabase
      .from("users")
      .select("portfolio_worth")
      .eq("id", user.id)
      .single();
    portfolioWorth = userRow?.portfolio_worth ?? 0;
  }

  const holdings = await getHoldingsForCurrentUser();
  const progress = benefitProgress(benefit, portfolioWorth, tiers, israeliExposure(holdings));
  const requiredTier = tiers.find((t) => t.id === benefit.minTierId);
  const tierCopy = requiredTier
    ? `Reach ${requiredTier.name} membership (₪${requiredTier.minPortfolioValue.toLocaleString()}+ total portfolio value).`
    : "Membership tier requirement unavailable.";

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
        <p className="mt-2 text-sm text-foreground/70">{tierCopy}</p>
        <p className="mt-1 text-sm text-foreground/70">
          One-time redemption. Self-reported holdings only (v1).
        </p>
      </Card>

      {!progress.eligible && (
        <div className="mt-8">
          <BenefitProgressSummary progress={progress} />
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
