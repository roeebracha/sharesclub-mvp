import { describe, it, expect } from "vitest";
import { resolveCurrency, convertFromILS, formatAmount, DEFAULT_CURRENCY } from "./currency";

describe("resolveCurrency", () => {
  it("defaults to ILS when nothing is stored", () => {
    expect(resolveCurrency(null)).toBe("ILS");
  });

  it("defaults to ILS for an invalid stored value", () => {
    expect(resolveCurrency("bogus")).toBe("ILS");
  });

  it("honors an explicit stored ILS choice", () => {
    expect(resolveCurrency("ILS")).toBe("ILS");
  });

  it("honors an explicit stored USD choice", () => {
    expect(resolveCurrency("USD")).toBe("USD");
  });

  it("falls back to DEFAULT_CURRENCY", () => {
    expect(resolveCurrency(null)).toBe(DEFAULT_CURRENCY);
  });
});

describe("convertFromILS", () => {
  it("returns the amount unchanged for ILS regardless of rate", () => {
    expect(convertFromILS(1000, "ILS", 0.27)).toBe(1000);
  });

  it("multiplies by usdPerIls for USD", () => {
    expect(convertFromILS(1000, "USD", 0.3)).toBe(300);
  });

  it("returns 0 for a 0 amount in either currency", () => {
    expect(convertFromILS(0, "ILS", 0.3)).toBe(0);
    expect(convertFromILS(0, "USD", 0.3)).toBe(0);
  });
});

describe("formatAmount", () => {
  it("formats ILS with a ₪ prefix, rounded and comma-grouped", () => {
    expect(formatAmount(12345.6, "ILS", 0.333)).toBe("₪12,346");
  });

  it("formats USD with a $ prefix, converted, rounded and comma-grouped", () => {
    expect(formatAmount(12345, "USD", 0.333)).toBe("$4,111");
  });

  it("formats a zero amount", () => {
    expect(formatAmount(0, "ILS", 0.333)).toBe("₪0");
    expect(formatAmount(0, "USD", 0.333)).toBe("$0");
  });
});
