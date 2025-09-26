import { getClient, query } from '../infrastructure/database';
import { Logger } from '../utils/logger';

/**
 * Enhanced Seed Script for LemoTech Backend
 * - Seeds all tables including new ones: cleaning_items, shop_queue, shop_inventory_tracking, etc.
 * - Safe to run multiple times (checks for existing by unique keys)
 * - Uses a single transaction for consistency
 * - Supports versioned data seeding
 */
export const seedTestData = async (): Promise<void> => {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Helper: check if a column exists on a table
    const hasColumn = async (table: string, column: string): Promise<boolean> => {
      const res = await client.query(
        `SELECT 1 FROM information_schema.columns WHERE table_name = $1 AND column_name = $2 LIMIT 1`,
        [table, column]
      );
      return (res?.rowCount ?? 0) > 0;
    };

    // Helper: check if table exists
    const tableExists = async (tableName: string): Promise<boolean> => {
      const res = await client.query(
        `SELECT 1 FROM information_schema.tables WHERE table_name = $1 LIMIT 1`,
        [tableName]
      );
      return (res?.rowCount ?? 0) > 0;
    };

    Logger.info('🌱 Starting comprehensive data seeding...');

    // Users
    const usersToEnsure = [
      { email: 'admin@lemotech.test', name: 'Admin User', role: 'admin', phone: '+15550000001' },
      { email: 'user@lemotech.test', name: 'Test User', role: 'user', phone: '+15550000002' },
      { email: 'driver@lemotech.test', name: 'Test Driver', role: 'driver', phone: '+15550000003' },
      { email: 'shop@lemotech.test', name: 'Shop Owner', role: 'shop', phone: '+15550000004' },
    ];

    const userEmailToId: Record<string, string> = {};

    for (const u of usersToEnsure) {
      const existing = await client.query('SELECT id FROM users WHERE email = $1', [u.email]);
      if ((existing?.rowCount ?? 0) > 0) {
        userEmailToId[u.email] = existing.rows[0].id;
      } else {
        const hasRoleColumn = await hasColumn('users', 'role');
        const hasIsActiveColumn = await hasColumn('users', 'is_active');
        
        if (hasRoleColumn && hasIsActiveColumn) {
          const inserted = await client.query(
            `INSERT INTO users (email, password, name, phone, address, avatar, email_verified, phone_verified, provider, role, loyalty_points, total_bookings, is_active)
             VALUES ($1, $2, $3, $4, $5, $6, true, true, 'email', $7, 100, 0, true) RETURNING id`,
            [
              u.email,
              '$2b$10$examplehashedpasswordforlocaltestingonlyxxxxxxx',
              u.name,
              u.phone,
              '123 Test St, Test City',
              null,
              u.role,
            ]
          );
          userEmailToId[u.email] = inserted.rows[0].id;
        } else if (hasRoleColumn) {
          const inserted = await client.query(
            `INSERT INTO users (email, password, name, phone, address, avatar, email_verified, phone_verified, provider, role, loyalty_points, total_bookings)
             VALUES ($1, $2, $3, $4, $5, $6, true, true, 'email', $7, 100, 0) RETURNING id`,
            [
              u.email,
              '$2b$10$examplehashedpasswordforlocaltestingonlyxxxxxxx',
              u.name,
              u.phone,
              '123 Test St, Test City',
              null,
              u.role,
            ]
          );
          userEmailToId[u.email] = inserted.rows[0].id;
        } else {
          const inserted = await client.query(
            `INSERT INTO users (email, password, name, phone, address, avatar, email_verified, phone_verified, provider, loyalty_points, total_bookings)
             VALUES ($1, $2, $3, $4, $5, $6, true, true, 'email', 100, 0) RETURNING id`,
            [
              u.email,
              '$2b$10$examplehashedpasswordforlocaltestingonlyxxxxxxx',
              u.name,
              u.phone,
              '123 Test St, Test City',
              null,
            ]
          );
          userEmailToId[u.email] = inserted.rows[0].id;
        }
      }
    }

    // Driver tied to driver user
    const driverUserId = userEmailToId['driver@lemotech.test'];
    let driverId: string | null = null;
    if (driverUserId) {
      const driversHasUserId = await hasColumn('drivers', 'user_id');
      if (driversHasUserId) {
        const existingDriver = await client.query('SELECT id FROM drivers WHERE user_id = $1', [driverUserId]);
        if ((existingDriver?.rowCount ?? 0) > 0) {
          driverId = existingDriver.rows[0].id;
        } else {
          const insertedDriver = await client.query(
            `INSERT INTO drivers (user_id, name, email, phone, vehicle, license_number, license_expiry, vehicle_registration, vehicle_model, vehicle_color, rating, total_jobs, total_earnings, is_active, is_verified, status)
             VALUES ($1, $2, $3, $4, $5, $6, NOW() + INTERVAL '1 year', $7, $8, $9, 4.8, 12, 320.5, true, true, 'available') RETURNING id`,
            [
              driverUserId,
              'Test Driver',
              'driver@lemotech.test',
              '+15550000003',
              'Toyota Prius',
              'DL-TEST-12345',
              'TEST-REG-001',
              'Prius',
              'Blue'
            ]
          );
          driverId = insertedDriver.rows[0].id;
        }
      }
    }

    // Shop tied to shop owner user
    const shopOwnerUserId = userEmailToId['shop@lemotech.test'];
    let shopId: string | null = null;
    if (shopOwnerUserId) {
      const shopsHasUserId = await hasColumn('shops', 'user_id');
      if (shopsHasUserId) {
        const existingShop = await client.query('SELECT id FROM shops WHERE user_id = $1', [shopOwnerUserId]);
        if ((existingShop?.rowCount ?? 0) > 0) {
          shopId = existingShop.rows[0].id;
        } else {
          const insertedShop = await client.query(
            `INSERT INTO shops (user_id, name, description, address, coordinates, phone, email, operating_hours, services, rating, total_bookings, total_revenue, is_active, is_verified, capacity, current_load)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 4.6, 25, 1520.75, true, true, 100, 5) RETURNING id`,
            [
              shopOwnerUserId,
              'Downtown Clean & Shine',
              'Premium cleaning center for clothing, shoes, and accessories',
              '456 Service Ave, Test City',
              JSON.stringify({ lat: 40.7128, lng: -74.0060 }),
              '+15550000010',
              'shop@lemotech.test',
              JSON.stringify({ mon_fri: '08:00-18:00', sat: '09:00-16:00', sun: 'closed' }),
              JSON.stringify({ categories: ['shoes', 'clothing', 'accessories'] }),
            ]
          );
          shopId = insertedShop.rows[0].id;
        }
      }
    }

    // Service Items
    if (await tableExists('service_items')) {
      const existingServiceItems = await client.query('SELECT COUNT(*) as count FROM service_items');
      if (existingServiceItems.rows[0].count === '0') {
        const serviceItems = [
          { name: 'Sneakers', category: 'shoes', base_price: 25.0, description: 'Athletic shoe cleaning' },
          { name: 'Dress Shoes', category: 'shoes', base_price: 30.0, description: 'Formal shoe cleaning' },
          { name: 'Shirt/Blouse', category: 'clothing', base_price: 15.0, description: 'Shirt cleaning and pressing' },
          { name: 'Pants', category: 'clothing', base_price: 18.0, description: 'Pants cleaning and pressing' },
          { name: 'Jacket', category: 'clothing', base_price: 35.0, description: 'Jacket cleaning' },
          { name: 'Boots', category: 'shoes', base_price: 40.0, description: 'Boot cleaning and conditioning' },
        ];

        for (const item of serviceItems) {
          await client.query(
            `INSERT INTO service_items (name, category, base_price, description, is_active)
             VALUES ($1, $2, $3, $4, true)`,
            [item.name, item.category, item.base_price, item.description]
          );
        }
        Logger.info('✅ Service items seeded');
      }
    }

    // Phone Verifications
    const pvPhone = '+15550009999';
    const existingPv = await client.query('SELECT id FROM phone_verifications WHERE phone_number = $1', [pvPhone]);
    if (existingPv.rowCount === 0) {
      await client.query(
        `INSERT INTO phone_verifications (phone_number, verification_code, expires_at)
         VALUES ($1, $2, NOW() + INTERVAL '10 minutes')`,
        [pvPhone, '123456']
      );
    }

    // Bookings
    const regularUserId = userEmailToId['user@lemotech.test'];
    if (regularUserId && driverId && shopId) {
      const existingBookings = await client.query('SELECT id FROM bookings WHERE user_id = $1 LIMIT 1', [regularUserId]);
      if (existingBookings.rowCount === 0) {
        const items = [
          { id: 'Sneakers', quantity: 2, price: 25.0 },
          { id: 'Shirt/Blouse', quantity: 3, price: 15.0 },
        ];

        await client.query(
          `INSERT INTO bookings (user_id, pickup_location, pickup_coords, items, driver_id, shop_id, status, payment_method, amount, contact_phone, special_instructions, estimated_pickup_time, estimated_delivery_time)
           VALUES ($1, $2, $3, $4, $5, $6, 'confirmed', 'card', $7, $8, $9, NOW() + INTERVAL '1 hour', NOW() + INTERVAL '2 days')`,
          [
            regularUserId,
            '789 Pickup Rd, Test City',
            JSON.stringify({ lat: 40.7139, lng: -74.0070 }),
            JSON.stringify(items),
            driverId,
            shopId,
            2 * 25.0 + 3 * 15.0,
            '+15550000002',
            'Handle with care; delicate fabrics',
          ]
        );

        await client.query(
          `INSERT INTO bookings (user_id, pickup_location, pickup_coords, items, driver_id, shop_id, status, payment_method, amount, contact_phone, special_instructions)
           VALUES ($1, $2, $3, $4, $5, $6, 'pending', 'cash', $7, $8, $9)`,
          [
            regularUserId,
            '1010 Second St, Test City',
            JSON.stringify({ lat: 40.7141, lng: -74.0080 }),
            JSON.stringify([{ id: 'Boots', quantity: 1, price: 40.0 }]),
            driverId,
            shopId,
            40.0,
            '+15550000002',
            'Pickup after 5 PM',
          ]
        );
        Logger.info('✅ Bookings seeded');
      }
    }

    // Cleaning Items (New Table)
    if (await tableExists('cleaning_items') && shopId) {
      const existingCleaningItems = await client.query('SELECT COUNT(*) as count FROM cleaning_items');
      if (existingCleaningItems.rows[0].count === '0') {
        const cleaningItems = [
          {
            bookingId: (await client.query('SELECT id FROM bookings LIMIT 1')).rows[0]?.id,
            itemName: 'Nike Air Max',
            itemType: 'shoes',
            condition: 'good',
            cleaningMethod: 'standard',
            status: 'received',
            estimatedTime: 45,
            notes: 'White sneakers, light stains'
          },
          {
            bookingId: (await client.query('SELECT id FROM bookings LIMIT 1')).rows[0]?.id,
            itemName: 'Cotton T-Shirt',
            itemType: 'clothing',
            condition: 'fair',
            cleaningMethod: 'delicate',
            status: 'in_progress',
            estimatedTime: 30,
            notes: 'Color bleeding concern'
          }
        ];

        for (const item of cleaningItems) {
          if (item.bookingId) {
            await client.query(
              `INSERT INTO cleaning_items (booking_id, item_name, item_type, condition, cleaning_method, status, estimated_time, notes, created_at, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
              [
                item.bookingId,
                item.itemName,
                item.itemType,
                item.condition,
                item.cleaningMethod,
                item.status,
                item.estimatedTime,
                item.notes
              ]
            );
          }
        }
        Logger.info('✅ Cleaning items seeded');
      }
    }

    // Shop Queue (New Table)
    if (await tableExists('shop_queue') && shopId) {
      const existingQueueItems = await client.query('SELECT COUNT(*) as count FROM shop_queue');
      if (existingQueueItems.rows[0].count === '0') {
        const cleaningItemIds = await client.query('SELECT id FROM cleaning_items LIMIT 2');
        const bookingIds = await client.query('SELECT id FROM bookings LIMIT 2');

        if (cleaningItemIds.rows.length > 0 && bookingIds.rows.length > 0) {
          const queueItems = [
            {
              shopId,
              bookingId: bookingIds.rows[0].id,
              cleaningItemId: cleaningItemIds.rows[0].id,
              priority: 'high',
              status: 'queued',
              estimatedDuration: 45,
              queuedAt: new Date(),
              notes: 'Priority cleaning required'
            },
            {
              shopId,
              bookingId: bookingIds.rows[1]?.id || bookingIds.rows[0].id,
              cleaningItemId: cleaningItemIds.rows[1]?.id || cleaningItemIds.rows[0].id,
              priority: 'normal',
              status: 'in_progress',
              estimatedDuration: 30,
              queuedAt: new Date(Date.now() - 3600000), // 1 hour ago
              startedAt: new Date(Date.now() - 1800000), // 30 minutes ago
              assignedTo: 'staff-001',
              notes: 'Standard cleaning process'
            }
          ];

          for (const item of queueItems) {
            await client.query(
              `INSERT INTO shop_queue (shop_id, booking_id, cleaning_item_id, priority, status, estimated_duration, queued_at, started_at, assigned_to, notes, created_at, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
              [
                item.shopId,
                item.bookingId,
                item.cleaningItemId,
                item.priority,
                item.status,
                item.estimatedDuration,
                item.queuedAt,
                item.startedAt,
                item.assignedTo,
                item.notes
              ]
            );
          }
          Logger.info('✅ Shop queue seeded');
        }
      }
    }

    // Shop Inventory Tracking (New Table)
    if (await tableExists('shop_inventory_tracking') && shopId) {
      const existingInventory = await client.query('SELECT COUNT(*) as count FROM shop_inventory_tracking');
      if (existingInventory.rows[0].count === '0') {
        const inventoryItems = [
          {
            shopId,
            itemName: 'Cleaning Detergent',
            category: 'cleaning_supplies',
            subcategory: 'detergent',
            sku: 'DET-001',
            quantity: 50,
            minQuantity: 10,
            maxQuantity: 100,
            unitPrice: 15.99,
            costPrice: 8.50,
            description: 'Multi-purpose cleaning detergent',
            supplier: 'CleanCorp Supplies',
            isActive: true,
            isTrackable: true,
            location: 'Storage Room A',
            condition: 'new'
          },
          {
            shopId,
            itemName: 'Steam Iron',
            category: 'equipment',
            subcategory: 'ironing',
            sku: 'IRN-002',
            quantity: 3,
            minQuantity: 1,
            maxQuantity: 5,
            unitPrice: 89.99,
            costPrice: 45.00,
            description: 'Professional steam iron',
            supplier: 'IronMaster Pro',
            isActive: true,
            isTrackable: true,
            location: 'Workstation 1',
            condition: 'good'
          },
          {
            shopId,
            itemName: 'Plastic Hangers',
            category: 'consumables',
            subcategory: 'hangers',
            sku: 'HNG-003',
            quantity: 5,
            minQuantity: 20,
            maxQuantity: 200,
            unitPrice: 0.50,
            costPrice: 0.25,
            description: 'Heavy-duty plastic hangers',
            supplier: 'HangRight Supplies',
            isActive: true,
            isTrackable: true,
            location: 'Storage Room B',
            condition: 'new'
          }
        ];

        for (const item of inventoryItems) {
          await client.query(
            `INSERT INTO shop_inventory_tracking (shop_id, item_name, category, subcategory, sku, quantity, min_quantity, max_quantity, unit_price, cost_price, description, supplier, is_active, is_trackable, location, condition, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())`,
            [
              item.shopId,
              item.itemName,
              item.category,
              item.subcategory,
              item.sku,
              item.quantity,
              item.minQuantity,
              item.maxQuantity,
              item.unitPrice,
              item.costPrice,
              item.description,
              item.supplier,
              item.isActive,
              item.isTrackable,
              item.location,
              item.condition
            ]
          );
        }
        Logger.info('✅ Shop inventory tracking seeded');
      }
    }

    // Driver Jobs (New Table)
    if (await tableExists('driver_jobs') && driverId) {
      const existingJobs = await client.query('SELECT COUNT(*) as count FROM driver_jobs');
      if (existingJobs.rows[0].count === '0') {
        const bookingIds = await client.query('SELECT id FROM bookings LIMIT 2');
        if (bookingIds.rows.length > 0) {
          const jobs = [
            {
              driverId,
              bookingId: bookingIds.rows[0].id,
              status: 'assigned',
              pickupLocation: JSON.stringify({ lat: 40.7139, lng: -74.0070 }),
              deliveryLocation: JSON.stringify({ lat: 40.7128, lng: -74.0060 }),
              assignedAt: new Date(),
              estimatedPickupTime: new Date(Date.now() + 3600000), // 1 hour from now
              estimatedDeliveryTime: new Date(Date.now() + 7200000) // 2 hours from now
            },
            {
              driverId,
              bookingId: bookingIds.rows[1]?.id || bookingIds.rows[0].id,
              status: 'in_progress',
              pickupLocation: JSON.stringify({ lat: 40.7141, lng: -74.0080 }),
              deliveryLocation: JSON.stringify({ lat: 40.7128, lng: -74.0060 }),
              assignedAt: new Date(Date.now() - 1800000), // 30 minutes ago
              startedAt: new Date(Date.now() - 900000), // 15 minutes ago
              estimatedPickupTime: new Date(Date.now() - 1800000),
              estimatedDeliveryTime: new Date(Date.now() + 3600000)
            }
          ];

          for (const job of jobs) {
            await client.query(
              `INSERT INTO driver_jobs (driver_id, booking_id, status, pickup_location, delivery_location, assigned_at, started_at, estimated_pickup_time, estimated_delivery_time, created_at, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
              [
                job.driverId,
                job.bookingId,
                job.status,
                job.pickupLocation,
                job.deliveryLocation,
                job.assignedAt,
                job.startedAt,
                job.estimatedPickupTime,
                job.estimatedDeliveryTime
              ]
            );
          }
          Logger.info('✅ Driver jobs seeded');
        }
      }
    }

    // Driver Locations (New Table)
    if (await tableExists('driver_locations') && driverId) {
      const existingLocations = await client.query('SELECT COUNT(*) as count FROM driver_locations');
      if (existingLocations.rows[0].count === '0') {
        await client.query(
          `INSERT INTO driver_locations (driver_id, latitude, longitude, accuracy, heading, speed, timestamp, status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, NOW(), NOW())`,
          [
            driverId,
            40.7128,
            -74.0060,
            10,
            180,
            25,
            'en_route'
          ]
        );
        Logger.info('✅ Driver locations seeded');
      }
    }

    // Payment Transactions (New Table)
    if (await tableExists('payment_transactions')) {
      const existingPayments = await client.query('SELECT COUNT(*) as count FROM payment_transactions');
      if (existingPayments.rows[0].count === '0') {
        const bookingIds = await client.query('SELECT id FROM bookings LIMIT 2');
        if (bookingIds.rows.length > 0) {
          const payments = [
            {
              bookingId: bookingIds.rows[0].id,
              amount: 95.0,
              currency: 'ZAR',
              status: 'completed',
              paymentMethod: 'card',
              transactionId: 'txn_test_001',
              processedAt: new Date(Date.now() - 3600000) // 1 hour ago
            },
            {
              bookingId: bookingIds.rows[1]?.id || bookingIds.rows[0].id,
              amount: 40.0,
              currency: 'ZAR',
              status: 'pending',
              paymentMethod: 'cash',
              transactionId: 'txn_test_002',
              processedAt: null
            }
          ];

          for (const payment of payments) {
            await client.query(
              `INSERT INTO payment_transactions (booking_id, amount, currency, status, payment_method, transaction_id, processed_at, created_at, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
              [
                payment.bookingId,
                payment.amount,
                payment.currency,
                payment.status,
                payment.paymentMethod,
                payment.transactionId,
                payment.processedAt
              ]
            );
          }
          Logger.info('✅ Payment transactions seeded');
        }
      }
    }

    // Files
    if (regularUserId) {
      const filesHasUserId = await hasColumn('files', 'user_id');
      if (filesHasUserId) {
        const existingFiles = await client.query('SELECT id FROM files WHERE user_id = $1 LIMIT 1', [regularUserId]);
        if (existingFiles.rowCount === 0) {
          await client.query(
            `INSERT INTO files (filename, original_name, mimetype, size, url, user_id)
             VALUES ('example.png', 'example.png', 'image/png', 12345, '/uploads/example.png', $1)`,
            [regularUserId]
          );
        }
      }
    }

    await client.query('COMMIT');
    Logger.info('✅ Comprehensive test data seeded successfully');
    Logger.info('📊 Seeded tables: users, drivers, shops, bookings, service_items, cleaning_items, shop_queue, shop_inventory_tracking, driver_jobs, driver_locations, payment_transactions, files');
  } catch (error) {
    await client.query('ROLLBACK');
    Logger.error('❌ Seeding test data failed:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default seedTestData;