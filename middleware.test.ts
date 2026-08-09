import { describe, it, expect } from "vitest";
import { isProtectedRoute, isAuthRoute } from "@/middleware";

describe("isProtectedRoute", () => {
  it("treats /, /dashboard, /import, and /benefits as protected", () => {
    expect(isProtectedRoute("/")).toBe(true);
    expect(isProtectedRoute("/dashboard")).toBe(true);
    expect(isProtectedRoute("/import")).toBe(true);
    // /benefits (the list page) was carved out of the protected home page in SHR-016 — it uses
    // the same auth-throwing getHoldings()/getPortfolioWorth() home used, so it needs the same
    // gate, or an anonymous visit throws "Not signed in." (found via manual QA, not a design
    // decision to leave it open).
    expect(isProtectedRoute("/benefits")).toBe(true);
  });

  it("treats other routes as not protected", () => {
    expect(isProtectedRoute("/login")).toBe(false);
    expect(isProtectedRoute("/signup")).toBe(false);
    expect(isProtectedRoute("/benefits/b1")).toBe(false);
  });
});

describe("isAuthRoute", () => {
  it("treats /login and /signup as auth routes", () => {
    expect(isAuthRoute("/login")).toBe(true);
    expect(isAuthRoute("/signup")).toBe(true);
  });

  it("treats other routes as not auth routes", () => {
    expect(isAuthRoute("/")).toBe(false);
    expect(isAuthRoute("/dashboard")).toBe(false);
  });
});
