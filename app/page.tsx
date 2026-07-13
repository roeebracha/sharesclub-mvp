"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { BenefitCard } from "@/components/BenefitCard";
import { PortfolioDonut } from "@/components/PortfolioDonut";
import { ShareModal } from "@/components/ShareModal";
import { Button } from "@/components/ui/Button";
import {
  benefitProgress,
  type Benefit,
  type Company,
  type Holding,
} from "@/lib/dummy-data";
import { getCompanies, getBenefits } from "@/lib/catalog-data";
import { getHoldings, getPortfolioWorth } from "@/lib/holdings-data";
import { getCurrentUser } from "@/lib/auth";

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [portfolioWorth, setPortfolioWorth] = useState(0);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    getCompanies().then(setCompanies);
    getBenefits().then(setBenefits);
    getHoldings().then(setHoldings);
    getPortfolioWorth().then(setPortfolioWorth);
    getCurrentUser().then((user) => setUserName(user?.name ?? null));
  }, []);

  const items = benefits
    .map((benefit) => {
      const company = companies.find((c) => c.id === benefit.companyId);
      if (!company) return null;
      const progress = benefitProgress(benefit, portfolioWorth, holdings);
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
        <p className="text-sm font-[family-name:var(--font-geist-mono)] text-foreground/60">
          Your portfolio
        </p>
        {userName && (
          <p className="mt-1 text-sm text-foreground/70">
            Welcome to ShareClub, {userName}
          </p>
        )}
        <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
          Real perks for real shareholders.
        </h1>
        <p className="mt-3 text-foreground/70">
          Hold shares in a company, claim the benefits it offers you.
        </p>
      </header>

      <section className="relative mb-16 flex flex-col items-center gap-6">
        <div className="bg-glow pointer-events-none absolute inset-0 -z-10" aria-hidden />
        <PortfolioDonut
          holdings={holdings}
          companies={companies}
          portfolioWorth={portfolioWorth}
        />
        <ShareModal
          variant="portfolio"
          unlockedCount={ready.length}
          totalCount={items.length}
          trigger={<Button variant="primary">Share your progress</Button>}
        />
      </section>

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
