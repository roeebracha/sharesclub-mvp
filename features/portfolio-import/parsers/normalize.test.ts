import { describe, it, expect } from "vitest";
import { normalize } from "./normalize";
import { ibiAdapter } from "./ibi";
import type { RawRow } from "./types";
import type { Company } from "@/lib/domain/eligibility";
import { companies } from "@/lib/test-utils/fixtures"; // fictional companies, no real overlap — matches reality

// Real rows from the sample IBI export (~/Downloads/data.xlsx, analyzed 2026-08-01).
const amdRow: RawRow = {
  "שם נייר": "ADV MICRO(AMD)",
  "מספר נייר": "102202",
  סימבול: "",
  "סוג נייר": "מניה זרה בחו״ל",
  מטבע: "דולר אמריקאי               001",
  "כמות נוכחית": "8",
  שער: "485.39",
  "שווי נוכחי": "11932.83",
  "אחוז אחזקה": "5.55",
};

const cashRow: RawRow = {
  "שם נייר": "דולר ארה״ב",
  "מספר נייר": "99028",
  סימבול: "",
  "סוג נייר": "מט״ח מזומן",
  מטבע: "שקל חדש                    000",
  "כמות נוכחית": "205.42",
  שער: "307.3",
  "שווי נוכחי": "631.26",
  "אחוז אחזקה": "0.29",
};

describe("normalize (IBI adapter, real sample rows)", () => {
  it("normalizes the AMD row: unmatched (not in the curated catalog), correctly foreign, precomputed percentage trusted", () => {
    const result = normalize(ibiAdapter, [amdRow], companies);
    expect(result.skipped).toEqual([]);
    expect(result.holdings).toEqual([
      { rawName: "ADV MICRO(AMD)", ticker: "AMD", isIsraeli: false, companyId: null, percentage: 5.55 },
    ]);
  });

  it("normalizes the cash row as not-Israeli, not-a-company, still gets a percentage", () => {
    const result = normalize(ibiAdapter, [cashRow], companies);
    expect(result.holdings).toEqual([
      { rawName: "דולר ארה״ב", ticker: null, isIsraeli: false, companyId: null, percentage: 0.29 },
    ]);
  });

  it("matches a company by ticker when one is present in the catalog", () => {
    const auraRow: RawRow = { ...amdRow, "שם נייר": "AURORA(AURA)" };
    const result = normalize(ibiAdapter, [auraRow], companies);
    const aura = companies.find((c) => c.ticker === "AURA") as Company;
    expect(result.holdings[0].companyId).toBe(aura.id);
  });

  it("falls back to computing percentage from market value when precomputed % is absent", () => {
    const noPercentRow: RawRow = { ...amdRow, "אחוז אחזקה": "" };
    const otherRow: RawRow = { ...amdRow, "שם נייר": "ORACLE(ORCL)", "שווי נוכחי": "3919.92", "אחוז אחזקה": "" };
    const result = normalize(ibiAdapter, [noPercentRow, otherRow], companies);
    const total = 11932.83 + 3919.92;
    expect(result.holdings[0].percentage).toBeCloseTo((11932.83 / total) * 100);
    expect(result.holdings[1].percentage).toBeCloseTo((3919.92 / total) * 100);
  });

  it("skips a row with no security name, without dropping the rest of the file", () => {
    const blankRow: RawRow = { ...amdRow, "שם נייר": "" };
    const result = normalize(ibiAdapter, [blankRow, cashRow], companies);
    expect(result.holdings).toHaveLength(1);
    expect(result.skipped).toEqual([{ row: blankRow, reason: "missing security name" }]);
  });

  it("skips a row with a name but no value or percentage signal at all", () => {
    const noValueRow: RawRow = { ...amdRow, "שווי נוכחי": "", "אחוז אחזקה": "" };
    const result = normalize(ibiAdapter, [noValueRow], companies);
    expect(result.holdings).toEqual([]);
    expect(result.skipped).toEqual([{ row: noValueRow, reason: "no value or percentage found" }]);
  });
});
