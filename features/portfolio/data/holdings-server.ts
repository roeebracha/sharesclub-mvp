// Server-component-safe read of the current user's holdings. Unlike
// holdings.ts's getHoldings() (client-side, throws when signed out — used by
// the dashboard, which requires auth), this is for server components that
// render for signed-in AND signed-out visitors (e.g. the benefit detail
// page) — it returns [] rather than throwing when nobody's signed in.

import { createClient } from "@/lib/supabase/server";
import type { Holding } from "@/lib/domain/eligibility";
import { mapHoldingRow } from "./holdings-mappers";

export async function getHoldingsForCurrentUser(): Promise<Holding[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("holdings")
    .select("company_id, raw_name, ticker, is_israeli, percentage")
    .eq("user_id", user.id);
  if (error) throw error;
  return (data ?? []).map(mapHoldingRow);
}
