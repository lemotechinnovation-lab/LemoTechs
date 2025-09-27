/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // PostGIS is already available in the container

  // Users table - Core user accounts
  pgm.createTable('users', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    email: { type: 'varchar(255)', unique: true, notNull: true },
    phone: { type: 'varchar(20)', unique: true },
    password_hash: { type: 'varchar(255)' },
    first_name: { type: 'varchar(100)' },
    last_name: { type: 'varchar(100)' },
    role: { type: 'varchar(20)', notNull: true, default: "'user'" },
    is_active: { type: 'boolean', default: true },
    email_verified: { type: 'boolean', default: false },
    phone_verified: { type: 'boolean', default: false },
    profile_image: { type: 'text' },
    firebase_uid: { type: 'varchar(128)', unique: true },
    last_login: { type: 'timestamp' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Drivers table - Driver profiles
  pgm.createTable('drivers', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', references: 'users(id)', onDelete: 'CASCADE', unique: true },
    license_number: { type: 'varchar(50)', unique: true },
    vehicle_make: { type: 'varchar(50)' },
    vehicle_model: { type: 'varchar(50)' },
    vehicle_year: { type: 'integer' },
    vehicle_color: { type: 'varchar(30)' },
    vehicle_plate: { type: 'varchar(20)', unique: true },
    vehicle_type: { type: 'varchar(20)', default: "'car'" },
    insurance_number: { type: 'varchar(100)' },
    rating: { type: 'decimal(3,2)', default: 5.0 },
    total_trips: { type: 'integer', default: 0 },
    is_available: { type: 'boolean', default: true },
    is_verified: { type: 'boolean', default: false },

    current_location: { type: 'point' },
    last_location_update: { type: 'timestamp' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Shops table - Cleaning service shops
  pgm.createTable('shops', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', references: 'users(id)', onDelete: 'CASCADE', unique: true },
    name: { type: 'varchar(200)', notNull: true },
    description: { type: 'text' },
    address: { type: 'text', notNull: true },
    location: { type: 'point', notNull: true },
    phone: { type: 'varchar(20)' },
    email: { type: 'varchar(255)' },
    business_hours: { type: 'jsonb' },
    services_offered: { type: 'jsonb' },
    rating: { type: 'decimal(3,2)', default: 5.0 },
    total_orders: { type: 'integer', default: 0 },
    capacity: { type: 'integer', default: 10 },
    current_load: { type: 'integer', default: 0 },
    is_active: { type: 'boolean', default: true },
    is_verified: { type: 'boolean', default: false },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Service items - Available cleaning services
  pgm.createTable('service_items', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    name: { type: 'varchar(100)', notNull: true },
    category: { type: 'varchar(50)', notNull: true },
    description: { type: 'text' },
    base_price: { type: 'decimal(10,2)', notNull: true },
    estimated_time: { type: 'integer' },
    icon: { type: 'varchar(100)' },
    is_active: { type: 'boolean', default: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Bookings table - Core booking records
  pgm.createTable('bookings', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', references: 'users(id)', onDelete: 'CASCADE', notNull: true },
    driver_id: { type: 'uuid', references: 'drivers(id)', onDelete: 'SET NULL' },
    shop_id: { type: 'uuid', references: 'shops(id)', onDelete: 'SET NULL' },
    status: { type: 'varchar(30)', notNull: true, default: "'pending'" },
    pickup_location: { type: 'text', notNull: true },
    pickup_coords: { type: 'point' },
    delivery_location: { type: 'text' },
    delivery_coords: { type: 'point' },
    items: { type: 'jsonb', notNull: true },
    total_amount: { type: 'decimal(10,2)', notNull: true },
    estimated_pickup_time: { type: 'timestamp' },
    estimated_delivery_time: { type: 'timestamp' },
    actual_pickup_time: { type: 'timestamp' },
    actual_delivery_time: { type: 'timestamp' },
    special_instructions: { type: 'text' },
    contact_phone: { type: 'varchar(20)' },
    rating: { type: 'integer' },
    feedback: { type: 'text' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Payment methods - User payment preferences
  pgm.createTable('payment_methods', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', references: 'users(id)', onDelete: 'CASCADE', notNull: true },
    type: { type: 'varchar(20)', notNull: true },
    provider: { type: 'varchar(50)' },
    external_id: { type: 'varchar(255)' },
    last_four: { type: 'varchar(4)' },
    expiry_month: { type: 'integer' },
    expiry_year: { type: 'integer' },
    is_default: { type: 'boolean', default: false },
    is_active: { type: 'boolean', default: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Payment transactions - Payment records
  pgm.createTable('payment_transactions', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    booking_id: { type: 'uuid', references: 'bookings(id)', onDelete: 'CASCADE', notNull: true },
    user_id: { type: 'uuid', references: 'users(id)', onDelete: 'CASCADE', notNull: true },
    payment_method_id: { type: 'uuid', references: 'payment_methods(id)', onDelete: 'SET NULL' },
    amount: { type: 'decimal(10,2)', notNull: true },
    currency: { type: 'varchar(3)', default: "'ZAR'" },
    status: { type: 'varchar(20)', notNull: true },
    provider: { type: 'varchar(50)', notNull: true },
    external_transaction_id: { type: 'varchar(255)' },
    provider_response: { type: 'jsonb' },
    processed_at: { type: 'timestamp' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Driver locations - Real-time driver tracking
  pgm.createTable('driver_locations', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    driver_id: { type: 'uuid', references: 'drivers(id)', onDelete: 'CASCADE', notNull: true },
    booking_id: { type: 'uuid', references: 'bookings(id)', onDelete: 'SET NULL' },
    latitude: { type: 'decimal(10,8)', notNull: true },
    longitude: { type: 'decimal(11,8)', notNull: true },
    accuracy: { type: 'decimal(8,2)' },
    heading: { type: 'decimal(5,2)' },
    speed: { type: 'decimal(5,2)' },
    timestamp: { type: 'timestamp', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Booking history - Status change tracking
  pgm.createTable('booking_history', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    booking_id: { type: 'uuid', references: 'bookings(id)', onDelete: 'CASCADE', notNull: true },
    status: { type: 'varchar(30)', notNull: true },
    notes: { type: 'text' },
    location: { type: 'point' },
    created_by: { type: 'uuid', references: 'users(id)', onDelete: 'SET NULL' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Files - File upload tracking
  pgm.createTable('files', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    filename: { type: 'varchar(255)', notNull: true },
    original_name: { type: 'varchar(255)', notNull: true },
    mime_type: { type: 'varchar(100)', notNull: true },
    size: { type: 'bigint', notNull: true },
    path: { type: 'text', notNull: true },
    url: { type: 'text' },
    upload_type: { type: 'varchar(50)' },
    related_id: { type: 'uuid' },
    uploaded_by: { type: 'uuid', references: 'users(id)', onDelete: 'SET NULL' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Add indexes for performance
  pgm.createIndex('users', 'email');
  pgm.createIndex('users', 'phone');
  pgm.createIndex('users', 'firebase_uid');
  pgm.createIndex('drivers', 'user_id');
  pgm.createIndex('drivers', 'is_available');
  // Only create spatial indexes if PostGIS is available
  pgm.sql(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
        CREATE INDEX drivers_current_location_index ON drivers USING gist (current_location);
      END IF;
    END $$;
  `);
  pgm.createIndex('shops', 'user_id');
  pgm.sql(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
        CREATE INDEX shops_location_index ON shops USING gist (location);
      END IF;
    END $$;
  `);
  pgm.createIndex('shops', 'is_active');
  pgm.createIndex('bookings', 'user_id');
  pgm.createIndex('bookings', 'driver_id');
  pgm.createIndex('bookings', 'shop_id');
  pgm.createIndex('bookings', 'status');
  pgm.createIndex('bookings', 'created_at');
  pgm.createIndex('payment_transactions', 'booking_id');
  pgm.createIndex('payment_transactions', 'user_id');
  pgm.createIndex('payment_transactions', 'status');
  pgm.createIndex('driver_locations', 'driver_id');
  pgm.createIndex('driver_locations', 'timestamp');
  pgm.createIndex('booking_history', 'booking_id');
  pgm.createIndex('booking_history', 'created_at');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Drop all tables in reverse order (due to foreign key constraints)
  pgm.dropTable('files');
  pgm.dropTable('booking_history');
  pgm.dropTable('driver_locations');
  pgm.dropTable('payment_transactions');
  pgm.dropTable('payment_methods');
  pgm.dropTable('bookings');
  pgm.dropTable('service_items');
  pgm.dropTable('shops');
  pgm.dropTable('drivers');
  pgm.dropTable('users');

  // Extensions are managed at the container level
};