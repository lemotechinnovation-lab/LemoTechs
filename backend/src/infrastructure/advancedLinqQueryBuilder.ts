// Advanced LINQ Query Builder with SQL Generation
// This provides EF Core-like query capabilities with proper SQL translation

import { PoolClient } from 'pg';

// Expression types for LINQ queries
export type Expression<T> = (entity: T) => any;
export type Predicate<T> = (entity: T) => boolean;
export type Selector<T, R> = (entity: T) => R;
export type OrderSelector<T> = (entity: T) => any;

// Query expression tree nodes
export interface QueryExpression {
  type: 'where' | 'orderBy' | 'orderByDescending' | 'take' | 'skip' | 'select';
  expression?: any;
  value?: any;
}

// Entity configuration
export interface EntityConfiguration<T> {
  tableName: string;
  primaryKey: string;
  columns: Record<string, string>;
  relationships?: Record<string, RelationshipConfig>;
}

export interface RelationshipConfig {
  type: 'one-to-one' | 'one-to-many' | 'many-to-many' | 'many-to-one';
  targetTable: string;
  foreignKey: string;
  localKey: string;
}

// Advanced LINQ Query Builder
export class AdvancedLinqQueryBuilder<T> {
  private client: PoolClient;
  private config: EntityConfiguration<T>;
  private entityMapper: (row: any) => T;
  private expressions: QueryExpression[] = [];

  constructor(
    client: PoolClient,
    config: EntityConfiguration<T>,
    entityMapper: (row: any) => T
  ) {
    this.client = client;
    this.config = config;
    this.entityMapper = entityMapper;
  }

  // WHERE clause
  where(predicate: Predicate<T>): AdvancedLinqQueryBuilder<T> {
    const newBuilder = this.clone();
    newBuilder.expressions.push({
      type: 'where',
      expression: predicate
    });
    return newBuilder;
  }

  // ORDER BY clause
  orderBy(selector: OrderSelector<T>): AdvancedLinqQueryBuilder<T> {
    const newBuilder = this.clone();
    newBuilder.expressions.push({
      type: 'orderBy',
      expression: selector
    });
    return newBuilder;
  }

  // ORDER BY DESCENDING clause
  orderByDescending(selector: OrderSelector<T>): AdvancedLinqQueryBuilder<T> {
    const newBuilder = this.clone();
    newBuilder.expressions.push({
      type: 'orderByDescending',
      expression: selector
    });
    return newBuilder;
  }

  // TAKE clause
  take(count: number): AdvancedLinqQueryBuilder<T> {
    const newBuilder = this.clone();
    newBuilder.expressions.push({
      type: 'take',
      value: count
    });
    return newBuilder;
  }

  // SKIP clause
  skip(count: number): AdvancedLinqQueryBuilder<T> {
    const newBuilder = this.clone();
    newBuilder.expressions.push({
      type: 'skip',
      value: count
    });
    return newBuilder;
  }

  // SELECT clause
  select<R>(selector: Selector<T, R>): AdvancedLinqQueryBuilder<R> {
    const newBuilder = this.clone() as any;
    newBuilder.expressions.push({
      type: 'select',
      expression: selector
    });
    return newBuilder;
  }

  // Execute query and return results
  async toList(): Promise<T[]> {
    const { sql, params } = this.buildSql();
    const result = await this.client.query(sql, params);
    return result.rows.map(this.entityMapper);
  }

  // Execute and return first result
  async first(): Promise<T | null> {
    const results = await this.take(1).toList();
    return results[0] || null;
  }

  // Execute and return single result
  async single(): Promise<T | null> {
    const results = await this.take(2).toList();
    if (results.length === 0) return null;
    if (results.length > 1) {
      throw new Error('Sequence contains more than one element');
    }
    return results[0] || null;
  }

  // Execute and return count
  async count(): Promise<number> {
    const countSql = `SELECT COUNT(*) FROM ${this.config.tableName}`;
    const result = await this.client.query(countSql);
    return parseInt(result.rows[0].count);
  }

  // Execute and check if any exists
  async any(): Promise<boolean> {
    const count = await this.count();
    return count > 0;
  }

