"use client";

// Client-side data-access layer for the public benefits catalog
// (companies/benefits/tiers). Public-read tables — no auth required, but
// still goes through Supabase so it stops being static dummy data.
//
// Server components must use catalog-server.ts instead — this file's
// createClient() needs a browser (window/cookies), so it cannot run there.

import { createClient } from "@/lib/supabase/client";
import type { Benefit, Company, MembershipTier } from "@/lib/domain/eligibility";
import { mapCompanyRow, mapBenefitRow, mapTierRow } from "./catalog-mappers";

export async function getCompanies(): Promise<Company[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("companies").select("id, name, ticker, sector");
  if (error) throw error;
  return (data ?? []).map(mapCompanyRow);
}

export async function getBenefits(): Promise<Benefit[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("benefits")
    .select("id, company_id, title, description, min_tier_id");
  if (error) throw error;
  return (data ?? []).map(mapBenefitRow);
}

export async function getMembershipTiers(): Promise<MembershipTier[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("membership_tiers")
    .select("id, name, min_portfolio_value, rank")
    .order("rank");
  if (error) throw error;
  return (data ?? []).map(mapTierRow);
}
