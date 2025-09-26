// Infrastructure Exports
// This is the main entry point for all data-related functionality

// Database connection and utilities
export { query, getClient, testConnection, initializeDatabase } from './database';

// Data Context (EF Core equivalent)
export { DataContext, db } from './dataContext';

// Entities/Models
export * from './entities/databaseSchema';

// Migration Management
export { 
  migrationManager,
  runMigrations,
  checkMigrationStatus,
  validateSchema,
  createMigration,
  rollbackMigration,
  resetDatabase
} from './migrationManager';

// Database Initialization
export { 
  databaseInitializer,
  initializeDatabase as initDatabase
} from './databaseInitializer';

// LINQ Components
export { 
  LinqQueryBuilder, 
  QueryResult, 
  createQuery 
} from './linqQueryBuilder';
export { 
  AdvancedLinqQueryBuilder, 
  Repository, 
  createRepository 
} from './advancedLinqQueryBuilder';
export { 
  EntityConfigurations, 
  EntityMappers,
  DriverJob,
  DriverLocation,
  PaymentRefund,
  ShopInventory,
  ShopOrder
} from './entityConfigurations';


// Database health check
export const healthCheck = async () => {
  try {
    const { testConnection } = await import('./database');
    await testConnection();
    return { status: 'healthy', timestamp: new Date() };
  } catch (error) {
    return { status: 'unhealthy', error: (error as Error).message, timestamp: new Date() };
  }
};
