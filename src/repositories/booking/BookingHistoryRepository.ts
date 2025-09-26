// Booking History Repository with LINQ capabilities
import { PoolClient } from 'pg';
import { Repository } from '../../infrastructure/advancedLinqQueryBuilder';
import { BookingHistoryConfiguration, EntityMappers } from '../../infrastructure/entityConfigurations';
import { BookingHistory } from '../../infrastructure/entities/databaseSchema';

export class BookingHistoryRepository extends Repository<BookingHistory> {
  constructor(client: PoolClient) {
    super(client, BookingHistoryConfiguration, EntityMappers.bookingHistory);
  }

  // Find history by booking ID
  async findByBookingId(bookingId: string): Promise<BookingHistory[]> {
    return await this.findWhere(history => history.bookingId === bookingId);
  }

  // Find history by user ID
  async findByUserId(userId: string): Promise<BookingHistory[]> {
    return await this.findWhere(history => history.userId === userId);
  }

  // Find history by step ID
  async findByStepId(stepId: string): Promise<BookingHistory[]> {
    return await this.findWhere(history => history.stepId === stepId);
  }
}

export default BookingHistoryRepository;
