#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')

// Load env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.error('   Make sure .env.local is set up correctly')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const migrations = [
  '0002_seed_companies.sql',
  '0003_seed_benefits.sql',
  '0004_seed_users.sql',
  '0005_seed_holdings.sql'
]

async function applyMigrations() {
  console.log('🚀 Starting migration process...\n')

  for (const migration of migrations) {
    const filePath = path.join(projectRoot, 'supabase', 'migrations', migration)

    if (!fs.existsSync(filePath)) {
      console.error(`❌ Migration file not found: ${filePath}`)
      process.exit(1)
    }

    try {
      console.log(`⏳ Applying ${migration}...`)
      const sql = fs.readFileSync(filePath, 'utf-8')

      const { error } = await supabase.rpc('exec', { sql })

      if (error) {
        // Try alternative method - direct SQL execution
        const { error: directError } = await supabase.from('_dummy').select().limit(0)

        // Since RPC might not exist, let's use a different approach with pg
        console.log(`   Trying alternative execution method...`)
        await executeWithPg(sql)
      }

      console.log(`✅ ${migration} applied successfully\n`)
    } catch (error) {
      console.error(`❌ Error applying ${migration}:`)
      console.error(`   ${error.message}`)
      process.exit(1)
    }
  }

  console.log('✨ All migrations applied successfully!')
  console.log('\nVerifying data...')
  await verifyData()
}

async function executeWithPg(sql) {
  // For Supabase, we need to use the PostgREST API or pg client
  // Let's use a more direct approach with node-postgres if available
  try {
    const pg = await import('pg')
    const { Client } = pg.default || pg

    // Parse Supabase connection string from URL
    const urlObj = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL)
    const connectionString = `postgresql://postgres:[YOUR_PASSWORD]@${urlObj.hostname}:5432/postgres`

    console.log('   (Note: Full postgres connection requires database password)')
    throw new Error('Direct postgres connection requires password - use Supabase dashboard instead')
  } catch {
    throw new Error('Cannot execute migrations directly. Please run via Supabase dashboard SQL editor.')
  }
}

async function verifyData() {
  try {
    const { data: companies, error: e1 } = await supabase.from('companies').select('COUNT(*)')
    const { data: benefits, error: e2 } = await supabase.from('benefits').select('COUNT(*)')
    const { data: users, error: e3 } = await supabase.from('users').select('COUNT(*)')
    const { data: holdings, error: e4 } = await supabase.from('holdings').select('COUNT(*)')

    if (e1 || e2 || e3 || e4) {
      console.log('\n⚠️  Could not verify data (RLS policies may restrict read access)')
      console.log('   Log into Supabase dashboard to verify manually')
      return
    }

    console.log(`\n📊 Data Summary:`)
    console.log(`   Companies: ${companies?.length || 'unknown'} rows`)
    console.log(`   Benefits:  ${benefits?.length || 'unknown'} rows`)
    console.log(`   Users:     ${users?.length || 'unknown'} rows`)
    console.log(`   Holdings:  ${holdings?.length || 'unknown'} rows`)
  } catch (error) {
    console.log('\n⚠️  Could not verify data counts')
  }
}

applyMigrations().catch(error => {
  console.error('Fatal error:', error.message)
  process.exit(1)
})
