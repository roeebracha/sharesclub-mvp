import type { SecurityEntity } from "./entities";

// A raw parsed row: header text (exactly as it appeared in the file) -> cell value as a string.
export type RawRow = Record<string, string>;

// One adapter per supported broker. The broker is chosen via a dropdown at upload time (see
// DECISIONS.md "Portfolio import") — there is deliberately no format auto-detection/signature
// matching (considered, explicitly deferred) and no validation that the file matches the
// selected broker.
export type BrokerAdapter = {
  id: string;
  label: string; // shown in the upload form's broker dropdown
  headerRow: number; // 0-indexed row that holds the column headers (rows above are skipped)
  columns: {
    name: string;
    ticker?: string;
    securityNumber?: string;
    quantity?: string;
    price?: string;
    marketValue?: string;
    precomputedPercentage?: string;
    securityType?: string;
    currency?: string;
  };
  extractTicker(entity: SecurityEntity): string | null;
  isIsraeli(entity: SecurityEntity): boolean;
};

export type NormalizedHolding = {
  rawName: string;
  ticker: string | null;
  isIsraeli: boolean;
  companyId: string | null;
  percentage: number;
};

export type NormalizeResult = {
  holdings: NormalizedHolding[];
  totalValue: number;
  skipped: { row: RawRow; reason: string }[];
};
