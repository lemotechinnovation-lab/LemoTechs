import { Pool } from 'pg';
import dotenv from 'dotenv';
import { Logger } from '../utils/logger';

dotenv.config();

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    Logger.info('✅ Database connected successfully');
    return true;
  } catch (error) {
    Logger.error('❌ Database connection failed:', error);
    return false;
  }
};

// Execute query with error handling
export const query = async (text: string, params?: any[]): Promise<any> => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    Logger.info('📊 Query executed:', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    Logger.error('❌ Query failed:', { text, error });
    throw error;
  }
};

// Get a client from the pool for transactions
export const getClient = async () => {
  return await pool.connect();
};

// Initialize database schema (if needed)
export const initializeDatabase = async (): Promise<void> => {
  try {
    Logger.info('🔧 Database schema already managed by migrations');
    Logger.info('✅ Database ready');
  } catch (error) {
    Logger.error('❌ Database initialization failed:', error);
    throw error;
  }
};

export default pool;
