-- ShareClub MVP — seed benefits (30-45 realistic shareholder perks)
-- Each company has 1-2 benefits with mixed threshold types

INSERT INTO benefits (id, company_id, title, description, terms, threshold_type, threshold_value) VALUES

-- Airlines (10 benefits)
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '10% Flight Discount', 'Get 10% off all United flights when you show your shareholder status', 'Valid on all United flights. One-time use per redemption code.', 'percent', 0.5),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Free Baggage for One Year', 'Waived checked baggage fees for 12 months', 'Applies to first checked bag on United flights. Redeemable within 12 months of approval.', 'amount', 500),

('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '15% Southwest Flight Discount', '15% off any Southwest flight booking', 'Valid on published fares. One code per redemption.', 'percent', 0.25),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Priority Boarding Upgrade', 'Skip the line with A-list priority boarding', 'Valid for 6 months. Not combinable with other boarding programs.', 'amount', 300),

('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', '12% Delta Flight Discount', '12% off Delta flights for shareholders', 'Valid on domestic and international routes.', 'percent', 0.4),
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 'Free SkyClub Lounge Pass', 'Complimentary lounge access for one year', 'Includes guest privileges. Valid at all SkyClub locations.', 'amount', 750),

('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440004', '8% American Airlines Discount', '8% off all American Airlines bookings', 'Valid for 12 months from redemption.', 'percent', 0.3),
('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440004', 'Upgrade Certificate', 'Free upgrade to premium cabin on one flight', 'Subject to availability. Must book within 6 months.', 'amount', 600),

('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440005', '10% Alaska Airlines Discount', '10% off Alaska Airlines flights', 'Valid on all fare classes.', 'percent', 0.35),
('660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440005', 'Free Companion Ticket', 'One free companion ticket on any Alaska flight', 'Companion must pay taxes and fees. Valid for 12 months.', 'amount', 1000),

-- Tech (10 benefits)
('660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440006', '15% Apple Store Discount', '15% off all Apple products in-store and online', 'Excludes gift cards and trade-ins. Valid for 12 months.', 'percent', 0.25),
('660e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440006', 'Free AppleCare+ Coverage', 'One year of free AppleCare+ on any device', 'Can be applied to one device per shareholder. Valid for 12 months.', 'amount', 800),

('660e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440007', '12% Microsoft Office Discount', '12% off Microsoft 365 subscriptions', 'Annual plans only. One redemption per shareholder.', 'percent', 0.3),
('660e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440007', 'Free Azure Credits', '$100 in free Azure cloud credits', 'Valid for 12 months. New account required.', 'amount', 1500),

('660e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440008', '10% Google Store Discount', '10% off Pixel, Nest, and other Google devices', 'Valid on direct Google Store purchases only.', 'percent', 0.2),
('660e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440008', 'Free Google One Premium', '1 year of Google One 100GB plan free', 'Includes enhanced security and support. Valid for 12 months.', 'amount', 500),

('660e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440009', '15% Meta Ads Coupon', '$500 in free Meta advertising credits', 'Valid on Facebook and Instagram ads. Expires 12 months from issuance.', 'percent', 0.4),
('660e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440009', 'Free Instagram Professional Account', 'One year of verified professional account status', 'Includes advanced analytics and promotional tools.', 'amount', 200),

('660e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440010', '20% Amazon Prime Discount', '20% off Amazon Prime annual membership', 'Can be combined with promotional offers.', 'percent', 0.15),
('660e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', 'Free AWS Starter Pack', '$300 in free AWS credits for new users', 'Valid for 12 months. One per person.', 'amount', 2000),

-- Retail (10 benefits)
('660e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440011', '10% Walmart Discount', '10% off your first Walmart purchase', 'Valid in-store and online. One use per code.', 'percent', 0.3),
('660e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440011', 'Free Walmart+ Membership', 'One year of Walmart+ with free shipping and member discounts', 'Includes grocery delivery service.', 'amount', 1000),

('660e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440012', '15% Target Discount', '15% off one Target purchase', 'Valid on most items (excludes some brands).', 'percent', 0.25),
('660e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440012', 'Free Target RedCard Rewards', '$50 Target gift card + 5% shopping bonus', 'RedCard benefits valid for 12 months.', 'amount', 500),

('660e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440013', '20% Best Buy Tech Discount', '20% off electronics and appliances', 'Valid on most items. Some exclusions apply.', 'percent', 0.35),
('660e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440013', 'Free Geek Squad Service', '2 hours of free tech support or installation service', 'Valid for 12 months. Schedule online or in-store.', 'amount', 1500),

('660e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440014', '12% Home Depot Discount', '12% off tools, building materials, and home improvement items', 'Valid in-store and online.', 'percent', 0.2),
('660e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440014', 'Free Installation Service', 'Complimentary installation on one major appliance purchase', 'Applies to kitchen and laundry appliances. $300+ purchase required.', 'amount', 2000),

('660e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440015', '8% Costco Discount', '8% off Costco Gold membership upgrade', 'Reduces upgrade cost to $42 (from $50).', 'percent', 0.15),
('660e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440015', 'Free Costco Travel Package', 'Complimentary vacation package worth $500 value', 'Valid on participating destinations. Book within 12 months.', 'amount', 3000),

