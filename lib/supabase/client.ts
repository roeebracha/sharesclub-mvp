import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// `ReturnType<typeof createBrowserClient>` resolves against createBrowserClient's
// last overload signature and loses the generic default, which made `session` in
// consumers (e.g. Header.tsx) implicitly `any`. Naming the type explicitly avoids that.
let client: SupabaseClient | undefined

export function createClient() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return client
}
