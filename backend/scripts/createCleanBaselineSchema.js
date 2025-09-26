#!/usr/bin/env node
/**
 * LemoTech Clean Baseline Schema Script
 * Creates database schema matching TypeScript entities exactly
 */

const { Pool } = require('pg');
const { Logger } = require('../dist/utils/logger');

async function createCleanBaselineSchema() {
  // First connect to postgres database to create our database
  const adminPool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5435'),
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres' // Connect to default postgres database
  });

  try {
    Logger.info('🚀 Creating clean baseline schema...');

    // Step 1: Create the database
    Logger.info('📋 Step 1: Creating database...');
    
    await adminPool.query('DROP DATABASE IF EXISTS lemotech_innovations');
    await adminPool.query('CREATE DATABASE lemotech_innovations');
    
    Logger.info('✅ Database created successfully');

    // Close admin connection
    await adminPool.end();

    // Now connect to our new database
    const clientPool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5435'),
      password: process.env.DB_PASSWORD || 'postgres',
      database: 'lemotech_innovations'
    });

    const client = await clientPool.connect();

    try {
      // Step 2: Create extensions and functions
      Logger.info('📋 Step 2: Creating extensions and functions...');
      
      await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
      
      await client.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
      `);

      Logger.info('✅ Extensions and functions created');

      // Step 3: Create all tables matching TypeScript entities exactly
      Logger.info('📋 Step 3: Creating all tables...');
      
      // Users table
      await client.query(`
        CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          firebase_uid VARCHAR(255) UNIQUE,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255),
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          address TEXT,
          avatar VARCHAR(500),
          email_verified BOOLEAN DEFAULT FALSE,
          phone_verified BOOLEAN DEFAULT FALSE,
          provider VARCHAR(50) DEFAULT 'email',
          role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'driver', 'shop', 'admin')),
          loyalty_points INTEGER DEFAULT 0,
          total_bookings INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT TRUE,
          member_since TIMESTAMP DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Drivers table
      await client.query(`
        CREATE TABLE drivers (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          vehicle VARCHAR(255) NOT NULL,
          license_number VARCHAR(50) NOT NULL UNIQUE,
          license_expiry DATE,
          vehicle_registration VARCHAR(20),
          vehicle_model VARCHAR(100),
          vehicle_color VARCHAR(50),
          rating DECIMAL(3,2) DEFAULT 0.00,
          total_jobs INTEGER DEFAULT 0,
          total_earnings DECIMAL(10,2) DEFAULT 0.00,
          is_active BOOLEAN DEFAULT TRUE,
          is_verified BOOLEAN DEFAULT FALSE,
          current_location JSONB,
          status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('offline', 'available', 'busy')),
          last_active TIMESTAMP,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Shops table
      await client.query(`
        CREATE TABLE shops (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL UNIQUE,
          description TEXT,
          address TEXT NOT NULL,
          coordinates JSONB,
          phone VARCHAR(20),
          email VARCHAR(255),
          operating_hours JSONB,
          services JSONB,
          rating DECIMAL(3,2) DEFAULT 0.00,
          total_bookings INTEGER DEFAULT 0,
          total_revenue DECIMAL(10,2) DEFAULT 0.00,
          is_active BOOLEAN DEFAULT TRUE,
          is_verified BOOLEAN DEFAULT FALSE,
          capacity INTEGER DEFAULT 100,
          current_load INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Bookings table
      await client.query(`
        CREATE TABLE bookings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          pickup_location TEXT NOT NULL,
          pickup_coords JSONB,
          items JSONB NOT NULL,
          driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
          shop_id UUID REFERENCES shops(id) ON DELETE SET NULL,
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'pickup', 'cleaning', 'delivery', 'completed', 'cancelled')),
          payment_method VARCHAR(10) NOT NULL CHECK (payment_method IN ('card', 'cash', 'mobile')),
          payment_id VARCHAR(255),
          amount DECIMAL(10,2) NOT NULL,
          contact_phone VARCHAR(20) NOT NULL,
          special_instructions TEXT,
          estimated_pickup_time TIMESTAMP,
          estimated_delivery_time TIMESTAMP,
          actual_pickup_time TIMESTAMP,
          actual_delivery_time TIMESTAMP,
          cleaning_started_at TIMESTAMP,
          cleaning_completed_at TIMESTAMP,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Payment Methods table
      await client.query(`
        CREATE TABLE payment_methods (
          id VARCHAR(255) PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          stripe_payment_method_id VARCHAR(255),
          type VARCHAR(50) NOT NULL CHECK (type IN ('card', 'bank_account', 'digital_wallet')),
          provider VARCHAR(50) NOT NULL DEFAULT 'stripe' CHECK (provider IN ('stripe', 'paypal', 'yoco', 'payfast', 'ozow', 'snapscan')),
          display_name VARCHAR(255) NOT NULL,
          last4 VARCHAR(4),
          brand VARCHAR(50),
          expiry_month INTEGER,
          expiry_year INTEGER,
          is_default BOOLEAN NOT NULL DEFAULT false,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Payment Transactions table
      await client.query(`
        CREATE TABLE payment_transactions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
          payment_method_id VARCHAR(255) REFERENCES payment_methods(id) ON DELETE SET NULL,
          stripe_payment_intent_id VARCHAR(255),
          payfast_payment_id VARCHAR(255),
          amount INTEGER NOT NULL,
          currency VARCHAR(3) NOT NULL DEFAULT 'ZAR',
          status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'canceled', 'refunded')),
          description TEXT,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Service Items table
      await client.query(`
        CREATE TABLE service_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL UNIQUE,
          category VARCHAR(100) NOT NULL,
          base_price DECIMAL(8,2) NOT NULL,
          description TEXT,
          estimated_time INTEGER,
          icon VARCHAR(10),
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Files table
      await client.query(`
        CREATE TABLE files (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          filename VARCHAR(255) NOT NULL,
          original_name VARCHAR(255) NOT NULL,
          mimetype VARCHAR(100) NOT NULL,
          size INTEGER NOT NULL,
          url VARCHAR(500) NOT NULL,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Phone Verifications table
      await client.query(`
        CREATE TABLE phone_verifications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          phone_number VARCHAR(20) NOT NULL UNIQUE,
          verification_code VARCHAR(10) NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Booking Steps table
      await client.query(`
        CREATE TABLE booking_steps (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          step_name VARCHAR(50) NOT NULL UNIQUE,
          step_order INTEGER NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Booking History table
      await client.query(`
        CREATE TABLE booking_history (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
          step_id UUID REFERENCES booking_steps(id) ON DELETE CASCADE,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          step_data JSONB,
          completed_at TIMESTAMP DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // In Progress Bookings table
      await client.query(`
        CREATE TABLE in_progress_bookings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          session_id VARCHAR(255),
          current_step VARCHAR(50) NOT NULL,
          booking_data JSONB NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Driver Jobs table
      await client.query(`
        CREATE TABLE driver_jobs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
          booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
          status VARCHAR(50) NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'cancelled')),
          assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          started_at TIMESTAMP WITH TIME ZONE,
          completed_at TIMESTAMP WITH TIME ZONE,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Driver Locations table
      await client.query(`
        CREATE TABLE driver_locations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
          latitude DECIMAL(10,8) NOT NULL,
          longitude DECIMAL(11,8) NOT NULL,
          accuracy DECIMAL(5,2),
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Payment Refunds table
      await client.query(`
        CREATE TABLE payment_refunds (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          transaction_id UUID NOT NULL REFERENCES payment_transactions(id) ON DELETE CASCADE,
          stripe_refund_id VARCHAR(255),
          amount INTEGER NOT NULL,
          reason VARCHAR(50),
          status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),
          description TEXT,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Shop Inventory table
      await client.query(`
        CREATE TABLE shop_inventory (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
          item_name VARCHAR(255) NOT NULL,
          category VARCHAR(50) NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 0,
          unit_price DECIMAL(10,2),
          description TEXT,
          is_active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Shop Orders table
      await client.query(`
        CREATE TABLE shop_orders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
          booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
          status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
          items JSONB NOT NULL DEFAULT '[]',
          total_amount DECIMAL(10,2) NOT NULL,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Cleaning Items table
      await client.query(`
        CREATE TABLE cleaning_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          type VARCHAR(50) NOT NULL CHECK (type IN ('clothing', 'shoes', 'accessories', 'furniture')),
          condition VARCHAR(50) NOT NULL CHECK (condition IN ('good', 'fair', 'poor', 'damaged')),
          cleaning_method VARCHAR(50) NOT NULL CHECK (cleaning_method IN ('dry_clean', 'wash', 'hand_wash', 'specialty')),
          photos JSONB DEFAULT '[]',
          notes TEXT,
          estimated_time INTEGER NOT NULL,
          actual_time INTEGER,
          status VARCHAR(50) NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'assessed', 'cleaning', 'completed', 'ready')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Shop Queue table
      await client.query(`
        CREATE TABLE shop_queue (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
          booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
          cleaning_item_id UUID NOT NULL REFERENCES cleaning_items(id) ON DELETE CASCADE,
          priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
          status VARCHAR(50) NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'in_progress', 'completed', 'cancelled', 'on_hold')),
          estimated_duration INTEGER NOT NULL,
          actual_duration INTEGER,
          assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
          queued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          started_at TIMESTAMP WITH TIME ZONE,
          completed_at TIMESTAMP WITH TIME ZONE,
          notes TEXT,
          special_instructions TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Shop Inventory Tracking table
      await client.query(`
        CREATE TABLE shop_inventory_tracking (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
          item_name VARCHAR(255) NOT NULL,
          category VARCHAR(50) NOT NULL CHECK (category IN ('cleaning_supplies', 'equipment', 'consumables', 'tools', 'safety', 'packaging')),
          subcategory VARCHAR(100),
          sku VARCHAR(100) UNIQUE,
          barcode VARCHAR(100) UNIQUE,
          quantity INTEGER NOT NULL DEFAULT 0,
          min_quantity INTEGER NOT NULL DEFAULT 0,
          max_quantity INTEGER NOT NULL DEFAULT 0,
          unit_price DECIMAL(10,2) NOT NULL,
          cost_price DECIMAL(10,2) NOT NULL,
          description TEXT,
          specifications JSONB DEFAULT '{}',
          supplier VARCHAR(255),
          supplier_contact VARCHAR(255),
          last_restocked TIMESTAMP WITH TIME ZONE,
          expiry_date DATE,
          is_active BOOLEAN NOT NULL DEFAULT TRUE,
          is_trackable BOOLEAN NOT NULL DEFAULT TRUE,
          location VARCHAR(255),
          condition VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (condition IN ('new', 'good', 'fair', 'poor', 'damaged')),
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Shop Capacity Planning table
      await client.query(`
        CREATE TABLE shop_capacity_planning (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
          plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('daily', 'weekly', 'monthly', 'seasonal')),
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          max_concurrent_jobs INTEGER NOT NULL,
          max_daily_jobs INTEGER NOT NULL,
          max_weekly_jobs INTEGER NOT NULL,
          processing_capacity INTEGER NOT NULL,
          storage_capacity INTEGER NOT NULL,
          staff_count INTEGER NOT NULL,
          equipment_count INTEGER NOT NULL,
          workstation_count INTEGER NOT NULL,
          vehicle_capacity INTEGER NOT NULL,
          operating_hours_start TIME NOT NULL,
          operating_hours_end TIME NOT NULL,
          operating_days JSONB NOT NULL DEFAULT '[]',
          break_duration INTEGER NOT NULL,
          break_frequency INTEGER NOT NULL,
          maintenance_windows JSONB NOT NULL DEFAULT '[]',
          current_utilization DECIMAL(5,2) NOT NULL,
          peak_utilization DECIMAL(5,2) NOT NULL,
          average_utilization DECIMAL(5,2) NOT NULL,
          efficiency DECIMAL(5,2) NOT NULL,
          expected_demand INTEGER NOT NULL,
          capacity_gap INTEGER NOT NULL,
          recommended_actions JSONB NOT NULL DEFAULT '[]',
          risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
          status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      Logger.info('✅ All tables created');

      // Step 4: Create indexes for performance
      Logger.info('📋 Step 4: Creating indexes...');
      
      // Users indexes
      await client.query('CREATE INDEX idx_users_email ON users(email)');
      await client.query('CREATE INDEX idx_users_firebase_uid ON users(firebase_uid)');
      await client.query('CREATE INDEX idx_users_phone ON users(phone)');
      await client.query('CREATE INDEX idx_users_role ON users(role)');

      // Drivers indexes
      await client.query('CREATE INDEX idx_drivers_user_id ON drivers(user_id)');
      await client.query('CREATE INDEX idx_drivers_status ON drivers(status)');
      await client.query('CREATE INDEX idx_drivers_is_active ON drivers(is_active)');

      // Shops indexes
      await client.query('CREATE INDEX idx_shops_user_id ON shops(user_id)');
      await client.query('CREATE INDEX idx_shops_is_active ON shops(is_active)');
      await client.query('CREATE INDEX idx_shops_is_verified ON shops(is_verified)');

      // Bookings indexes
      await client.query('CREATE INDEX idx_bookings_user_id ON bookings(user_id)');
      await client.query('CREATE INDEX idx_bookings_driver_id ON bookings(driver_id)');
      await client.query('CREATE INDEX idx_bookings_shop_id ON bookings(shop_id)');
      await client.query('CREATE INDEX idx_bookings_status ON bookings(status)');
      await client.query('CREATE INDEX idx_bookings_created_at ON bookings(created_at)');

      // Payment indexes
      await client.query('CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id)');
      await client.query('CREATE INDEX idx_payment_transactions_user_id ON payment_transactions(user_id)');
      await client.query('CREATE INDEX idx_payment_transactions_booking_id ON payment_transactions(booking_id)');
      await client.query('CREATE INDEX idx_payment_transactions_status ON payment_transactions(status)');

      // Cleaning items indexes
      await client.query('CREATE INDEX idx_cleaning_items_booking_id ON cleaning_items(booking_id)');
      await client.query('CREATE INDEX idx_cleaning_items_status ON cleaning_items(status)');
      await client.query('CREATE INDEX idx_cleaning_items_type ON cleaning_items(type)');

      // Shop queue indexes
      await client.query('CREATE INDEX idx_shop_queue_shop_id ON shop_queue(shop_id)');
      await client.query('CREATE INDEX idx_shop_queue_status ON shop_queue(status)');
      await client.query('CREATE INDEX idx_shop_queue_priority ON shop_queue(priority)');

      // Shop inventory tracking indexes
      await client.query('CREATE INDEX idx_shop_inventory_tracking_shop_id ON shop_inventory_tracking(shop_id)');
      await client.query('CREATE INDEX idx_shop_inventory_tracking_category ON shop_inventory_tracking(category)');

      Logger.info('✅ All indexes created');

      // Step 5: Create triggers for updated_at
      Logger.info('📋 Step 5: Creating triggers...');
      
      const tables = [
        'users', 'drivers', 'shops', 'bookings', 'payment_methods', 'payment_transactions',
        'service_items', 'files', 'phone_verifications', 'booking_steps', 'booking_history',
        'in_progress_bookings', 'driver_jobs', 'driver_locations', 'payment_refunds',
        'shop_inventory', 'shop_orders', 'cleaning_items', 'shop_queue', 'shop_inventory_tracking',
        'shop_capacity_planning'
      ];

      for (const table of tables) {
        await client.query(`
          CREATE TRIGGER update_${table}_updated_at 
          BEFORE UPDATE ON ${table} 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
        `);
      }

      Logger.info('✅ All triggers created');

      // Step 6: Create migration tracking table
      Logger.info('📋 Step 6: Creating migration tracking...');
      
      await client.query(`
        CREATE TABLE schema_migrations (
          version VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          checksum VARCHAR(64) NOT NULL,
          applied_at TIMESTAMP DEFAULT NOW(),
          rollback_at TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Mark baseline migration as applied
      await client.query(
        `INSERT INTO schema_migrations (version, name, checksum, applied_at) 
         VALUES ($1, $2, $3, NOW())`,
        ['2024122000000', 'baseline-schema', 'clean-entity-match']
      );

      Logger.info('✅ Migration tracking created');

      // Step 7: Seed test data
      Logger.info('📋 Step 7: Seeding test data...');
      
      // Create test users
      const users = [
        {
          email: 'admin@lemotech.test',
          password: '$2b$10$examplehashedpasswordforlocaltestingonlyxxxxxxx',
          name: 'Admin User',
          phone: '+15550000001',
          role: 'admin'
        },
        {
          email: 'leo@lemotech.test',
          password: '$2b$10$examplehashedpasswordforlocaltestingonlyxxxxxxx',
          name: 'Leo Test User',
          phone: '+15550000001',
          role: 'user'
        },
        {
          email: 'user@lemotech.test',
          password: '$2b$10$examplehashedpasswordforlocaltestingonlyxxxxxxx',
          name: 'Test User',
          phone: '+15550000002',
          role: 'user'
        },
        {
          email: 'driver@lemotech.test',
          password: '$2b$10$examplehashedpasswordforlocaltestingonlyxxxxxxx',
          name: 'Test Driver',
          phone: '+15550000003',
          role: 'driver'
        },
        {
          email: 'shop@lemotech.test',
          password: '$2b$10$examplehashedpasswordforlocaltestingonlyxxxxxxx',
          name: 'Shop Owner',
          phone: '+15550000004',
          role: 'shop'
        }
      ];

      const userIds = [];
      for (const user of users) {
        const result = await client.query(
          `INSERT INTO users (email, password, name, phone, role, email_verified, phone_verified, loyalty_points, total_bookings, is_active, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, true, true, 100, 0, true, NOW(), NOW()) RETURNING id`,
          [user.email, user.password, user.name, user.phone, user.role]
        );
        userIds.push(result.rows[0].id);
      }

      Logger.info(`✅ Created ${userIds.length} test users`);

      // Create test drivers
      const driverResult = await client.query(
        `INSERT INTO drivers (user_id, vehicle, license_number, rating, total_jobs, total_earnings, is_active, is_verified, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, true, true, 'available', NOW(), NOW()) RETURNING id`,
        [userIds[2], 'Toyota Corolla', 'DL123456', 4.5, 0, 0.00]
      );
      const driverId = driverResult.rows[0].id;

      Logger.info('✅ Created test driver');

      // Create test shops
      const shopResult = await client.query(
        `INSERT INTO shops (user_id, name, description, address, phone, email, rating, total_bookings, total_revenue, is_active, is_verified, capacity, current_load, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, true, 100, 0, NOW(), NOW()) RETURNING id`,
        [userIds[3], 'Downtown Clean & Shine', 'Professional cleaning services', '123 Main St, City', '+15550000004', 'shop@lemotech.test', 4.8, 0, 0.00]
      );
      const shopId = shopResult.rows[0].id;

      Logger.info('✅ Created test shop');

      // Create test bookings
      const bookingResult = await client.query(
        `INSERT INTO bookings (user_id, pickup_location, pickup_coords, items, driver_id, shop_id, status, payment_method, amount, contact_phone, special_instructions, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW()) RETURNING id`,
        [
          userIds[1],
          '456 Customer St, City',
          JSON.stringify({ lat: 40.7128, lng: -74.0060 }),
          JSON.stringify([{ name: 'Sneakers', quantity: 2, price: 25.00 }]),
          driverId,
          shopId,
          'confirmed',
          'card',
          50.00,
          '+15550000002',
          'Handle with care'
        ]
      );
      const bookingId = bookingResult.rows[0].id;

      Logger.info('✅ Created test booking');

      // Create test cleaning items
      const cleaningItemResult = await client.query(
        `INSERT INTO cleaning_items (booking_id, name, type, condition, cleaning_method, photos, estimated_time, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING id`,
        [
          bookingId,
          'White Sneakers',
          'shoes',
          'good',
          'wash',
          JSON.stringify(['photo1.jpg', 'photo2.jpg']),
          60,
          'received'
        ]
      );
      const cleaningItemId = cleaningItemResult.rows[0].id;

      Logger.info('✅ Created test cleaning item');

      // Create test shop queue item
      await client.query(
        `INSERT INTO shop_queue (shop_id, booking_id, cleaning_item_id, priority, status, estimated_duration, notes, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [shopId, bookingId, cleaningItemId, 'high', 'queued', 60, 'Handle with care']
      );

      Logger.info('✅ Created test shop queue item');

      // Create test inventory items
      await client.query(
        `INSERT INTO shop_inventory_tracking (shop_id, item_name, category, quantity, min_quantity, max_quantity, unit_price, cost_price, supplier, last_restocked, is_active, is_trackable, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, true, NOW(), NOW())`,
        [shopId, 'Eco-Friendly Detergent', 'cleaning_supplies', 100, 20, 200, 15.50, 10.00, 'Green Clean Supplies', new Date()]
      );

      await client.query(
        `INSERT INTO shop_inventory_tracking (shop_id, item_name, category, quantity, min_quantity, max_quantity, unit_price, cost_price, supplier, last_restocked, is_active, is_trackable, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, true, NOW(), NOW())`,
        [shopId, 'Microfiber Cloths', 'consumables', 500, 100, 1000, 2.00, 1.20, 'Textile Innovations', new Date()]
      );

      Logger.info('✅ Created test inventory items');

      // Step 8: Verify database state
      Logger.info('📋 Step 8: Verifying database state...');
      
      const tableCount = await client.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      `);

      const indexCount = await client.query(`
        SELECT COUNT(*) as count 
        FROM pg_indexes 
        WHERE schemaname = 'public'
      `);

      const constraintCount = await client.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.table_constraints 
        WHERE table_schema = 'public'
      `);

      Logger.info(`📊 Database Statistics:`);
      Logger.info(`   - Tables: ${tableCount.rows[0].count}`);
      Logger.info(`   - Indexes: ${indexCount.rows[0].count}`);
      Logger.info(`   - Constraints: ${constraintCount.rows[0].count}`);

      Logger.info('🎉 Clean baseline schema creation completed successfully!');
      Logger.info('✅ Database created with exact TypeScript entity schema match');
      Logger.info('✅ All tables created with proper relationships');
      Logger.info('✅ All indexes created for performance');
      Logger.info('✅ All triggers created for data integrity');
      Logger.info('✅ Migration tracking created');
      Logger.info('✅ Test data seeded successfully');
      Logger.info('✅ Database ready for API testing');

    } finally {
      client.release();
      await clientPool.end();
    }

  } catch (error) {
    Logger.error('❌ Failed to create clean baseline schema:', error);
    throw error;
  }
}

createCleanBaselineSchema();