-- Finance (8 benefits)
('660e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440016', 'Premium Banking Benefits', 'Waived ATM fees, priority service, and bonus interest rates', 'Valid for 12 months at JPMorgan Chase branches.', 'percent', 0.75),
('660e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440016', 'Free Financial Advisory', 'One complimentary 1-hour financial planning session', 'With registered financial advisor. Valid for 12 months.', 'amount', 2500),

('660e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440017', 'Preferred Banking Status', 'Relationship rewards, preferred rates, and fee waivers', 'Valid for 24 months. Requires $50k+ minimum balance.', 'percent', 0.5),
('660e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440017', 'Investment Advisory Credit', '$500 credit toward investment advisory fees', 'Applied to accounts opened during promotional period.', 'amount', 1500),

('660e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440018', 'Citibank Elite Status', 'Concierge service, travel benefits, and insurance upgrades', 'Valid for 12 months on Citi credit cards.', 'percent', 0.6),
('660e8400-e29b-41d4-a716-446655440036', '550e8400-e29b-41d4-a716-446655440018', 'Fee Waiver Package', 'Waive annual credit card fees and banking charges for one year', 'Can be applied to one primary account.', 'amount', 800),

('660e8400-e29b-41d4-a716-446655440037', '550e8400-e29b-41d4-a716-446655440019', 'Goldman Sachs Wealth Management', 'Consultation and advisory on investment strategies', 'For qualified shareholders. Minimum $1M+ assets required.', 'percent', 1.0),
('660e8400-e29b-41d4-a716-446655440038', '550e8400-e29b-41d4-a716-446655440020', 'Morgan Stanley Brokerage Discount', '$1000 credit toward brokerage trading fees', 'Valid on active brokerage accounts.', 'amount', 2000),

-- Healthcare (8 benefits)
('660e8400-e29b-41d4-a716-446655440039', '550e8400-e29b-41d4-a716-446655440021', 'Telehealth Service Credit', '$200 credit toward virtual doctor visits and telehealth', 'Valid for 12 months. Covers UnitedHealth partner providers.', 'percent', 0.4),
('660e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440021', 'Wellness Program Enrollment', 'Free enrollment in premium wellness programs and fitness benefits', 'Includes gym discounts and health coaching. Valid for 12 months.', 'amount', 1000),

('660e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440022', 'Prescription Discount Card', '$100 in prescription medication discounts', 'Valid at major pharmacy retailers nationwide.', 'percent', 0.3),
('660e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440022', 'Health Screening Package', 'Free annual comprehensive health screening ($500 value)', 'Includes blood work, physical, and health consultation.', 'amount', 1500),

('660e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440023', 'Pfizer Patient Assistance', 'Discounted medications through Pfizer assistance programs', 'Eligible for select Pfizer drugs. Apply directly to program.', 'percent', 0.25),
('660e8400-e29b-41d4-a716-446655440044', '550e8400-e29b-41d4-a716-446655440023', 'Vaccine Program Discount', '50% off recommended vaccines through partner clinics', 'Valid for shareholder and immediate family. 12-month validity.', 'amount', 200),

('660e8400-e29b-41d4-a716-446655440045', '550e8400-e29b-41d4-a716-446655440024', 'AbbVie Health Benefits', 'Enrollment in exclusive AbbVie health programs with reduced copays', 'Valid for 24 months. Covers specialty medications.', 'percent', 0.35),
('660e8400-e29b-41d4-a716-446655440046', '550e8400-e29b-41d4-a716-446655440025', 'Scientific Equipment Discount', '15% off Thermo Fisher lab equipment and supplies', 'For research professionals and educators. Corporate accounts only.', 'amount', 5000),

-- Energy (6 benefits)
('660e8400-e29b-41d4-a716-446655440047', '550e8400-e29b-41d4-a716-446655440026', 'ExxonMobil Fuel Rewards', 'Earn 10¢ per gallon bonus at Exxon/Mobil stations', 'Valid for 12 months. Enrollment required.', 'percent', 0.5),
('660e8400-e29b-41d4-a716-446655440048', '550e8400-e29b-41d4-a716-446655440026', 'Home Energy Audit', 'Free energy efficiency audit for your home ($300 value)', 'Includes recommendations for cost savings.', 'amount', 1000),

('660e8400-e29b-41d4-a716-446655440049', '550e8400-e29b-41d4-a716-446655440027', 'Chevron Fuel Discount Program', '7¢ per gallon discount at Chevron stations', 'Valid for 12 months. Must enroll via program.', 'percent', 0.4),
('660e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440027', 'Renewable Energy Rebate', '$500 rebate toward home solar installation', 'For Chevron-certified solar partners. Valid for 24 months.', 'amount', 2000),

('660e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440028', 'ConocoPhillips Fuel Rewards', '5¢ per gallon savings at participating stations', 'Rewards card required. Valid 12 months.', 'percent', 0.35),
('660e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440030', 'Valero Energy Dividend Bonus', 'Quarterly energy efficiency rebates on home utilities', 'Automatic enrollment. Valid for 12 months.', 'amount', 600);
