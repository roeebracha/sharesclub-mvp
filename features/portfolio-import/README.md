# Portfolio import

Future feature: user picks their broker, uploads a CSV/Excel export of their real holdings, and
the app parses it into portfolio holdings.

**Skeleton only — not implemented yet.** The design is now locked — see the "Portfolio import
(v1, locked — design session 2026-08-01)" note and the "Israeli-market exposure gate" note in
`architecture/DECISIONS.md` for the approach (generic normalize function + per-broker column-map
config, nullable `company_id` on `holdings`, `is_israeli` exposure gate). Implementation
(migration, parser, upload UI, `lib/domain/eligibility.ts` changes) has not started — do not add
code here without re-reading that section first, since it's the source of truth for the exact
schema/behavior to build against.
