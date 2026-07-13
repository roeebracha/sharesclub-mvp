import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createFakeSupabaseClient,
  createFakeQueryBuilder,
} from "@/lib/test-utils/fake-supabase-client";

const fakeClient = createFakeSupabaseClient();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => fakeClient,
}));

import {
  getHoldings,
  getPortfolioWorth,
  setPortfolioWorth,
  addHolding,
  updateHolding,
  deleteHolding,
} from "@/lib/holdings-data";

const USER_ID = "u1";

function holdingsRows(rows: { company_id: string; percentage: number }[]) {
  return createFakeQueryBuilder({ data: rows, error: null });
}

beforeEach(() => {
  vi.clearAllMocks();
  fakeClient.auth.getUser.mockResolvedValue({ data: { user: { id: USER_ID } } });
});

describe("getHoldings", () => {
  it("throws when not signed in", async () => {
    fakeClient.auth.getUser.mockResolvedValue({ data: { user: null } });
    await expect(getHoldings()).rejects.toThrow("Not signed in.");
  });

  it("returns holdings mapped from company_id to companyId", async () => {
    fakeClient.from.mockReturnValue(
      holdingsRows([{ company_id: "c1", percentage: 10 }]),
    );
    const result = await getHoldings();
    expect(fakeClient.from).toHaveBeenCalledWith("holdings");
    expect(result).toEqual([{ companyId: "c1", percentage: 10 }]);
  });
});

describe("getPortfolioWorth", () => {
  it("returns the user's portfolio_worth", async () => {
    fakeClient.from.mockReturnValue(
      createFakeQueryBuilder({ data: { portfolio_worth: 1000 }, error: null }),
    );
    const result = await getPortfolioWorth();
    expect(fakeClient.from).toHaveBeenCalledWith("users");
    expect(result).toBe(1000);
  });
});

describe("setPortfolioWorth", () => {
  it("updates then re-fetches the user's portfolio_worth", async () => {
    fakeClient.from.mockReturnValue(
      createFakeQueryBuilder({ data: { portfolio_worth: 2000 }, error: null }),
    );
    const result = await setPortfolioWorth(2000);
    expect(result).toBe(2000);
  });
});

describe("addHolding", () => {
  it("inserts a new holding when under 100%", async () => {
    fakeClient.from.mockReturnValue(holdingsRows([{ company_id: "c1", percentage: 10 }]));
    const result = await addHolding("c2", 20);
    expect(result).toEqual([{ companyId: "c1", percentage: 10 }]);
  });

  it("throws if the company is already held", async () => {
    fakeClient.from.mockReturnValue(holdingsRows([{ company_id: "c1", percentage: 10 }]));
    await expect(addHolding("c1", 20)).rejects.toThrow(
      "You already hold this company",
    );
  });

  it("throws if the total would exceed 100%", async () => {
    fakeClient.from.mockReturnValue(holdingsRows([{ company_id: "c1", percentage: 90 }]));
    await expect(addHolding("c2", 20)).rejects.toThrow(
      "Total holdings can't exceed 100%",
    );
  });
});

describe("updateHolding", () => {
  it("updates when the new total is under 100%", async () => {
    fakeClient.from.mockReturnValue(
      holdingsRows([
        { company_id: "c1", percentage: 10 },
        { company_id: "c2", percentage: 20 },
      ]),
    );
    const result = await updateHolding("c1", 30);
    expect(result).toEqual([
      { companyId: "c1", percentage: 10 },
      { companyId: "c2", percentage: 20 },
    ]);
  });

  it("throws if the new total would exceed 100% (excluding itself)", async () => {
    fakeClient.from.mockReturnValue(
      holdingsRows([
        { company_id: "c1", percentage: 10 },
        { company_id: "c2", percentage: 80 },
      ]),
    );
    await expect(updateHolding("c1", 95)).rejects.toThrow(
      "Total holdings can't exceed 100%",
    );
  });
});

describe("deleteHolding", () => {
  it("deletes and returns the refreshed holdings list", async () => {
    fakeClient.from.mockReturnValue(holdingsRows([{ company_id: "c2", percentage: 20 }]));
    const result = await deleteHolding("c1");
    expect(result).toEqual([{ companyId: "c2", percentage: 20 }]);
  });
});
