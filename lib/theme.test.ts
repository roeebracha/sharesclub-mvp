import { describe, it, expect } from "vitest";
import { resolveTheme, themeBootScript, THEME_STORAGE_KEY } from "./theme";

describe("resolveTheme", () => {
  it("falls back to light when nothing stored and OS prefers light", () => {
    expect(resolveTheme(null, false)).toBe("light");
  });

  it("falls back to dark when nothing stored and OS prefers dark", () => {
    expect(resolveTheme(null, true)).toBe("dark");
  });

  it("prefers an explicit light choice over OS dark", () => {
    expect(resolveTheme("light", true)).toBe("light");
  });

  it("prefers an explicit dark choice over OS light", () => {
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("ignores an invalid stored value and falls back to OS", () => {
    expect(resolveTheme("bogus", true)).toBe("dark");
    expect(resolveTheme("bogus", false)).toBe("light");
  });
});

describe("themeBootScript", () => {
  it("generates a script that reads the storage key, checks matchMedia, and guards with try/catch", () => {
    const script = themeBootScript();
    expect(script).toContain(`localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})`);
    expect(script).toContain("matchMedia(");
    expect(script).toContain('classList.add("dark")');
    expect(script).toContain("try");
    expect(script).toContain("catch");
  });
});
