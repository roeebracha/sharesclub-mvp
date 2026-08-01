import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createFakeSupabaseClient,
  createFakeQueryBuilder,
} from "@/lib/test-utils/fake-supabase-client";

const fakeClient = createFakeSupabaseClient();

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => Promise.resolve(fakeClient),
}));

import { getHoldingsForCurrentUser } from "./holdings-server";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getHoldingsForCurrentUser", () => {
  it("returns [] when signed out, without querying holdings", async () => {
    fakeClient.auth.getUser.mockResolvedValue({ data: { user: null } });
    const result = await getHoldingsForCurrentUser();
    expect(result).toEqual([]);
    expect(fakeClient.from).not.toHaveBeenCalled();
  });

  it("returns mapped holdings for the signed-in user", async () => {
    fakeClient.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    fakeClient.from.mockReturnValue(
      createFakeQueryBuilder({
        data: [{ company_id: "c1", raw_name: null, ticker: null, is_israeli: true, percentage: 10 }],
        error: null,
      }),
    );
    const result = await getHoldingsForCurrentUser();
    expect(fakeClient.from).toHaveBeenCalledWith("holdings");
    expect(result).toEqual([
      { companyId: "c1", rawName: null, ticker: null, isIsraeli: true, percentage: 10 },
    ]);
  });
});
