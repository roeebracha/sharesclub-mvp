# ShareClub MVP — Brand & Visual System

This is the living source of truth for how the ShareClub app looks, feels, and behaves visually.
All page and component design derives from this file. It lives in `dev/` itself and is
committed/pushed with the app: it needs to be available to Claude (and anyone else) working from a
fresh clone of this repo, not just on this machine.

**How to use this file:**
- Before adding any new UI, check here first for an existing token, primitive, or pattern. Don't
  introduce ad hoc hex values, one-off spacing, or a new component style that isn't listed below.
- If a genuinely new visual need comes up, add it here (with a value, not just a description)
  *before* using it in a component — this file should never trail the code by more than one change.
- **Mobile-first (locked 2026-08-01).** Design and reason about every screen at 375px width first,
  then progressively enhance with `sm:`/`md:` — not "shrink desktop down." See "Responsive
  philosophy" below for what this actually requires, not just the Tailwind breakpoint direction.
- Sections below are checked against the real implementation as of 2026-08-01. Where something is
  still just a plan (not built), it's explicitly marked **planned**, not implied as shipped.
- **Opacity modifiers need an `-rgb` variable.** `background`/`foreground`/`primary`/`success`/
  `danger` are defined in `tailwind.config.ts` as `rgb(var(--x-rgb) / <alpha-value>)`, backed by a
  space-separated `--x-rgb` variable in `globals.css` (kept alongside the hex `--x` variable used
  elsewhere) — this is required for classes like `text-foreground/60` or `bg-primary/10` to
  generate any CSS at all. A color defined as a plain `var(--x)` hex string silently produces no
  rule for its opacity variants (found 2026-08-01: this had been broken for `text-foreground/*`,
  `bg-primary/*`, `bg-success/10`, `bg-danger/10`, `bg-foreground/10`, and `bg-background/70`
  across the whole app — fixed by adding the `-rgb` variables, not by removing the usages). If you
  add a new custom color token that will ever be used with a `/NN` opacity modifier, give it an
  `-rgb` variable too, or it will look fine in the class name and do nothing in the browser.

## Brand identity

- **Name / wordmark:** "ShareClub". Wordmark set in Geist Mono, tight tracking, rendered as
  `Shares` + `Club` in `--primary` (see `Header.tsx`, `ShareCard.tsx`). Optional monogram "SC".
  (Final logo: TBD — placeholder wordmark until decided.)
- **Voice & tone:** confident, plainspoken, a little playful. Short sentences. Celebrates unlocking
  perks ("You just unlocked…"). Never finance-jargon-heavy.
- **Feel:** a rewarding, game-like layer over a serious idea (real shareholder perks). Motion and
  color signal progress and achievement. **Locked positioning (2026-08-01):** the product must read
  as a real, trustworthy, Israeli financial-consumer product — not a hobby project — while keeping
  the gamified layer that makes it fun to check. Visual direction below is built to hold both at
  once: a serious "chrome" layer (navigation, buttons, structure) plus a distinctly playful
  "gamification" layer (progress, unlocks, hover reveals) that never bleeds into the serious layer.

## Visual references (locked 2026-08-01)

Real sites the palette/structure below are grounded in — not vibes, actual sourced data:

