// Driver Location Repository with LINQ capabilities
import { PoolClient } from 'pg';
import { Repository } from '../../infrastructure/advancedLinqQueryBuilder';
import { DriverLocationConfiguration, EntityMappers, DriverLocation } from '../../infrastructure/entityConfigurations';

export class DriverLocationRepository extends Repository<DriverLocation> {
  constructor(client: PoolClient) {
    super(client, DriverLocationConfiguration, EntityMappers.driverLocation);
  }

  // Find by driver ID
  async findByDriverId(driverId: string): Promise<DriverLocation[]> {
    return await this.findWhere(location => location.driverId === driverId);
  }

  // Find latest location by driver ID
  async findLatestByDriverId(driverId: string): Promise<DriverLocation | null> {
    const locations = await this.findByDriverId(driverId);
    return locations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0] || null;
  }

  // Find locations by date range
  async findByDateRange(startDate: Date, endDate: Date): Promise<DriverLocation[]> {
    return await this.findWhere(location => 
      location.timestamp >= startDate && location.timestamp <= endDate
    );
  }
}

export default DriverLocationRepository;
