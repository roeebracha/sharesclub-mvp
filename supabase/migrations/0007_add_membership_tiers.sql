-- ShareClub MVP — membership tier system
-- Locked in architecture/DECISIONS.md ("Membership tier system"): every user gets a GLOBAL
-- Silver/Gold/Platinum tier from total portfolio_worth. This replaces the old per-benefit
-- threshold_type/threshold_value gate — eligibility is now userTier.rank >= benefit's min tier
-- rank, regardless of which company is held. holdings becomes visualization-only.

create table membership_tiers (
  id uuid primary key default gen_random_uuid(),
  name text not null check (name in ('Silver', 'Gold', 'Platinum')),
  min_portfolio_value numeric not null,
  rank int not null unique
);

insert into membership_tiers (name, min_portfolio_value, rank) values
  ('Silver', 0, 1),
  ('Gold', 20000, 2),
  ('Platinum', 50000, 3);

alter table companies add column sector text
  check (sector in ('security', 'aviation', 'tourism', 'leisure_entertainment', 'technology', 'retail'));

alter table benefits add column min_tier_id uuid references membership_tiers(id);
alter table benefits drop column threshold_type;
alter table benefits drop column threshold_value;
-- min_tier_id/sector are backfilled by 0008 (full catalog reseed), then locked to NOT NULL there.

alter table membership_tiers enable row level security;

create policy "membership tiers are publicly readable" on membership_tiers
  for select using (true);
