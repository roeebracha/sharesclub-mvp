"use client";

// Data-access layer for the public benefits catalog (companies/benefits).
// Public-read tables — no auth required, but still goes through Supabase so
// it stops being static dummy data.

import { createClient } from "@/lib/supabase/client";
import type { Benefit, Company, ThresholdType } from "@/lib/dummy-data";

export async function getCompanies(): Promise<Company[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("companies").select("id, name, ticker");
  if (error) throw error;
  return data ?? [];
}

export async function getBenefits(): Promise<Benefit[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("benefits")
    .select("id, company_id, title, description, threshold_type, threshold_value");
  if (error) throw error;
  return (data ?? []).map(
    (b: {
      id: string;
      company_id: string;
      title: string;
      description: string;
      threshold_type: ThresholdType;
      threshold_value: number;
    }) => ({
      id: b.id,
      companyId: b.company_id,
      title: b.title,
      description: b.description,
      thresholdType: b.threshold_type,
      thresholdValue: b.threshold_value,
    }),
  );
}
