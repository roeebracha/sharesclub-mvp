@AGENTS.md
@architecture/DECISIONS.md

# Engineering conventions

**תיאור:** שני הקבצים המיובאים למעלה מכסים החלטות מוצר ואת מטרת הריפו. הסקשן הזה מכסה איך הקוד
בפועל נכתב — הכל כאן מאומת מול הקוד האמיתי, לא הנחות.

The two imports above cover product decisions and repo purpose. This section covers how the
code itself is actually written — verified against the real codebase, not assumed.

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
- No test framework exists in this project yet (see "Not yet in use" below). The first time this
  rule applies, ask the user which framework to set up (e.g. Vitest, which pairs well with
  Next.js/TypeScript) before writing the first test — don't silently pick one.

## Current phase

**תיאור:** תמונת מצב קצרה של איפה הפרויקט נמצא עכשיו ומה הבא בתור, כדי שקלוד לא יבנה משהו
שעדיין לא בתור. הצ'קליסט המלא נמצא ב-DECISIONS.md המיובא למעלה — לא לשכפל אותו כאן.

Phase 1 (Foundation) is done — the frontend design pass v2 (roadmap item 6d: theming/nav/
progress/share upgrade) is the latest shipped piece. Next up: Phase 2 decisions (redemption
flow, membership mechanics, admin tool architecture), then Phase 3 real build (auth, live
Supabase wiring, seed data). The full checklist lives in the imported `architecture/DECISIONS.md`
above — don't duplicate it here, just keep this pointer in sync if phases change.

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

- `app/page.tsx` — home page (benefits feed), server component, dummy data
- `app/dashboard/page.tsx` — personal dashboard (holdings CRUD), `"use client"`, in-memory state
- `app/layout.tsx`, `app/globals.css` — root layout/theme (Geist fonts, CSS-variable light/dark)
- `components/BenefitCard.tsx` — the only component so far; named export, server component
- `lib/dummy-data.ts` — types (`Company`, `Benefit`, `Holding`, `ThresholdType`), static dummy
  data, and `isEligible()` — shapes mirror the locked schema in `architecture/DECISIONS.md`
- `lib/holdings-data.ts` — async CRUD data-access layer (`getHoldings`/`getPortfolioWorth`/
  `setPortfolioWorth`/`addHolding`/`updateHolding`/`deleteHolding`). In-memory today, but
  intentionally shaped like a real DB layer so swapping to Supabase later won't touch the UI.
  Also owns the ≤100%-holdings validation.
- `lib/supabase/client.ts` / `lib/supabase/server.ts` — real `@supabase/ssr` clients (browser /
  server, cookie-based)
- `supabase/migrations/0001_init_schema.sql` — locked schema (`users`, `companies`, `benefits`,
  `holdings`) with RLS policies, matches `architecture/DECISIONS.md`, not yet wired into any UI

## Conventions Claude must follow

**תיאור:** כללי כתיבת קוד קונקרטיים, מאומתים מול הפאטרנים הקיימים בפועל (בעיקר `BenefitCard.tsx`
ו-`holdings-data.ts`) — לא כללים כלליים מספר לימוד.

- **Components:** PascalCase filenames, **named exports** (see `BenefitCard.tsx`) — not default
  exports.
- **Server components by default.** Only add `"use client"` when the component needs state,
  effects, or browser APIs.
- **TypeScript strict, no `any`.** Use the `@/*` path alias for imports (e.g.
  `@/lib/dummy-data`), not deep relative paths.
