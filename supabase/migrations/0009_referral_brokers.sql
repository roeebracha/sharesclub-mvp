-- ShareClub MVP — referral links to Israeli brokers + click logging
-- Locked in architecture/DECISIONS.md ("Referral links (v1, locked)"): a broker referral list
-- routes through a server-side redirect (app/go/[slug]/route.ts) instead of a raw client-side
-- link, so clicks are logged and the destination URL can change without a redeploy.
--
-- referral_url values below are each broker's real public homepage — placeholders, NOT yet
-- real tracked affiliate links. logo_url is left null, same reason/precedent as `companies` in
-- 0008 (no verified logo assets on hand). Swap in real affiliate URLs + logos before this goes
-- live. Excludes Mor Investment House (no self-directed retail trading found — see DECISIONS.md
-- research notes) and Interactive Brokers (not an Israeli investment house).

create table brokers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  logo_url text,
  referral_url text not null,
  display_order int not null default 0
);

create table referral_clicks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  broker_id uuid not null references brokers(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table brokers enable row level security;
alter table referral_clicks enable row level security;

create policy "brokers are publicly readable" on brokers
  for select using (true);

-- Insert-only: the server logs a click as the authenticated user (or anonymously, user_id
-- null) — nothing in the app reads these back yet, so no select policy.
create policy "anyone can log a referral click as themselves or anonymously" on referral_clicks
  for insert with check (auth.uid() = user_id or user_id is null);

insert into brokers (slug, name, referral_url, display_order) values
  ('meitav', 'Meitav Trade', 'https://www.meitav.co.il/trade', 1),
  ('psagot', 'Psagot Trade', 'https://www.psagot.co.il/', 2),
  ('excellence', 'Excellence Trade', 'https://www.xnes.co.il/trading/extrade-pro/', 3),
  ('ibi', 'IBI Trade', 'https://www.ibi.co.il/', 4),
  ('blink', 'Blink Trade', 'https://www.heyblink.com/', 5),
  ('onezero', 'One Zero Bank', 'https://www.onezerobank.com/', 6),
  ('hapoalim', 'Bank Hapoalim', 'https://www.bankhapoalim.co.il/', 7),
  ('leumi', 'Bank Leumi', 'https://www.leumi.co.il/', 8);