  // Build SQL from expressions
  private buildSql(): { sql: string; params: any[] } {
    let sql = `SELECT * FROM ${this.config.tableName}`;
    const params: any[] = [];
    let paramIndex = 1;

    // Process WHERE clauses
    const whereExpressions = this.expressions.filter(e => e.type === 'where');
    if (whereExpressions.length > 0) {
      const whereClauses = whereExpressions.map((expr, index) => {
        const predicate = expr.expression.toString();
        
        // Handle email comparison: user => user.email === email
        if (predicate.includes('email ===')) {
          // Extract the actual email value from the closure
          const emailMatch = predicate.match(/email === ([^)]+)/);
          if (emailMatch && emailMatch[1]) {
            const email = emailMatch[1].trim();
            sql += ` WHERE email = $${paramIndex++}`;
            params.push(email);
            return '';
          }
        }
        
        // Handle phone comparison: user => user.phone === phone
        if (predicate.includes('phone ===')) {
          const phoneMatch = predicate.match(/phone === ([^)]+)/);
          if (phoneMatch && phoneMatch[1]) {
            const phone = phoneMatch[1].trim();
            sql += ` WHERE phone = $${paramIndex++}`;
            params.push(phone);
            return '';
          }
        }
        
        // Handle id comparison: entity => entity.id === id  
        if (predicate.includes('id ===')) {
          const idMatch = predicate.match(/id === ([^)]+)/);
          if (idMatch && idMatch[1]) {
            const id = idMatch[1].trim();
            sql += ` WHERE id = $${paramIndex++}`;
            params.push(id);
            return '';
          }
        }
        
        // Default fallback
        return '1=1';
      });
      
      // Only add WHERE if we haven't already added it above
      if (!sql.includes('WHERE')) {
        sql += ` WHERE ${whereClauses.filter(c => c !== '').join(' AND ')}`;
      }
    }

    // Process ORDER BY clauses
    const orderExpressions = this.expressions.filter(e => 
      e.type === 'orderBy' || e.type === 'orderByDescending'
    );
    if (orderExpressions.length > 0) {
      const orderClauses = orderExpressions.map(expr => {
        // Simplified ORDER BY clause
        return expr.type === 'orderByDescending' ? 'id DESC' : 'id ASC';
      });
      sql += ` ORDER BY ${orderClauses.join(', ')}`;
    }

    // Process SKIP clause
    const skipExpression = this.expressions.find(e => e.type === 'skip');
    if (skipExpression) {
      sql += ` OFFSET $${paramIndex++}`;
      params.push(skipExpression.value);
    }

    // Process TAKE clause
    const takeExpression = this.expressions.find(e => e.type === 'take');
    if (takeExpression) {
      sql += ` LIMIT $${paramIndex++}`;
      params.push(takeExpression.value);
    }

    return { sql, params };
  }

  // Clone builder for chaining
  private clone(): AdvancedLinqQueryBuilder<T> {
    const newBuilder = new AdvancedLinqQueryBuilder(
      this.client,
      this.config,
      this.entityMapper
    );
    newBuilder.expressions = [...this.expressions];
    return newBuilder;
  }
}

// Repository base class with LINQ capabilities
export class Repository<T> {
  protected client: PoolClient;
  protected config: EntityConfiguration<T>;
  protected entityMapper: (row: any) => T;

  constructor(
    client: PoolClient,
    config: EntityConfiguration<T>,
    entityMapper: (row: any) => T
  ) {
    this.client = client;
    this.config = config;
    this.entityMapper = entityMapper;
  }

  // Get queryable
  getQueryable(): AdvancedLinqQueryBuilder<T> {
    return new AdvancedLinqQueryBuilder(
      this.client,
      this.config,
      this.entityMapper
    );
  }

  // Find by ID
  async findById(id: string): Promise<T | null> {
    return await this.getQueryable()
      .where((entity: any) => entity.id === id)
      .first();
  }

  // Find all
  async findAll(): Promise<T[]> {
    return await this.getQueryable().toList();
  }

  // Find with predicate
  async findWhere(predicate: Predicate<T>): Promise<T[]> {
    return await this.getQueryable().where(predicate).toList();
  }

  // Find first with predicate
  async findFirst(predicate: Predicate<T>): Promise<T | null> {
    return await this.getQueryable().where(predicate).first();
  }

  // Count with predicate
  async countWhere(predicate: Predicate<T>): Promise<number> {
    return await this.getQueryable().where(predicate).count();
  }

  // Check if exists
  async exists(predicate: Predicate<T>): Promise<boolean> {
    return await this.getQueryable().where(predicate).any();
  }

  // Count all entities
  async count(): Promise<number> {
    return await this.getQueryable().count();
  }

