"use client";

// Data-access layer for the public benefits catalog (companies/benefits/tiers).
// Public-read tables — no auth required, but still goes through Supabase so
// it stops being static dummy data.

import { createClient } from "@/lib/supabase/client";
import type { Benefit, Company, MembershipTier, Sector } from "@/lib/eligibility";

export async function getCompanies(): Promise<Company[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("companies").select("id, name, ticker, sector");
  if (error) throw error;
  return (data ?? []).map((c: { id: string; name: string; ticker: string; sector: Sector }) => ({
    id: c.id,
    name: c.name,
    ticker: c.ticker,
    sector: c.sector,
  }));
}

export async function getBenefits(): Promise<Benefit[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("benefits")
    .select("id, company_id, title, description, min_tier_id");
  if (error) throw error;
  return (data ?? []).map(
    (b: { id: string; company_id: string; title: string; description: string; min_tier_id: string }) => ({
      id: b.id,
      companyId: b.company_id,
      title: b.title,
      description: b.description,
      minTierId: b.min_tier_id,
    }),
  );
}

export async function getMembershipTiers(): Promise<MembershipTier[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("membership_tiers")
    .select("id, name, min_portfolio_value, rank")
    .order("rank");
  if (error) throw error;
  return (data ?? []).map(
    (t: { id: string; name: MembershipTier["name"]; min_portfolio_value: number; rank: number }) => ({
      id: t.id,
      name: t.name,
      minPortfolioValue: t.min_portfolio_value,
      rank: t.rank,
    }),
  );
}
