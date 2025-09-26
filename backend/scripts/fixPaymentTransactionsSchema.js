#!/usr/bin/env node

/**
 * Fix Payment Transactions Table Schema
 * This script fixes column naming issues in the payment_transactions table
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

async function fixPaymentTransactionsSchema() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔧 Starting payment transactions schema fix...');
    
    // Read the SQL script
    const sqlPath = path.join(__dirname, 'fix-payment-transactions-schema.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL script
    await pool.query(sqlScript);
    
    console.log('✅ Payment transactions schema fix completed successfully!');
    
    // Verify the fix by checking the table structure
    console.log('\n📋 Current payment_transactions table structure:');
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'payment_transactions'
      ORDER BY ordinal_position;
    `);
    
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing payment transactions schema:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the fix
fixPaymentTransactionsSchema().catch(console.error);
