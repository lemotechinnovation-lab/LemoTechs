// LINQ-style Query Builder for LemoTech Infrastructure
// This provides EF Core-like query capabilities with lambda expressions

import { PoolClient } from 'pg';

// Base query expression types
export type QueryExpression<T> = (entity: T) => boolean;
export type OrderExpression<T> = (entity: T) => any;
export type SelectExpression<T, R> = (entity: T) => R;

// Query options
export interface QueryOptions<T> {
  where?: QueryExpression<T>[];
  orderBy?: OrderExpression<T>[];
  orderByDescending?: OrderExpression<T>[];
  take?: number;
  skip?: number;
  select?: SelectExpression<T, any>;
}

// Query result wrapper
export class QueryResult<T> {
  constructor(
    public data: T[],
    public totalCount: number,
    public hasMore: boolean
  ) {}

  // LINQ-style methods
  where(predicate: QueryExpression<T>): QueryResult<T> {
    return new QueryResult(
      this.data.filter(predicate),
      this.data.filter(predicate).length,
      false
    );
  }

  orderBy(selector: OrderExpression<T>): QueryResult<T> {
    const sorted = [...this.data].sort((a, b) => {
      const aVal = selector(a);
      const bVal = selector(b);
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    });
    return new QueryResult(sorted, this.totalCount, this.hasMore);
  }

  orderByDescending(selector: OrderExpression<T>): QueryResult<T> {
    const sorted = [...this.data].sort((a, b) => {
      const aVal = selector(a);
      const bVal = selector(b);
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    });
    return new QueryResult(sorted, this.totalCount, this.hasMore);
  }

  take(count: number): QueryResult<T> {
    return new QueryResult(
      this.data.slice(0, count),
      Math.min(count, this.totalCount),
      this.data.length > count
    );
  }

  skip(count: number): QueryResult<T> {
    return new QueryResult(
      this.data.slice(count),
      Math.max(0, this.totalCount - count),
      this.data.length > count
    );
  }

  select<R>(selector: SelectExpression<T, R>): QueryResult<R> {
    return new QueryResult(
      this.data.map(selector),
      this.totalCount,
      this.hasMore
    );
  }

  first(): T | null {
    return this.data[0] || null;
  }

  firstOrDefault(): T | null {
    return this.data[0] || null;
  }

  single(): T | null {
    if (this.data.length === 1) return this.data[0] || null;
    if (this.data.length === 0) return null;
    throw new Error('Sequence contains more than one element');
  }

  singleOrDefault(): T | null {
    if (this.data.length === 1) return this.data[0] || null;
    if (this.data.length === 0) return null;
    throw new Error('Sequence contains more than one element');
  }

  any(predicate?: QueryExpression<T>): boolean {
    if (predicate) {
      return this.data.some(predicate);
    }
    return this.data.length > 0;
  }

  count(predicate?: QueryExpression<T>): number {
    if (predicate) {
      return this.data.filter(predicate).length;
    }
    return this.data.length;
  }

  sum(selector: SelectExpression<T, number>): number {
    return this.data.reduce((sum, item) => sum + selector(item), 0);
  }

  average(selector: SelectExpression<T, number>): number {
    if (this.data.length === 0) return 0;
    return this.sum(selector) / this.data.length;
  }

  max(selector: SelectExpression<T, number>): number {
    if (this.data.length === 0) return 0;
    return Math.max(...this.data.map(selector));
  }

  min(selector: SelectExpression<T, number>): number {
    if (this.data.length === 0) return 0;
    return Math.min(...this.data.map(selector));
  }

  groupBy<K>(keySelector: SelectExpression<T, K>): Map<K, T[]> {
    const groups = new Map<K, T[]>();
    for (const item of this.data) {
      const key = keySelector(item);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(item);
    }
    return groups;
  }

  toArray(): T[] {
    return [...this.data];
  }

  toList(): T[] {
    return [...this.data];
  }
}

// LINQ Query Builder
export class LinqQueryBuilder<T> {
  private client: PoolClient;
  private tableName: string;
  private entityMapper: (row: any) => T;

  constructor(
    client: PoolClient,
    tableName: string,
    entityMapper: (row: any) => T
  ) {
    this.client = client;
    this.tableName = tableName;
    this.entityMapper = entityMapper;
  }

