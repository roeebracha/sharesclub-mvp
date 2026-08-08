"use client";

import { useEffect, useState } from "react";
import { getStockQuote, type StockQuote as StockQuoteData } from "@/lib/stock-quote";
import { CURRENCY_SYMBOLS } from "@/lib/currency";

export function StockQuote({ ticker, isIsraeli }: { ticker: string; isIsraeli: boolean }) {
  const [quote, setQuote] = useState<StockQuoteData | null>(null);

  useEffect(() => {
    let cancelled = false;
    setQuote(null);
    getStockQuote(ticker, isIsraeli).then((result) => {
      if (!cancelled) setQuote(result);
    });
    return () => {
      cancelled = true;
    };
  }, [ticker, isIsraeli]);

  if (!quote) {
    return <span className="text-xs text-foreground/40">—</span>;
  }

  const isUp = quote.changePercent >= 0;
  const changeClass = isUp ? "text-success" : "text-danger";
  const sign = isUp ? "+" : "-";

  return (
    <span className="text-xs font-[family-name:var(--font-geist-mono)] text-foreground/70">
      {CURRENCY_SYMBOLS[quote.currency]}
      {quote.price.toFixed(2)}{" "}
      <span className={changeClass}>
        {sign}
        {Math.abs(quote.changePercent).toFixed(1)}%
      </span>
    </span>
  );
}
