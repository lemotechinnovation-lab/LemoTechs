// Migration Management for LemoTech Infrastructure
// This integrates with node-pg-migrate and provides utilities for database management

import { promisify } from 'util';
import { exec } from 'child_process';
import path from 'path';
import { testConnection } from './database';
import { Logger } from '../utils/logger';

const execAsync = promisify(exec);

export interface MigrationStatus {
  name: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

export class MigrationManager {
  private migrationsPath: string;
  private configPath: string;

  constructor() {
    this.migrationsPath = path.join(__dirname, 'migrations');
    this.configPath = path.join(process.cwd(), 'migrate.json');
  }

  // Check if migrations are up to date
  async checkMigrationStatus(): Promise<MigrationStatus[]> {
    try {
      const { stdout } = await execAsync('npx pg-migrate status', {
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'development' }
      });

      const lines = stdout.split('\n').filter(line => line.trim());
      const migrations: MigrationStatus[] = [];

      for (const line of lines) {
        if (line.includes('Migration')) {
          const match = line.match(/(\d+)_(.+)/);
          if (match && match[1] && match[2]) {
            migrations.push({
              name: match[2],
              timestamp: match[1],
              status: line.includes('up') ? 'completed' : 'pending'
            });
          }
        }
      }

      return migrations;
    } catch (error) {
      Logger.error('❌ Failed to check migration status:', error);
      return [];
    }
  }

  // Run pending migrations
  async runMigrations(): Promise<boolean> {
    try {
      Logger.info('🔄 Running database migrations...');
      
      // Test database connection first
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error('Database connection failed');
      }

      const { stdout, stderr } = await execAsync('npx pg-migrate up', {
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'development' }
      });

      if (stderr && !stderr.includes('warning')) {
        Logger.error('❌ Migration error:', stderr);
        return false;
      }

      Logger.info('✅ Migrations completed successfully');
      Logger.info(stdout);
      return true;
    } catch (error) {
      Logger.error('❌ Migration failed:', error);
      return false;
    }
  }

  // Rollback last migration
  async rollbackMigration(): Promise<boolean> {
    try {
      Logger.info('🔄 Rolling back last migration...');
      
      const { stdout, stderr } = await execAsync('npx pg-migrate down', {
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'development' }
      });

      if (stderr && !stderr.includes('warning')) {
        Logger.error('❌ Rollback error:', stderr);
        return false;
      }

      Logger.info('✅ Rollback completed successfully');
      Logger.info(stdout);
      return true;
    } catch (error) {
      Logger.error('❌ Rollback failed:', error);
      return false;
    }
  }

  // Create a new migration
  async createMigration(name: string): Promise<string | null> {
    try {
      Logger.info(`🔄 Creating new migration: ${name}`);
      
      const { stdout } = await execAsync(`npx pg-migrate create ${name}`, {
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'development' }
      });

      const match = stdout.match(/(\d+)_(.+)\.js/);
      if (match) {
        const migrationFile = match[0];
        Logger.info(`✅ Migration created: ${migrationFile}`);
        return migrationFile;
      }

      return null;
    } catch (error) {
      Logger.error('❌ Failed to create migration:', error);
      return null;
    }
  }

  // Reset database (drop all tables and re-run migrations)
  async resetDatabase(): Promise<boolean> {
    try {
      Logger.info('⚠️  Resetting database (this will drop all data!)');
      
      const { stdout, stderr } = await execAsync('npx pg-migrate reset', {
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'development' }
      });

      if (stderr && !stderr.includes('warning')) {
        Logger.error('❌ Reset error:', stderr);
        return false;
      }

      Logger.info('✅ Database reset completed successfully');
      Logger.info(stdout);
      return true;
    } catch (error) {
      Logger.error('❌ Database reset failed:', error);
      return false;
    }
  }

  // Validate database schema against migrations
  async validateSchema(): Promise<boolean> {
    try {
      const migrations = await this.checkMigrationStatus();
      const pendingMigrations = migrations.filter(m => m.status === 'pending');
      
      if (pendingMigrations.length > 0) {
        Logger.info('⚠️  Pending migrations found:', pendingMigrations.map(m => m.name));
        return false;
      }

      Logger.info('✅ Database schema is up to date');
      return true;
    } catch (error) {
      Logger.error('❌ Schema validation failed:', error);
      return false;
    }
  }

  // Get migration history
  async getMigrationHistory(): Promise<MigrationStatus[]> {
    return await this.checkMigrationStatus();
  }
}

// Export singleton instance
export const migrationManager = new MigrationManager();

// Convenience functions
export const runMigrations = () => migrationManager.runMigrations();
export const checkMigrationStatus = () => migrationManager.checkMigrationStatus();
export const validateSchema = () => migrationManager.validateSchema();
export const createMigration = (name: string) => migrationManager.createMigration(name);
export const rollbackMigration = () => migrationManager.rollbackMigration();
export const resetDatabase = () => migrationManager.resetDatabase();

export default migrationManager;
