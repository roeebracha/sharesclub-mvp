"use client";

import { useCurrency } from "@/components/CurrencyProvider";
import { formatAmount } from "@/lib/currency";

export function CurrencyAmount({
  amountILS,
  className = "",
}: {
  amountILS: number;
  className?: string;
}) {
  const { currency, usdPerIls } = useCurrency();
  return <span className={className}>{formatAmount(amountILS, currency, usdPerIls)}</span>;
}
