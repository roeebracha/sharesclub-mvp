import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreateBrowserClient = vi.fn(() => ({}));

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: (...args: unknown[]) => mockCreateBrowserClient(...args),
}));

beforeEach(() => {
  vi.resetModules();
  mockCreateBrowserClient.mockClear();
});

describe("createClient", () => {
  it("returns the same client instance on repeated calls", async () => {
    const { createClient } = await import("@/lib/supabase/client");

    const first = createClient();
    const second = createClient();

    expect(second).toBe(first);
    expect(mockCreateBrowserClient).toHaveBeenCalledTimes(1);
  });
});
