"use client";

import { useEffect, useState } from "react";
import { getStockQuote } from "@/lib/stock-quote";

export function BenefitStockTicker({ ticker }: { ticker: string }) {
  const [isReal, setIsReal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsReal(false);
    getStockQuote(ticker, true).then((quote) => {
      if (!cancelled && quote) setIsReal(true);
    });
    return () => {
      cancelled = true;
    };
  }, [ticker]);

  if (!isReal) return null;

  return (
    <span className="font-[family-name:var(--font-geist-mono)] text-foreground/50">
      {ticker}.TA
    </span>
  );
}