  // Build SQL query from LINQ expressions
  private buildQuery(options: QueryOptions<T>): { sql: string; params: any[] } {
    let sql = `SELECT * FROM ${this.tableName}`;
    const params: any[] = [];
    let paramIndex = 1;

    // WHERE clauses
    if (options.where && options.where.length > 0) {
      const whereClauses = options.where.map(predicate => {
        // This is a simplified version - in a real implementation,
        // you'd need to parse the predicate function
        return '1=1'; // Placeholder
      });
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    // ORDER BY clauses
    if (options.orderBy && options.orderBy.length > 0) {
      const orderClauses = options.orderBy.map(() => 'id ASC'); // Placeholder
      sql += ` ORDER BY ${orderClauses.join(', ')}`;
    }

    if (options.orderByDescending && options.orderByDescending.length > 0) {
      const orderClauses = options.orderByDescending.map(() => 'id DESC'); // Placeholder
      sql += ` ORDER BY ${orderClauses.join(', ')}`;
    }

    // LIMIT and OFFSET
    if (options.take) {
      sql += ` LIMIT $${paramIndex++}`;
      params.push(options.take);
    }

    if (options.skip) {
      sql += ` OFFSET $${paramIndex++}`;
      params.push(options.skip);
    }

    return { sql, params };
  }

  // Execute query and return QueryResult
  async execute(options: QueryOptions<T> = {}): Promise<QueryResult<T>> {
    const { sql, params } = this.buildQuery(options);
    
    // Get total count
    const countSql = `SELECT COUNT(*) FROM ${this.tableName}`;
    const countResult = await this.client.query(countSql);
    const totalCount = parseInt(countResult.rows[0].count);

    // Execute main query
    const result = await this.client.query(sql, params);
    const data = result.rows.map(this.entityMapper);

    return new QueryResult(
      data,
      totalCount,
      options.skip ? (options.skip + data.length) < totalCount : false
    );
  }

  // LINQ-style methods
  where(predicate: QueryExpression<T>): LinqQueryBuilder<T> {
    return new LinqQueryBuilder(
      this.client,
      this.tableName,
      this.entityMapper
    );
  }

  orderBy(selector: OrderExpression<T>): LinqQueryBuilder<T> {
    return new LinqQueryBuilder(
      this.client,
      this.tableName,
      this.entityMapper
    );
  }

  orderByDescending(selector: OrderExpression<T>): LinqQueryBuilder<T> {
    return new LinqQueryBuilder(
      this.client,
      this.tableName,
      this.entityMapper
    );
  }

  take(count: number): LinqQueryBuilder<T> {
    return new LinqQueryBuilder(
      this.client,
      this.tableName,
      this.entityMapper
    );
  }

  skip(count: number): LinqQueryBuilder<T> {
    return new LinqQueryBuilder(
      this.client,
      this.tableName,
      this.entityMapper
    );
  }

  select<R>(selector: SelectExpression<T, R>): LinqQueryBuilder<R> {
    return new LinqQueryBuilder(
      this.client,
      this.tableName,
      (row: any) => selector(this.entityMapper(row))
    );
  }

  // Execute and return first result
  async first(): Promise<T | null> {
    const result = await this.execute({ take: 1 });
    return result.first();
  }

  // Execute and return single result
  async single(): Promise<T | null> {
    const result = await this.execute({ take: 2 });
    return result.single();
  }

  // Execute and return all results
  async toList(): Promise<T[]> {
    const result = await this.execute();
    return result.toList();
  }

  // Execute and return count
  async count(): Promise<number> {
    const countSql = `SELECT COUNT(*) FROM ${this.tableName}`;
    const result = await this.client.query(countSql);
    return parseInt(result.rows[0].count);
  }

  // Execute and check if any exists
  async any(): Promise<boolean> {
    const count = await this.count();
    return count > 0;
  }
}

// Spatial Query Builder for PostGIS operations
export class SpatialQueryBuilder {
  private client: PoolClient;

  constructor(client: PoolClient) {
    this.client = client;
  }

  /**
   * Find drivers within a specific radius using PostGIS spatial functions
   */
  async findDriversInRadius(
    centerLocation: { lat: number; lng: number },
    radiusKm: number,
    maxDrivers: number = 20,
    additionalFilters: string = ''
  ): Promise<any[]> {
    const sql = `
      SELECT 
        d.id as driver_id,
        d.user_id,
        u.name,
        u.phone,
        d.vehicle,
        d.rating,
        d.total_jobs,
        d.current_location,
        d.last_active,
        d.status,
        ST_Distance(
          ST_GeogFromText('POINT(' || ($2) || ' ' || ($1) || ')'),
          ST_GeogFromText('POINT(' || (d.current_location->>'lng') || ' ' || (d.current_location->>'lat') || ')')
        ) / 1000 as distance_km
      FROM drivers d
      JOIN users u ON d.user_id = u.id
      WHERE 
        d.is_active = true 
        AND d.is_verified = true
        AND d.status = 'available'
        AND d.current_location IS NOT NULL
        AND ST_DWithin(
          ST_GeogFromText('POINT(' || ($2) || ' ' || ($1) || ')'),
          ST_GeogFromText('POINT(' || (d.current_location->>'lng') || ' ' || (d.current_location->>'lat') || ')'),
          $3 * 1000
        )
        AND d.last_active > NOW() - INTERVAL '15 minutes'
        ${additionalFilters}
      ORDER BY distance_km ASC
      LIMIT $4
    `;

    const result = await this.client.query(sql, [
      centerLocation.lat, 
      centerLocation.lng, 
      radiusKm, 
      maxDrivers
    ]);

    return result.rows;
  }

