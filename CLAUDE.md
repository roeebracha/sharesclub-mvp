@architecture/DECISIONS.md
@DESIGN.md

# Engineering conventions

**תיאור:** שני הקבצים המיובאים למעלה מכסים החלטות מוצר ואת מערכת העיצוב הוויזואלית. הסקשן הזה
מכסה איך הקוד בפועל נכתב — הכל כאן מאומת מול הקוד האמיתי, לא הנחות.

The two imports above cover product decisions and the visual design system. This section covers
how the code itself is actually written — verified against the real codebase, not assumed.

## Mandatory test-first workflow

**תיאור:** זה הכלל הכי קריטי בקובץ. קלוד אסור לו לסמן משימה/פיצ'ר כגמור ולסיים תור עבודה לפני
שכתב טסט אוטומטי לפיצ'ר והריץ אותו בהצלחה. אם טסט נכשל — התיקון חייב להיות בקוד עצמו, **לעולם
לא** בשינוי הטסט כדי שיעבור. שינוי טסט קיים מותר רק אם הטסט עצמו שגוי, ורק עם הסבר מפורש למה.

- Before considering any feature/bugfix task complete, Claude must:
  1. Write an automated test that exercises the new/changed behavior.
  2. Run it and confirm it passes.
- If a test fails, fix the underlying code — **never** edit the test just to make it pass.
- The only exception: the test itself is provably wrong. In that case, fix it and add a comment
  explaining why, per the existing repo-wide rule (see "Things Claude should NEVER do" below).
- Vitest is the test framework in use (`npm run test`), colocated `*.test.ts`/`*.test.tsx` files
  next to their subject. Use the existing fakes in `lib/test-utils/` (`fake-supabase-client.ts`,
  `fixtures.ts`) rather than inventing new mocking patterns.

## Current phase

**תיאור:** תמונת מצב קצרה של איפה הפרויקט נמצא עכשיו ומה הבא בתור, כדי שקלוד לא יבנה משהו
שעדיין לא בתור. הצ'קליסט המלא נמצא ב-DECISIONS.md המיובא למעלה — לא לשכפל אותו כאן.

Phase 1 (Foundation) is done. Most of Phase 2 is locked (data model/schema, membership tier
mechanics, backend architecture, referral links, portfolio-import design). Phase 3 real build is
underway: auth (middleware, `signIn`/`signUp`/`signOut`, provisioning trigger), real
Supabase-backed holdings/catalog data, the membership tier pass (roadmap 6f — real Israeli
catalog, global tiers), and referral links (`features/referrals/`, `app/go/[slug]/route.ts`,
`app/import/page.tsx`) have all shipped. Still open: roadmap 6e (responsive/mobile pass), the
redemption-flow decision (Phase 2 item 8), admin tool architecture (Phase 2 item 10), the
portfolio-import **implementation** (design is locked in `DECISIONS.md` — broker dropdown, Server
Action upload, per-broker mapping config — but no migration/parser/UI code exists yet, see
`features/portfolio-import/`), the Israeli-exposure eligibility gate that import unlocks, and the
remaining Phase 3 items (claim/redeem flow, admin entry point, seed data for testing). The full
checklist lives in the imported `architecture/DECISIONS.md` above — don't duplicate it here, just
keep this pointer in sync if phases change.

## Stack

**תיאור:** הטכנולוגיות האמיתיות שבשימוש בפרויקט — מאומת מול package.json וקבצי הקונפיג בפועל,
לא הנחות כלליות על "פרויקט Next.js טיפוסי".

- **Next.js 14.2.35** (App Router, server components by default)
- **React 18**
- **TypeScript 5**, strict mode — no `any`
- **Supabase** (`@supabase/supabase-js` + `@supabase/ssr`) — Postgres + Row Level Security, no
  ORM (not Prisma)
- **Tailwind CSS 3** — utility-first, CSS-variable theming for light/dark, no component library
  yet
- **ESLint** (`next/core-web-vitals` + `next/typescript`) — no Prettier configured
- **Vercel** — auto-deploys from GitHub pushes

## Where things live

**תיאור:** מפת קבצים אמיתית — מה כל קובץ/תיקייה עושה בפועל, כדי שקלוד ימצא קוד קיים לפני שהוא
כותב חדש, ולא ינחש מבנה תיקיות שלא קיים.

- `app/page.tsx` — home page (gamified portfolio + benefits feed), `"use client"`, real Supabase
  data via the feature data-access layers below
