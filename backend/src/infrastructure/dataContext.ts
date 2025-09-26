import { Pool, PoolClient } from 'pg';
import { query, getClient } from './database';
import { 
  UserRepository,
  DriverRepository,
  ShopRepository,
  BookingRepository,
  PaymentTransactionRepository,
  ServiceItemRepository,
  FileRepository,
  PhoneVerificationRepository,
  BookingStepRepository,
  BookingHistoryRepository,
  InProgressBookingRepository,
  PaymentMethodRepository,
  DriverJobRepository,
  DriverLocationRepository,
  PaymentRefundRepository,
  ShopInventoryRepository,
  ShopOrderRepository
} from '../repositories';
import {
  User,
  Driver,
  Shop,
  Booking,
  PaymentTransaction,
  PaymentMethod,
  ServiceItem,
  File,
  PhoneVerification,
  BookingStep,
  BookingHistory,
  InProgressBooking
} from './entities/databaseSchema';

// Data Context - EF Core equivalent with LINQ repositories
export class DataContext {
  private pool: Pool;
  private client: PoolClient | null = null;

  constructor() {
    this.pool = require('./database').default;
  }

  // Get database client
  private async getClient(): Promise<PoolClient> {
    if (!this.client) {
      this.client = await getClient();
    }
    return this.client;
  }

  // Users Repository with LINQ
  async users(): Promise<UserRepository> {
    const client = await this.getClient();
    return new UserRepository(client);
  }

  // Drivers Repository with LINQ
  async drivers(): Promise<DriverRepository> {
    const client = await this.getClient();
    return new DriverRepository(client);
  }

  // Shops Repository with LINQ
  async shops(): Promise<ShopRepository> {
    const client = await this.getClient();
    return new ShopRepository(client);
  }

  // Bookings Repository with LINQ
  async bookings(): Promise<BookingRepository> {
    const client = await this.getClient();
    return new BookingRepository(client);
  }

  // Payment Transactions Repository with LINQ
  async paymentTransactions(): Promise<PaymentTransactionRepository> {
    const client = await this.getClient();
    return new PaymentTransactionRepository(client);
  }

  // Service Items Repository with LINQ
  async serviceItems(): Promise<ServiceItemRepository> {
    const client = await this.getClient();
    return new ServiceItemRepository(client);
  }

  // File Repository with LINQ
  async files(): Promise<FileRepository> {
    const client = await this.getClient();
    return new FileRepository(client);
  }

  // Phone Verification Repository with LINQ
  async phoneVerifications(): Promise<PhoneVerificationRepository> {
    const client = await this.getClient();
    return new PhoneVerificationRepository(client);
  }

  // Booking Step Repository with LINQ
  async bookingSteps(): Promise<BookingStepRepository> {
    const client = await this.getClient();
    return new BookingStepRepository(client);
  }

  // Booking History Repository with LINQ
  async bookingHistory(): Promise<BookingHistoryRepository> {
    const client = await this.getClient();
    return new BookingHistoryRepository(client);
  }

  // In Progress Booking Repository with LINQ
  async inProgressBookings(): Promise<InProgressBookingRepository> {
    const client = await this.getClient();
    return new InProgressBookingRepository(client);
  }

  // Payment Method Repository with LINQ
  async paymentMethods(): Promise<PaymentMethodRepository> {
    const client = await this.getClient();
    return new PaymentMethodRepository(client);
  }

  // Driver Job Repository with LINQ
  async driverJobs(): Promise<DriverJobRepository> {
    const client = await this.getClient();
    return new DriverJobRepository(client);
  }

  // Driver Location Repository with LINQ
  async driverLocations(): Promise<DriverLocationRepository> {
    const client = await this.getClient();
    return new DriverLocationRepository(client);
  }

  // Payment Refund Repository with LINQ
  async paymentRefunds(): Promise<PaymentRefundRepository> {
    const client = await this.getClient();
    return new PaymentRefundRepository(client);
  }

  // Shop Inventory Repository with LINQ
  async shopInventory(): Promise<ShopInventoryRepository> {
    const client = await this.getClient();
    return new ShopInventoryRepository(client);
  }

  // Shop Order Repository with LINQ
  async shopOrders(): Promise<ShopOrderRepository> {
    const client = await this.getClient();
    return new ShopOrderRepository(client);
  }

  // Transaction support
  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // LINQ-style queries
  async query<T>(tableName: string, callback: (queryable: any) => any): Promise<T[]> {
    const client = await this.getClient();
    // This would integrate with the LINQ query builder
    // For now, return empty array as placeholder
    return [];
  }

  // Dispose resources
  async dispose(): Promise<void> {
    if (this.client) {
      this.client.release();
      this.client = null;
    }
  }
}

// Export singleton instance
export const db = new DataContext();
export default db;
