import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createFakeSupabaseClient,
  createFakeQueryBuilder,
} from "@/lib/test-utils/fake-supabase-client";
import { brokers } from "@/lib/test-utils/fixtures";

const fakeClient = createFakeSupabaseClient();

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => Promise.resolve(fakeClient),
}));

import { getBrokers, getBrokerBySlug, recordReferralClick } from "./catalog-server";

function brokerRow(b: (typeof brokers)[number]) {
  return { id: b.id, slug: b.slug, name: b.name, logo_url: b.logoUrl, referral_url: b.referralUrl };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getBrokers", () => {
  it("returns mapped brokers", async () => {
    fakeClient.from.mockImplementation((table: string) => {
      if (table === "brokers") {
        return createFakeQueryBuilder({ data: brokers.map(brokerRow), error: null });
      }
      return createFakeQueryBuilder({ data: null, error: null });
    });

    expect(await getBrokers()).toEqual(brokers);
    expect(fakeClient.from).toHaveBeenCalledWith("brokers");
  });
});

describe("getBrokerBySlug", () => {
  it("returns a mapped Broker for a known slug", async () => {
    const broker = brokers[0];
    fakeClient.from.mockImplementation((table: string) => {
      if (table === "brokers") {
        return createFakeQueryBuilder({ data: brokerRow(broker), error: null });
      }
      return createFakeQueryBuilder({ data: null, error: null });
    });

    expect(await getBrokerBySlug(broker.slug)).toEqual(broker);
  });

  it("returns null for an unknown slug", async () => {
    fakeClient.from.mockImplementation(() => createFakeQueryBuilder({ data: null, error: null }));
    expect(await getBrokerBySlug("does-not-exist")).toBeNull();
  });
});

describe("recordReferralClick", () => {
  it("logs the click with the current user's id", async () => {
    fakeClient.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    const builder = createFakeQueryBuilder({ data: null, error: null });
    fakeClient.from.mockReturnValue(builder);

    await recordReferralClick("br1");

    expect(fakeClient.from).toHaveBeenCalledWith("referral_clicks");
    expect(builder.insert).toHaveBeenCalledWith({ broker_id: "br1", user_id: "u1" });
  });

  it("logs anonymously when no user is signed in", async () => {
    fakeClient.auth.getUser.mockResolvedValue({ data: { user: null } });
    const builder = createFakeQueryBuilder({ data: null, error: null });
    fakeClient.from.mockReturnValue(builder);

    await recordReferralClick("br1");

    expect(builder.insert).toHaveBeenCalledWith({ broker_id: "br1", user_id: null });
  });

  it("throws when the insert fails", async () => {
    fakeClient.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    fakeClient.from.mockReturnValue(
      createFakeQueryBuilder({ data: null, error: new Error("db error") }),
    );

    await expect(recordReferralClick("br1")).rejects.toThrow("db error");
  });
});
