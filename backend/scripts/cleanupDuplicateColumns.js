#!/usr/bin/env node

/**
 * Cleanup Duplicate Columns in Payment Transactions Table
 * This script removes duplicate camelCase columns that are causing conflicts
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

async function cleanupDuplicateColumns() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🧹 Starting duplicate columns cleanup...');
    
    // Read the SQL script
    const sqlPath = path.join(__dirname, 'cleanup-duplicate-columns.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL script
    await pool.query(sqlScript);
    
    console.log('✅ Duplicate columns cleanup completed successfully!');
    
    // Verify the cleanup by checking the table structure
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
    console.error('❌ Error cleaning up duplicate columns:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the cleanup
cleanupDuplicateColumns().catch(console.error);
