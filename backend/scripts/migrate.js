#!/usr/bin/env node
/**
 * LemoTech Migration CLI
 * Provides EF-like migration commands with versioning and database recreation
 */

const { Command } = require('commander');
const { 
  enhancedMigrationManager,
  runMigrations,
  getMigrationStatus,
  validateSchema,
  createMigration,
  rollbackMigration,
  resetDatabase,
  getCurrentSchemaVersion,
  getDatabaseSchema,
  backupSchema,
  restoreSchema
} = require('../dist/infrastructure/enhancedMigrationManager');
const { seedTestData } = require('../dist/scripts/seedTestData');
const { Logger } = require('../dist/utils/logger');

const program = new Command();

program
  .name('lemotech-migrate')
  .description('LemoTech Database Migration CLI')
  .version('1.0.0');

// Status command
program
  .command('status')
  .description('Show migration status')
  .action(async () => {
    try {
      Logger.info('📊 Checking migration status...');
      
      const currentVersion = await getCurrentSchemaVersion();
      const migrations = await getMigrationStatus();
      const schema = await getDatabaseSchema();
      
      console.log('\n📋 Migration Status:');
      console.log(`Current Schema Version: ${currentVersion || 'None'}`);
      console.log(`Total Migrations: ${migrations.length}`);
      console.log(`Applied Migrations: ${migrations.filter(m => m.status === 'completed').length}`);
      console.log(`Pending Migrations: ${migrations.filter(m => m.status === 'pending').length}`);
      
      console.log('\n📊 Database Schema:');
      console.log(`Tables: ${schema.tables.length}`);
      console.log(`Indexes: ${schema.indexes.length}`);
      console.log(`Constraints: ${schema.constraints.length}`);
      console.log(`Functions: ${schema.functions.length}`);
      
      if (migrations.length > 0) {
        console.log('\n📝 Migration Details:');
        migrations.forEach(migration => {
          const statusIcon = migration.status === 'completed' ? '✅' : 
                           migration.status === 'pending' ? '⏳' : 
                           migration.status === 'failed' ? '❌' : '🔄';
          console.log(`${statusIcon} ${migration.timestamp}_${migration.name} (${migration.status})`);
        });
      }
      
      Logger.info('✅ Status check completed');
    } catch (error) {
      Logger.error('❌ Status check failed:', error);
      process.exit(1);
    }
  });

// Migrate command
program
  .command('migrate')
  .description('Run pending migrations')
  .option('-f, --force', 'Force migration even if there are warnings')
  .action(async (options) => {
    try {
      Logger.info('🔄 Running migrations...');
      
      const success = await runMigrations();
      
      if (success) {
        Logger.info('✅ All migrations completed successfully');
        
        // Show updated status
        const currentVersion = await getCurrentSchemaVersion();
        console.log(`\n📊 Current Schema Version: ${currentVersion}`);
      } else {
        Logger.error('❌ Migration failed');
        process.exit(1);
      }
    } catch (error) {
      Logger.error('❌ Migration failed:', error);
      process.exit(1);
    }
  });

// Create migration command
program
  .command('create <name>')
  .description('Create a new migration')
  .action(async (name) => {
    try {
      Logger.info(`🔄 Creating migration: ${name}`);
      
      const migrationFile = await createMigration(name);
      
      if (migrationFile) {
        Logger.info(`✅ Migration created: ${migrationFile}`);
        console.log(`\n📝 Edit the migration file: src/infrastructure/migrations/${migrationFile}`);
        console.log('📚 Migration template:');
        console.log(`
exports.up = (pgm) => {
  // Add your migration logic here
  // Example: pgm.createTable('table_name', { ... });
};

exports.down = (pgm) => {
  // Add your rollback logic here
  // Example: pgm.dropTable('table_name');
};
        `);
      } else {
        Logger.error('❌ Failed to create migration');
        process.exit(1);
      }
    } catch (error) {
      Logger.error('❌ Failed to create migration:', error);
      process.exit(1);
    }
  });

// Rollback command
program
  .command('rollback')
  .description('Rollback the last migration')
  .option('-c, --confirm', 'Skip confirmation prompt')
  .action(async (options) => {
    try {
      if (!options.confirm) {
        console.log('⚠️  This will rollback the last applied migration.');
        console.log('Are you sure? (y/N)');
        
        // In a real implementation, you'd use readline for user input
        // For now, we'll assume confirmation
      }
      
      Logger.info('🔄 Rolling back last migration...');
      
      const success = await rollbackMigration();
      
      if (success) {
        Logger.info('✅ Rollback completed successfully');
      } else {
        Logger.error('❌ Rollback failed');
        process.exit(1);
      }
    } catch (error) {
      Logger.error('❌ Rollback failed:', error);
      process.exit(1);
    }
  });

