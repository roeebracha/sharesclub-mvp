// Static fixture data for tests only — production code must go through the
// real data layers (lib/catalog-data.ts, lib/holdings-data.ts, lib/auth.ts).
// Kept in its own explicit file so no page can accidentally re-import it.

import type { Company, Benefit, Holding } from "@/lib/eligibility";

export const companies: Company[] = [
  { id: "c1", name: "Aurora Airlines", ticker: "AURA" },
  { id: "c2", name: "Beacon Coffee Co.", ticker: "BEAN" },
  { id: "c3", name: "Cascade Outdoors", ticker: "CSCO" },
  { id: "c4", name: "NovaTech Cloud", ticker: "NVTC" },
  { id: "c5", name: "Solstice Beauty", ticker: "SLST" },
  { id: "c6", name: "Pinnacle Fitness", ticker: "PNCL" },
  { id: "c7", name: "Meridian Books", ticker: "MRDN" },
];

export const benefits: Benefit[] = [
  {
    id: "b1",
    companyId: "c1",
    title: "10% off any flight",
    description: "Redeem a one-time discount code for domestic or international flights.",
    thresholdType: "percent",
    thresholdValue: 1,
  },
  {
    id: "b2",
    companyId: "c2",
    title: "Free drink every visit",
    description: "Show your redemption code at any Beacon Coffee location for a free drink.",
    thresholdType: "amount",
    thresholdValue: 500,
  },
  {
    id: "b3",
    companyId: "c3",
    title: "20% off gear",
    description: "One-time discount code for any in-store or online purchase.",
    thresholdType: "amount",
    thresholdValue: 2000,
  },
  {
    id: "b4",
    companyId: "c4",
    title: "Free cloud storage upgrade",
    description: "Bump your storage tier at no extra cost, for as long as you hold.",
    thresholdType: "percent",
    thresholdValue: 5,
  },
  {
    id: "b5",
    companyId: "c4",
    title: "Priority support line",
    description: "Skip the queue with a dedicated support line for shareholders.",
    thresholdType: "amount",
    thresholdValue: 120,
  },
  {
    id: "b6",
    companyId: "c5",
    title: "Quarterly beauty box",
    description: "A curated box of new releases shipped to your door every quarter.",
    thresholdType: "percent",
    thresholdValue: 50,
  },
  {
    id: "b7",
    companyId: "c6",
    title: "Free personal training session",
    description: "One complimentary 1:1 session at any Pinnacle Fitness location.",
    thresholdType: "percent",
    thresholdValue: 5,
  },
  {
    id: "b8",
    companyId: "c7",
    title: "10% off any book order",
    description: "A standing discount code for online and in-store purchases.",
    thresholdType: "percent",
    thresholdValue: 10,
  },
];

// Placeholder "logged in" user, used only in tests to exercise eligibility coloring.
export const demoUser = {
  portfolioWorth: 1000,
  holdings: [
    { companyId: "c1", percentage: 5 }, // $50 in Aurora
    { companyId: "c2", percentage: 60 }, // $600 in Beacon
    { companyId: "c4", percentage: 10 }, // $100 in NovaTech
    { companyId: "c5", percentage: 15 }, // $150 in Solstice
    { companyId: "c6", percentage: 5 }, // $50 in Pinnacle
    // c7 (Meridian Books) intentionally has zero holdings — exercises the
    // fully-locked/zero-progress state. Remaining 5% stays unallocated cash.
  ] satisfies Holding[],
};
