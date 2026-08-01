import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFakeQueryBuilder } from "@/lib/test-utils/fake-supabase-client";
import { benefits, companies, tiers } from "@/lib/test-utils/fixtures";

const fakeClient = { from: vi.fn() };

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => Promise.resolve(fakeClient),
}));

import { getBenefitById, getCompanies, getCompanyById, getMembershipTiers } from "./catalog-server";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("catalog-server", () => {
  it("getCompanies returns all mapped companies", async () => {
    fakeClient.from.mockImplementation((table: string) => {
      if (table === "companies") {
        return createFakeQueryBuilder({
          data: companies.map((c) => ({ id: c.id, name: c.name, ticker: c.ticker, sector: c.sector })),
          error: null,
        });
      }
      return createFakeQueryBuilder({ data: null, error: null });
    });

    expect(await getCompanies()).toEqual(companies);
  });

  it("getBenefitById returns a mapped Benefit", async () => {
    const benefitRow = benefits.find((b) => b.id === "b1")!;
    fakeClient.from.mockImplementation((table: string) => {
      if (table === "benefits") {
        return createFakeQueryBuilder({
          data: {
            id: benefitRow.id,
            company_id: benefitRow.companyId,
            title: benefitRow.title,
            description: benefitRow.description,
            min_tier_id: benefitRow.minTierId,
          },
          error: null,
        });
      }
      return createFakeQueryBuilder({ data: null, error: null });
    });

    expect(await getBenefitById("b1")).toEqual(benefitRow);
  });

  it("getBenefitById returns null for an unknown id", async () => {
    fakeClient.from.mockImplementation(() => createFakeQueryBuilder({ data: null, error: null }));
    expect(await getBenefitById("does-not-exist")).toBeNull();
  });

  it("getCompanyById returns a mapped Company", async () => {
    const companyRow = companies.find((c) => c.id === "c1")!;
    fakeClient.from.mockImplementation((table: string) => {
      if (table === "companies") {
        return createFakeQueryBuilder({
          data: {
            id: companyRow.id,
            name: companyRow.name,
            ticker: companyRow.ticker,
            sector: companyRow.sector,
          },
          error: null,
        });
      }
      return createFakeQueryBuilder({ data: null, error: null });
    });

    expect(await getCompanyById("c1")).toEqual(companyRow);
  });

  it("getMembershipTiers returns mapped tiers ordered by rank", async () => {
    fakeClient.from.mockImplementation((table: string) => {
      if (table === "membership_tiers") {
        return createFakeQueryBuilder({
          data: tiers.map((t) => ({
            id: t.id,
            name: t.name,
            min_portfolio_value: t.minPortfolioValue,
            rank: t.rank,
          })),
          error: null,
        });
      }
      return createFakeQueryBuilder({ data: null, error: null });
    });

    expect(await getMembershipTiers()).toEqual(tiers);
  });
});
