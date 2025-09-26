import { BookingRepository } from '../../repositories/booking/BookingRepository';
import { UserRepository } from '../../repositories/user/UserRepository';
import { DriverRepository } from '../../repositories/driver/DriverRepository';
import { CreateBookingRequest } from '../../models/booking/bookingModel';
import { IBookingService } from '../../infrastructure/di/interfaces';
import { BaseService } from '../base/BaseService';

export class BookingService extends BaseService implements IBookingService {
  constructor(
    private bookingRepository: BookingRepository,
    private userRepository: UserRepository,
    private driverRepository: DriverRepository
  ) {
    super();
  }

  /**
   * Create a new booking
   */
  async createBooking(bookingData: CreateBookingRequest): Promise<any> {
    this.logMethodEntry('createBooking', { userId: bookingData.userId });
    
    try {
      const booking = await this.bookingRepository.create(bookingData);
      if (!booking) {
        this.logMethodExit('createBooking', null);
        return null;
      }
      
      this.logMethodExit('createBooking', { bookingId: booking.id });
      return booking;
    } catch (error) {
      this.handleError('createBooking', error);
    }
  }

  /**
   * Update user total bookings count
   */
  async updateUserTotalBookings(userId: string): Promise<boolean> {
    this.logMethodEntry('updateUserTotalBookings', { userId });
    
    try {
      // Get count of bookings for user
      const bookings = await this.bookingRepository.findByUserId(userId);
      const totalBookings = bookings.length;
      
      // Update user's total bookings
      const result = await this.userRepository.update(userId, { totalBookings });
      
      this.logMethodExit('updateUserTotalBookings', { success: result !== null });
      return result !== null;
    } catch (error) {
      this.handleError('updateUserTotalBookings', error);
    }
  }

  /**
   * Get driver info for booking
   */
  async getDriverInfo(driverId: string): Promise<any> {
    this.logMethodEntry('getDriverInfo', { driverId });
    
    try {
      const driver = await this.driverRepository.findById(driverId);
      
      this.logMethodExit('getDriverInfo', { driverId });
      return driver;
    } catch (error) {
      this.handleError('getDriverInfo', error);
    }
  }

  /**
   * Get user bookings
   */
  async getUserBookings(userId: string): Promise<any[]> {
    this.logMethodEntry('getUserBookings', { userId });
    
    try {
      const bookings = await this.bookingRepository.findByUserId(userId);
      
      this.logMethodExit('getUserBookings', { count: bookings.length });
      return bookings;
    } catch (error) {
      this.handleError('getUserBookings', error);
    }
  }

