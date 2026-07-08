import { BenefitCard } from "@/components/BenefitCard";
import { benefits, companies, demoUser, isEligible } from "@/lib/dummy-data";

export default function Home() {
  return (
    <div className="min-h-screen px-6 py-16 sm:px-12 sm:py-24 max-w-3xl mx-auto">
      <header className="mb-16">
        <p className="text-sm font-[family-name:var(--font-geist-mono)] text-foreground/60">
          ShareClub
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
          Real perks for real shareholders.
        </h1>
        <p className="mt-3 text-foreground/70">
          Hold shares in a company, claim the benefits it offers you.
        </p>
      </header>

      <main>
        <h2 className="text-sm font-medium text-foreground/60 mb-4 uppercase tracking-wide">
          Benefits feed
        </h2>
        <div className="grid gap-4">
          {benefits.map((benefit) => {
            const company = companies.find((c) => c.id === benefit.companyId)!;
            const eligible = isEligible(benefit, demoUser.portfolioWorth, demoUser.holdings);
            return (
              <BenefitCard
                key={benefit.id}
                benefit={benefit}
                company={company}
                eligible={eligible}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