- **Styling:** Tailwind utility classes only, conditional classes via template literals (see
  `BenefitCard.tsx`'s `eligible` styling). No CSS-in-JS. No component library — if a new
  reusable UI primitive is needed, **ask** before building an ad-hoc design system.
- **Data access:** never call Supabase directly from a UI component for holdings/portfolio data
  — go through a `lib/holdings-data.ts`-style abstraction layer, so swapping in-memory state for
  real queries later doesn't touch the UI.
- **Validation:** the holdings-sum-≤100% rule belongs in the data layer (see
  `lib/holdings-data.ts`), not only in the UI.

## Things Claude should NEVER do

**תיאור:** רשימת "קווים אדומים" — פעולות שעלולות לשבור את הפרויקט, לבנות קדימה על החלטות שלא
ננעלו, או לעקוף את מנגנון האימות (הטסטים) במקום לתקן קוד באמת.

- Never modify a test just to make a failing feature pass — fix the underlying code instead. If
  a test is genuinely wrong, fix it and explain why in a comment.
- Never skip writing/running a test before calling a feature or fix done (see "Mandatory
  test-first workflow" above).
- Never hand-edit `supabase/migrations/0001_init_schema.sql` after it's been applied — migrations
  are append-only; add a new numbered migration file for schema changes.
- Never build ahead of `architecture/DECISIONS.md` — redemption flow, membership mechanics, and
  admin tool architecture are explicitly undecided. Ask, don't assume.
- Never add real persistence (localStorage, cookies, Supabase writes) to the dashboard CRUD —
  Phase 1 scope is locked to in-memory React state only.
- Never add a component library or `components/ui/` folder without asking first — none exists
  yet.
- Never invent feature flags or skills/MCP configs for this project — see below.

## Not yet in use in this project

**תיאור:** רשימת דברים שלא קיימים בפרויקט היום בפועל, כדי שקלוד לא יניח שהם מוגדרים ולא יפנה
אליהם כאילו הם קיימים. שים לב: הכלל על טסטים (למעלה) חל למרות שאין עדיין תשתית טסטים — הפעם
הראשונה שהכלל רלוונטי, צריך להקים את התשתית (ולשאול איזו).

Don't assume any of the following are configured here — they aren't:

- **Feature flags** — no `lib/flags.ts`, no flags of any kind exist.
- **Skills / MCP** — no `.claude/skills/` directory and no `.mcp.json` in this project.
- **Testing** — no test framework installed yet (no vitest/jest, no `.test.ts` files). This must
  change the first time the mandatory test-first workflow above applies.
- **Auth** — no `lib/auth.ts`, no auth code at all yet. This is Phase 3, item 11, not started.

## Future direction

**תיאור:** כיוון עתידי כללי, בלי לקבוע פרטים שעדיין לא סוכמו — רק כדי שקלוד ידע לצפות לשינוי
ולא יבנה דברים שיתנגשו איתו.

Data will move from dummy/in-memory to real Supabase queries plus auth once Phase 2 decisions
are locked and Phase 3 begins. `lib/holdings-data.ts` is already shaped for that swap. Don't
pre-build real persistence, auth, or Supabase-backed UI ahead of that — ask if unsure whether
something is locked.

## How to ask good questions in this repo

**תיאור:** הנחיות למשתמש (לא לקלוד) — איך לנסח בקשות תכנון בצורה שתוציא מקלוד תשובות ממוקדות
במקום תשובות מעורפלות.

When scoping or planning, ask Claude to:

1. **Survey first** in plan mode (Shift+Tab → plan mode).
2. **Name the files** that would change. No vague "the data layer" answers.
3. **Compare to existing patterns.** "How does `lib/holdings-data.ts` work? What would the new
   feature do differently?"
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

## When in doubt

**תיאור:** מה לעשות כשמשהו לא ברור — לקרוא קודם את המסמכים המיובאים, ואם עדיין לא ברור, לשאול
את המשתמש במקום לנחש, במיוחד בנושאים שמסומנים כ"לא סוכם" ב-DECISIONS.md.

Read `AGENTS.md` and `architecture/DECISIONS.md` (imported above). If still unclear on a
product or architecture decision — especially anything listed as "Not yet decided" in
`DECISIONS.md` — ask the user. Don't guess on architectural decisions.
