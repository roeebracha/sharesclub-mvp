import { vi } from "vitest";

// Shared fake for `lib/supabase/client.ts`'s createClient() in data-layer tests.
// Each `.from(table)` call should be routed (via a mockImplementation on `from`)
// to a builder created by `createFakeQueryBuilder`. The builder is chainable
// (select/eq/update/insert/delete all return itself) and thenable, so both
// `await supabase.from(t).select(...).eq(...)` and
// `await supabase.from(t).select(...).eq(...).single()` resolve correctly.

export type FakeResult<T = unknown> =
  | { data: T; error: null }
  | { data: null; error: Error };

export function createFakeQueryBuilder<T>(result: FakeResult<T>) {
  const builder: Record<string, unknown> = {};
  const chain = () => builder;
  builder.select = vi.fn(chain);
  builder.eq = vi.fn(chain);
  builder.update = vi.fn(chain);
  builder.insert = vi.fn(chain);
  builder.delete = vi.fn(chain);
  builder.single = vi.fn(() => Promise.resolve(result));
  builder.then = (
    resolve: (value: FakeResult<T>) => void,
    reject?: (reason: unknown) => void,
  ) => Promise.resolve(result).then(resolve, reject);
  return builder;
}

export function createFakeSupabaseClient() {
  const getUser = vi.fn();
  const from = vi.fn();
  return {
    auth: { getUser },
    from,
  };
}
