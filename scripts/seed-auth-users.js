#!/usr/bin/env node

/**
 * Seed Auth Users Script
 * Creates 30 demo users in Supabase Auth and updates migration files with real UUIDs
 */

const fs = require('fs');
const path = require('path');

// Extract from environment, .env.local, or command line
// Manual .env.local parsing (dotenv not available)
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.+)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2];
    }
  });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL not found in .env.local');
  process.exit(1);
}

if (!SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY not provided');
  console.error('Usage: SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/seed-auth-users.js');
  process.exit(1);
}

// Import dynamic modules for this Node.js context
let supabase;

async function initSupabase() {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    console.log('✅ Supabase client initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase:', error.message);
    process.exit(1);
  }
}

// Extract user data from migration file
function extractUsersFromMigration() {
  const migrationPath = path.join(__dirname, '../supabase/migrations/0004_seed_users.sql');
  const content = fs.readFileSync(migrationPath, 'utf-8');

  const users = [];
  const lines = content.split('\n');

  for (const line of lines) {
    // Match: ('UUID', 'email', 'name', portfolio_worth, 'verification_status'),
    const match = line.match(/\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*'([^']+)'\)/);
    if (match) {
      users.push({
        placeholderId: match[1],
        email: match[2],
        name: match[3],
        portfolioWorth: parseInt(match[4]),
        verificationStatus: match[5],
      });
    }
  }

  return users;
}

// Create auth users and collect real IDs
async function createAuthUsers(users) {
  const mapping = {}; // oldId -> newAuthId
  const createdUsers = [];

  console.log(`\n📧 Creating ${users.length} auth users...`);

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: Math.random().toString(36).slice(-12), // Random temp password
        email_confirm: true, // Auto-confirm so no verification email needed
      });

      if (error) {
        console.error(`❌ Failed to create user ${user.email}:`, error.message);
        continue;
      }

      const authId = data.user.id;
      mapping[user.placeholderId] = authId;
      createdUsers.push({
        ...user,
        authId,
      });

      console.log(`  [${i + 1}/${users.length}] ✅ ${user.email} → ${authId}`);
    } catch (error) {
      console.error(`❌ Error creating user ${user.email}:`, error.message);
    }
  }

  console.log(`\n✅ Created ${createdUsers.length}/${users.length} auth users`);
  return { mapping, createdUsers };
}

// Update migration file with real auth IDs
function updateMigrationFile(filePath, mapping) {
  let content = fs.readFileSync(filePath, 'utf-8');

  for (const [oldId, newId] of Object.entries(mapping)) {
    const regex = new RegExp(`'${oldId}'`, 'g');
    content = content.replace(regex, `'${newId}'`);
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Updated ${path.basename(filePath)}`);
}

// Main execution
async function main() {
  try {
    console.log('🚀 ShareClub MVP — Auth User Seeding Script\n');

    // Initialize Supabase
    await initSupabase();

    // Extract users from migration
    const users = extractUsersFromMigration();
    console.log(`📋 Extracted ${users.length} users from migration file`);

    // Create auth users
    const { mapping, createdUsers } = await createAuthUsers(users);

    if (Object.keys(mapping).length === 0) {
      console.error('\n❌ No auth users were created. Aborting migration file updates.');
      process.exit(1);
    }

    // Update migration files
    console.log('\n📝 Updating migration files...');
    const usersPath = path.join(__dirname, '../supabase/migrations/0004_seed_users.sql');
    const holdingsPath = path.join(__dirname, '../supabase/migrations/0005_seed_holdings.sql');

    updateMigrationFile(usersPath, mapping);
    updateMigrationFile(holdingsPath, mapping);

    // Output summary
    console.log('\n✅ Seed process complete!');
    console.log('\n📌 User ID Mapping:');
    console.log('─'.repeat(80));

    for (const user of createdUsers) {
      console.log(`${user.email.padEnd(35)} → ${user.authId}`);
    }

    console.log('─'.repeat(80));
    console.log('\n📋 Next steps:');
    console.log('1. Open Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste content of 0004_seed_users.sql and execute');
    console.log('4. Copy and paste content of 0005_seed_holdings.sql and execute');
    console.log('\n⚠️  After running this script, REGENERATE your service role key in Supabase dashboard for security.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

main();
