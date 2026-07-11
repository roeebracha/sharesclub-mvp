-- ShareClub MVP — seed users (30 demo users with varied portfolios)
-- 10 retail ($5k-$10k), 10 mid-level ($20k-$35k), 10 high-net-worth ($40k-$100k)

INSERT INTO users (id, email, name, portfolio_worth, verification_status) VALUES

-- Retail investors ($5k-$10k)
('5f3a4d11-9658-4baa-b505-449ff11d019c', 'alex.retail@sharesclub.local', 'Alex Rodriguez', 7500, 'self_report'),
('389d7e41-7860-4591-8437-da6f717e3559', 'morgan.smith@sharesclub.local', 'Morgan Smith', 5200, 'self_report'),
('808f49ed-7b1e-4edf-9301-a526321acaec', 'jordan.lee@sharesclub.local', 'Jordan Lee', 9800, 'self_report'),
('aaefcce3-af64-43aa-91af-f7e66b706787', 'casey.johnson@sharesclub.local', 'Casey Johnson', 6400, 'self_report'),
('a885efbe-e659-4960-95bf-b671f923d7b1', 'riley.williams@sharesclub.local', 'Riley Williams', 8900, 'self_report'),
('da7040dd-d8ae-4934-a68e-fe7ad06b2e0f', 'emma.thompson@sharesclub.local', 'Emma Thompson', 7200, 'self_report'),
('c002256d-3d70-4dd9-b63f-9e1f135b5ee7', 'david.chen@sharesclub.local', 'David Chen', 9500, 'self_report'),
('076083bd-77a0-4fab-947a-b4a62c4bdf42', 'sarah.patel@sharesclub.local', 'Sarah Patel', 6800, 'self_report'),
('a44bd24d-aec3-4e3d-9a47-4cb669aa3c6b', 'james.kim@sharesclub.local', 'James Kim', 8300, 'self_report'),
('4ba46fe4-4659-4b1f-b2a2-da1d4b78a538', 'lisa.johnson@sharesclub.local', 'Lisa Johnson', 5900, 'self_report'),

-- Mid-level investors ($20k-$35k)
('ce849048-e20c-4f52-914a-90c489ab6c86', 'taylor.brown@sharesclub.local', 'Taylor Brown', 22500, 'self_report'),
('4da779ed-6e9f-4380-8c9a-77442d4ac18f', 'jordan.davis@sharesclub.local', 'Jordan Davis', 28300, 'self_report'),
('d93c87c7-8536-4358-b944-36ed3ba8cf15', 'sam.martinez@sharesclub.local', 'Sam Martinez', 31800, 'self_report'),
('1b8e1199-df63-4d85-b5ef-b2c2af7d7c18', 'alex.garcia@sharesclub.local', 'Alex Garcia', 25600, 'self_report'),
('1d3fdd59-5d32-4d95-9f7a-68bd634f2d0c', 'morgan.wilson@sharesclub.local', 'Morgan Wilson', 34200, 'self_report'),
('b8519dd1-217e-4168-a56a-0283f22f1384', 'nina.kumar@sharesclub.local', 'Nina Kumar', 20500, 'self_report'),
('653c973c-770e-477b-ad3e-b891325ad1de', 'robert.lee@sharesclub.local', 'Robert Lee', 29800, 'self_report'),
('0868910a-46df-48d2-8818-5aee79395870', 'jessica.wang@sharesclub.local', 'Jessica Wang', 23400, 'self_report'),
('6c666f3a-1b44-49b8-af19-cbf66de836a5', 'christopher.brown@sharesclub.local', 'Christopher Brown', 32100, 'self_report'),
('4ce8ab9f-2bed-46ac-adac-43bcc973b1a5', 'amanda.davis@sharesclub.local', 'Amanda Davis', 26900, 'self_report'),

-- High-net-worth investors ($40k-$100k)
('4a239008-caf4-4d2c-90b3-9a1314321584', 'casey.anderson@sharesclub.local', 'Casey Anderson', 85000, 'self_report'),
('66bfcee5-d55a-4a56-88b1-2b94fb0a8fca', 'riley.taylor@sharesclub.local', 'Riley Taylor', 42500, 'self_report'),
('fdea5061-c2f5-4fbb-96e0-d9bf03012768', 'jordan.thomas@sharesclub.local', 'Jordan Thomas', 95000, 'self_report'),
('6cb83372-03a8-4e90-a3cd-ed283bfadeb2', 'morgan.jackson@sharesclub.local', 'Morgan Jackson', 67500, 'self_report'),
('f55dc066-6f2d-4f08-bbde-da3b99173ec9', 'alex.white@sharesclub.local', 'Alex White', 48200, 'self_report'),
('988ac01a-ca3c-4dc0-8651-d48e11553ca0', 'michael.singh@sharesclub.local', 'Michael Singh', 72000, 'self_report'),
('74c9974d-31a5-4987-b9d5-e3c2af51c524', 'patricia.harris@sharesclub.local', 'Patricia Harris', 55800, 'self_report'),
('e58be04e-c6fa-4e7b-af87-bd149f6acde7', 'kevin.martin@sharesclub.local', 'Kevin Martin', 88500, 'self_report'),
('b8eb5b1e-2f3e-465d-a139-20d8ce200032', 'rachel.adams@sharesclub.local', 'Rachel Adams', 61200, 'self_report'),
('10dbf5ef-b926-4c5e-a54c-47e0ae46dd4c', 'matthew.clark@sharesclub.local', 'Matthew Clark', 92000, 'self_report');