- `app/dashboard/page.tsx` — personal dashboard (holdings CRUD), `"use client"`
- `app/benefits/[id]/page.tsx` — benefit detail, server component, uses
  `features/benefits/data/catalog-server.ts`
- `app/login/page.tsx`, `app/signup/page.tsx`, `app/checkout/page.tsx` — auth pages + a
  visual-only checkout placeholder
- `app/import/page.tsx` — "connect your portfolio" page, server component, renders
  `features/referrals/components/BrokerGrid.tsx` fed by `features/referrals/data/catalog-server.ts`
- `app/go/[slug]/route.ts` — referral-link redirect: a plain GET Route Handler that logs the click
  server-side then 302s to the broker's real URL (see "Backend architecture" in
  `architecture/DECISIONS.md`, imported above, for why this is a Route Handler and not a raw
  `<a href>`)
- `app/layout.tsx`, `app/globals.css` — root layout/theme (Geist fonts, CSS-variable light/dark),
  implements the tokens/rules locked in `DESIGN.md` (imported above)
- `features/benefits/` — the benefits catalog feature: `components/` (`BenefitCard.tsx`,
  `BenefitProgressSummary.tsx`), `data/` (`catalog-mappers.ts` — pure row→domain mappers,
  `catalog-client.ts` — client-side reads, `catalog-server.ts` — server-component-safe reads,
  same mappers, different Supabase client)
- `features/portfolio/` — the user's own portfolio feature: `components/` (`PortfolioDonut.tsx`,
  `TierBadge.tsx`), `data/holdings.ts` (holdings/portfolio-worth CRUD, owns the
  ≤100%-holdings validation)
- `features/auth/data/auth.ts` — `signUp`/`signIn`/`signOut`/`getCurrentUser`
- `features/referrals/` — broker referral-link feature: `components/BrokerGrid.tsx` (the grid
  rendered on `app/import`), `data/broker-mappers.ts` (pure row→domain mappers),
  `data/catalog-server.ts` (`getBrokers`, server-component-safe read) — same
  mappers/client-vs-server split as `features/benefits/`
- `features/portfolio-import/` — still skeleton only (README-only, no code) for the CSV/Excel
  brokerage-import feature. **Design is locked** in `architecture/DECISIONS.md` (broker dropdown,
  Server Action upload, per-broker mapping config, `is_israeli` detection) — only the
  implementation is pending; see "Current phase" above
- `components/` — shared only: `Header.tsx` (global nav), `ShareCard.tsx`/`ShareModal.tsx`
  (percentage-only share affordance, used by both features above), `ui/` (design-system
  primitives: `Button`, `Card`, `Input`, `Badge`, `Modal`, `CountUp`, `ProgressBar`)
- `lib/domain/eligibility.ts` — pure tier/eligibility/progress logic + shared domain types
  (`Company`, `Benefit`, `MembershipTier`, `Holding`), no I/O — genuinely cross-feature, used by
  both `features/benefits/` and `features/portfolio/`
- `lib/supabase/client.ts` / `lib/supabase/server.ts` — real `@supabase/ssr` clients (browser /
  server, cookie-based)
- `lib/test-utils/` — cross-cutting test infra: `fixtures.ts` (static fixture data),
  `fake-supabase-client.ts` (chainable fake Supabase query builder)
- `supabase/migrations/` — append-only, locked schema (`users`, `companies`, `benefits`,
  `holdings`, `membership_tiers`) with RLS policies, matches `architecture/DECISIONS.md`

## Feature-based folder architecture

**תיאור:** המבנה שקוד חדש/קיים חייב לעקוב אחריו: `features/` מארגן קוד לפי יכולת מוצרית, `app/`
הוא ראוטינג בלבד, ו-`lib/` שמור לקוד שבאמת חוצה פיצ'רים ולא לעוד "פינת אשפה" של קוד משותף.

- `features/<name>/{components,data}` is the standard shape for a feature. Add another subfolder
  (e.g. `hooks/`, `parsers/`) only the first time that feature genuinely needs one — don't
  pre-create empty conventions nothing uses yet.
- **`app/` is routing-only.** `page.tsx` files stay under `app/` (Next.js App Router routing is
  filesystem-based, so this is a hard constraint, not a preference) but should import
  components/data-access from the matching `features/*` folder and mostly compose/render — no
  inlined Supabase queries, no business logic beyond simple glue. (The old
  `app/benefits/[id]/page.tsx` inlining raw Supabase queries instead of using a data-access layer
  was exactly this anti-pattern — fixed by introducing `features/benefits/data/catalog-server.ts`.)