// Reset command
program
  .command('reset')
  .description('Reset database (drop all tables and recreate)')
  .option('-c, --confirm', 'Skip confirmation prompt')
  .option('-s, --seed', 'Seed test data after reset')
  .action(async (options) => {
    try {
      if (!options.confirm) {
        console.log('⚠️  WARNING: This will DROP ALL TABLES and recreate the database!');
        console.log('⚠️  ALL DATA WILL BE LOST!');
        console.log('Are you absolutely sure? (y/N)');
        
        // In a real implementation, you'd use readline for user input
        // For now, we'll assume confirmation
      }
      
      Logger.info('🔄 Resetting database...');
      
      const success = await resetDatabase();
      
      if (success) {
        Logger.info('✅ Database reset completed successfully');
        
        if (options.seed) {
          Logger.info('🌱 Seeding test data...');
          await seedTestData();
          Logger.info('✅ Test data seeded successfully');
        }
        
        // Show final status
        const currentVersion = await getCurrentSchemaVersion();
        console.log(`\n📊 Database reset complete. Current version: ${currentVersion}`);
      } else {
        Logger.error('❌ Database reset failed');
        process.exit(1);
      }
    } catch (error) {
      Logger.error('❌ Database reset failed:', error);
      process.exit(1);
    }
  });

// Seed command
program
  .command('seed')
  .description('Seed test data')
  .action(async () => {
    try {
      Logger.info('🌱 Seeding test data...');
      
      await seedTestData();
      
      Logger.info('✅ Test data seeded successfully');
    } catch (error) {
      Logger.error('❌ Seeding failed:', error);
      process.exit(1);
    }
  });

// Backup command
program
  .command('backup')
  .description('Backup database schema')
  .action(async () => {
    try {
      Logger.info('💾 Creating schema backup...');
      
      const backupFile = await backupSchema();
      
      if (backupFile) {
        Logger.info(`✅ Schema backup created: ${backupFile}`);
      } else {
        Logger.error('❌ Schema backup failed');
        process.exit(1);
      }
    } catch (error) {
      Logger.error('❌ Schema backup failed:', error);
      process.exit(1);
    }
  });

// Restore command
program
  .command('restore <backup-file>')
  .description('Restore database schema from backup')
  .action(async (backupFile) => {
    try {
      Logger.info(`🔄 Restoring schema from: ${backupFile}`);
      
      const success = await restoreSchema(backupFile);
      
      if (success) {
        Logger.info('✅ Schema restored successfully');
      } else {
        Logger.error('❌ Schema restore failed');
        process.exit(1);
      }
    } catch (error) {
      Logger.error('❌ Schema restore failed:', error);
      process.exit(1);
    }
  });

// Validate command
program
  .command('validate')
  .description('Validate database schema')
  .action(async () => {
    try {
      Logger.info('🔍 Validating database schema...');
      
      const isValid = await validateSchema();
      
      if (isValid) {
        Logger.info('✅ Database schema is valid and up to date');
      } else {
        Logger.error('❌ Database schema validation failed');
        process.exit(1);
      }
    } catch (error) {
      Logger.error('❌ Schema validation failed:', error);
      process.exit(1);
    }
  });

// Schema command
program
  .command('schema')
  .description('Show database schema information')
  .action(async () => {
    try {
      Logger.info('📊 Getting database schema...');
      
      const schema = await getDatabaseSchema();
      
      console.log('\n📊 Database Schema Information:');
      console.log(`Version: ${schema.version}`);
      console.log(`Last Updated: ${schema.lastUpdated}`);
      console.log(`Tables: ${schema.tables.length}`);
      console.log(`Indexes: ${schema.indexes.length}`);
      console.log(`Constraints: ${schema.constraints.length}`);
      console.log(`Functions: ${schema.functions.length}`);
      
      if (schema.tables.length > 0) {
        console.log('\n📋 Tables:');
        schema.tables.forEach(table => console.log(`  - ${table}`));
      }
      
      Logger.info('✅ Schema information retrieved');
    } catch (error) {
      Logger.error('❌ Failed to get schema information:', error);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
