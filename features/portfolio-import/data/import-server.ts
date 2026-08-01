"use server";

// The Server Action behind the upload form. Runs server-side (not client-side, not a REST
// route) using the existing session-scoped lib/supabase/server.ts client — no service-role key,
// RLS unchanged. See "Portfolio import" in architecture/DECISIONS.md for the full design.

import { createClient } from "@/lib/supabase/server";
import { getCompanies } from "@/features/benefits/data/catalog-server";
import { getBrokerAdapter } from "@/features/portfolio-import/parsers/registry";
import { parseFile } from "@/features/portfolio-import/parsers/parse-file";
import { normalize } from "@/features/portfolio-import/parsers/normalize";

export type ImportResult = {
  saved: number;
  skipped: number;
  skippedReasons: string[];
};

export async function importPortfolio(formData: FormData): Promise<ImportResult> {
  const brokerId = formData.get("brokerId");
  const file = formData.get("file");

  if (typeof brokerId !== "string" || !brokerId) {
    throw new Error("Pick a broker.");
  }
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Choose a file to upload.");
  }

  const adapter = getBrokerAdapter(brokerId);
  if (!adapter) {
    throw new Error(`Unknown broker "${brokerId}".`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");

  const buffer = Buffer.from(await file.arrayBuffer());
  const rawRows = await parseFile(buffer, file.name, adapter.headerRow);
  const companies = await getCompanies();
  const { holdings, totalValue, skipped } = normalize(adapter, rawRows, companies);

  // Full-replace, not upsert-by-key: an export is a snapshot of the user's current portfolio,
  // not a transaction log — a stale row from a since-sold position must not survive an upload.
  const { error: deleteError } = await supabase.from("holdings").delete().eq("user_id", user.id);
  if (deleteError) throw deleteError;

  if (holdings.length > 0) {
    const { error: insertError } = await supabase.from("holdings").insert(
      holdings.map((h) => ({
        user_id: user.id,
        company_id: h.companyId,
        raw_name: h.rawName,
        ticker: h.ticker,
        is_israeli: h.isIsraeli,
        percentage: h.percentage,
      })),
    );
    if (insertError) throw insertError;
  }

  const { error: worthError } = await supabase
    .from("users")
    .update({ portfolio_worth: totalValue })
    .eq("id", user.id);
  if (worthError) throw worthError;

  return {
    saved: holdings.length,
    skipped: skipped.length,
    skippedReasons: skipped.map((s) => s.reason),
  };
}
