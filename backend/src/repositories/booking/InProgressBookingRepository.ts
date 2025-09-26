// In Progress Booking Repository with LINQ capabilities
import { PoolClient } from 'pg';
import { Repository } from '../../infrastructure/advancedLinqQueryBuilder';
import { InProgressBookingConfiguration, EntityMappers } from '../../infrastructure/entityConfigurations';
import { InProgressBooking } from '../../infrastructure/entities/databaseSchema';

export class InProgressBookingRepository extends Repository<InProgressBooking> {
  constructor(client: PoolClient) {
    super(client, InProgressBookingConfiguration, EntityMappers.inProgressBooking);
  }

  // Find by user ID
  async findByUserId(userId: string): Promise<InProgressBooking[]> {
    return await this.findWhere(booking => booking.userId === userId);
  }

  // Find by session ID
  async findBySessionId(sessionId: string): Promise<InProgressBooking | null> {
    return await this.findFirst(booking => booking.sessionId === sessionId);
  }

  // Find expired bookings
  async findExpiredBookings(): Promise<InProgressBooking[]> {
    const now = new Date();
    return await this.findWhere(booking => booking.expiresAt < now);
  }

  // Find active bookings
  async findActiveBookings(): Promise<InProgressBooking[]> {
    const now = new Date();
    return await this.findWhere(booking => booking.expiresAt > now);
  }
}

export default InProgressBookingRepository;
