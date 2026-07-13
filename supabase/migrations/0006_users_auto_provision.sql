-- Auto-provision a public.users row whenever a new auth.users row is created.
-- Additive only — 0001-0005 stay untouched.
-- Run this once in the Supabase dashboard: SQL Editor → New query → paste → Run

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();
