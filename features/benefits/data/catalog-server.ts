// Server-component-safe twin of catalog-client.ts — same mappers, server
// Supabase client (lib/supabase/server.ts). Client components must use
// catalog-client.ts instead; this file has no "use client" directive and
// must never be imported from one.

import { createClient } from "@/lib/supabase/server";
import type { Benefit, Company, MembershipTier } from "@/lib/domain/eligibility";
import { mapCompanyRow, mapBenefitRow, mapTierRow } from "./catalog-mappers";

export async function getCompanies(): Promise<Company[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("companies").select("id, name, ticker, sector");
  if (error) throw error;
  return (data ?? []).map(mapCompanyRow);
}

export async function getBenefitById(id: string): Promise<Benefit | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("benefits")
    .select("id, company_id, title, description, min_tier_id")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return mapBenefitRow(data);
}

export async function getCompanyById(id: string): Promise<Company | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("companies")
    .select("id, name, ticker, sector")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return mapCompanyRow(data);
}

export async function getMembershipTiers(): Promise<MembershipTier[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("membership_tiers")
    .select("id, name, min_portfolio_value, rank")
    .order("rank");
  if (error) throw error;
  return (data ?? []).map(mapTierRow);
}
