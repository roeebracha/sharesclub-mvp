import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAuth = {
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  getUser: vi.fn(),
};

const mockFrom = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: mockAuth,
    from: mockFrom,
  }),
}));

import { signUp, signIn, signOut, getCurrentUser } from "@/lib/auth";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("signUp", () => {
  it("calls supabase auth.signUp with email/password and name metadata", async () => {
    mockAuth.signUp.mockResolvedValue({ data: { user: { id: "u1" } }, error: null });
    const result = await signUp("jane@example.com", "password123", "Jane");
    expect(mockAuth.signUp).toHaveBeenCalledWith({
      email: "jane@example.com",
      password: "password123",
      options: { data: { name: "Jane" } },
    });
    expect(result).toEqual({ user: { id: "u1" } });
  });

  it("throws when supabase returns an error", async () => {
    mockAuth.signUp.mockResolvedValue({ data: null, error: new Error("email taken") });
    await expect(signUp("jane@example.com", "password123", "Jane")).rejects.toThrow(
      "email taken"
    );
  });
});

describe("signIn", () => {
  it("calls supabase auth.signInWithPassword", async () => {
    mockAuth.signInWithPassword.mockResolvedValue({
      data: { user: { id: "u1" } },
      error: null,
    });
    const result = await signIn("jane@example.com", "password123");
    expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
      email: "jane@example.com",
      password: "password123",
    });
    expect(result).toEqual({ user: { id: "u1" } });
  });

  it("throws when credentials are invalid", async () => {
    mockAuth.signInWithPassword.mockResolvedValue({
      data: null,
      error: new Error("invalid credentials"),
    });
    await expect(signIn("jane@example.com", "wrong")).rejects.toThrow(
      "invalid credentials"
    );
  });
});

describe("signOut", () => {
  it("calls supabase auth.signOut", async () => {
    mockAuth.signOut.mockResolvedValue({ error: null });
    await signOut();
    expect(mockAuth.signOut).toHaveBeenCalled();
  });

  it("throws when sign out fails", async () => {
    mockAuth.signOut.mockResolvedValue({ error: new Error("network error") });
    await expect(signOut()).rejects.toThrow("network error");
  });
});

describe("getCurrentUser", () => {
  it("returns null when no session exists", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: null } });
    const result = await getCurrentUser();
    expect(result).toBeNull();
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("returns the user's public.users profile when a session exists", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    const single = vi.fn().mockResolvedValue({
      data: { id: "u1", email: "jane@example.com", name: "Jane" },
      error: null,
    });
    const eq = vi.fn().mockReturnValue({ single });
    const select = vi.fn().mockReturnValue({ eq });
    mockFrom.mockReturnValue({ select });

    const result = await getCurrentUser();

    expect(mockFrom).toHaveBeenCalledWith("users");
    expect(select).toHaveBeenCalledWith("id, email, name");
    expect(eq).toHaveBeenCalledWith("id", "u1");
    expect(result).toEqual({ id: "u1", email: "jane@example.com", name: "Jane" });
  });

  it("throws when the profile query errors", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    const single = vi.fn().mockResolvedValue({ data: null, error: new Error("db error") });
    const eq = vi.fn().mockReturnValue({ single });
    const select = vi.fn().mockReturnValue({ eq });
    mockFrom.mockReturnValue({ select });

    await expect(getCurrentUser()).rejects.toThrow("db error");
  });
});
