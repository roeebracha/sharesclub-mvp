import { describe, it, expect } from "vitest";
import { isProtectedRoute, isAuthRoute } from "@/middleware";

describe("isProtectedRoute", () => {
  it("treats /, /dashboard, and /import as protected", () => {
    expect(isProtectedRoute("/")).toBe(true);
    expect(isProtectedRoute("/dashboard")).toBe(true);
    expect(isProtectedRoute("/import")).toBe(true);
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
