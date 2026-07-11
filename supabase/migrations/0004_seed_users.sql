-- ShareClub MVP — seed users (30 demo users with varied portfolios)
-- 10 retail ($5k-$10k), 10 mid-level ($20k-$35k), 10 high-net-worth ($40k-$100k)

INSERT INTO users (id, email, name, portfolio_worth, verification_status) VALUES

-- Retail investors ($5k-$10k)
('770e8400-e29b-41d4-a716-446655440001', 'alex.retail@sharesclub.local', 'Alex Rodriguez', 7500, 'self_report'),
('770e8400-e29b-41d4-a716-446655440002', 'morgan.smith@sharesclub.local', 'Morgan Smith', 5200, 'self_report'),
('770e8400-e29b-41d4-a716-446655440003', 'jordan.lee@sharesclub.local', 'Jordan Lee', 9800, 'self_report'),
('770e8400-e29b-41d4-a716-446655440004', 'casey.johnson@sharesclub.local', 'Casey Johnson', 6400, 'self_report'),
('770e8400-e29b-41d4-a716-446655440005', 'riley.williams@sharesclub.local', 'Riley Williams', 8900, 'self_report'),
('770e8400-e29b-41d4-a716-446655440031', 'emma.thompson@sharesclub.local', 'Emma Thompson', 7200, 'self_report'),
('770e8400-e29b-41d4-a716-446655440032', 'david.chen@sharesclub.local', 'David Chen', 9500, 'self_report'),
('770e8400-e29b-41d4-a716-446655440033', 'sarah.patel@sharesclub.local', 'Sarah Patel', 6800, 'self_report'),
('770e8400-e29b-41d4-a716-446655440034', 'james.kim@sharesclub.local', 'James Kim', 8300, 'self_report'),
('770e8400-e29b-41d4-a716-446655440035', 'lisa.johnson@sharesclub.local', 'Lisa Johnson', 5900, 'self_report'),

-- Mid-level investors ($20k-$35k)
('770e8400-e29b-41d4-a716-446655440006', 'taylor.brown@sharesclub.local', 'Taylor Brown', 22500, 'self_report'),
('770e8400-e29b-41d4-a716-446655440007', 'jordan.davis@sharesclub.local', 'Jordan Davis', 28300, 'self_report'),
('770e8400-e29b-41d4-a716-446655440008', 'sam.martinez@sharesclub.local', 'Sam Martinez', 31800, 'self_report'),
('770e8400-e29b-41d4-a716-446655440009', 'alex.garcia@sharesclub.local', 'Alex Garcia', 25600, 'self_report'),
('770e8400-e29b-41d4-a716-446655440010', 'morgan.wilson@sharesclub.local', 'Morgan Wilson', 34200, 'self_report'),
('770e8400-e29b-41d4-a716-446655440036', 'nina.kumar@sharesclub.local', 'Nina Kumar', 20500, 'self_report'),
('770e8400-e29b-41d4-a716-446655440037', 'robert.lee@sharesclub.local', 'Robert Lee', 29800, 'self_report'),
('770e8400-e29b-41d4-a716-446655440038', 'jessica.wang@sharesclub.local', 'Jessica Wang', 23400, 'self_report'),
('770e8400-e29b-41d4-a716-446655440039', 'christopher.brown@sharesclub.local', 'Christopher Brown', 32100, 'self_report'),
('770e8400-e29b-41d4-a716-446655440040', 'amanda.davis@sharesclub.local', 'Amanda Davis', 26900, 'self_report'),

-- High-net-worth investors ($40k-$100k)
('770e8400-e29b-41d4-a716-446655440011', 'casey.anderson@sharesclub.local', 'Casey Anderson', 85000, 'self_report'),
('770e8400-e29b-41d4-a716-446655440012', 'riley.taylor@sharesclub.local', 'Riley Taylor', 42500, 'self_report'),
('770e8400-e29b-41d4-a716-446655440013', 'jordan.thomas@sharesclub.local', 'Jordan Thomas', 95000, 'self_report'),
('770e8400-e29b-41d4-a716-446655440014', 'morgan.jackson@sharesclub.local', 'Morgan Jackson', 67500, 'self_report'),
('770e8400-e29b-41d4-a716-446655440015', 'alex.white@sharesclub.local', 'Alex White', 48200, 'self_report'),
('770e8400-e29b-41d4-a716-446655440041', 'michael.singh@sharesclub.local', 'Michael Singh', 72000, 'self_report'),
('770e8400-e29b-41d4-a716-446655440042', 'patricia.harris@sharesclub.local', 'Patricia Harris', 55800, 'self_report'),
('770e8400-e29b-41d4-a716-446655440043', 'kevin.martin@sharesclub.local', 'Kevin Martin', 88500, 'self_report'),
('770e8400-e29b-41d4-a716-446655440044', 'rachel.adams@sharesclub.local', 'Rachel Adams', 61200, 'self_report'),
('770e8400-e29b-41d4-a716-446655440045', 'matthew.clark@sharesclub.local', 'Matthew Clark', 92000, 'self_report');
