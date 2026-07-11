-- ShareClub MVP — seed companies (30 real companies, 6 sectors)
-- Ordered by sector for clarity

INSERT INTO companies (id, name, ticker, logo_url) VALUES
-- Airlines (5)
('550e8400-e29b-41d4-a716-446655440001', 'United Airlines', 'UAL', 'https://upload.wikimedia.org/wikipedia/commons/0/0b/United_Airlines_logo_svg.svg'),
('550e8400-e29b-41d4-a716-446655440002', 'Southwest Airlines', 'LUV', 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Southwest_Airlines_logo_svg.svg'),
('550e8400-e29b-41d4-a716-446655440003', 'Delta Air Lines', 'DAL', 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Delta_logo.svg'),
('550e8400-e29b-41d4-a716-446655440004', 'American Airlines', 'AAL', 'https://upload.wikimedia.org/wikipedia/commons/0/0f/American_Airlines_logo_svg.svg'),
('550e8400-e29b-41d4-a716-446655440005', 'Alaska Air Group', 'ALK', 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Alaska_Airlines_logo.svg'),

-- Tech (5)
('550e8400-e29b-41d4-a716-446655440006', 'Apple', 'AAPL', 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Apple_logo_grey.svg'),
('550e8400-e29b-41d4-a716-446655440007', 'Microsoft', 'MSFT', 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg'),
('550e8400-e29b-41d4-a716-446655440008', 'Google', 'GOOGL', 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Google_logo.svg'),
('550e8400-e29b-41d4-a716-446655440009', 'Meta Platforms', 'META', 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc_logo.svg'),
('550e8400-e29b-41d4-a716-446655440010', 'Amazon', 'AMZN', 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'),

-- Retail (5)
('550e8400-e29b-41d4-a716-446655440011', 'Walmart', 'WMT', 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg'),
('550e8400-e29b-41d4-a716-446655440012', 'Target', 'TGT', 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Target_logo.svg'),
('550e8400-e29b-41d4-a716-446655440013', 'Best Buy', 'BBY', 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Best_Buy_logo.svg'),
('550e8400-e29b-41d4-a716-446655440014', 'The Home Depot', 'HD', 'https://upload.wikimedia.org/wikipedia/commons/1/18/Home_Depot_logo.svg'),
('550e8400-e29b-41d4-a716-446655440015', 'Costco Wholesale', 'COST', 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Costco_logo.svg'),

-- Finance (5)
('550e8400-e29b-41d4-a716-446655440016', 'JPMorgan Chase', 'JPM', 'https://upload.wikimedia.org/wikipedia/commons/5/51/JPMorgan_Chase_logo.svg'),
('550e8400-e29b-41d4-a716-446655440017', 'Bank of America', 'BAC', 'https://upload.wikimedia.org/wikipedia/commons/7/79/BofI_logo.svg'),
('550e8400-e29b-41d4-a716-446655440018', 'Citigroup', 'C', 'https://upload.wikimedia.org/wikipedia/commons/0/02/Citigroup_logo.svg'),
('550e8400-e29b-41d4-a716-446655440019', 'Goldman Sachs Group', 'GS', 'https://upload.wikimedia.org/wikipedia/commons/3/36/Goldman_Sachs.svg'),
('550e8400-e29b-41d4-a716-446655440020', 'Morgan Stanley', 'MS', 'https://upload.wikimedia.org/wikipedia/commons/3/33/Morgan_Stanley_Logo.svg'),

-- Healthcare (5)
('550e8400-e29b-41d4-a716-446655440021', 'UnitedHealth Group', 'UNH', 'https://upload.wikimedia.org/wikipedia/commons/2/2e/UnitedHealth_Group_logo.svg'),
('550e8400-e29b-41d4-a716-446655440022', 'Johnson & Johnson', 'JNJ', 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Johnson_%26_Johnson_Logo.svg'),
('550e8400-e29b-41d4-a716-446655440023', 'Pfizer', 'PFE', 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Pfizer_logo.svg'),
('550e8400-e29b-41d4-a716-446655440024', 'AbbVie', 'ABBV', 'https://upload.wikimedia.org/wikipedia/commons/a/a9/AbbVie_logo.svg'),
('550e8400-e29b-41d4-a716-446655440025', 'Thermo Fisher Scientific', 'TMO', 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Thermofisher_scientific_logo.svg'),

-- Energy (5)
('550e8400-e29b-41d4-a716-446655440026', 'ExxonMobil', 'XOM', 'https://upload.wikimedia.org/wikipedia/commons/a/a7/ExxonMobil_Logo.svg'),
('550e8400-e29b-41d4-a716-446655440027', 'Chevron', 'CVX', 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chevron_insignia.svg'),
('550e8400-e29b-41d4-a716-446655440028', 'ConocoPhillips', 'COP', 'https://upload.wikimedia.org/wikipedia/commons/3/39/ConocoPhillips_logo.svg'),
('550e8400-e29b-41d4-a716-446655440029', 'Equinor', 'EQNR', 'https://upload.wikimedia.org/wikipedia/commons/5/58/Equinor_logo.svg'),
('550e8400-e29b-41d4-a716-446655440030', 'Valero Energy', 'VLO', 'https://upload.wikimedia.org/wikipedia/commons/7/74/Valero_Energy_logo.png');
