-- ShareClub MVP — portfolio import: holdings gains raw-import fields
-- Locked in architecture/DECISIONS.md ("Portfolio import", "Israeli-market exposure gate"):
-- company_id becomes optional (a match is enrichment, never a requirement for a row to exist —
-- see the real-sample-file finding that motivated this), and every holding now carries enough of
-- its own identity/classification to exist independently of the curated `companies` catalog.

alter table holdings
  alter column company_id drop not null,
  add column raw_name text,
  add column ticker text,
  add column is_israeli boolean not null default false;

-- Backfill: every company in `companies` is a real Israeli company by product definition (see
-- "Benefit catalog content" in DECISIONS.md), so any pre-existing holding that already matched
-- one is Israeli by construction — not a guess.
update holdings set is_israeli = true where company_id is not null;
