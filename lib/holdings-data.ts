"use client";

// Data-access layer for the personal dashboard's holdings CRUD.
//
// This is intentionally shaped like a real data layer (async functions, one
// responsibility each) even though it currently just mutates an in-memory
// array seeded from `demoUser`. When auth + Supabase are wired in (Phase 3),
// swap the internals of these functions to query/update the `holdings` and
// `users` tables — the dashboard UI that calls them won't need to change.
//
// State resets on page refresh by design (no localStorage): real persistence
// arrives once this is backed by the database, not before.

import { demoUser, type Holding } from "@/lib/dummy-data";

let holdingsStore: Holding[] = [...demoUser.holdings];
let portfolioWorthStore = demoUser.portfolioWorth;

function totalPercentage(holdings: Holding[], excludeCompanyId?: string) {
  return holdings
    .filter((h) => h.companyId !== excludeCompanyId)
    .reduce((sum, h) => sum + h.percentage, 0);
}

export async function getHoldings(): Promise<Holding[]> {
  return holdingsStore;
}

export async function getPortfolioWorth(): Promise<number> {
  return portfolioWorthStore;
}

export async function setPortfolioWorth(value: number): Promise<number> {
  portfolioWorthStore = value;
  return portfolioWorthStore;
}

export async function addHolding(companyId: string, percentage: number): Promise<Holding[]> {
  if (holdingsStore.some((h) => h.companyId === companyId)) {
    throw new Error("You already hold this company — edit it instead.");
  }
  if (totalPercentage(holdingsStore) + percentage > 100) {
    throw new Error("Total holdings can't exceed 100% of your portfolio.");
  }
  holdingsStore = [...holdingsStore, { companyId, percentage }];
  return holdingsStore;
}

export async function updateHolding(companyId: string, percentage: number): Promise<Holding[]> {
  if (totalPercentage(holdingsStore, companyId) + percentage > 100) {
    throw new Error("Total holdings can't exceed 100% of your portfolio.");
  }
  holdingsStore = holdingsStore.map((h) =>
    h.companyId === companyId ? { ...h, percentage } : h
  );
  return holdingsStore;
}

export async function deleteHolding(companyId: string): Promise<Holding[]> {
  holdingsStore = holdingsStore.filter((h) => h.companyId !== companyId);
  return holdingsStore;
}
