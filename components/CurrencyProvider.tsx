"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  CURRENCY_STORAGE_KEY,
  DEFAULT_CURRENCY,
  resolveCurrency,
  type Currency,
} from "@/lib/currency";
import { DEFAULT_USD_PER_ILS, getUsdPerIls } from "@/lib/fx-rate";

type CurrencyContextValue = {
  currency: Currency;
  usdPerIls: number;
  setCurrency: (next: Currency) => void;
};

// Real, non-null default (not createContext(null) + throw-if-missing): any
// component using useCurrency() outside a provider (e.g. a test that doesn't
// wrap in <CurrencyProvider>) still renders correctly at the ILS default.
export const CurrencyContext = createContext<CurrencyContextValue>({
  currency: DEFAULT_CURRENCY,
  usdPerIls: DEFAULT_USD_PER_ILS,
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);
  const [usdPerIls, setUsdPerIls] = useState<number>(DEFAULT_USD_PER_ILS);

  useEffect(() => {
    setCurrencyState(resolveCurrency(localStorage.getItem(CURRENCY_STORAGE_KEY)));
    getUsdPerIls().then(setUsdPerIls);
  }, []);

  function setCurrency(next: Currency) {
    setCurrencyState(next);
    localStorage.setItem(CURRENCY_STORAGE_KEY, next);
  }

  return (
    <CurrencyContext.Provider value={{ currency, usdPerIls, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
