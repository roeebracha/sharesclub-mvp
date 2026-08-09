"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { BenefitCard } from "@/features/benefits/components/BenefitCard";
import { ShareModal } from "@/components/ShareModal";
import { Button } from "@/components/ui/Button";
import {
  benefitProgress,
  israeliExposure,
  type Benefit,
  type Company,
  type Holding,
  type MembershipTier,
  type Sector,
} from "@/lib/domain/eligibility";
import { SECTOR_LABELS } from "@/features/benefits/components/sector-meta";
import { getCompanies, getBenefits, getMembershipTiers } from "@/features/benefits/data/catalog-client";
import { getHoldings, getPortfolioWorth } from "@/features/portfolio/data/holdings";

export default function BenefitsPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [portfolioWorth, setPortfolioWorth] = useState(0);
  const [sectorFilter, setSectorFilter] = useState<Sector | "all">("all");

  useEffect(() => {
    getCompanies().then(setCompanies);
    getBenefits().then(setBenefits);
    getMembershipTiers().then(setTiers);
    getHoldings().then(setHoldings);
    getPortfolioWorth().then(setPortfolioWorth);
  }, []);

  const sectorsPresent = Array.from(new Set(companies.map((c) => c.sector)));
  const exposure = israeliExposure(holdings);

  const items = benefits
    .map((benefit) => {
      const company = companies.find((c) => c.id === benefit.companyId);
      if (!company) return null;
      if (sectorFilter !== "all" && company.sector !== sectorFilter) return null;
      const progress = benefitProgress(benefit, portfolioWorth, tiers, exposure);
      return { benefit, company, progress };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const ready = items.filter((i) => i.progress.eligible);
  const locked = items.filter((i) => !i.progress.eligible);

  function celebrate() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.7 } });
  }

  return (
    <div className="min-h-screen px-6 py-16 sm:px-12 sm:py-24 max-w-3xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Real perks for real shareholders.
        </h1>
        <p className="mt-3 text-foreground/70">
          Hold shares in a company, claim the benefits it offers you.
        </p>
        <div className="mt-6">
          <ShareModal
            variant="portfolio"
            unlockedCount={ready.length}
            totalCount={items.length}
            trigger={<Button variant="primary">Share your progress</Button>}
          />
        </div>
      </header>

      <div className="mb-8 flex flex-wrap items-center gap-0.5 rounded-full bg-black/5 p-1 text-sm dark:bg-white/5 sm:gap-1">
        <button
          onClick={() => setSectorFilter("all")}
          className={`rounded-full px-2.5 py-1.5 transition-colors sm:px-3 ${
            sectorFilter === "all"
              ? "bg-primary text-white"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          All
        </button>
        {sectorsPresent.map((sector) => (
          <button
            key={sector}
            onClick={() => setSectorFilter(sector)}
            className={`rounded-full px-2.5 py-1.5 transition-colors sm:px-3 ${
              sectorFilter === sector
                ? "bg-primary text-white"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            {SECTOR_LABELS[sector]}
          </button>
        ))}
      </div>

      <main className="grid gap-12">
        <section>
          <h2 className="text-sm font-medium text-foreground/60 mb-4 uppercase tracking-wide">
            Ready to claim
          </h2>
          {ready.length === 0 ? (
            <p className="text-sm text-foreground/60">
              Nothing unlocked yet — keep building your holdings.
            </p>
          ) : (
            <div className="grid gap-4">
              {ready.map(({ benefit, company, progress }) => (
                <BenefitCard
                  key={benefit.id}
                  benefit={benefit}
                  company={company}
                  eligible
                  progress={progress}
                  onClaim={celebrate}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-sm font-medium text-foreground/60 mb-4 uppercase tracking-wide">
            Locked / almost there
          </h2>
          {locked.length === 0 ? (
            <p className="text-sm text-foreground/60">
              You&apos;ve unlocked everything. Nice.
            </p>
          ) : (
            <div className="grid gap-4">
              {locked.map(({ benefit, company, progress }) => (
                <BenefitCard
                  key={benefit.id}
                  benefit={benefit}
                  company={company}
                  eligible={false}
                  progress={progress}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