  /**
   * Get booking by ID
   */
  async getBookingById(bookingId: string): Promise<any> {
    this.logMethodEntry('getBookingById', { bookingId });
    
    try {
      const booking = await this.bookingRepository.findById(bookingId);
      
      this.logMethodExit('getBookingById', { bookingId, found: booking !== null });
      return booking;
    } catch (error) {
      this.handleError('getBookingById', error);
    }
  }

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId: string): Promise<boolean> {
    this.logMethodEntry('cancelBooking', { bookingId });
    
    try {
      const result = await this.bookingRepository.update(bookingId, { 
        status: 'cancelled'
      });
      
      this.logMethodExit('cancelBooking', { success: result !== null });
      return result !== null;
    } catch (error) {
      this.handleError('cancelBooking', error);
    }
  }

  /**
   * Get available drivers
   */
  async getAvailableDrivers(): Promise<any[]> {
    this.logMethodEntry('getAvailableDrivers');
    
    try {
      // Get drivers with status 'available' - using findAll and filter for now
      const allDrivers = await this.driverRepository.findAll();
      const drivers = allDrivers.filter(driver => driver.status === 'available');
      
      this.logMethodExit('getAvailableDrivers', { count: drivers.length });
      return drivers;
    } catch (error) {
      this.handleError('getAvailableDrivers', error);
    }
  }

  /**
   * Get booking for auto assignment
   */
  async getBookingForAutoAssignment(): Promise<any[]> {
    this.logMethodEntry('getBookingForAutoAssignment');
    
    try {
      // Get bookings that need assignment
      const allBookings = await this.bookingRepository.findAll();
      const bookings = allBookings.filter(booking => booking.status === 'pending');
      
      this.logMethodExit('getBookingForAutoAssignment', { count: bookings.length });
      return bookings;
    } catch (error) {
      this.handleError('getBookingForAutoAssignment', error);
    }
  }

  /**
   * Get booking assignment status
   */
  async getBookingAssignmentStatus(bookingId: string): Promise<any> {
    this.logMethodEntry('getBookingAssignmentStatus', { bookingId });
    
    try {
      const booking = await this.bookingRepository.findById(bookingId);
      if (!booking) {
        this.logMethodExit('getBookingAssignmentStatus', null);
        return null;
      }
      
      const status = {
        bookingId: booking.id,
        status: booking.status,
        driverId: booking.driverId,
        assignedAt: (booking as any).assignedAt // Type assertion for missing property
      };
      
      this.logMethodExit('getBookingAssignmentStatus', status);
      return status;
    } catch (error) {
      this.handleError('getBookingAssignmentStatus', error);
    }
  }

  /**
   * Get booking for assignment
   */
  async getBookingForAssignment(bookingId: string): Promise<any> {
    this.logMethodEntry('getBookingForAssignment', { bookingId });
    
    try {
      const booking = await this.bookingRepository.findById(bookingId);
      
      this.logMethodExit('getBookingForAssignment', { bookingId, found: booking !== null });
      return booking;
    } catch (error) {
      this.handleError('getBookingForAssignment', error);
    }
  }

  /**
   * List driver bookings
   */
  async listDriverBookings(driverId: string): Promise<any[]> {
    this.logMethodEntry('listDriverBookings', { driverId });
    
    try {
      const bookings = await this.bookingRepository.findByDriverId(driverId);
      
      this.logMethodExit('listDriverBookings', { count: bookings.length });
      return bookings;
    } catch (error) {
      this.handleError('listDriverBookings', error);
    }
  }

  /**
   * List available jobs
   */
  async listAvailableJobs(): Promise<any[]> {
    this.logMethodEntry('listAvailableJobs');
    
    try {
      const allBookings = await this.bookingRepository.findAll();
      const bookings = allBookings.filter(booking => booking.status === 'pending');
      
      this.logMethodExit('listAvailableJobs', { count: bookings.length });
      return bookings;
    } catch (error) {
      this.handleError('listAvailableJobs', error);
    }
  }

  /**
   * Assign job to driver
   */
  async assignJobToDriver(bookingId: string, driverId: string): Promise<boolean> {
    this.logMethodEntry('assignJobToDriver', { bookingId, driverId });
    
    try {
      const result = await this.bookingRepository.update(bookingId, {
        driverId,
        status: 'assigned',
        ...(this.bookingRepository as any).assignedAt && { assignedAt: new Date() } // Conditional property
      });
      
      this.logMethodExit('assignJobToDriver', { success: result !== null });
      return result !== null;
    } catch (error) {
      this.handleError('assignJobToDriver', error);
    }
  }

  /**
   * List shop bookings
   */
  async listShopBookings(shopId: string): Promise<any[]> {
    this.logMethodEntry('listShopBookings', { shopId });
    
    try {
      const bookings = await this.bookingRepository.findByShopId(shopId);
      
      this.logMethodExit('listShopBookings', { count: bookings.length });
      return bookings;
    } catch (error) {
      this.handleError('listShopBookings', error);
    }
  }

  /**
   * Get booking owned by shop
   */
  async getBookingOwnedByShop(shopId: string, bookingId: string): Promise<any> {
    this.logMethodEntry('getBookingOwnedByShop', { shopId, bookingId });
    
    try {
      const booking = await this.bookingRepository.findById(bookingId);
      if (!booking || booking.shopId !== shopId) {
        this.logMethodExit('getBookingOwnedByShop', null);
        return null;
      }
      
      this.logMethodExit('getBookingOwnedByShop', { bookingId });
      return booking;
    } catch (error) {
      this.handleError('getBookingOwnedByShop', error);
    }
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(bookingId: string, status: string): Promise<boolean> {
    this.logMethodEntry('updateBookingStatus', { bookingId, status });
    
    try {
      const result = await this.bookingRepository.update(bookingId, { status: status as any });
      
      this.logMethodExit('updateBookingStatus', { success: result !== null });
      return result !== null;
    } catch (error) {
      this.handleError('updateBookingStatus', error);
    }
  }
}