- **`lib/` is for genuinely cross-feature code only — not a second `features/` dump.** Current
  inventory: `lib/domain/` (pure logic used by 2+ features), `lib/supabase/` (client/server infra
  used by every feature), `lib/test-utils/` (cross-cutting test fixtures/fakes). If new code is
  only ever consumed by one feature, it belongs in that feature's `data/`/`components/`, not
  `lib/`.
- **Default for new work:** a new feature defaults to a new `features/<name>/` folder. Promote
  something to shared `components/`/`lib/` only when it passes this test: *does more than one
  feature need this, unmodified, today?* "Maybe later" → leave it in the feature; promote when a
  real second consumer shows up, not preemptively.
- **Accepted exception:** a feature importing another feature's `data/` function directly (e.g.
  `app/dashboard/page.tsx`, part of the portfolio feature, imports `getCompanies` from
  `features/benefits/data/catalog-client`) is fine when there's one clear owner — it does not by
  itself force promoting that function to `lib/`. Only promote if a *third* feature needs it
  unmodified too.

## Conventions Claude must follow

**תיאור:** כללי כתיבת קוד קונקרטיים, מאומתים מול הפאטרנים הקיימים בפועל — לא כללים כלליים מספר
לימוד.

- **Components:** PascalCase filenames, **named exports** (see `BenefitCard.tsx`) — not default
  exports.
- **Server components by default.** Only add `"use client"` when the component needs state,
  effects, or browser APIs.
- **TypeScript strict, no `any`.** Use the `@/*` path alias for imports (e.g.
  `@/lib/domain/eligibility`), not deep relative paths.
