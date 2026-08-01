// Server-component-safe data access for the brokers referral catalog. Used by
// app/import/page.tsx (list) and app/go/[slug]/route.ts (redirect + click log)
// — both are server-only contexts, so this has no "use client" twin (compare
// features/benefits/data/catalog-server.ts, which does have one, because its
// data is also read from client components).

import { createClient } from "@/lib/supabase/server";
import type { Broker } from "./broker-mappers";
import { mapBrokerRow } from "./broker-mappers";

export async function getBrokers(): Promise<Broker[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brokers")
    .select("id, slug, name, logo_url, referral_url")
    .order("display_order");
  if (error) throw error;
  return (data ?? []).map(mapBrokerRow);
}

export async function getBrokerBySlug(slug: string): Promise<Broker | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brokers")
    .select("id, slug, name, logo_url, referral_url")
    .eq("slug", slug)
    .single();
  if (error || !data) return null;
  return mapBrokerRow(data);
}

// Logs the click as the current user if signed in, anonymously (user_id null)
// otherwise — /go/[slug] is reachable without a session, so this must not
// require one. Throws on a real DB error; the caller decides whether a
// logging failure should still let the redirect happen.
export async function recordReferralClick(brokerId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("referral_clicks")
    .insert({ broker_id: brokerId, user_id: user?.id ?? null });
  if (error) throw error;
}
