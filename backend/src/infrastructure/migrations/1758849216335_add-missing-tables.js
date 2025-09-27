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
  // UUID functions are available in PostgreSQL 15

  // Booking steps - Multi-step booking process tracking (skip if already exists)
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS booking_steps (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      step_name varchar(50) NOT NULL UNIQUE,
      step_order integer NOT NULL,
      description text,
      created_at timestamp DEFAULT current_timestamp,
      updated_at timestamp DEFAULT current_timestamp
    );
  `);

  // Cleaning items - Individual items within a booking
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS cleaning_items (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      service_item_id uuid REFERENCES service_items(id) ON DELETE SET NULL,
      item_name varchar(200) NOT NULL,
      item_description text,
      quantity integer DEFAULT 1,
      unit_price decimal(10,2) NOT NULL,
      total_price decimal(10,2) NOT NULL,
      special_instructions text,
      before_photos jsonb,
      after_photos jsonb,
      status varchar(30) DEFAULT 'pending',
      created_at timestamp DEFAULT current_timestamp,
      updated_at timestamp DEFAULT current_timestamp
    );
  `);

  // Driver jobs - Driver work assignments
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS driver_jobs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      driver_id uuid NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
      booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      job_type varchar(20) NOT NULL,
      status varchar(20) NOT NULL DEFAULT 'assigned',
      assigned_at timestamp DEFAULT current_timestamp,
      started_at timestamp,
      completed_at timestamp,
      location text NOT NULL,
      coordinates point,
      estimated_time integer,
      actual_time integer,
      notes text,
      created_at timestamp DEFAULT current_timestamp,
      updated_at timestamp DEFAULT current_timestamp
    );
  `);

  // In-progress bookings - Active booking tracking
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS in_progress_bookings (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_id uuid NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
      current_step varchar(30) NOT NULL,
      driver_id uuid REFERENCES drivers(id) ON DELETE SET NULL,
      shop_id uuid REFERENCES shops(id) ON DELETE SET NULL,
      pickup_eta timestamp,
      cleaning_eta timestamp,
      delivery_eta timestamp,
      last_update timestamp DEFAULT current_timestamp,
      created_at timestamp DEFAULT current_timestamp
    );
  `);

  // Payment refunds - Refund transaction tracking
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS payment_refunds (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      original_transaction_id uuid NOT NULL REFERENCES payment_transactions(id) ON DELETE CASCADE,
      booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      refund_amount decimal(10,2) NOT NULL,
      refund_reason varchar(100) NOT NULL,
      status varchar(20) NOT NULL DEFAULT 'pending',
      provider varchar(50) NOT NULL,
      external_refund_id varchar(255),
      provider_response jsonb,
      processed_at timestamp,
      created_at timestamp DEFAULT current_timestamp,
      updated_at timestamp DEFAULT current_timestamp
    );
  `);

  // Phone verifications - Phone number verification tracking
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS phone_verifications (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES users(id) ON DELETE CASCADE,
      phone_number varchar(20) NOT NULL,
      verification_code varchar(10) NOT NULL,
      is_verified boolean DEFAULT false,
      attempts integer DEFAULT 0,
      expires_at timestamp NOT NULL,
      verified_at timestamp,
      created_at timestamp DEFAULT current_timestamp
    );
  `);

  // Shop capacity planning - Shop workload management
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS shop_capacity_planning (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      shop_id uuid NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
      date date NOT NULL,
      hour integer NOT NULL,
      max_capacity integer NOT NULL,
      current_load integer DEFAULT 0,
      available_slots integer NOT NULL,
      is_available boolean DEFAULT true,
      created_at timestamp DEFAULT current_timestamp,
      updated_at timestamp DEFAULT current_timestamp
    );
  `);

  // Shop inventory - Shop supplies and materials
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS shop_inventory (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      shop_id uuid NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
      item_name varchar(100) NOT NULL,
      item_category varchar(50) NOT NULL,
      current_stock integer NOT NULL,
      minimum_stock integer NOT NULL,
      unit varchar(20) NOT NULL,
      cost_per_unit decimal(10,2),
      supplier varchar(100),
      last_restocked timestamp,
      created_at timestamp DEFAULT current_timestamp,
      updated_at timestamp DEFAULT current_timestamp
    );
  `);

  // Shop inventory tracking - Inventory movement history
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS shop_inventory_tracking (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      inventory_id uuid NOT NULL REFERENCES shop_inventory(id) ON DELETE CASCADE,
      shop_id uuid NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
      movement_type varchar(20) NOT NULL,
      quantity_change integer NOT NULL,
      previous_stock integer NOT NULL,
      new_stock integer NOT NULL,
      booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
      notes text,
      created_by uuid REFERENCES users(id) ON DELETE SET NULL,
      created_at timestamp DEFAULT current_timestamp
    );
  `);

  // Shop orders - Internal shop order management
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS shop_orders (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      shop_id uuid NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
      booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      order_number varchar(20) UNIQUE NOT NULL,
      priority varchar(10) DEFAULT 'normal',
      status varchar(20) NOT NULL DEFAULT 'received',
      assigned_staff varchar(100),
      estimated_completion timestamp,
      actual_completion timestamp,
      quality_notes text,
      created_at timestamp DEFAULT current_timestamp,
      updated_at timestamp DEFAULT current_timestamp
    );
  `);

  // Shop queue - Shop processing queue management
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS shop_queue (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      shop_id uuid NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
      shop_order_id uuid NOT NULL REFERENCES shop_orders(id) ON DELETE CASCADE,
      queue_position integer NOT NULL,
      estimated_start_time timestamp,
      estimated_completion_time timestamp,
      actual_start_time timestamp,
      queue_date date NOT NULL,
      is_active boolean DEFAULT true,
      created_at timestamp DEFAULT current_timestamp,
      updated_at timestamp DEFAULT current_timestamp
    );
  `);

  // Add indexes for performance (only if they don't exist)
  pgm.sql(`CREATE INDEX IF NOT EXISTS cleaning_items_booking_id_index ON cleaning_items (booking_id);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS cleaning_items_service_item_id_index ON cleaning_items (service_item_id);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS cleaning_items_status_index ON cleaning_items (status);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS driver_jobs_driver_id_index ON driver_jobs (driver_id);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS driver_jobs_booking_id_index ON driver_jobs (booking_id);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS driver_jobs_status_index ON driver_jobs (status);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS driver_jobs_job_type_index ON driver_jobs (job_type);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS in_progress_bookings_booking_id_index ON in_progress_bookings (booking_id);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS in_progress_bookings_current_step_index ON in_progress_bookings (current_step);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS in_progress_bookings_driver_id_index ON in_progress_bookings (driver_id);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS in_progress_bookings_shop_id_index ON in_progress_bookings (shop_id);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS payment_refunds_original_transaction_id_index ON payment_refunds (original_transaction_id);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS payment_refunds_booking_id_index ON payment_refunds (booking_id);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS payment_refunds_status_index ON payment_refunds (status);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS phone_verifications_phone_number_index ON phone_verifications (phone_number);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS phone_verifications_user_id_index ON phone_verifications (user_id);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS phone_verifications_expires_at_index ON phone_verifications (expires_at);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS shop_capacity_planning_shop_id_index ON shop_capacity_planning (shop_id);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS shop_capacity_planning_shop_id_date_hour_index ON shop_capacity_planning (shop_id, date, hour);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS shop_inventory_shop_id_index ON shop_inventory (shop_id);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS shop_inventory_item_category_index ON shop_inventory (item_category);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS shop_inventory_tracking_inventory_id_index ON shop_inventory_tracking (inventory_id);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS shop_inventory_tracking_shop_id_index ON shop_inventory_tracking (shop_id);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS shop_inventory_tracking_booking_id_index ON shop_inventory_tracking (booking_id);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS shop_orders_shop_id_index ON shop_orders (shop_id);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS shop_orders_booking_id_index ON shop_orders (booking_id);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS shop_orders_status_index ON shop_orders (status);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS shop_orders_order_number_index ON shop_orders (order_number);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS shop_queue_shop_id_index ON shop_queue (shop_id);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS shop_queue_shop_order_id_index ON shop_queue (shop_order_id);`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS shop_queue_shop_id_queue_date_queue_position_index ON shop_queue (shop_id, queue_date, queue_position);`);

  // Add unique constraints (only if they don't exist)
  pgm.sql(`
    DO $$ 
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_shop_date_hour') THEN
        ALTER TABLE shop_capacity_planning ADD CONSTRAINT unique_shop_date_hour UNIQUE(shop_id, date, hour);
      END IF;
    END $$;
  `);
  
  pgm.sql(`
    DO $$ 
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_shop_position_date') THEN
        ALTER TABLE shop_queue ADD CONSTRAINT unique_shop_position_date UNIQUE(shop_id, queue_position, queue_date);
      END IF;
    END $$;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Drop all new tables in reverse order
  pgm.dropTable('shop_queue', { ifExists: true });
  pgm.dropTable('shop_orders', { ifExists: true });
  pgm.dropTable('shop_inventory_tracking', { ifExists: true });
  pgm.dropTable('shop_inventory', { ifExists: true });
  pgm.dropTable('shop_capacity_planning', { ifExists: true });
  pgm.dropTable('phone_verifications', { ifExists: true });
  pgm.dropTable('payment_refunds', { ifExists: true });
  pgm.dropTable('in_progress_bookings', { ifExists: true });
  pgm.dropTable('driver_jobs', { ifExists: true });
  pgm.dropTable('cleaning_items', { ifExists: true });
  pgm.dropTable('booking_steps', { ifExists: true });
};