- **Styling:** Tailwind utility classes only, conditional classes via template literals (see
  `BenefitCard.tsx`'s `eligible` styling). No CSS-in-JS. No component library — if a new
  reusable UI primitive is needed, **ask** before adding to `components/ui/`.
- **Design system compliance:** every color, spacing value, radius, shadow, and component pattern
  used in `app/`/`components/`/`features/*/components/` must trace to a token or primitive listed
  in `DESIGN.md` (imported above). No ad hoc hex values or one-off styles. If a real new visual
  need comes up, add it to `DESIGN.md` first, then use it — don't let the doc trail the code.
- **Data access:** never call `supabase.from(...)` or `supabase.auth.*` directly inside anything
  in `app/` or `components/` — **server components included.** Add/extend a function in the
  matching feature's `data/*-server.ts` or `data/*-client.ts` file instead. If a data-access
  module needs both a client and server context, split it into a pure `-mappers.ts` (no Supabase
  import) plus `-client.ts`/`-server.ts` twins that both call the same mappers —
  `features/benefits/data/catalog-mappers.ts` is the reference pattern for the next time this
  comes up (e.g. if `features/portfolio/data/holdings.ts` or `features/auth/data/auth.ts` need a
  server variant).
- **Validation:** the holdings-sum-≤100% rule belongs in the data layer (see
  `features/portfolio/data/holdings.ts`), not only in the UI.

## Things Claude should NEVER do

**תיאור:** רשימת "קווים אדומים" — פעולות שעלולות לשבור את הפרויקט, לבנות קדימה על החלטות שלא
ננעלו, או לעקוף את מנגנון האימות (הטסטים) במקום לתקן קוד באמת.

- Never modify a test just to make a failing feature pass — fix the underlying code instead. If
  a test is genuinely wrong, fix it and explain why in a comment.
- Never skip writing/running a test before calling a feature or fix done (see "Mandatory
  test-first workflow" above).
- Never hand-edit an applied file under `supabase/migrations/` — migrations are append-only; add
  a new numbered migration file for schema changes.
- Never build ahead of `architecture/DECISIONS.md` — the redemption flow and admin tool
  architecture are explicitly undecided; ask, don't assume. `portfolio-import`'s *design* is now
  locked (see `architecture/DECISIONS.md`), but its implementation hasn't started — don't add real
  parsing logic to `features/portfolio-import/` (still a README-only skeleton) without confirming
  scope first, since the locked design still has open sub-decisions (parsing library, exact
  per-broker mapping configs beyond IBI, `is_israeli` detection rule in code).
- Never add a component library beyond what's in `components/ui/` without asking first.
- Never invent feature flags for this project — see below.

## Not yet in use in this project

**תיאור:** רשימת דברים שלא קיימים בפרויקט היום בפועל, כדי שקלוד לא יניח שהם מוגדרים ולא יפנה
אליהם כאילו הם קיימים.

Don't assume any of the following are configured here — they aren't:

- **Feature flags** — no `lib/flags.ts`, no flags of any kind exist.
- **MCP inside `dev/`** — no `.mcp.json` inside the `dev/` folder itself (there is a repo-root
  `.mcp.json` one level up, for the Supabase MCP server, shared across `dev/` and `architecture/`).
  `dev/.claude/skills/` does exist now — see "CI & PR workflow" below.
- **`portfolio-import` implementation** — `features/portfolio-import/` is a README-only skeleton;
  no parsing/upload code exists yet. See "Things Claude should NEVER do" above.

## CI & PR workflow

**תיאור:** איך שינוי הופך למיזוג ב-main בפועל — נוסף 2026-08-01, כדי שקלוד לא יפתח PR בלי המספור
הנכון ולא יניח שמיזוג אפשרי בלי אישור ידני.

- **`.github/workflows/ci.yml`** — lint+test+build gate on every push/PR to `main`. Pure quality
  gate; Vercel still owns all actual deploys (preview + production), unchanged.
- **`.github/workflows/manual-approval.yml`** — merging also requires a `/approve` comment from
  `roeebracha` specifically on the PR (repo is public, so this is restricted to that one login).
  Posting a new commit after approving re-locks the gate until `/approve` is commented again.
- **`dev/.claude/skills/create-pr/`** — use this to open PRs instead of a bare `gh pr create`. It
  numbers each PR `SHR-NNN` (sequential, derived from existing GitHub PR titles — no local counter
  file), which is the stable handle to refer to a PR/branch in conversation later (e.g. "SHR-005").

## Future direction

**תיאור:** כיוון עתידי כללי, בלי לקבוע פרטים שעדיין לא סוכמו — רק כדי שקלוד ידע לצפות לשינוי
ולא יבנה דברים שיתנגשו איתו.

Auth, real Supabase-backed data, and referral links are live (see "Current phase" above). The
portfolio-import design is locked and likely the next real build (it also unlocks the
Israeli-exposure eligibility gate already specified in `architecture/DECISIONS.md`'s data model).
The redemption flow and admin tool architecture remain the next locked-vs-open boundary beyond
that — don't pre-build either ahead of a locked decision in `architecture/DECISIONS.md`; ask if
unsure whether something is locked.

## How to ask good questions in this repo

**תיאור:** הנחיות למשתמש (לא לקלוד) — איך לנסח בקשות תכנון בצורה שתוציא מקלוד תשובות ממוקדות
במקום תשובות מעורפלות.

When scoping or planning, ask Claude to:

1. **Survey first** in plan mode (Shift+Tab → plan mode).
2. **Name the files** that would change. No vague "the data layer" answers.
3. **Compare to existing patterns.** "How does `features/portfolio/data/holdings.ts` work? What
   would the new feature do differently?"
4. **Push back.** "What's the riskiest part of this?"

## Session summary file

**תיאור:** אחרי סשן עבודה ארוך, קלוד כותב קובץ סיכום (md) שמתעד מה נעשה, בלי לחכות שיבקשו את זה
כל פעם מחדש.

After a long working session (a plan-driven feature/design pass, not a one-line fix), write a
`session-summary.md` at the repo root (`dev/`) covering:

- **Brainstorming/thinking process** — what was discussed and decided before building started
  (the "why", any options considered/rejected).
- **Files changed** — what changed in each, and why.
- **Tests run** — what was written/extended, and confirmation they passed.

Overwrite the previous `session-summary.md` each time (it reflects the latest session, not a
running log — `architecture/DECISIONS.md` is the durable roadmap record).

If the session touched `architecture/DECISIONS.md`, remind the user to commit and
push the `architecture/` repo (its own separate GitHub remote, `roeebracha/sharesclub-architecture`)
before ending the session — that repo doesn't share `dev/`'s git history, so its changes aren't
backed up until pushed separately.

## When in doubt

**תיאור:** מה לעשות כשמשהו לא ברור — לקרוא קודם את המסמכים המיובאים, ואם עדיין לא ברור, לשאול
את המשתמש במקום לנחש, במיוחד בנושאים שמסומנים כ"לא סוכם" ב-DECISIONS.md.

Read `architecture/DECISIONS.md` and `DESIGN.md` (imported above). If still unclear on a
product or architecture decision — especially anything listed as "Not yet decided" in
`DECISIONS.md` — ask the user. Don't guess on architectural decisions.