- **[elal.com](https://www.elal.com/heb/israel)** — color source. El Al's real, deliberate
  design-system tokens were extracted directly from their production CSS bundle (not guessed):
  brand navy `--eastern-blue`/`--pacific-blue: #1b358f` plus a supporting blue scale
  (`--blue-500: #254ab0`, `--tory-blue: #2d47a0`, `--resolution-blue: #294077`), and — highly
  relevant to us — a **loyalty-tier color system** for their "Matmid" frequent-flyer program
  (`--silver-tier: #61646c`, `--gold-tier: #a3803c`, `--platinum-tier: #262427`,
  `--top-platinum-tier: #603c22`), muted/metallic rather than saturated. This is the direct source
  for both the primary color and the tier-badge palette below.
- **[joinconsumerclub.com](https://joinconsumerclub.com/)** — structure reference: direct hero with
  value prop + stats, contrast between membership tiers, minimal-friction navigation. Its landing
  page (not a custom login page — it offloads auth to third parties) is the reference point for
  giving our `/login` more visual presence than a bare form, without turning it into a sales page
  (see Login rules below).
- **[htzone.co.il](https://www.htzone.co.il/)** — structure reference: benefit/deal content grouped
  by category with confident, bold callouts (e.g. discount %). We're borrowing the *visual
  confidence* of that pattern for benefit/eligibility badges — not their mega-menu navigation or
  category depth, which is more IA than our current catalog size (7-8 companies) needs.
- **hot.co.il** — attempted as a structure reference; page is JS-rendered and didn't yield usable
  content through automated fetching. Not used as a concrete source; revisit with a screenshot if
  still wanted.

## Color palette (light / dark)

**Status: shipped (2026-08-01).** `app/globals.css` and `tailwind.config.ts` now match the table
below — `--primary`/`--primary-rgb` are navy, `--secondary` (new token) holds the old violet,
`--chart-1` and `.bg-glow` point at `--secondary`, tier tokens are the Matmid-inspired set (light
*and* dark — dark tier values didn't exist before this change), and `--shadow-soft`/
`--shadow-elevated` are navy-tinted while `--shadow-glow` stays violet. Verified in a real browser
(signed-up test session, screenshots), not just read off the diff.

**Primary → navy blue (El Al-sourced), replacing violet.** Signals "serious, trustworthy, Israeli"
on first glance — used for CTAs, active nav state, links, focus rings, wordmark:

| Token         | Light     | Dark      | Use                                            |
|---------------|-----------|-----------|--------------------------------------------------|
| `--background`| `#ffffff` | `#0a0a0a` | page background (unchanged)                    |
| `--foreground`| `#171717` | `#ededed` | primary text (unchanged)                       |
| `--primary`   | `#1b358f` | `#254ab0` | CTAs, active nav pill, links, focus rings, wordmark |

**Secondary → violet (previous primary), demoted to a gamification-only accent.** Never used for
CTAs, nav, or links anymore — reserved for the "fun" layer: the glow behind the portfolio hero and
`ShareCard`, the portfolio donut's first chart slice, the primary button's hover glow (a serious
navy button, playful violet spark on interaction — deliberate):

| Token        | Light     | Dark      | Use                                                |
|--------------|-----------|-----------|------------------------------------------------------|
| `--secondary`| `#7c3aed` | `#a78bfa` | `bg-glow`, donut chart-1, `--shadow-glow` (Button hover) |

**Unchanged — not brand-specific, no reason to touch:**

| Token          | Light     | Dark      | Use                                  |
|-----------------|-----------|-----------|---------------------------------------|
| `--accent`      | `#f59e0b` | `#fbbf24` | progress-bar fill (normal state)     |
| `--accent-hot`  | `#f97316` | `#fb923c` | progress-bar fill once ≥80% (pulses) |
| `--success`     | `#16a34a` | `#4ade80` | "Eligible" badge                     |
| `--danger`      | `#dc2626` | `#f87171` | errors, delete actions               |
| `--surface`     | `#faf9fc` | `#14121a` | elevated-card background             |
| `--surface-elevated`| `#ffffff`| `#1c1a24`| modal background                    |

Chart tokens (portfolio donut slices) — `--chart-1` becomes `var(--secondary)` (was `--primary`);
`--chart-2` through `--chart-6` and `--chart-cash` unchanged.

**Tier tokens → Matmid-inspired, muted/metallic (replacing the current bright placeholder set).**
Directly adapted from El Al's own loyalty-tier tokens (see Visual references above), not the
current `#94a3b8`/`#d4a017`/`#7c3aed` set — the old platinum reused the brand primary directly,
which no longer makes sense once primary is navy:

| Token             | Light     | Dark (derived*)| Use                          |
|--------------------|-----------|-----------------|--------------------------------|
| `--tier-silver`    | `#71757c` | `#a8acb3`       | Silver member badge          |
| `--tier-gold`      | `#a3803c` | `#c9a15c`       | Gold member badge            |
| `--tier-platinum`  | `#33343a` | `#9a9ca3`       | Platinum member badge        |

*El Al's site is light-mode only — dark-mode values above are lightened derivations for contrast
against a near-black background, not sourced directly. Treat as a reasonable starting point, open
to adjustment once seen rendered.

Shadow tokens — split by which layer they belong to:

| Token | Tint | Use |
|---|---|---|
| `--shadow-soft` / `--shadow-elevated` | **navy** (`--primary`) | resting/hover elevation on `Card` `elevated`, `Modal` — the "serious" layer |
| `--shadow-glow` | **violet** (`--secondary`, unchanged from today) | `Button` `primary` hover — the "fun" layer, deliberately kept distinct |

Utility `.bg-glow` — keeps mixing `--secondary` (was `--primary`) + `--accent`; still the
gamification-layer background, used behind the portfolio hero, `ShareCard`, and (new) the login
card backdrop.

## Typography

- **Body / UI:** Geist Sans, loaded via `next/font/local` in `app/layout.tsx` as
  `--font-geist-sans`, applied on `<body>` in `app/globals.css`.
- **Labels / meta / tickers / numbers:** Geist Mono (`--font-geist-mono`), applied per-element via
  the Tailwind arbitrary-value pattern `font-[family-name:var(--font-geist-mono)]`.
- Hierarchy: page title `text-3xl sm:text-4xl font-semibold tracking-tight`; section label
  `text-sm font-medium text-foreground/60 uppercase tracking-wide`; card title `text-lg
  font-semibold`; body `text-sm text-foreground/70`.

## Layout & spacing

- Page container: `min-h-screen px-6 py-16 sm:px-12 sm:py-24 max-w-3xl mx-auto` (home, dashboard,
  benefit detail). Narrow variant `max-w-md` for single-column auth/checkout flows.
- Cards: `rounded-xl border p-4`/`p-5`. Inputs/buttons: `rounded-lg border px-3 py-2 text-sm`.
- Borders: `border-black/10 dark:border-white/15`. Hover surfaces: `hover:bg-black/5
  dark:hover:bg-white/10`.
- **Side-by-side content (added 2026-08-08, home page's live-holdings panel next to the portfolio
  donut):** `grid gap-8 md:grid-cols-2 md:items-start` — single column (stacked) below `md:`, two
  columns from `md:` up, within the existing `max-w-3xl` container. This is the app's first
  side-by-side layout; reuse this exact pattern rather than inventing a new one the next time a
  page needs a real two-column split.

## Components / primitives

`components/ui/` — cross-feature primitives: **Button** (`primary`/`secondary`/`danger`), **Input**,
**Card** (`flat`/`elevated`), **Badge** (`success`/`muted`/`accent`), **ProgressBar** (switches to
hot state ≥80%, optional `milestones` ticks), **Modal** (`framer-motion` fade+scale), **CountUp**
(animated number, respects `prefers-reduced-motion`).

`components/` — shared: **Header** (collapsing pill nav, active-route state, live auth state),
**ShareCard** (shareable image, percentage-only — never `$`), **ShareModal** (click-to-open modal,
inert social icon row).

`features/*/components/` — feature-owned: **PortfolioDonut** (animated, draggable slices, hover
tooltip), **TierBadge** (tier pill + progress-to-next-tier), **BenefitCard** (plain company name +
sector label — not a stock ticker, since not every benefit-granting company is publicly traded —
plus a `sector-meta.tsx`-driven icon tile, `bg-primary/15 text-primary`, using a Phosphor icon
(`react-icons/pi`) per `Sector`: shield/plane/suitcase/film-slate/cpu/shopping-bag), **BenefitProgressSummary**.

## Motion & interaction (rich)

Locked patterns, confirmed implemented via `framer-motion` + `canvas-confetti` — and explicitly
**reaffirmed as the right foundation** for the "gamified" feel (2026-08-01 direction check):
- **Developing progress bar that marks proximity to the next tier — shipped 2026-08-01.**
  `TierBadge` now passes `milestones={[0.5, 0.8]}` (same points as `BenefitProgressSummary`, for one
  consistent "getting close" visual language) into its `ProgressBar` call whenever there's a next
  tier — the bar visually marks "how close to the next tier," not just a smooth fill. No milestones
  once at Platinum (nothing left to mark).
- **Hover reveals small info popups.** `PortfolioDonut`: hover a slice → center tooltip with
  ticker/%/$ — **now with a tap equivalent (shipped 2026-08-01):** tapping/clicking a slice toggles
  the same info state (same handler drives both; tap again to clear). `TierBadge`: tapping/clicking
  the tier pill **(shipped 2026-08-01)** reveals a small popup listing which benefits the next tier
  unlocks (`Unlocks at {nextTier}: …`) — click/tap-only by design (no separate hover-only path to
  begin with, so it's mobile-first from the start rather than retrofitted). Pill is only interactive
  when there's a next tier *and* at least one benefit actually unlocks there; otherwise it's a plain
  (non-interactive) label. **`BenefitCard` hover-preview — deliberately not built:** the original
  idea was "hover shows a fuller terms preview," but `Benefit` has no separate `terms` field —
  the detail page's "Terms" section is just the same tier-requirement copy already visible on the
  card. A hover/tap popup here would duplicate existing content, not add real information; revisit
  only if a real `terms` field gets added to the data model.
- Draggable donut slices, confetti-on-claim, entry animations — unchanged from before, still
  correct.
- `prefers-reduced-motion` honored throughout — non-negotiable, don't regress this while extending
  the patterns above.

## Page-by-page visual rules

- **Home `/`:** unchanged structurally (portfolio viz + `TierBadge` + sector filter + benefits feed
  grouped by claimable status) — gets the new color tokens above, plus the `TierBadge` milestone
  wiring noted in Motion above.
- **Login `/login`, Signup `/signup` — visual upgrade, not a landing page (shipped 2026-08-01):**
  form `Card` uses `elevated` variant on a `.bg-glow` backdrop, existing short headline + one-line
  tagline above the form unchanged. **Explicitly not doing:** stats, testimonials, or social-proof
  numbers — this is a pre-launch MVP with no real users yet, so anything resembling
  `joinconsumerclub.com`'s "100M+ ARR, 50+ members" pattern would be fabricated. The upgrade is
  about visual polish and presence, not persuasion copy.
- **Benefit cards / badges — visual polish only, no new IA (locked 2026-08-01):** borrow the bold,
  confident callout feel of htzone.co.il's discount badges for our own `Badge`/eligibility styling
  — our benefits are binary claim/locked (tier-gated), not `%`-off, so this means sharper visual
  treatment of the existing `Eligible`/`Locked` badges and progress copy, not a literal discount
  badge. No hamburger mega-menu, no new category depth beyond the existing sector filter pills.
- **Benefit detail `/benefits/[id]`, Dashboard `/dashboard`, Checkout `/checkout`:** unchanged
  structurally, inherit the new color tokens.

## Responsive philosophy — mobile-first (locked 2026-08-01)

Supersedes how roadmap item 6e ("Responsive/mobile pass") in `architecture/DECISIONS.md` gets
approached: that item was framed as a one-time retrofit pass at the end. Mobile-first instead means
this governs every design decision from now on, not a cleanup pass done once:

- **Reference viewport is 375px**, not desktop — same number `architecture/DECISIONS.md` already
  uses for the 6e verification pass (375/768/1024 in DevTools). Reason about layout, type size, and
  spacing at that width first; `sm:`/`md:` add refinement for larger screens, they don't rescue a
  design that only works wide.
- **No hover-only interaction ships without a tap/press equivalent in the same change.**
  `PortfolioDonut`'s hover tooltip **— fixed 2026-08-01:** tapping/clicking a slice now toggles the
  same info state (one handler drives both hover and tap; see Motion above). `TierBadge`'s
  next-tier-unlocks popup was built tap/click-only from the start, so it was never hover-only to
  begin with. Still applies to anything new: no future hover-only interaction ships without its tap
  equivalent in the same change.
- **Tap targets ≥ ~40px.** Nav pills currently use `px-2.5 py-1.5` (`Header.tsx`, sector filter in
  `app/page.tsx`) — comfortable with Geist Sans at `text-sm`, but check actual rendered hit area
  against this when touching that styling, don't just eyeball it on desktop.
- **No unguarded horizontal layouts.** The dashboard holdings row (`app/dashboard/page.tsx`) —
  **fixed 2026-08-01:** `flex-wrap` added to the `Card` row itself and to both its inner control
  groups (view-mode `Edit`/`Delete`, edit-mode `Input`+`Save`/`Cancel`), matching the add-holding
  form's existing pattern. Verified at 375px with a long company name (`Israel Aerospace
  Industries`) in both view and edit mode — no horizontal overflow. Any new `flex` row of controls
  needs the same treatment before it ships, not after someone notices it break on a real phone.
- **`Header` nav wrapping — fixed 2026-08-01.** Found via a real 375px screenshot, not previously
  documented: the wordmark + nav pill strip (`Home`/`Dashboard`/`Import`/`Log out`) didn't fit one
  row at 375px, and the last pill's text wrapped internally ("Log out" broke across two lines
  inside its own pill). Fixed with `flex-wrap` on the header row (`sm:flex-nowrap` to keep desktop
  unchanged) so the whole nav strip drops below the wordmark as a unit when needed, plus
  `whitespace-nowrap` on every pill so no pill's text ever wraps internally again.

## Accessibility

- Light/dark parity required for every token above, including the new navy/violet split and tier
  colors — check contrast on `--primary`/`--secondary` fills before shipping.
- Keyboard-reachable interactive elements; `Modal` traps Escape and click-outside.
- `prefers-reduced-motion` honored (see Motion section above).

## Deferred / not yet decided

- **`BenefitCard` hover/tap preview** — deliberately not built, see Motion section above (no real
  extra content to show without a `terms` field on `Benefit`).
- **Final logo** — placeholder wordmark only.
- **Real social sharing** — deferred to v2, `ShareModal` ships the inert affordance only.
- **Redemption CTA behavior** — blocked on the unlocked redemption-flow decision in
  `architecture/DECISIONS.md`.
- **Israeli-exposure-gate UI copy** — locked in `DECISIONS.md` but not yet designed/built.
