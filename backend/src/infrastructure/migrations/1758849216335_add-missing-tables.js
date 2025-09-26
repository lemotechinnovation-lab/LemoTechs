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
  // Booking steps - Multi-step booking process tracking
  pgm.createTable('booking_steps', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    booking_id: { type: 'uuid', references: 'bookings(id)', onDelete: 'CASCADE', notNull: true },
    step_number: { type: 'integer', notNull: true },
    step_name: { type: 'varchar(50)', notNull: true }, // pickup, cleaning, delivery
    status: { type: 'varchar(20)', notNull: true, default: 'pending' }, // pending, in_progress, completed, failed
    started_at: { type: 'timestamp' },
    completed_at: { type: 'timestamp' },
    notes: { type: 'text' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Cleaning items - Individual items within a booking
  pgm.createTable('cleaning_items', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    booking_id: { type: 'uuid', references: 'bookings(id)', onDelete: 'CASCADE', notNull: true },
    service_item_id: { type: 'uuid', references: 'service_items(id)', onDelete: 'SET NULL' },
    item_name: { type: 'varchar(200)', notNull: true },
    item_description: { type: 'text' },
    quantity: { type: 'integer', default: 1 },
    unit_price: { type: 'decimal(10,2)', notNull: true },
    total_price: { type: 'decimal(10,2)', notNull: true },
    special_instructions: { type: 'text' },
    before_photos: { type: 'jsonb' }, // Array of photo URLs
    after_photos: { type: 'jsonb' }, // Array of photo URLs
    status: { type: 'varchar(30)', default: 'pending' }, // pending, cleaning, completed, damaged
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Driver jobs - Driver work assignments
  pgm.createTable('driver_jobs', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    driver_id: { type: 'uuid', references: 'drivers(id)', onDelete: 'CASCADE', notNull: true },
    booking_id: { type: 'uuid', references: 'bookings(id)', onDelete: 'CASCADE', notNull: true },
    job_type: { type: 'varchar(20)', notNull: true }, // pickup, delivery
    status: { type: 'varchar(20)', notNull: true, default: 'assigned' }, // assigned, started, completed, cancelled
    assigned_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    started_at: { type: 'timestamp' },
    completed_at: { type: 'timestamp' },
    location: { type: 'text', notNull: true },
    coordinates: { type: 'point' },
    estimated_time: { type: 'integer' }, // minutes
    actual_time: { type: 'integer' }, // minutes
    notes: { type: 'text' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // In-progress bookings - Active booking tracking
  pgm.createTable('in_progress_bookings', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    booking_id: { type: 'uuid', references: 'bookings(id)', onDelete: 'CASCADE', unique: true, notNull: true },
    current_step: { type: 'varchar(30)', notNull: true }, // pickup_scheduled, picked_up, cleaning, ready, out_for_delivery, delivered
    driver_id: { type: 'uuid', references: 'drivers(id)', onDelete: 'SET NULL' },
    shop_id: { type: 'uuid', references: 'shops(id)', onDelete: 'SET NULL' },
    pickup_eta: { type: 'timestamp' },
    cleaning_eta: { type: 'timestamp' },
    delivery_eta: { type: 'timestamp' },
    last_update: { type: 'timestamp', default: pgm.func('current_timestamp') },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Payment refunds - Refund transaction tracking
  pgm.createTable('payment_refunds', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    original_transaction_id: { type: 'uuid', references: 'payment_transactions(id)', onDelete: 'CASCADE', notNull: true },
    booking_id: { type: 'uuid', references: 'bookings(id)', onDelete: 'CASCADE', notNull: true },
    user_id: { type: 'uuid', references: 'users(id)', onDelete: 'CASCADE', notNull: true },
    refund_amount: { type: 'decimal(10,2)', notNull: true },
    refund_reason: { type: 'varchar(100)', notNull: true },
    status: { type: 'varchar(20)', notNull: true, default: 'pending' }, // pending, processing, completed, failed
    provider: { type: 'varchar(50)', notNull: true },
    external_refund_id: { type: 'varchar(255)' },
    provider_response: { type: 'jsonb' },
    processed_at: { type: 'timestamp' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Phone verifications - Phone number verification tracking
  pgm.createTable('phone_verifications', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', references: 'users(id)', onDelete: 'CASCADE' },
    phone_number: { type: 'varchar(20)', notNull: true },
    verification_code: { type: 'varchar(10)', notNull: true },
    is_verified: { type: 'boolean', default: false },
    attempts: { type: 'integer', default: 0 },
    expires_at: { type: 'timestamp', notNull: true },
    verified_at: { type: 'timestamp' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Shop capacity planning - Shop workload management
  pgm.createTable('shop_capacity_planning', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    shop_id: { type: 'uuid', references: 'shops(id)', onDelete: 'CASCADE', notNull: true },
    date: { type: 'date', notNull: true },
    hour: { type: 'integer', notNull: true }, // 0-23
    max_capacity: { type: 'integer', notNull: true },
    current_load: { type: 'integer', default: 0 },
    available_slots: { type: 'integer', notNull: true },
    is_available: { type: 'boolean', default: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Shop inventory - Shop supplies and materials
  pgm.createTable('shop_inventory', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    shop_id: { type: 'uuid', references: 'shops(id)', onDelete: 'CASCADE', notNull: true },
    item_name: { type: 'varchar(100)', notNull: true },
    item_category: { type: 'varchar(50)', notNull: true }, // cleaning_supplies, equipment, packaging
    current_stock: { type: 'integer', notNull: true },
    minimum_stock: { type: 'integer', notNull: true },
    unit: { type: 'varchar(20)', notNull: true }, // pieces, liters, kg
    cost_per_unit: { type: 'decimal(10,2)' },
    supplier: { type: 'varchar(100)' },
    last_restocked: { type: 'timestamp' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Shop inventory tracking - Inventory movement history
  pgm.createTable('shop_inventory_tracking', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    inventory_id: { type: 'uuid', references: 'shop_inventory(id)', onDelete: 'CASCADE', notNull: true },
    shop_id: { type: 'uuid', references: 'shops(id)', onDelete: 'CASCADE', notNull: true },
    movement_type: { type: 'varchar(20)', notNull: true }, // use, restock, adjustment, waste
    quantity_change: { type: 'integer', notNull: true }, // positive for add, negative for use
    previous_stock: { type: 'integer', notNull: true },
    new_stock: { type: 'integer', notNull: true },
    booking_id: { type: 'uuid', references: 'bookings(id)', onDelete: 'SET NULL' },
    notes: { type: 'text' },
    created_by: { type: 'uuid', references: 'users(id)', onDelete: 'SET NULL' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Shop orders - Internal shop order management
  pgm.createTable('shop_orders', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    shop_id: { type: 'uuid', references: 'shops(id)', onDelete: 'CASCADE', notNull: true },
    booking_id: { type: 'uuid', references: 'bookings(id)', onDelete: 'CASCADE', notNull: true },
    order_number: { type: 'varchar(20)', unique: true, notNull: true },
    priority: { type: 'varchar(10)', default: 'normal' }, // low, normal, high, urgent
    status: { type: 'varchar(20)', notNull: true, default: 'received' }, // received, processing, completed, quality_check, ready
    assigned_staff: { type: 'varchar(100)' },
    estimated_completion: { type: 'timestamp' },
    actual_completion: { type: 'timestamp' },
    quality_notes: { type: 'text' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Shop queue - Shop processing queue management
  pgm.createTable('shop_queue', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    shop_id: { type: 'uuid', references: 'shops(id)', onDelete: 'CASCADE', notNull: true },
    shop_order_id: { type: 'uuid', references: 'shop_orders(id)', onDelete: 'CASCADE', notNull: true },
    queue_position: { type: 'integer', notNull: true },
    estimated_start_time: { type: 'timestamp' },
    estimated_completion_time: { type: 'timestamp' },
    actual_start_time: { type: 'timestamp' },
    queue_date: { type: 'date', notNull: true },
    is_active: { type: 'boolean', default: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Add indexes for performance
  pgm.createIndex('booking_steps', 'booking_id');
  pgm.createIndex('booking_steps', ['booking_id', 'step_number']);
  pgm.createIndex('cleaning_items', 'booking_id');
  pgm.createIndex('cleaning_items', 'service_item_id');
  pgm.createIndex('cleaning_items', 'status');
  pgm.createIndex('driver_jobs', 'driver_id');
  pgm.createIndex('driver_jobs', 'booking_id');
  pgm.createIndex('driver_jobs', 'status');
  pgm.createIndex('driver_jobs', 'job_type');
  pgm.createIndex('in_progress_bookings', 'booking_id');
  pgm.createIndex('in_progress_bookings', 'current_step');
  pgm.createIndex('in_progress_bookings', 'driver_id');
  pgm.createIndex('in_progress_bookings', 'shop_id');
  pgm.createIndex('payment_refunds', 'original_transaction_id');
  pgm.createIndex('payment_refunds', 'booking_id');
  pgm.createIndex('payment_refunds', 'status');
  pgm.createIndex('phone_verifications', 'phone_number');
  pgm.createIndex('phone_verifications', 'user_id');
  pgm.createIndex('phone_verifications', 'expires_at');
  pgm.createIndex('shop_capacity_planning', 'shop_id');
  pgm.createIndex('shop_capacity_planning', ['shop_id', 'date', 'hour']);
  pgm.createIndex('shop_inventory', 'shop_id');
  pgm.createIndex('shop_inventory', 'item_category');
  pgm.createIndex('shop_inventory_tracking', 'inventory_id');
  pgm.createIndex('shop_inventory_tracking', 'shop_id');
  pgm.createIndex('shop_inventory_tracking', 'booking_id');
  pgm.createIndex('shop_orders', 'shop_id');
  pgm.createIndex('shop_orders', 'booking_id');
  pgm.createIndex('shop_orders', 'status');
  pgm.createIndex('shop_orders', 'order_number');
  pgm.createIndex('shop_queue', 'shop_id');
  pgm.createIndex('shop_queue', 'shop_order_id');
  pgm.createIndex('shop_queue', ['shop_id', 'queue_date', 'queue_position']);

  // Add unique constraints
  pgm.addConstraint('shop_capacity_planning', 'unique_shop_date_hour', 'UNIQUE(shop_id, date, hour)');
  pgm.addConstraint('shop_queue', 'unique_shop_position_date', 'UNIQUE(shop_id, queue_position, queue_date)');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Drop all new tables in reverse order
  pgm.dropTable('shop_queue');
  pgm.dropTable('shop_orders');
  pgm.dropTable('shop_inventory_tracking');
  pgm.dropTable('shop_inventory');
  pgm.dropTable('shop_capacity_planning');
  pgm.dropTable('phone_verifications');
  pgm.dropTable('payment_refunds');
  pgm.dropTable('in_progress_bookings');
  pgm.dropTable('driver_jobs');
  pgm.dropTable('cleaning_items');
  pgm.dropTable('booking_steps');
};
