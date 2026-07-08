-- ShareClub MVP — initial schema
-- Locked in architecture/DECISIONS.md (Data model section)
-- Run this once in the Supabase dashboard: SQL Editor → New query → paste → Run

create table users (
  id uuid primary key references auth.users(id),
  email text not null,
  name text,
  portfolio_worth numeric not null default 0,
  verification_status text not null default 'self_report'
    check (verification_status in ('self_report', 'broker_verified'))
);

create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  ticker text,
  logo_url text
);

create table benefits (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  title text not null,
  description text,
  terms text,
  threshold_type text not null check (threshold_type in ('percent', 'amount')),
  threshold_value numeric not null,
  company_owner_id uuid references users(id) -- nullable, future self-serve placeholder
);

create table holdings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  company_id uuid not null references companies(id) on delete cascade,
  percentage numeric not null,
  unique (user_id, company_id) -- one row per user+company pairing
);

-- Row Level Security: Supabase exposes every table over a public API by default.
-- Without RLS, anyone holding the app's public "anon" key could read/write any row.
-- Policies below: companies/benefits are public read (the feed is visible to everyone,
-- eligible or not); users/holdings are readable/writable only by their own owner.

alter table companies enable row level security;
alter table benefits enable row level security;
alter table users enable row level security;
alter table holdings enable row level security;

create policy "companies are publicly readable" on companies
  for select using (true);

create policy "benefits are publicly readable" on benefits
  for select using (true);

create policy "users can read own row" on users
  for select using (auth.uid() = id);

create policy "users can update own row" on users
  for update using (auth.uid() = id);

create policy "users can read own holdings" on holdings
  for select using (auth.uid() = user_id);

create policy "users can manage own holdings" on holdings
  for all using (auth.uid() = user_id);
