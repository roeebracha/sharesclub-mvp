// Pure snake_case row -> camelCase domain object mappers for the benefits
// catalog (companies/benefits/membership_tiers). No Supabase import — shared
// by both the client-side (catalog-client.ts) and server-side
// (catalog-server.ts) data-access layers so the mapping logic exists in
// exactly one place.

import type { Benefit, Company, MembershipTier, Sector } from "@/lib/domain/eligibility";

export type CompanyRow = { id: string; name: string; ticker: string; sector: Sector };
export type BenefitRow = {
  id: string;
  company_id: string;
  title: string;
  description: string;
  min_tier_id: string;
};
export type TierRow = {
  id: string;
  name: MembershipTier["name"];
  min_portfolio_value: number;
  rank: number;
};

export function mapCompanyRow(row: CompanyRow): Company {
  return { id: row.id, name: row.name, ticker: row.ticker, sector: row.sector };
}

export function mapBenefitRow(row: BenefitRow): Benefit {
  return {
    id: row.id,
    companyId: row.company_id,
    title: row.title,
    description: row.description,
    minTierId: row.min_tier_id,
  };
}

export function mapTierRow(row: TierRow): MembershipTier {
  return {
    id: row.id,
    name: row.name,
    minPortfolioValue: row.min_portfolio_value,
    rank: row.rank,
  };
}
