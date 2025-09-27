// Enhanced Migration Management for LemoTech Infrastructure
// Provides EF-like migrations with versioning, database recreation, and comprehensive schema management

import { promisify } from 'util';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { getClient, testConnection } from './database';
import { Logger } from '../utils/logger';

const execAsync = promisify(exec);

export interface MigrationVersion {
  version: string;
  name: string;
  timestamp: Date;
  checksum: string;
  appliedAt?: Date;
  rollbackAt?: Date;
}

export interface MigrationStatus {
  name: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed' | 'rolled_back';
  version: string;
  checksum: string;
  appliedAt?: Date;
  rollbackAt?: Date;
}

export interface DatabaseSchema {
  version: string;
  tables: string[];
  indexes: string[];
  constraints: string[];
  functions: string[];
  triggers: string[];
  lastUpdated: Date;
}

export class EnhancedMigrationManager {
  private migrationsPath: string;
  private configPath: string;
  private schemaPath: string;
  private versionTable: string = 'schema_migrations';

  constructor() {
    // Point to migrations directory - check multiple possible locations
    const possiblePaths = [
      path.join(process.cwd(), 'src', 'infrastructure', 'migrations'), // Development/local
      path.join(process.cwd(), 'migrations'), // If migrations are in root
      path.join(__dirname, 'migrations'), // Relative to compiled location
      path.join(__dirname, '..', '..', 'src', 'infrastructure', 'migrations') // From dist back to src
    ];
    
    this.migrationsPath = possiblePaths.find(p => {
      try {
        return require('fs').existsSync(p);
      } catch {
        return false;
      }
    }) ?? possiblePaths[0]!; // Default to first if none found
    
    this.configPath = path.join(process.cwd(), 'migrate.json');
    this.schemaPath = path.join(this.migrationsPath, 'sql');
    
    console.log(`🔍 Migration path resolved to: ${this.migrationsPath}`);
  }

