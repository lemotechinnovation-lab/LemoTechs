// Driver Repository with LINQ capabilities
import { PoolClient } from 'pg';
import { Repository } from '../../infrastructure/advancedLinqQueryBuilder';
import { DriverConfiguration, EntityMappers } from '../../infrastructure/entityConfigurations';
import { Driver } from '../../infrastructure/entities/databaseSchema';
import { createSpatialQuery } from '../../infrastructure/linqQueryBuilder';

export class DriverRepository extends Repository<Driver> {
  constructor(client: PoolClient) {
    super(client, DriverConfiguration, EntityMappers.driver);
  }

  // Find driver by user ID
  async findByUserId(userId: string): Promise<Driver | null> {
    return await this.findFirst(driver => driver.userId === userId);
  }

  // Find available drivers
  async findAvailableDrivers(): Promise<Driver[]> {
    return await this.findWhere(driver => 
      driver.isActive && driver.status === 'available'
    );
  }

  // Find drivers by rating
  async findByRating(minRating: number): Promise<Driver[]> {
    return await this.findWhere(driver => driver.rating >= minRating);
  }

  // Find drivers by location (simplified)
  async findDriversNearLocation(lat: number, lng: number, radius: number = 10): Promise<Driver[]> {
    // This is a simplified implementation
    // In a real app, you'd use PostGIS for spatial queries
    return await this.findWhere(driver => driver.isActive);
  }

  // Find drivers within radius using PostGIS spatial queries
  async findDriversInRadius(
    centerLocation: { lat: number; lng: number },
    radiusKm: number,
    maxDrivers: number = 20,
    additionalFilters: string = ''
  ): Promise<any[]> {
    const spatialQuery = createSpatialQuery(this.client);
    return await spatialQuery.findDriversInRadius(
      centerLocation,
      radiusKm,
      maxDrivers,
      additionalFilters
    );
  }

  // Find drivers within radius with custom select fields
  async findDriversInRadiusCustom(
    centerLocation: { lat: number; lng: number },
    radiusKm: number,
    selectFields: string = '*',
    maxDrivers: number = 20
  ): Promise<any[]> {
    const spatialQuery = createSpatialQuery(this.client);
    return await spatialQuery.findDriversInRadiusCustom(
      centerLocation,
      radiusKm,
      selectFields,
      maxDrivers
    );
  }

  // Calculate distance between two points
  async calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): Promise<number> {
    const spatialQuery = createSpatialQuery(this.client);
    return await spatialQuery.calculateDistance(point1, point2);
  }

  // Get driver density in a specific area
  async getDriverDensity(
    centerLocation: { lat: number; lng: number },
    radiusKm: number
  ): Promise<number> {
    const spatialQuery = createSpatialQuery(this.client);
    return await spatialQuery.getDriverDensity(centerLocation, radiusKm);
  }

  // Get driver statistics
  async getDriverStats(): Promise<{
    totalDrivers: number;
    activeDrivers: number;
    availableDrivers: number;
    averageRating: number;
  }> {
    const totalDrivers = await this.count();
    const activeDrivers = await this.countWhere(driver => driver.isActive);
    const availableDrivers = await this.countWhere(driver => 
      driver.isActive && driver.status === 'available'
    );

    const allDrivers = await this.findAll();
    const averageRating = allDrivers.length > 0 
      ? allDrivers.reduce((sum, driver) => sum + driver.rating, 0) / allDrivers.length
      : 0;

    return {
      totalDrivers,
      activeDrivers,
      availableDrivers,
      averageRating
    };
  }
}

export default DriverRepository;
