-- Fix two seeded ticker typos found while building live-price lookups (feature: live stock
-- quotes next to the portfolio donut). Confirmed via Yahoo Finance's chart API against the real
-- TASE listing: El Al's real ticker is ELAL (seeded in 0008 as the wrong value "LY"); Israir's
-- real ticker is ISRG (seeded as the wrong value "6H"). Both now resolve correctly via
-- `{ticker}.TA`.
update companies set ticker = 'ELAL' where ticker = 'LY';
update companies set ticker = 'ISRG' where ticker = '6H';

-- The other 5 companies seeded in 0008 with tickers that return no data on Yahoo Finance are
-- intentionally left as-is — verified individually that they are not publicly traded, so no real
-- ticker exists to substitute (this is not "ticker doesn't resolve, cause unknown"):
--   ARKIA  Arkia Israeli Airlines — private, acquired by El Al in 2022, no ticker.
--   IAI    Israel Aerospace Industries — state-owned; only bonds trade on TASE, no equity
--          ticker (an IPO is planned for later 2026 but not live yet).
--   YESP   Yes Planet — owned by Cineworld Group PLC (LSE: CINE), not itself a TASE entity.
--   SPRLD  Superland — privately owned by Entertainment Town Ltd, no ticker found.
--   STMZ   Steimatzky — privately held bookstore chain, no ticker found.
-- The live-price feature must treat "no data available" as a normal, permanent, expected state
-- for these 5 — consistent with dev/DESIGN.md's existing precedent that "not every
-- benefit-granting company is publicly traded."
