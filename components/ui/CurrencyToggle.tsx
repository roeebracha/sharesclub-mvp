"use client";

import { useCurrency } from "@/components/CurrencyProvider";
import { CURRENCY_SYMBOLS, type Currency } from "@/lib/currency";

export function CurrencyToggle({ className = "" }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  const next: Currency = currency === "ILS" ? "USD" : "ILS";

  return (
    <button
      onClick={() => setCurrency(next)}
      aria-label={`Switch to ${next}`}
      className={`rounded-full px-2.5 py-2 text-sm font-semibold text-foreground/60 transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10 ${className}`}
    >
      {CURRENCY_SYMBOLS[next]}
    </button>
  );
}
