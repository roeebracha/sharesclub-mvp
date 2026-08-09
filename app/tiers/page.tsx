"use client";

import { useEffect, useState } from "react";
import { getMembershipTiers, getBenefits } from "@/features/benefits/data/catalog-client";
import { getPortfolioWorth } from "@/features/portfolio/data/holdings";
import { TierBadge } from "@/features/portfolio/components/TierBadge";
import { Badge } from "@/components/ui/Badge";
import { CurrencyAmount } from "@/components/ui/CurrencyAmount";
import { getUserTier, type Benefit, type MembershipTier } from "@/lib/domain/eligibility";

export default function TiersPage() {
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [portfolioWorth, setPortfolioWorth] = useState(0);

  useEffect(() => {
    getMembershipTiers().then(setTiers);
    getBenefits().then(setBenefits);
    getPortfolioWorth().then(setPortfolioWorth);
  }, []);

  const sortedTiers = [...tiers].sort((a, b) => a.rank - b.rank);
  const currentTier = tiers.length > 0 ? getUserTier(portfolioWorth, tiers) : null;

  return (
    <div className="min-h-screen px-6 py-16 sm:px-12 sm:py-24 max-w-3xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Tiers & Perks</h1>
        <p className="mt-3 text-foreground/70">
          Your journey through SharesClub&apos;s membership tiers, and every perk each one unlocks.
        </p>
      </header>

      {tiers.length > 0 && (
        <section className="mb-12 flex justify-center">
          <TierBadge portfolioWorth={portfolioWorth} tiers={tiers} benefits={benefits} />
        </section>
      )}

      <section className="space-y-4">
        {sortedTiers.map((tier) => {
          const tierBenefits = benefits.filter((b) => b.minTierId === tier.id);
          const isCurrent = currentTier?.id === tier.id;
          const reached = currentTier ? tier.rank <= currentTier.rank : false;

          return (
            <div key={tier.id} className="rounded-xl border border-black/10 p-5 dark:border-white/15">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">{tier.name}</h2>
                  {isCurrent && <Badge variant="success">Current</Badge>}
                  {!isCurrent && reached && <Badge variant="muted">Reached</Badge>}
                </div>
                <p className="text-sm text-foreground/60">
                  <CurrencyAmount amountILS={tier.minPortfolioValue} />+
                </p>
              </div>

              {tierBenefits.length > 0 ? (
                <ul className="mt-3 space-y-1 text-sm text-foreground/70">
                  {tierBenefits.map((benefit) => (
                    <li key={benefit.id}>{benefit.title}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-foreground/50">No perks at this tier yet.</p>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
