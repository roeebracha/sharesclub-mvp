import { describe, it, expect } from "vitest";
import { mapBrokerRow } from "./broker-mappers";

describe("mapBrokerRow", () => {
  it("maps a snake_case row to a camelCase Broker", () => {
    expect(
      mapBrokerRow({
        id: "b1",
        slug: "meitav",
        name: "Meitav Trade",
        logo_url: null,
        referral_url: "https://www.meitav.co.il/trade",
      }),
    ).toEqual({
      id: "b1",
      slug: "meitav",
      name: "Meitav Trade",
      logoUrl: null,
      referralUrl: "https://www.meitav.co.il/trade",
    });
  });
});
