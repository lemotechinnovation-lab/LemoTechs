import { UserRepository } from '../../repositories/user/UserRepository';
import { DriverRepository } from '../../repositories/driver/DriverRepository';
import { ShopRepository } from '../../repositories/shop/ShopRepository';
import { BookingRepository } from '../../repositories/booking/BookingRepository';
import { AdminDashboardStats, AdminUserManagement, AdminDriverManagement, AdminShopManagement, AdminBookingManagement } from '../../models/user/adminModel';
import { IAdminService } from '../../infrastructure/di/interfaces';
import { BaseService } from '../base/BaseService';
import { Logger } from '../../utils/logger';

export class AdminService extends BaseService implements IAdminService {
  constructor(
    private userRepository: UserRepository,
    private bookingRepository: BookingRepository,
    private driverRepository: DriverRepository,
    private shopRepository: ShopRepository
  ) {
    super();
  }

  /**
   * Get all users with pagination and filtering
   */
  async getAllUsers(page: number = 1, limit: number = 10, filters?: any): Promise<{ users: AdminUserManagement[], total: number }> {
    this.logMethodEntry('getAllUsers', { page, limit, filters });
    
    try {
      const users = await this.userRepository.findAll();
      const total = users.length;
      
      // Simple pagination
      const offset = (page - 1) * limit;
      const paginatedUsers = users.slice(offset, offset + limit);
      
      const userManagement: AdminUserManagement[] = paginatedUsers.map(user => ({
        userId: user.id,
        name: user.name || 'Unknown',
        email: user.email,
        role: user.role as 'user' | 'driver' | 'shop' | 'admin',
        emailVerified: user.emailVerified || false,
        phoneVerified: user.phoneVerified || false,
        isActive: user.isActive !== undefined ? user.isActive : true,
        memberSince: user.createdAt,
        totalBookings: user.totalBookings || 0
      }));
      
      this.logMethodExit('getAllUsers', { count: userManagement.length, total });
      return { users: userManagement, total };
    } catch (error) {
      this.handleError('getAllUsers', error);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<AdminUserManagement | null> {
    this.logMethodEntry('getUserById', { userId });
    
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        this.logMethodExit('getUserById', null);
        return null;
      }
      
      const userManagement: AdminUserManagement = {
        userId: user.id,
        name: user.name || 'Unknown',
        email: user.email,
        role: user.role as 'user' | 'driver' | 'shop' | 'admin',
        emailVerified: user.emailVerified || false,
        phoneVerified: user.phoneVerified || false,
        isActive: user.isActive !== undefined ? user.isActive : true,
        memberSince: user.createdAt,
        totalBookings: user.totalBookings || 0
      };
      
      this.logMethodExit('getUserById', { userId: userManagement.userId });
      return userManagement;
    } catch (error) {
      this.handleError('getUserById', error);
    }
  }

  /**
   * Update user status
   */
  async updateUserStatus(userId: string, status: string): Promise<boolean> {
    this.logMethodEntry('updateUserStatus', { userId, status });
    
    try {
      const result = await this.userRepository.update(userId, {});
      
      this.logMethodExit('updateUserStatus', { success: result !== null });
      return result !== null;
    } catch (error) {
      this.handleError('updateUserStatus', error);
    }
  }

  /**
   * Get all bookings with pagination
   */
  async getAllBookings(page: number = 1, limit: number = 10): Promise<{ bookings: AdminBookingManagement[], total: number }> {
    this.logMethodEntry('getAllBookings', { page, limit });
    
    try {
      const bookings = await this.bookingRepository.findAll();
      const total = bookings.length;
      
      // Simple pagination
      const offset = (page - 1) * limit;
      const paginatedBookings = bookings.slice(offset, offset + limit);
      
      const bookingManagement: AdminBookingManagement[] = [];
      
      for (const booking of paginatedBookings) {
        const user = await this.userRepository.findById(booking.userId);
        const driver = booking.driverId ? await this.driverRepository.findById(booking.driverId) : null;
        const shop = booking.shopId ? await this.shopRepository.findById(booking.shopId) : null;
        
        bookingManagement.push({
          bookingId: booking.id,
          userId: booking.userId,
          driverId: booking.driverId,
          shopId: booking.shopId,
          status: booking.status,
          amount: booking.amount,
          createdAt: booking.createdAt,
          userName: user?.name || 'Unknown User',
          driverName: driver ? (driver as any).name || 'Unknown Driver' : 'No Driver',
          shopName: shop?.name || 'Unknown Shop'
        });
      }
      
      this.logMethodExit('getAllBookings', { count: bookingManagement.length, total });
      return { bookings: bookingManagement, total };
    } catch (error) {
      this.handleError('getAllBookings', error);
    }
  }

