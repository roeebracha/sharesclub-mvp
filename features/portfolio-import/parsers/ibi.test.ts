import { describe, it, expect } from "vitest";
import { ibiAdapter } from "./ibi";
import type { SecurityEntity } from "./entities";

function entity(overrides: Partial<SecurityEntity>): SecurityEntity {
  return { name: "", ...overrides };
}

describe("ibiAdapter.extractTicker", () => {
  // All of these are real `שם נייר` values from the sample IBI export analyzed 2026-08-01.
  const nameShapes: [string, string][] = [
    ["ADV MICRO(AMD)", "AMD"],
    ["ORACLE(ORCL)", "ORCL"],
    ["AAPLE COM(AAPL)", "AAPL"], // real sample has this misspelling — still extracts correctly
    ["MICROSOFT(MSFT)", "MSFT"],
    ["INVESCO  (QQQ)", "QQQ"],
    ["GOOG US", "GOOG"],
    ["VOO US", "VOO"],
    ["META US", "META"],
    ["AMZN     ‬אמאזון", "AMZN"], // ticker + bidi mark + Hebrew name
  ];

  it.each(nameShapes)("extracts %s -> %s", (name, expected) => {
    expect(ibiAdapter.extractTicker(entity({ name }))).toBe(expected);
  });

  it("returns null for a cash row with no ticker shape at all", () => {
    expect(ibiAdapter.extractTicker(entity({ name: "דולר ארה״ב" }))).toBeNull();
  });

  it("trusts a populated ticker column over parsing the name", () => {
    expect(ibiAdapter.extractTicker(entity({ name: "ADV MICRO(AMD)", ticker: "AMD-X" }))).toBe(
      "AMD-X",
    );
  });
});

describe("ibiAdapter.isIsraeli", () => {
  it("is false for a foreign stock", () => {
    expect(ibiAdapter.isIsraeli(entity({ securityType: "מניה זרה בחו״ל" }))).toBe(false);
  });

  it("is false for a foreign fund/ETF", () => {
    expect(ibiAdapter.isIsraeli(entity({ securityType: "קרנות נאמנות זרות" }))).toBe(false);
  });

  it("is false for foreign-currency cash — not market exposure either way", () => {
    expect(ibiAdapter.isIsraeli(entity({ securityType: "מט״ח מזומן" }))).toBe(false);
  });

  it("is true for a security type with no foreign/cash marker (unverified positive case)", () => {
    expect(ibiAdapter.isIsraeli(entity({ securityType: "מניה" }))).toBe(true);
  });

  it("is true when securityType is missing entirely", () => {
    expect(ibiAdapter.isIsraeli(entity({}))).toBe(true);
  });
});
