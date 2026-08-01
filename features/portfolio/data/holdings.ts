"use client";

// Data-access layer for the personal dashboard's holdings CRUD.
//
// Backed by the real `holdings`/`users` tables via Supabase, scoped to the
// current signed-in user (RLS is the defense-in-depth backstop). Function
// signatures are unchanged from the in-memory version so the dashboard UI
// didn't need to change.

import { createClient } from "@/lib/supabase/client";
import type { Holding } from "@/lib/domain/eligibility";
import { mapHoldingRow } from "./holdings-mappers";

function totalPercentage(holdings: Holding[], excludeCompanyId?: string) {
  return holdings
    .filter((h) => h.companyId !== excludeCompanyId)
    .reduce((sum, h) => sum + h.percentage, 0);
}

type SupabaseLike = ReturnType<typeof createClient>;

async function requireUserId(supabase: SupabaseLike) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");
  return user.id;
}

export async function getHoldings(): Promise<Holding[]> {
  const supabase = createClient();
  const userId = await requireUserId(supabase);
  const { data, error } = await supabase
    .from("holdings")
    .select("company_id, raw_name, ticker, is_israeli, percentage")
    .eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map(mapHoldingRow);
}

export async function getPortfolioWorth(): Promise<number> {
  const supabase = createClient();
  const userId = await requireUserId(supabase);
  const { data, error } = await supabase
    .from("users")
    .select("portfolio_worth")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data.portfolio_worth;
}

export async function setPortfolioWorth(value: number): Promise<number> {
  const supabase = createClient();
  const userId = await requireUserId(supabase);
  const { error } = await supabase
    .from("users")
    .update({ portfolio_worth: value })
    .eq("id", userId);
  if (error) throw error;
  return getPortfolioWorth();
}

export async function addHolding(companyId: string, percentage: number): Promise<Holding[]> {
  const supabase = createClient();
  const userId = await requireUserId(supabase);
  const current = await getHoldings();
  if (current.some((h) => h.companyId === companyId)) {
    throw new Error("You already hold this company — edit it instead.");
  }
  if (totalPercentage(current) + percentage > 100) {
    throw new Error("Total holdings can't exceed 100% of your portfolio.");
  }
  const { error } = await supabase
    .from("holdings")
    // Every company in `companies` is Israeli by product definition (see "Benefit catalog
    // content" in DECISIONS.md), so a manually-picked holding is always Israeli exposure.
    .insert({ user_id: userId, company_id: companyId, percentage, is_israeli: true });
  if (error) throw error;
  return getHoldings();
}

export async function updateHolding(companyId: string, percentage: number): Promise<Holding[]> {
  const supabase = createClient();
  const userId = await requireUserId(supabase);
  const current = await getHoldings();
  if (totalPercentage(current, companyId) + percentage > 100) {
    throw new Error("Total holdings can't exceed 100% of your portfolio.");
  }
  const { error } = await supabase
    .from("holdings")
    .update({ percentage })
    .eq("user_id", userId)
    .eq("company_id", companyId);
  if (error) throw error;
  return getHoldings();
}

export async function deleteHolding(companyId: string): Promise<Holding[]> {
  const supabase = createClient();
  const userId = await requireUserId(supabase);
  const { error } = await supabase
    .from("holdings")
    .delete()
    .eq("user_id", userId)
    .eq("company_id", companyId);
  if (error) throw error;
  return getHoldings();
}
