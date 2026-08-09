"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PortfolioDonut } from "@/features/portfolio/components/PortfolioDonut";
import { TierBadge } from "@/features/portfolio/components/TierBadge";
import { LiveHoldingsPanel } from "@/features/portfolio/components/LiveHoldingsPanel";
import { TaseIndicesStrip } from "@/features/portfolio/components/TaseIndicesStrip";
import { Button } from "@/components/ui/Button";
import type { Benefit, Company, Holding, MembershipTier } from "@/lib/domain/eligibility";
import { getCompanies, getBenefits, getMembershipTiers } from "@/features/benefits/data/catalog-client";
import { getHoldings, getPortfolioWorth } from "@/features/portfolio/data/holdings";
import { getCurrentUser } from "@/features/auth/data/auth";

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [portfolioWorth, setPortfolioWorth] = useState(0);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    getCompanies().then(setCompanies);
    getBenefits().then(setBenefits);
    getMembershipTiers().then(setTiers);
    getHoldings().then(setHoldings);
    getPortfolioWorth().then(setPortfolioWorth);
    getCurrentUser().then((user) => setUserName(user?.name ?? null));
  }, []);

  return (
    <div className="min-h-screen px-6 py-16 sm:px-12 sm:py-24 max-w-3xl mx-auto">
      <header className="mb-10">
        <p className="text-sm font-[family-name:var(--font-geist-mono)] text-foreground/60">
          Your portfolio
        </p>
        {userName && (
          <p className="mt-1 text-sm text-foreground/70">
            Welcome to SharesClub, {userName}
          </p>
        )}
        <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
          Your portfolio, always in view.
        </h1>
        <p className="mt-3 text-foreground/70">
          Track your holdings and the market around them.{" "}
          <Link href="/benefits" className="text-primary hover:underline">
            Head to Benefits
          </Link>{" "}
          to claim your perks.
        </p>
      </header>

      <section className="relative mb-16">
        <div className="bg-glow pointer-events-none absolute inset-0 -z-10" aria-hidden />
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <div className="flex flex-col items-center gap-6">
            <PortfolioDonut
              holdings={holdings}
              companies={companies}
              portfolioWorth={portfolioWorth}
            />
            <TierBadge portfolioWorth={portfolioWorth} tiers={tiers} benefits={benefits} />
            <Link href="/benefits">
              <Button variant="primary">View your benefits</Button>
            </Link>
          </div>
          <LiveHoldingsPanel holdings={holdings} companies={companies} />
        </div>
      </section>

      <div className="mb-8">
        <TaseIndicesStrip />
      </div>
    </div>
  );
}