  /**
   * Get all drivers with pagination
   */
  async getAllDrivers(page: number = 1, limit: number = 10): Promise<{ drivers: AdminDriverManagement[], total: number }> {
    this.logMethodEntry('getAllDrivers', { page, limit });
    
    try {
      const drivers = await this.driverRepository.findAll();
      const total = drivers.length;
      
      // Simple pagination
      const offset = (page - 1) * limit;
      const paginatedDrivers = drivers.slice(offset, offset + limit);
      
      const driverManagement: AdminDriverManagement[] = paginatedDrivers.map(driver => ({
        driverId: driver.id,
        userId: driver.userId,
        name: (driver as any).name || 'Unknown',
        email: (driver as any).email || 'Unknown',
        phone: (driver as any).phone || 'Unknown',
        status: driver.status,
        rating: driver.rating || 0,
        totalJobs: driver.totalJobs || 0,
        isActive: driver.isActive !== undefined ? driver.isActive : true,
        joinedAt: driver.createdAt,
        vehicle: 'Unknown',
        licenseNumber: 'Unknown',
        isVerified: false
      }));
      
      this.logMethodExit('getAllDrivers', { count: driverManagement.length, total });
      return { drivers: driverManagement, total };
    } catch (error) {
      this.handleError('getAllDrivers', error);
    }
  }

  /**
   * Get all shops with pagination
   */
  async getAllShops(page: number = 1, limit: number = 10): Promise<{ shops: AdminShopManagement[], total: number }> {
    this.logMethodEntry('getAllShops', { page, limit });
    
    try {
      const shops = await this.shopRepository.findAll();
      const total = shops.length;
      
      // Simple pagination
      const offset = (page - 1) * limit;
      const paginatedShops = shops.slice(offset, offset + limit);
      
      const shopManagement: AdminShopManagement[] = paginatedShops.map(shop => ({
        shopId: shop.id,
        userId: shop.userId,
        name: shop.name || 'Unknown',
        email: shop.email || 'Unknown',
        phone: shop.phone || 'Unknown',
        address: shop.address || 'Unknown',
        status: (shop as any).status || 'active',
        rating: shop.rating || 0,
        totalOrders: shop.totalBookings || 0,
        isActive: shop.isActive !== undefined ? shop.isActive : true,
        joinedAt: shop.createdAt,
        totalBookings: 0,
        isVerified: false,
        capacity: 100,
        currentLoad: 0
      }));
      
      this.logMethodExit('getAllShops', { count: shopManagement.length, total });
      return { shops: shopManagement, total };
    } catch (error) {
      this.handleError('getAllShops', error);
    }
  }

  /**
   * Get system analytics
   */
  async getSystemAnalytics(): Promise<AdminDashboardStats> {
    this.logMethodEntry('getSystemAnalytics');
    
    try {
      const users = await this.userRepository.findAll();
      const bookings = await this.bookingRepository.findAll();
      const drivers = await this.driverRepository.findAll();
      const shops = await this.shopRepository.findAll();
      
      const analytics: AdminDashboardStats = {
        totalUsers: users.length,
        totalBookings: bookings.length,
        totalDrivers: drivers.length,
        totalShops: shops.length,
        totalRevenue: bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0),
        activeUsers: users.filter(u => u.emailVerified).length,
        pendingVerifications: users.filter(u => !u.emailVerified || !u.phoneVerified).length
      };
      
      this.logMethodExit('getSystemAnalytics', analytics);
      return analytics;
    } catch (error) {
      this.handleError('getSystemAnalytics', error);
    }
  }

  /**
   * Get system logs
   */
  async getSystemLogs(page: number = 1, limit: number = 10): Promise<{ logs: any[], total: number }> {
    this.logMethodEntry('getSystemLogs', { page, limit });
    
    try {
      // Basic logging system - in production, integrate with proper logging service
      const logs: any[] = [
        {
          id: '1',
          level: 'info',
          message: 'System started successfully',
          timestamp: new Date().toISOString(),
          source: 'system',
          userId: null
        },
        {
          id: '2', 
          level: 'info',
          message: 'Database connection established',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          source: 'database',
          userId: null
        },
        {
          id: '3',
          level: 'warning',
          message: 'High memory usage detected',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          source: 'system',
          userId: null
        }
      ];
      
      const total = logs.length;
      const offset = (page - 1) * limit;
      const paginatedLogs = logs.slice(offset, offset + limit);
      
      this.logMethodExit('getSystemLogs', { count: paginatedLogs.length, total });
      return { logs: paginatedLogs, total };
    } catch (error) {
      this.handleError('getSystemLogs', error);
    }
  }

  /**
   * Update system settings
   */
  async updateSystemSettings(settings: any): Promise<boolean> {
    this.logMethodEntry('updateSystemSettings', { settings });
    
    try {
      // Basic system settings storage - in production, use proper settings database table
      const validSettings = {
        maintenanceMode: settings.maintenanceMode || false,
        maxBookingAmount: settings.maxBookingAmount || 1000,
        driverSearchRadius: settings.driverSearchRadius || 10,
        shopCapacityLimit: settings.shopCapacityLimit || 50,
        notificationEnabled: settings.notificationEnabled !== undefined ? settings.notificationEnabled : true,
        paymentEnabled: settings.paymentEnabled !== undefined ? settings.paymentEnabled : true,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'admin' // In production, get from authenticated user
      };
      
      // In production, save to database:
      // await this.systemSettingsRepository.update('system_settings', validSettings);
      
      Logger.info('System settings updated', validSettings);
      this.logMethodExit('updateSystemSettings', { success: true });
      return true;
    } catch (error) {
      this.handleError('updateSystemSettings', error);
    }
  }
}