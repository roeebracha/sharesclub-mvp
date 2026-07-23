-- ShareClub MVP — reseed catalog with real Israeli companies + general-appeal perks
-- Locked in architecture/DECISIONS.md ("Benefit catalog content"): replaces the placeholder
-- US-company catalog with real, recognizable Israeli companies across all 6 locked sectors.
-- Deleting companies cascades to benefits and holdings (both `on delete cascade` from 0001),
-- so this fully replaces the old catalog and its dependent rows in one step.

delete from companies;

-- 15 companies across the 6 locked sectors (logo_url intentionally left null — no verified
-- logo URLs on hand; the UI doesn't render logo_url today).
insert into companies (id, name, ticker, sector) values
  ('660e8400-e29b-41d4-a716-446655440001', 'El Al Israel Airlines', 'LY', 'aviation'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Israir Airlines', '6H', 'aviation'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Arkia Israeli Airlines', 'ARKIA', 'aviation'),
  ('660e8400-e29b-41d4-a716-446655440004', 'Elbit Systems', 'ESLT', 'security'),
  ('660e8400-e29b-41d4-a716-446655440005', 'Israel Aerospace Industries', 'IAI', 'security'),
  ('660e8400-e29b-41d4-a716-446655440006', 'Isrotel', 'ISRO', 'tourism'),
  ('660e8400-e29b-41d4-a716-446655440007', 'Fattal Hotels', 'FTAL', 'tourism'),
  ('660e8400-e29b-41d4-a716-446655440008', 'Yes Planet', 'YESP', 'leisure_entertainment'),
  ('660e8400-e29b-41d4-a716-446655440009', 'Superland', 'SPRLD', 'leisure_entertainment'),
  ('660e8400-e29b-41d4-a716-446655440010', 'Wix.com', 'WIX', 'technology'),
  ('660e8400-e29b-41d4-a716-446655440011', 'Bezeq', 'BEZQ', 'technology'),
  ('660e8400-e29b-41d4-a716-446655440012', 'Cellcom Israel', 'CEL', 'technology'),
  ('660e8400-e29b-41d4-a716-446655440013', 'Shufersal', 'SAE', 'retail'),
  ('660e8400-e29b-41d4-a716-446655440014', 'Fox Wizel', 'FOX', 'retail'),
  ('660e8400-e29b-41d4-a716-446655440015', 'Steimatzky', 'STMZ', 'retail');

-- 30 benefits (2 per company), min_tier_id spread across all 3 tiers so the feed has
-- claimable/locked variety at every membership level.
insert into benefits (id, company_id, title, description, terms, min_tier_id) values
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '10% off any flight', 'One-time discount code for domestic or international El Al flights.', 'Single use, non-transferable.', (select id from membership_tiers where name = 'Silver')),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Free seat upgrade to Business', 'One complimentary upgrade on any El Al route, subject to availability.', 'Subject to availability at check-in.', (select id from membership_tiers where name = 'Gold')),
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', '15% off domestic flights', 'Standing discount code for Israir domestic routes.', 'Single use, non-transferable.', (select id from membership_tiers where name = 'Silver')),
  ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'Free extra baggage allowance', 'One additional checked bag on any Israir flight.', 'Applies at check-in, one bag.', (select id from membership_tiers where name = 'Gold')),
  ('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440003', 'One free checked bag', 'A complimentary checked bag on any Arkia flight.', 'Applies at check-in, one bag.', (select id from membership_tiers where name = 'Silver')),
  ('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440003', 'Free round-trip ticket voucher', 'A voucher toward a domestic round-trip flight.', 'Redeemable within 12 months.', (select id from membership_tiers where name = 'Platinum')),
  ('770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440004', 'Tech showcase tour', 'A guided tour of Elbit Systems'' technology showcase.', 'Booked in advance, limited dates.', (select id from membership_tiers where name = 'Gold')),
  ('770e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440004', 'Annual shareholder briefing', 'Invitation to Elbit''s annual shareholder technology briefing.', 'One invitation per shareholder.', (select id from membership_tiers where name = 'Platinum')),
  ('770e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440005', 'IAI branded gift package', 'A curated IAI-branded merchandise package.', 'While supplies last.', (select id from membership_tiers where name = 'Gold')),
  ('770e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440005', 'VIP facility tour', 'A VIP tour of an IAI manufacturing facility.', 'Booked in advance, security clearance required.', (select id from membership_tiers where name = 'Platinum')),
  ('770e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440006', '10% off any Isrotel stay', 'Standing discount code for any Isrotel property.', 'Blackout dates may apply.', (select id from membership_tiers where name = 'Silver')),
  ('770e8400-e29b-41d4-a716-446655440012', '660e8400-e29b-41d4-a716-446655440006', 'Free night at any Isrotel property', 'One complimentary night, subject to availability.', 'Subject to availability, blackout dates may apply.', (select id from membership_tiers where name = 'Gold')),
  ('770e8400-e29b-41d4-a716-446655440013', '660e8400-e29b-41d4-a716-446655440007', '15% off Leonardo Hotels bookings', 'Standing discount code for Fattal''s Leonardo Hotels brand.', 'Blackout dates may apply.', (select id from membership_tiers where name = 'Silver')),
  ('770e8400-e29b-41d4-a716-446655440014', '660e8400-e29b-41d4-a716-446655440007', 'Complimentary suite upgrade', 'One weekend suite upgrade at a Fattal property.', 'Subject to availability.', (select id from membership_tiers where name = 'Platinum')),
  ('770e8400-e29b-41d4-a716-446655440015', '660e8400-e29b-41d4-a716-446655440008', '2-for-1 movie tickets', 'A standing 2-for-1 code for any Yes Planet screening.', 'Excludes special events.', (select id from membership_tiers where name = 'Silver')),
  ('770e8400-e29b-41d4-a716-446655440016', '660e8400-e29b-41d4-a716-446655440008', 'Free popcorn combo every visit', 'A free popcorn combo redemption code, reusable each visit.', 'One redemption per visit.', (select id from membership_tiers where name = 'Gold')),
  ('770e8400-e29b-41d4-a716-446655440017', '660e8400-e29b-41d4-a716-446655440009', '20% off admission tickets', 'Standing discount code for Superland admission.', 'Not combinable with other offers.', (select id from membership_tiers where name = 'Silver')),
  ('770e8400-e29b-41d4-a716-446655440018', '660e8400-e29b-41d4-a716-446655440009', 'Free annual family pass upgrade', 'Upgrade a single-visit ticket to an annual family pass.', 'One upgrade per household per year.', (select id from membership_tiers where name = 'Gold')),
  ('770e8400-e29b-41d4-a716-446655440019', '660e8400-e29b-41d4-a716-446655440010', 'Free Premium plan upgrade (3 months)', 'Three months of Wix Premium at no cost.', 'New or existing sites, one redemption.', (select id from membership_tiers where name = 'Silver')),
  ('770e8400-e29b-41d4-a716-446655440020', '660e8400-e29b-41d4-a716-446655440010', 'Priority customer support', 'A dedicated priority support line for shareholders.', 'Ongoing while eligible.', (select id from membership_tiers where name = 'Gold')),
  ('770e8400-e29b-41d4-a716-446655440021', '660e8400-e29b-41d4-a716-446655440011', '10% off monthly internet plan', 'A standing discount on any Bezeq internet plan.', 'Ongoing while eligible.', (select id from membership_tiers where name = 'Silver')),
  ('770e8400-e29b-41d4-a716-446655440022', '660e8400-e29b-41d4-a716-446655440011', 'Free router upgrade', 'One complimentary router hardware upgrade.', 'One redemption per household.', (select id from membership_tiers where name = 'Gold')),
  ('770e8400-e29b-41d4-a716-446655440023', '660e8400-e29b-41d4-a716-446655440012', 'One month free mobile plan', 'A one-time free month on any Cellcom mobile plan.', 'One redemption per line.', (select id from membership_tiers where name = 'Silver')),
  ('770e8400-e29b-41d4-a716-446655440024', '660e8400-e29b-41d4-a716-446655440012', 'Free flagship phone upgrade', 'A subsidized upgrade to a flagship device on contract renewal.', 'Subject to plan renewal terms.', (select id from membership_tiers where name = 'Platinum')),
  ('770e8400-e29b-41d4-a716-446655440025', '660e8400-e29b-41d4-a716-446655440013', '5% cashback on groceries', 'Standing cashback on Shufersal purchases via a redemption code.', 'Capped monthly, ongoing while eligible.', (select id from membership_tiers where name = 'Silver')),
  ('770e8400-e29b-41d4-a716-446655440026', '660e8400-e29b-41d4-a716-446655440013', 'Free delivery for a year', 'Waived delivery fees on Shufersal online orders for 12 months.', 'One redemption per household per year.', (select id from membership_tiers where name = 'Gold')),
  ('770e8400-e29b-41d4-a716-446655440027', '660e8400-e29b-41d4-a716-446655440014', '15% off any purchase', 'A standing discount code for any Fox Wizel store or site.', 'Not combinable with other offers.', (select id from membership_tiers where name = 'Silver')),
  ('770e8400-e29b-41d4-a716-446655440028', '660e8400-e29b-41d4-a716-446655440014', 'Early access to new collections', 'Shop new Fox Wizel collections before public release.', 'Access window varies by drop.', (select id from membership_tiers where name = 'Gold')),
  ('770e8400-e29b-41d4-a716-446655440029', '660e8400-e29b-41d4-a716-446655440015', '10% off book purchases', 'A standing discount code for Steimatzky purchases, in-store or online.', 'Not combinable with other offers.', (select id from membership_tiers where name = 'Silver')),
  ('770e8400-e29b-41d4-a716-446655440030', '660e8400-e29b-41d4-a716-446655440015', 'Free annual book club membership', 'A complimentary year of Steimatzky''s book club.', 'One redemption per shareholder per year.', (select id from membership_tiers where name = 'Platinum'));

