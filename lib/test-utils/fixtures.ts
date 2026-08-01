// Static fixture data for tests only — production code must go through the
// real data layers (lib/catalog-data.ts, lib/holdings-data.ts, lib/auth.ts).
// Kept in its own explicit file so no page can accidentally re-import it.

import type { Company, Benefit, Holding, MembershipTier } from "@/lib/domain/eligibility";
import type { Broker } from "@/features/referrals/data/broker-mappers";

export const tiers: MembershipTier[] = [
  { id: "t-silver", name: "Silver", minPortfolioValue: 0, rank: 1 },
  { id: "t-gold", name: "Gold", minPortfolioValue: 20000, rank: 2 },
  { id: "t-platinum", name: "Platinum", minPortfolioValue: 50000, rank: 3 },
];

export const companies: Company[] = [
  { id: "c1", name: "Aurora Airlines", ticker: "AURA", sector: "aviation" },
  { id: "c2", name: "Beacon Coffee Co.", ticker: "BEAN", sector: "retail" },
  { id: "c3", name: "Cascade Outdoors", ticker: "CSCO", sector: "retail" },
  { id: "c4", name: "NovaTech Cloud", ticker: "NVTC", sector: "technology" },
  { id: "c5", name: "Solstice Beauty", ticker: "SLST", sector: "retail" },
  { id: "c6", name: "Pinnacle Fitness", ticker: "PNCL", sector: "leisure_entertainment" },
  { id: "c7", name: "Meridian Books", ticker: "MRDN", sector: "retail" },
];

export const benefits: Benefit[] = [
  {
    id: "b1",
    companyId: "c1",
    title: "10% off any flight",
    description: "Redeem a one-time discount code for domestic or international flights.",
    minTierId: "t-silver",
  },
  {
    id: "b2",
    companyId: "c2",
    title: "Free drink every visit",
    description: "Show your redemption code at any Beacon Coffee location for a free drink.",
    minTierId: "t-silver",
  },
  {
    id: "b3",
    companyId: "c3",
    title: "20% off gear",
    description: "One-time discount code for any in-store or online purchase.",
    minTierId: "t-gold",
  },
  {
    id: "b4",
    companyId: "c4",
    title: "Free cloud storage upgrade",
    description: "Bump your storage tier at no extra cost, for as long as you hold.",
    minTierId: "t-gold",
  },
  {
    id: "b5",
    companyId: "c4",
    title: "Priority support line",
    description: "Skip the queue with a dedicated support line for shareholders.",
    minTierId: "t-silver",
  },
  {
    id: "b6",
    companyId: "c5",
    title: "Quarterly beauty box",
    description: "A curated box of new releases shipped to your door every quarter.",
    minTierId: "t-platinum",
  },
  {
    id: "b7",
    companyId: "c6",
    title: "Free personal training session",
    description: "One complimentary 1:1 session at any Pinnacle Fitness location.",
    minTierId: "t-gold",
  },
  {
    id: "b8",
    companyId: "c7",
    title: "10% off any book order",
    description: "A standing discount code for online and in-store purchases.",
    minTierId: "t-silver",
  },
];

export const brokers: Broker[] = [
  { id: "br1", slug: "meitav", name: "Meitav Trade", logoUrl: null, referralUrl: "https://www.meitav.co.il/trade" },
  { id: "br2", slug: "ibi", name: "IBI Trade", logoUrl: null, referralUrl: "https://www.ibi.co.il/" },
];

// Placeholder "logged in" user, used only in tests to exercise eligibility coloring.
// portfolioWorth of $25,000 lands in Gold (t-gold): eligible for silver+gold
// benefits, locked out of the platinum one (b6).
// Manually-added holdings (not from a file import) always match a catalog company, so they're
// always Israeli exposure by construction — see features/portfolio/data/holdings.ts's addHolding.
function manualHolding(companyId: string, percentage: number): Holding {
  return { companyId, rawName: null, ticker: null, isIsraeli: true, percentage };
}

export const demoUser = {
  portfolioWorth: 25000,
  holdings: [
    manualHolding("c1", 5), // $1,250 in Aurora
    manualHolding("c2", 60), // $15,000 in Beacon
    manualHolding("c4", 10), // $2,500 in NovaTech
    manualHolding("c5", 15), // $3,750 in Solstice
    manualHolding("c6", 5), // $1,250 in Pinnacle
    // c7 (Meridian Books) intentionally has zero holdings — the donut still
    // renders it as unallocated cash; eligibility no longer depends on this.
  ] satisfies Holding[],
};
