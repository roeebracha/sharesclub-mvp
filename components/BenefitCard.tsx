import type { Benefit, Company } from "@/lib/dummy-data";

export function BenefitCard({
  benefit,
  company,
  eligible,
}: {
  benefit: Benefit;
  company: Company;
  eligible: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 transition-opacity ${
        eligible
          ? "border-black/10 dark:border-white/15"
          : "border-black/10 dark:border-white/15 opacity-40 grayscale"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-[family-name:var(--font-geist-mono)] text-foreground/60">
          {company.name} · {company.ticker}
        </span>
        {eligible && (
          <span className="text-xs font-medium text-green-600 dark:text-green-400">
            Eligible
          </span>
        )}
      </div>
      <h3 className="mt-2 text-lg font-semibold">{benefit.title}</h3>
      <p className="mt-1 text-sm text-foreground/70">{benefit.description}</p>
    </div>
  );
}