-- Reseed holdings for the existing 30 users (from 0004) against the new company ids.
-- Keeps the same holdings-count-by-segment pattern as the old 0005 seed (retail: 3,
-- mid-level: 4, high-net-worth: 5 holdings), so donuts still look realistic, while
-- portfolio_worth (and therefore each user's tier) is left untouched.
do $$
declare
  u record;
  c_ids uuid[];
  n_companies int;
  holdings_count int;
  remaining numeric;
  pct numeric;
  offset_idx int;
  i int;
begin
  select array_agg(id order by name) into c_ids from companies;
  n_companies := array_length(c_ids, 1);

  for u in select id, portfolio_worth from users order by email loop
    if u.portfolio_worth < 20000 then
      holdings_count := 3;
    elsif u.portfolio_worth < 50000 then
      holdings_count := 4;
    else
      holdings_count := 5;
    end if;

    remaining := 90; -- leaves ~10% unallocated cash on the donut
    offset_idx := abs(hashtext(u.id::text)) % n_companies;

    for i in 0..holdings_count - 1 loop
      if i = holdings_count - 1 then
        pct := remaining;
      else
        pct := round(remaining / (holdings_count - i));
      end if;

      insert into holdings (user_id, company_id, percentage)
      values (u.id, c_ids[((offset_idx + i) % n_companies) + 1], pct);

      remaining := remaining - pct;
    end loop;
  end loop;
end $$;

-- All rows now have sector/min_tier_id set — lock them down at the schema level.
alter table companies alter column sector set not null;
alter table benefits alter column min_tier_id set not null;
