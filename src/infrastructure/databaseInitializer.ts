// Database Initialization Script
// This script handles database setup, migrations, and seeding

import { Logger } from '../utils/logger';
import { testConnection, query } from './database';
import dotenv from 'dotenv';

dotenv.config();

export interface DatabaseInitResult {
  success: boolean;
  message: string;
  migrationsRun?: number;
  errors?: string[];
}

export class DatabaseInitializer {
  private errors: string[] = [];

  // Initialize database with migrations and seed data
  async initialize(): Promise<DatabaseInitResult> {
    try {
      Logger.info('🚀 Initializing LemoTech Database...');

      // Step 1: Test database connection
      Logger.info('📡 Testing database connection...');
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error('Database connection failed');
      }

      // Step 2: Skip migrations (database already created with clean baseline schema)
      Logger.info('📊 Skipping migrations - using clean baseline schema...');
      
      // Step 3: Validate schema exists
      Logger.info('✅ Validating database schema...');
      const schemaValid = await this.validateBasicSchema();
      if (!schemaValid) {
        throw new Error('Schema validation failed');
      }

      // Step 5: Seed initial data (if needed)
      Logger.info('🌱 Checking for seed data...');
      await this.seedInitialData();

      Logger.info('✅ Database initialization completed successfully!');

      return {
        success: true,
        message: 'Database initialized successfully',
        migrationsRun: 0
      };

    } catch (error) {
      const errorMessage = (error as Error).message;
      Logger.error('❌ Database initialization failed:', errorMessage);
      this.errors.push(errorMessage);

      return {
        success: false,
        message: 'Database initialization failed',
        errors: this.errors
      };
    }
  }

  // Seed initial data if tables are empty
  private async seedInitialData(): Promise<void> {
    try {
      // Check if service items exist
      const serviceItemsResult = await query('SELECT COUNT(*) FROM service_items');
      const serviceItemsCount = parseInt(serviceItemsResult.rows[0].count);

      if (serviceItemsCount === 0) {
        Logger.info('🌱 Seeding service items...');
        await this.seedServiceItems();
      } else {
        Logger.info(`✅ Service items already exist (${serviceItemsCount} items)`);
      }

      // Check if booking steps exist
      const bookingStepsResult = await query('SELECT COUNT(*) FROM booking_steps');
      const bookingStepsCount = parseInt(bookingStepsResult.rows[0].count);

      if (bookingStepsCount === 0) {
        Logger.info('🌱 Seeding booking steps...');
        await this.seedBookingSteps();
      } else {
        Logger.info(`✅ Booking steps already exist (${bookingStepsCount} steps)`);
      }

      // Check if admin user exists
      const adminResult = await query('SELECT COUNT(*) FROM users WHERE role = $1', ['admin']);
      const adminCount = parseInt(adminResult.rows[0].count);

      if (adminCount === 0) {
        Logger.info('🌱 Creating default admin user...');
        await this.createDefaultAdmin();
      } else {
        Logger.info(`✅ Admin users already exist (${adminCount} admins)`);
      }

    } catch (error) {
      Logger.error('❌ Failed to seed initial data:', error);
      this.errors.push(`Seed data error: ${(error as Error).message}`);
    }
  }

  // Seed service items
  private async seedServiceItems(): Promise<void> {
    const serviceItems = [
      { name: 'Sneakers', category: 'shoes', basePrice: 25.00, description: 'Professional sneaker cleaning and restoration', estimatedTime: 120, icon: '👟' },
      { name: 'Dress Shoes', category: 'shoes', basePrice: 35.00, description: 'Premium leather shoe care and polishing', estimatedTime: 90, icon: '👞' },
      { name: 'Boots', category: 'shoes', basePrice: 40.00, description: 'Deep cleaning for all types of boots', estimatedTime: 150, icon: '🥾' },
      { name: 'Shirt/Blouse', category: 'clothing', basePrice: 15.00, description: 'Professional shirt cleaning and pressing', estimatedTime: 60, icon: '👔' },
      { name: 'Pants/Trousers', category: 'clothing', basePrice: 20.00, description: 'Complete trouser cleaning service', estimatedTime: 75, icon: '👖' },
      { name: 'Jacket/Blazer', category: 'clothing', basePrice: 50.00, description: 'Specialized jacket and blazer care', estimatedTime: 180, icon: '🧥' },
      { name: 'Dress', category: 'clothing', basePrice: 30.00, description: 'Delicate dress cleaning and care', estimatedTime: 120, icon: '👗' },
      { name: 'Handbag', category: 'accessories', basePrice: 45.00, description: 'Luxury handbag restoration and cleaning', estimatedTime: 150, icon: '👜' }
    ];

    for (const item of serviceItems) {
      await query(`
        INSERT INTO service_items (name, category, base_price, description, estimated_time, icon)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (name) DO NOTHING
      `, [item.name, item.category, item.basePrice, item.description, item.estimatedTime, item.icon]);
    }

    Logger.info(`✅ Seeded ${serviceItems.length} service items`);
  }

  // Seed booking steps
  private async seedBookingSteps(): Promise<void> {
    const steps = [
      { stepName: 'location', stepOrder: 1, description: 'User selects pickup location' },
      { stepName: 'items', stepOrder: 2, description: 'User selects items to be cleaned' },
      { stepName: 'carType', stepOrder: 3, description: 'User selects service type (Standard/Premium)' },
      { stepName: 'confirming', stepOrder: 4, description: 'User reviews and confirms booking' },
      { stepName: 'processing', stepOrder: 5, description: 'Booking is being processed' },
      { stepName: 'confirmed', stepOrder: 6, description: 'Booking is confirmed and scheduled' }
    ];

    for (const step of steps) {
      await query(`
        INSERT INTO booking_steps (step_name, step_order, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (step_name) DO NOTHING
      `, [step.stepName, step.stepOrder, step.description]);
    }

    Logger.info(`✅ Seeded ${steps.length} booking steps`);
  }

  // Create default admin user
  private async createDefaultAdmin(): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@lemotech.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    await query(`
      INSERT INTO users (email, password, name, role, email_verified)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
    `, [adminEmail, adminPassword, 'System Administrator', 'admin', true]);

    Logger.info(`✅ Created default admin user: ${adminEmail}`);
  }

  // Validate basic schema exists
  private async validateBasicSchema(): Promise<boolean> {
    try {
      // Check if key tables exist
      const tables = ['users', 'bookings', 'drivers', 'shops', 'cleaning_items', 'shop_queue', 'shop_inventory_tracking'];
      
      for (const table of tables) {
        const result = await query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          );
        `, [table]);
        
        if (!result.rows[0].exists) {
          Logger.error(`❌ Table ${table} does not exist`);
          return false;
        }
      }
      
      Logger.info('✅ All required tables exist');
      return true;
    } catch (error) {
      Logger.error('❌ Schema validation failed:', error);
      return false;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; details: any }> {
    try {
      const isConnected = await testConnection();
      const schemaValid = await this.validateBasicSchema();

      return {
        status: isConnected && schemaValid ? 'healthy' : 'unhealthy',
        details: {
          connected: isConnected,
          schemaValid: schemaValid,
          usingBaselineSchema: true
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: (error as Error).message
        }
      };
    }
  }
}

// Export singleton instance
export const databaseInitializer = new DatabaseInitializer();

// Convenience function
export const initializeDatabase = () => databaseInitializer.initialize();

export default databaseInitializer;
