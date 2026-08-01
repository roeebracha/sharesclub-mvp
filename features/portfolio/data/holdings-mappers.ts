// Pure snake_case row -> camelCase domain object mapper for holdings. No
// Supabase import — shared by holdings.ts (client) and holdings-server.ts
// (server), mirrors features/benefits/data/catalog-mappers.ts.

import type { Holding } from "@/lib/domain/eligibility";

export type HoldingRow = {
  company_id: string | null;
  raw_name: string | null;
  ticker: string | null;
  is_israeli: boolean;
  percentage: number;
};

export function mapHoldingRow(row: HoldingRow): Holding {
  return {
    companyId: row.company_id,
    rawName: row.raw_name,
    ticker: row.ticker,
    isIsraeli: row.is_israeli,
    percentage: row.percentage,
  };
}
