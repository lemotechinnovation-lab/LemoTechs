// Booking Repository with LINQ capabilities
import { PoolClient } from 'pg';
import { Repository } from '../../infrastructure/advancedLinqQueryBuilder';
import { BookingConfiguration, EntityMappers } from '../../infrastructure/entityConfigurations';
import { Booking } from '../../infrastructure/entities/databaseSchema';

export class BookingRepository extends Repository<Booking> {
  constructor(client: PoolClient) {
    super(client, BookingConfiguration, EntityMappers.booking);
  }

  // Override findById to use direct SQL query for better reliability
  override async findById(id: string): Promise<Booking | null> {
    const result = await this.client.query(
      'SELECT * FROM bookings WHERE id = $1 LIMIT 1',
      [id]
    );
    return result.rows.length > 0 ? this.entityMapper(result.rows[0]) : null;
  }

  // Find bookings by user ID
  async findByUserId(userId: string): Promise<Booking[]> {
    return await this.findWhere(booking => booking.userId === userId);
  }

  // Find bookings by driver ID
  async findByDriverId(driverId: string): Promise<Booking[]> {
    return await this.findWhere(booking => booking.driverId === driverId);
  }

  // Find bookings by shop ID
  async findByShopId(shopId: string): Promise<Booking[]> {
    return await this.findWhere(booking => booking.shopId === shopId);
  }

  // Find bookings by status
  async findByStatus(status: string): Promise<Booking[]> {
    return await this.findWhere(booking => booking.status === status);
  }

  // Find pending bookings
  async findPendingBookings(): Promise<Booking[]> {
    return await this.findWhere(booking => booking.status === 'pending');
  }

  // Find completed bookings
  async findCompletedBookings(): Promise<Booking[]> {
    return await this.findWhere(booking => booking.status === 'completed');
  }

  // Find bookings by date range
  async findByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    return await this.findWhere(booking => 
      booking.createdAt >= startDate && booking.createdAt <= endDate
    );
  }

  // Get booking statistics
  async getBookingStats(): Promise<{
    totalBookings: number;
    pendingBookings: number;
    completedBookings: number;
    totalRevenue: number;
  }> {
    const totalBookings = await this.count();
    const pendingBookings = await this.countWhere(booking => booking.status === 'pending');
    const completedBookings = await this.countWhere(booking => booking.status === 'completed');

    const allBookings = await this.findAll();
    const totalRevenue = allBookings.reduce((sum, booking) => sum + booking.amount, 0);

    return {
      totalBookings,
      pendingBookings,
      completedBookings,
      totalRevenue
    };
  }
}

export default BookingRepository;
