// Driver Job Repository with LINQ capabilities
import { PoolClient } from 'pg';
import { Repository } from '../../infrastructure/advancedLinqQueryBuilder';
import { DriverJobConfiguration, EntityMappers, DriverJob } from '../../infrastructure/entityConfigurations';

export class DriverJobRepository extends Repository<DriverJob> {
  constructor(client: PoolClient) {
    super(client, DriverJobConfiguration, EntityMappers.driverJob);
  }

  // Find by driver ID
  async findByDriverId(driverId: string): Promise<DriverJob[]> {
    return await this.findWhere(job => job.driverId === driverId);
  }

  // Find by booking ID
  async findByBookingId(bookingId: string): Promise<DriverJob[]> {
    return await this.findWhere(job => job.bookingId === bookingId);
  }

  // Find by status
  async findByStatus(status: string): Promise<DriverJob[]> {
    return await this.findWhere(job => job.status === status);
  }

  // Find active jobs
  async findActiveJobs(): Promise<DriverJob[]> {
    return await this.findWhere(job => 
      job.status === 'assigned' || job.status === 'in_progress'
    );
  }
}

export default DriverJobRepository;
