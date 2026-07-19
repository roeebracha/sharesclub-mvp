# Session summary — Fix login → feed transition & page separation

## Brainstorming / decisions before building

User reported: after logging in, the login page didn't disappear — they expected to land
straight on the feed, with a nav clearly showing feed / portfolio editing / log out once
authenticated.

Investigated with two parallel Explore agents (one on the login/auth redirect flow, one on the
Header/nav structure) plus direct reads of the implicated files. Found two real, compounding bugs
— not a missing feature, since the feed/Dashboard/Log-out nav already existed in `Header.tsx`:

1. `components/Header.tsx` rendered on every route via `app/layout.tsx`, including `/login` and
   `/signup` — no clean chrome separation between the auth pages and the authenticated app.
2. Because Header (with its always-present `Home` link to `/`) rendered on `/login`, Next.js
   would prefetch `/` while still unauthenticated; middleware redirects that prefetch back to
   `/login`, and the client Router Cache could then serve that stale/negative result back when
   `app/login/page.tsx` called `router.push("/")` after a successful sign-in — since neither
   `signIn`/`signUp` nor the calling pages ever called `router.refresh()`, nothing forced a fresh
   Server-Component fetch of `/` with the new session cookie. This is the standard cause of
   "auth succeeded but the old page is still showing" in Next.js App Router + Supabase SSR.

Confirmed via code reading only (not live reproduction) — flagged explicitly to the user as a
diagnosis, not a guaranteed root cause, since browser verification wasn't available this session
(see below). No `architecture/DECISIONS.md` items were implicated; this was scoped as a bug fix,
not a product decision. `app/checkout/page.tsx` also renders Header today but wasn't touched —
out of scope, not mentioned by the user and not behind auth.

## Files changed

- `components/Header.tsx` — added an early return (`if (pathname === "/login" || pathname ===
  "/signup") return null;`) after the existing hooks, so Header renders nothing on the two auth
  pages. Consistent with Header's existing pathname-branching pattern (already used for
  active-pill state); `app/layout.tsx` itself untouched.
- `app/login/page.tsx`, `app/signup/page.tsx` — added `router.refresh()` immediately after the
  existing `router.push("/")` on successful sign-in/sign-up, forcing Next.js to refetch Server
  Component data for `/` with the current session cookie instead of potentially reusing a cached
  pre-auth render.
- `components/Header.test.tsx` — `usePathname` mock changed from a static return to a
  `vi.fn()` so individual tests can override the pathname; 2 new tests added (Header renders
  nothing on `/login`, same for `/signup`). Existing 3 tests unmodified.
- `app/auth-pages.test.tsx` — `useRouter` mock extended with a `refresh` spy; the two existing
  "redirects to / on success" tests (login and signup) extended to also assert `refresh` was
  called. No existing assertion weakened or removed.

## Tests run

- New/extended tests written first, confirmed **red** against the unmodified code (4 failing
  assertions), then confirmed **green** after the two source fixes — no test was edited to force
  a pass.
- Full suite (`npx vitest run`): 15 files, 81 tests, all green.
- `npx tsc --noEmit`: clean except the same two pre-existing `node_modules` type-definition
  warnings (`aria-query 2`, `estree 2`) noted in prior session summaries — unrelated to this
  change.

## Verification not completed this session

Same constraint as the prior responsive-mobile-pass session: `/` and `/dashboard` sit behind the
auth middleware, and no test credentials were available, so the actual login → feed transition
was **not** verified live in a browser. The `router.refresh()` fix is the standard, well-
established pattern for this class of bug, but it's a diagnosis from static code reading, not a
confirmed-fixed live repro. Before merging, please manually verify:

- Logging in from `/login` lands cleanly on `/` with no visible login form afterward.
- `/login` and `/signup` no longer show the app header/nav.
- The authenticated nav (Home / Dashboard / Log out) appears correctly on `/` and `/dashboard`
  after login.