  /**
   * Find drivers within radius with custom select fields
   */
  async findDriversInRadiusCustom(
    centerLocation: { lat: number; lng: number },
    radiusKm: number,
    selectFields: string = '*',
    maxDrivers: number = 20
  ): Promise<any[]> {
    const sql = `
      SELECT 
        ${selectFields},
        ST_Distance(
          ST_GeogFromText('POINT(' || ($2) || ' ' || ($1) || ')'),
          ST_GeogFromText('POINT(' || (d.current_location->>'lng') || ' ' || (d.current_location->>'lat') || ')')
        ) / 1000 as distance_km
      FROM drivers d
      JOIN users u ON d.user_id = u.id
      WHERE 
        d.is_active = true 
        AND d.is_verified = true
        AND d.status = 'available'
        AND d.current_location IS NOT NULL
        AND ST_DWithin(
          ST_GeogFromText('POINT(' || ($2) || ' ' || ($1) || ')'),
          ST_GeogFromText('POINT(' || (d.current_location->>'lng') || ' ' || (d.current_location->>'lat') || ')'),
          $3 * 1000
        )
        AND d.last_active > NOW() - INTERVAL '15 minutes'
      ORDER BY distance_km ASC
      LIMIT $4
    `;

    const result = await this.client.query(sql, [
      centerLocation.lat, 
      centerLocation.lng, 
      radiusKm, 
      maxDrivers
    ]);

    return result.rows;
  }

  /**
   * Calculate distance between two points
   */
  async calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): Promise<number> {
    const sql = `
      SELECT ST_Distance(
        ST_GeogFromText('POINT(' || $2 || ' ' || $1 || ')'),
        ST_GeogFromText('POINT(' || $4 || ' ' || $3 || ')')
      ) / 1000 as distance_km
    `;

    const result = await this.client.query(sql, [
      point1.lat, point1.lng, point2.lat, point2.lng
    ]);

    return parseFloat(result.rows[0].distance_km);
  }

  /**
   * Find nearest drivers to multiple points (for batch operations)
   */
  async findNearestDriversToPoints(
    points: Array<{ lat: number; lng: number; id: string }>,
    radiusKm: number = 10
  ): Promise<Map<string, any[]>> {
    const results = new Map<string, any[]>();
    
    for (const point of points) {
      const drivers = await this.findDriversInRadius(point, radiusKm, 5);
      results.set(point.id, drivers);
    }
    
    return results;
  }

  /**
   * Get driver density in a specific area
   */
  async getDriverDensity(
    centerLocation: { lat: number; lng: number },
    radiusKm: number
  ): Promise<number> {
    const sql = `
      SELECT COUNT(*) as driver_count
      FROM drivers d
      WHERE 
        d.is_active = true 
        AND d.is_verified = true
        AND d.status = 'available'
        AND d.current_location IS NOT NULL
        AND ST_DWithin(
          ST_GeogFromText('POINT(' || ($2) || ' ' || ($1) || ')'),
          ST_GeogFromText('POINT(' || (d.current_location->>'lng') || ' ' || (d.current_location->>'lat') || ')'),
          $3 * 1000
        )
        AND d.last_active > NOW() - INTERVAL '15 minutes'
    `;

    const result = await this.client.query(sql, [
      centerLocation.lat, 
      centerLocation.lng, 
      radiusKm
    ]);

    return parseInt(result.rows[0].driver_count);
  }
}

// Factory function to create LINQ query builder
export function createQuery<T>(
  client: PoolClient,
  tableName: string,
  entityMapper: (row: any) => T
): LinqQueryBuilder<T> {
  return new LinqQueryBuilder(client, tableName, entityMapper);
}

// Factory function to create spatial query builder
export function createSpatialQuery(client: PoolClient): SpatialQueryBuilder {
  return new SpatialQueryBuilder(client);
}

export default LinqQueryBuilder;
