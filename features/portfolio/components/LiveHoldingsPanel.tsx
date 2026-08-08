"use client";

import type { Company, Holding } from "@/lib/domain/eligibility";
import { StockQuote } from "@/components/ui/StockQuote";

export function LiveHoldingsPanel({
  holdings,
  companies,
}: {
  holdings: Holding[];
  companies: Company[];
}) {
  const rows = holdings.map((h, i) => {
    const company = companies.find((c) => c.id === h.companyId);
    return {
      key: company?.id ?? `${h.rawName ?? h.ticker ?? "unknown"}-${i}`,
      label: company?.name ?? h.rawName ?? "Unknown",
      ticker: company?.ticker ?? h.ticker,
      // A catalog match is always Israeli by construction (the catalog is Israeli-only);
      // otherwise trust the holding's own import-time-detected flag.
      isIsraeli: company ? true : h.isIsraeli,
    };
  });

  return (
    <div className="rounded-xl border border-black/10 p-4 dark:border-white/15">
      <h2 className="mb-3 text-sm font-medium text-foreground/60 uppercase tracking-wide">
        Your stocks
      </h2>
      {rows.length === 0 ? (
        <p className="text-sm text-foreground/50">No holdings yet.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((row) => (
            <li key={row.key} className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate">{row.label}</span>
              {row.ticker ? (
                <StockQuote ticker={row.ticker} isIsraeli={row.isIsraeli} />
              ) : (
                <span className="text-xs text-foreground/40">—</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
