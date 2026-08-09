"use client";

import { useEffect, useState } from "react";
import { getFxRates } from "@/lib/fx-rate";

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export function ExchangeRateTicker() {
  const [rates, setRates] = useState<{ usdPerIls: number; eurPerIls: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    function refresh() {
      getFxRates().then((result) => {
        if (!cancelled) setRates(result);
      });
    }
    refresh();
    const interval = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (!rates) return null;

  return (
    <div className="hidden items-center gap-2 whitespace-nowrap text-xs text-foreground/60 font-[family-name:var(--font-geist-mono)] sm:flex">
      <span>$1 = ₪{(1 / rates.usdPerIls).toFixed(2)}</span>
      <span>€1 = ₪{(1 / rates.eurPerIls).toFixed(2)}</span>
    </div>
  );
}