  /**
   * Initialize migration system - create version tracking table
   */
  async initializeMigrationSystem(): Promise<boolean> {
    try {
      const client = await getClient();
      
      // Create schema migrations table
      await client.query(`
        CREATE TABLE IF NOT EXISTS ${this.versionTable} (
          version VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          checksum VARCHAR(64) NOT NULL,
          applied_at TIMESTAMP DEFAULT NOW(),
          rollback_at TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create schema version table
      await client.query(`
        CREATE TABLE IF NOT EXISTS schema_version (
          id SERIAL PRIMARY KEY,
          version VARCHAR(50) NOT NULL,
          description TEXT,
          applied_at TIMESTAMP DEFAULT NOW(),
          checksum VARCHAR(64) NOT NULL,
          UNIQUE(version)
        )
      `);

      client.release();
      Logger.info('✅ Migration system initialized');
      return true;
    } catch (error) {
      Logger.error('❌ Failed to initialize migration system:', error);
      return false;
    }
  }

  /**
   * Get current database schema version
   */
  async getCurrentSchemaVersion(): Promise<string | null> {
    try {
      const client = await getClient();
      const result = await client.query(
        `SELECT version FROM schema_version ORDER BY applied_at DESC LIMIT 1`
      );
      client.release();
      
      return result.rows.length > 0 ? result.rows[0].version : null;
    } catch (error) {
      Logger.error('❌ Failed to get current schema version:', error);
      return null;
    }
  }

  /**
   * Get all migration statuses
   */
  async getMigrationStatus(): Promise<MigrationStatus[]> {
    try {
      const client = await getClient();
      
      // Get applied migrations
      const appliedMigrations = await client.query(
        `SELECT version, name, checksum, applied_at, rollback_at FROM ${this.versionTable} ORDER BY applied_at`
      );

      // Get all migration files
      const migrationFiles = await this.getAllMigrationFiles();
      
      const migrations: MigrationStatus[] = [];
      
      // Process applied migrations
      for (const migration of appliedMigrations.rows) {
        migrations.push({
          name: migration.name,
          timestamp: migration.version.split('_')[0],
          status: migration.rollback_at ? 'rolled_back' : 'completed',
          version: migration.version,
          checksum: migration.checksum,
          appliedAt: migration.applied_at,
          rollbackAt: migration.rollback_at
        });
      }

      // Process pending migrations
      for (const file of migrationFiles) {
        const version = file.split('_')[0];
        const name = file.replace(/^\d+_/, '').replace(/\.js$/, '');
        
        if (!migrations.find(m => m.version === version)) {
          migrations.push({
            name,
            timestamp: version || '',
            status: 'pending',
            version: version || '',
            checksum: await this.calculateFileChecksum(path.join(this.migrationsPath, file))
          });
        }
      }

      client.release();
      return migrations.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    } catch (error) {
      Logger.error('❌ Failed to get migration status:', error);
      return [];
    }
  }

  /**
   * Run all pending migrations
   */
  async runMigrations(): Promise<boolean> {
    try {
      Logger.info('🔄 Running database migrations...');
      
      // Test database connection
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error('Database connection failed');
      }

      // Initialize migration system if needed
      await this.initializeMigrationSystem();

      // Get pending migrations
      const migrations = await this.getMigrationStatus();
      const pendingMigrations = migrations.filter(m => m.status === 'pending');

      if (pendingMigrations.length === 0) {
        Logger.info('✅ No pending migrations');
        return true;
      }

      Logger.info(`📋 Found ${pendingMigrations.length} pending migrations`);

      // Run each migration
      for (const migration of pendingMigrations) {
        const success = await this.runSingleMigration(migration);
        if (!success) {
          Logger.error(`❌ Migration ${migration.name} failed`);
          return false;
        }
      }

      Logger.info('✅ All migrations completed successfully');
      return true;
    } catch (error) {
      Logger.error('❌ Migration failed:', error);
      return false;
    }
  }

  /**
   * Run a single migration
   */
  private async runSingleMigration(migration: MigrationStatus): Promise<boolean> {
    try {
      Logger.info(`🔄 Running migration: ${migration.name}`);
      
      const migrationFile = path.join(this.migrationsPath, `${migration.version}_${migration.name}.js`);
      
      if (!fs.existsSync(migrationFile)) {
        Logger.error(`❌ Migration file not found: ${migrationFile}`);
        return false;
      }

      // Execute migration directly using our custom migration runner
      const client = await getClient();
      try {
        // Load and execute the migration
        const migrationModule = require(migrationFile);
        
        if (typeof migrationModule.up === 'function') {
          // Create a mock pgm object for the migration
          const pgm = {
            createTable: (tableName: string, columns: any) => this.createTable(client, tableName, columns),
            dropTable: (tableName: string) => this.dropTable(client, tableName),
            createIndex: (tableName: string, columns: string | string[], options?: any) => this.createIndex(client, tableName, columns, options),
            dropIndex: (tableName: string, indexName: string) => this.dropIndex(client, tableName, indexName),
            sql: (sql: string) => this.executeSQL(client, sql),
            func: (funcName: string) => funcName,
            createTrigger: (tableName: string, triggerName: string, options: any) => this.createTrigger(client, tableName, triggerName, options)
          };
          
          await migrationModule.up(pgm);
          Logger.info(`✅ Migration ${migration.name} completed successfully`);
        } else {
          Logger.error(`❌ Migration ${migration.name} has no 'up' function`);
          return false;
        }
      } finally {
        client.release();
      }

      // Record migration in our version table
      const recordClient = await getClient();
      await recordClient.query(
        `INSERT INTO ${this.versionTable} (version, name, checksum, applied_at) VALUES ($1, $2, $3, NOW())`,
        [migration.version, migration.name, migration.checksum]
      );
      recordClient.release();

      Logger.info(`✅ Migration ${migration.name} completed`);
      return true;
    } catch (error) {
      Logger.error(`❌ Migration ${migration.name} failed:`, error);
      return false;
    }
  }

  /**
   * Helper methods for migration execution
   */
  private async createTable(client: any, tableName: string, columns: any): Promise<void> {
    const columnDefs = Object.entries(columns).map(([name, def]: [string, any]) => {
      let defStr = `${name} ${def.type}`;
      if (def.primaryKey) defStr += ' PRIMARY KEY';
      if (def.notNull) defStr += ' NOT NULL';
      if (def.default) {
        if (typeof def.default === 'object' && def.default.func) {
          // Handle pgm.func() calls
          defStr += ` DEFAULT ${def.default.func}`;
        } else if (typeof def.default === 'string' && def.default.includes('gen_random_uuid()')) {
          defStr += ' DEFAULT gen_random_uuid()';
        } else if (typeof def.default === 'string' && def.default.includes('NOW()')) {
          defStr += ' DEFAULT NOW()';
        } else {
          defStr += ` DEFAULT ${def.default}`;
        }
      }
      if (def.references) defStr += ` REFERENCES ${def.references}`;
      if (def.onDelete) defStr += ` ON DELETE ${def.onDelete}`;
      if (def.check) defStr += ` CHECK (${def.check})`;
      return defStr;
    }).join(', ');
    
    await client.query(`CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefs})`);
  }

  private async dropTable(client: any, tableName: string): Promise<void> {
    await client.query(`DROP TABLE IF EXISTS ${tableName}`);
  }

  private async createIndex(client: any, tableName: string, columns: string | string[], options?: any): Promise<void> {
    const columnStr = Array.isArray(columns) ? columns.join(', ') : columns;
    const indexName = options?.name || `idx_${tableName}_${columnStr.replace(/[,\s]/g, '_')}`;
    await client.query(`CREATE INDEX IF NOT EXISTS ${indexName} ON ${tableName} (${columnStr})`);
  }

  private async dropIndex(client: any, tableName: string, indexName: string): Promise<void> {
    await client.query(`DROP INDEX IF EXISTS ${indexName}`);
  }

  private async executeSQL(client: any, sql: string): Promise<void> {
    await client.query(sql);
  }

  private async createTrigger(client: any, tableName: string, triggerName: string, options: any): Promise<void> {
    const { when, operation, function: funcName, level } = options;
    await client.query(
      `CREATE TRIGGER ${triggerName} ${when} ${operation} ON ${tableName} FOR EACH ${level} EXECUTE FUNCTION ${funcName}()`
    );
  }

  /**
   * Rollback last migration
   */
  async rollbackMigration(): Promise<boolean> {
    try {
      Logger.info('🔄 Rolling back last migration...');
      
      const client = await getClient();
      
      // Get last applied migration
      const lastMigration = await client.query(
        `SELECT version, name FROM ${this.versionTable} WHERE rollback_at IS NULL ORDER BY applied_at DESC LIMIT 1`
      );

      if (lastMigration.rows.length === 0) {
        Logger.info('✅ No migrations to rollback');
        client.release();
        return true;
      }

      const migration = lastMigration.rows[0];
      
      // Execute rollback using node-pg-migrate
      const { stdout, stderr } = await execAsync(`npx pg-migrate down --file ${migration.version}_${migration.name}`, {
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'development' }
      });

      if (stderr && !stderr.includes('warning')) {
        Logger.error('❌ Rollback error:', stderr);
        client.release();
        return false;
      }

      // Mark migration as rolled back
      await client.query(
        `UPDATE ${this.versionTable} SET rollback_at = NOW() WHERE version = $1`,
        [migration.version]
      );

      client.release();
      Logger.info(`✅ Rollback completed: ${migration.name}`);
      return true;
    } catch (error) {
      Logger.error('❌ Rollback failed:', error);
      return false;
    }
  }

  /**
   * Reset database - drop all tables and recreate from scratch
   */
  async resetDatabase(): Promise<boolean> {
    try {
      Logger.info('⚠️  Resetting database (this will drop all data!)');
      
      // Test connection first
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error('Database connection failed');
      }

      // Drop all tables
      const client = await getClient();
      
      // Get all table names
      const tables = await client.query(`
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT LIKE 'pg_%'
      `);

      // Drop all tables
      for (const table of tables.rows) {
        await client.query(`DROP TABLE IF EXISTS ${table.tablename} CASCADE`);
      }

      Logger.info(`🗑️  Dropped ${tables.rows.length} tables`);

      // Recreate database from baseline schema
      await this.createBaselineSchema(client);
      
      // Run all migrations
      client.release();
      const migrationSuccess = await this.runMigrations();
      
      if (migrationSuccess) {
        Logger.info('✅ Database reset completed successfully');
        return true;
      } else {
        Logger.error('❌ Database reset failed during migration');
        return false;
      }
    } catch (error) {
      Logger.error('❌ Database reset failed:', error);
      return false;
    }
  }

  /**
   * Create baseline schema from SQL files
   */
  private async createBaselineSchema(client: any): Promise<void> {
    try {
      const baselineSchemaPath = path.join(this.schemaPath, 'baselineSchema.sql');
      
      if (fs.existsSync(baselineSchemaPath)) {
        const schema = fs.readFileSync(baselineSchemaPath, 'utf8');
        
        // Split by semicolon and execute each statement
        const statements = schema.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
          if (statement.trim()) {
            await client.query(statement);
          }
        }
        
        Logger.info('✅ Baseline schema created');
      } else {
        Logger.warn('⚠️  Baseline schema file not found, creating minimal schema');
        await this.createMinimalSchema(client);
      }
    } catch (error) {
      Logger.error('❌ Failed to create baseline schema:', error);
      throw error;
    }
  }

  /**
   * Create minimal schema if baseline doesn't exist
   */
  private async createMinimalSchema(client: any): Promise<void> {
    // Create essential tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        avatar VARCHAR(500),
        email_verified BOOLEAN DEFAULT FALSE,
        phone_verified BOOLEAN DEFAULT FALSE,
        provider VARCHAR(50) DEFAULT 'email',
        role VARCHAR(50) DEFAULT 'user',
        loyalty_points INTEGER DEFAULT 0,
        total_bookings INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    Logger.info('✅ Minimal schema created');
  }

  /**
   * Create a new migration
   */
  async createMigration(name: string): Promise<string | null> {
    try {
      Logger.info(`🔄 Creating new migration: ${name}`);
      
      const timestamp = Date.now();
      const migrationName = `${timestamp}_${name}`;
      
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

  /**
   * Validate database schema
   */
  async validateSchema(): Promise<boolean> {
    try {
      const migrations = await this.getMigrationStatus();
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

  /**
   * Get database schema information
   */
  async getDatabaseSchema(): Promise<DatabaseSchema> {
    try {
      const client = await getClient();
      
      // Get tables
      const tables = await client.query(`
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT LIKE 'pg_%'
        ORDER BY tablename
      `);

      // Get indexes
      const indexes = await client.query(`
        SELECT indexname FROM pg_indexes 
        WHERE schemaname = 'public'
        ORDER BY indexname
      `);

      // Get constraints
      const constraints = await client.query(`
        SELECT conname FROM pg_constraint 
        WHERE connamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        ORDER BY conname
      `);

      // Get functions
      const functions = await client.query(`
        SELECT proname FROM pg_proc 
        WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        ORDER BY proname
      `);

      client.release();

      return {
        version: await this.getCurrentSchemaVersion() || 'unknown',
        tables: tables.rows.map(r => r.tablename),
        indexes: indexes.rows.map(r => r.indexname),
        constraints: constraints.rows.map(r => r.conname),
        functions: functions.rows.map(r => r.proname),
        triggers: [], // TODO: Implement trigger detection
        lastUpdated: new Date()
      };
    } catch (error) {
      Logger.error('❌ Failed to get database schema:', error);
      throw error;
    }
  }

  /**
   * Get all migration files
   */
  private async getAllMigrationFiles(): Promise<string[]> {
    try {
      const files = fs.readdirSync(this.migrationsPath);
      return files.filter(file => file.endsWith('.js') && /^\d+_/.test(file));
    } catch (error) {
      Logger.error('❌ Failed to read migration files:', error);
      return [];
    }
  }

  /**
   * Calculate file checksum
   */
  private async calculateFileChecksum(filePath: string): Promise<string> {
    try {
      const crypto = require('crypto');
      const content = fs.readFileSync(filePath, 'utf8');
      return crypto.createHash('md5').update(content).digest('hex');
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Backup database schema
   */
  async backupSchema(): Promise<string | null> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = `schema_backup_${timestamp}.sql`;
      
      const { stdout } = await execAsync(`pg_dump --schema-only --no-owner --no-privileges ${process.env.DATABASE_URL || 'lemotech_innovations'} > ${backupFile}`, {
        cwd: process.cwd()
      });

      Logger.info(`✅ Schema backup created: ${backupFile}`);
      return backupFile;
    } catch (error) {
      Logger.error('❌ Schema backup failed:', error);
      return null;
    }
  }

  /**
   * Restore database from backup
   */
  async restoreSchema(backupFile: string): Promise<boolean> {
    try {
      Logger.info(`🔄 Restoring schema from backup: ${backupFile}`);
      
      const { stdout, stderr } = await execAsync(`psql ${process.env.DATABASE_URL || 'lemotech_innovations'} < ${backupFile}`, {
        cwd: process.cwd()
      });

      if (stderr && !stderr.includes('warning')) {
        Logger.error('❌ Schema restore error:', stderr);
        return false;
      }

      Logger.info('✅ Schema restored successfully');
      return true;
    } catch (error) {
      Logger.error('❌ Schema restore failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const enhancedMigrationManager = new EnhancedMigrationManager();

// Convenience functions
export const runMigrations = () => enhancedMigrationManager.runMigrations();
export const getMigrationStatus = () => enhancedMigrationManager.getMigrationStatus();
export const validateSchema = () => enhancedMigrationManager.validateSchema();
export const createMigration = (name: string) => enhancedMigrationManager.createMigration(name);
export const rollbackMigration = () => enhancedMigrationManager.rollbackMigration();
export const resetDatabase = () => enhancedMigrationManager.resetDatabase();
export const getCurrentSchemaVersion = () => enhancedMigrationManager.getCurrentSchemaVersion();
export const getDatabaseSchema = () => enhancedMigrationManager.getDatabaseSchema();
export const backupSchema = () => enhancedMigrationManager.backupSchema();
export const restoreSchema = (backupFile: string) => enhancedMigrationManager.restoreSchema(backupFile);

export default enhancedMigrationManager;
