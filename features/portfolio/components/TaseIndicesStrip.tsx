import { StockQuote } from "@/components/ui/StockQuote";

// Real Yahoo Finance symbols, confirmed live (both instrumentType: "INDEX", currency: "ILS",
// no Agorot conversion needed — unlike company shares, an index has no /100 quirk).
const TASE_INDICES = [
  { label: "TA-125", ticker: "^TA125" },
  { label: "TA-35", ticker: "TA35" },
];

export function TaseIndicesStrip() {
  return (
    <div className="rounded-xl border border-black/10 p-4 dark:border-white/15">
      <h2 className="mb-3 text-sm font-medium text-foreground/60 uppercase tracking-wide">
        TASE indices
      </h2>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {TASE_INDICES.map((index) => (
          <li key={index.ticker} className="flex items-center gap-2 text-sm">
            <span className="text-foreground/70">{index.label}</span>
            <StockQuote ticker={index.ticker} isIsraeli />
          </li>
        ))}
      </ul>
    </div>
  );
}
