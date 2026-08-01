import { describe, it, expect } from "vitest";
import { mapCompanyRow, mapBenefitRow, mapTierRow } from "./catalog-mappers";

describe("catalog-mappers", () => {
  it("maps a company row to camelCase", () => {
    expect(
      mapCompanyRow({ id: "c1", name: "Aurora Airlines", ticker: "AURA", sector: "aviation" }),
    ).toEqual({ id: "c1", name: "Aurora Airlines", ticker: "AURA", sector: "aviation" });
  });

  it("maps a benefit row to camelCase", () => {
    expect(
      mapBenefitRow({
        id: "b1",
        company_id: "c1",
        title: "10% off",
        description: "desc",
        min_tier_id: "t-silver",
      }),
    ).toEqual({
      id: "b1",
      companyId: "c1",
      title: "10% off",
      description: "desc",
      minTierId: "t-silver",
    });
  });

  it("maps a membership tier row to camelCase", () => {
    expect(mapTierRow({ id: "t-gold", name: "Gold", min_portfolio_value: 20000, rank: 2 })).toEqual({
      id: "t-gold",
      name: "Gold",
      minPortfolioValue: 20000,
      rank: 2,
    });
  });
});