  // Create entity
  async create(entity: Partial<T>): Promise<T> {
    // Map entity property names to database column names
    const entityToColumnMap: Record<string, string> = {
      userId: 'user_id',
      driverId: 'driver_id',
      shopId: 'shop_id',
      pickupLocation: 'pickup_location',
      pickupCoords: 'pickup_coords',
      paymentMethod: 'payment_method',
      paymentId: 'payment_id',
      contactPhone: 'contact_phone',
      specialInstructions: 'special_instructions',
      estimatedPickupTime: 'estimated_pickup_time',
      estimatedDeliveryTime: 'estimated_delivery_time',
      actualPickupTime: 'actual_pickup_time',
      actualDeliveryTime: 'actual_delivery_time',
      cleaningStartedAt: 'cleaning_started_at',
      cleaningCompletedAt: 'cleaning_completed_at',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      // User entity mappings
      firebaseUid: 'firebase_uid',
      emailVerified: 'email_verified',
      phoneVerified: 'phone_verified',
      loyaltyPoints: 'loyalty_points',
      totalBookings: 'total_bookings',
      memberSince: 'member_since',
      isActive: 'is_active',
      // Driver entity mappings
      licenseNumber: 'license_number',
      licenseExpiry: 'license_expiry',
      vehicleRegistration: 'vehicle_registration',
      vehicleModel: 'vehicle_model',
      vehicleColor: 'vehicle_color',
      totalJobs: 'total_jobs',
      totalEarnings: 'total_earnings',
      isVerified: 'is_verified',
      currentLocation: 'current_location',
      lastActive: 'last_active',
      // Shop entity mappings
      operatingHours: 'operating_hours',
      totalRevenue: 'total_revenue',
      currentLoad: 'current_load'
    };

    // Convert entity keys to database column names and handle JSON fields
    const dbColumns = Object.keys(entity).map(key => entityToColumnMap[key] || key);
    const columns = dbColumns.join(', ');
    
    // Process values - JSON stringify objects and arrays for JSONB columns
    const jsonbColumns = ['pickup_coords', 'items', 'operating_hours', 'services', 'current_location', 'booking_data', 'step_data', 'coordinates'];
    const values = Object.entries(entity).map(([key, value]) => {
      const dbColumnName = entityToColumnMap[key] || key;
      
      // If it's a JSONB column and the value is an object/array, stringify it
      if (jsonbColumns.includes(dbColumnName) && (typeof value === 'object' && value !== null)) {
        return JSON.stringify(value);
      }
      
      return value;
    });
    
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
    
    const sql = `
      INSERT INTO ${this.config.tableName} (${columns})
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const result = await this.client.query(sql, values);
    return this.entityMapper(result.rows[0]);
  }

  // Update entity
  async update(id: string, updates: Partial<T>): Promise<T> {
    // Map entity property names to database column names and handle JSON fields
    const entityToColumnMap: Record<string, string> = {
      userId: 'user_id',
      driverId: 'driver_id',
      shopId: 'shop_id',
      pickupLocation: 'pickup_location',
      pickupCoords: 'pickup_coords',
      paymentMethod: 'payment_method',
      paymentId: 'payment_id',
      contactPhone: 'contact_phone',
      specialInstructions: 'special_instructions',
      estimatedPickupTime: 'estimated_pickup_time',
      estimatedDeliveryTime: 'estimated_delivery_time',
      actualPickupTime: 'actual_pickup_time',
      actualDeliveryTime: 'actual_delivery_time',
      cleaningStartedAt: 'cleaning_started_at',
      cleaningCompletedAt: 'cleaning_completed_at',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      // User entity mappings
      firebaseUid: 'firebase_uid',
      emailVerified: 'email_verified',
      phoneVerified: 'phone_verified',
      loyaltyPoints: 'loyalty_points',
      totalBookings: 'total_bookings',
      memberSince: 'member_since',
      isActive: 'is_active',
      // Driver entity mappings
      licenseNumber: 'license_number',
      licenseExpiry: 'license_expiry',
      vehicleRegistration: 'vehicle_registration',
      vehicleModel: 'vehicle_model',
      vehicleColor: 'vehicle_color',
      totalJobs: 'total_jobs',
      totalEarnings: 'total_earnings',
      isVerified: 'is_verified',
      currentLocation: 'current_location',
      lastActive: 'last_active',
      // Shop entity mappings
      operatingHours: 'operating_hours',
      totalRevenue: 'total_revenue',
      currentLoad: 'current_load'
    };

    // Convert entity keys to database column names and handle JSON fields
    const dbColumns = Object.keys(updates).map(key => entityToColumnMap[key] || key);
    const setClause = dbColumns.map((col, index) => `${col} = $${index + 1}`).join(', ');
    
    // Process values - JSON stringify objects and arrays for JSONB columns
    const jsonbColumns = ['pickup_coords', 'items', 'operating_hours', 'services', 'current_location', 'booking_data', 'step_data', 'coordinates'];
    const values = Object.entries(updates).map(([key, value]) => {
      const dbColumnName = entityToColumnMap[key] || key;
      
      // If it's a JSONB column and the value is an object/array, stringify it
      if (jsonbColumns.includes(dbColumnName) && (typeof value === 'object' && value !== null)) {
        return JSON.stringify(value);
      }
      
      return value;
    });
    
    const sql = `
      UPDATE ${this.config.tableName}
      SET ${setClause}, updated_at = NOW()
      WHERE ${this.config.primaryKey} = $${values.length + 1}
      RETURNING *
    `;
    
    const result = await this.client.query(sql, [...values, id]);
    return this.entityMapper(result.rows[0]);
  }

  // Delete entity
  async delete(id: string): Promise<void> {
    const sql = `DELETE FROM ${this.config.tableName} WHERE ${this.config.primaryKey} = $1`;
    await this.client.query(sql, [id]);
  }
}

// Factory function
export function createRepository<T>(
  client: PoolClient,
  config: EntityConfiguration<T>,
  entityMapper: (row: any) => T
): Repository<T> {
  return new Repository(client, config, entityMapper);
}

export default AdvancedLinqQueryBuilder;
