/**
 * Example: Testing with Dependency Injection
 * Shows how DI makes unit testing much easier
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { ServiceFactory } from '../../infrastructure/di/serviceFactory';
import { IUserService, IBookingService } from '../../infrastructure/di/interfaces';
import { UserProfile } from '../../models/userModel';

// Mock implementations for testing
class MockUserService implements IUserService {
  private users: Map<string, UserProfile> = new Map();

  async getUserByEmail(email: string): Promise<UserProfile | null> {
    return this.users.get(email) || null;
  }

  async getUserByEmailWithPassword(email: string): Promise<{ user: UserProfile | null, password?: string }> {
    const user = this.users.get(email);
    return { user, password: user ? 'hashed_password' : undefined };
  }

  async getUserById(userId: string): Promise<UserProfile | null> {
    for (const user of this.users.values()) {
      if (user.id === userId) return user;
    }
    return null;
  }

  async createUser(userData: any): Promise<UserProfile | null> {
    const user: UserProfile = {
      id: 'test-id',
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      avatar: userData.avatar,
      emailVerified: false,
      phoneVerified: false,
      role: userData.role || 'user',
      loyaltyPoints: 0,
      totalBookings: 0,
      memberSince: new Date()
    };
    this.users.set(userData.email, user);
    return user;
  }

  async updateUserProfile(userId: string, updates: any): Promise<UserProfile | null> {
    const user = await this.getUserById(userId);
    if (!user) return null;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(user.email, updatedUser);
    return updatedUser;
  }

  async updateUserPassword(userId: string, newPassword: string): Promise<boolean> {
    return true;
  }

  async storePhoneVerification(phone: string, code: string, expiresAt: Date): Promise<boolean> {
    return true;
  }

  async verifyPhoneCode(phone: string, code: string): Promise<boolean> {
    return code === '123456';
  }

  async getUserByPhone(phone: string): Promise<UserProfile | null> {
    for (const user of this.users.values()) {
      if (user.phone === phone) return user;
    }
    return null;
  }

  async updatePhoneVerificationStatus(userId: string, phoneVerified: boolean): Promise<boolean> {
    return true;
  }

  async createPhoneUser(phone: string, name?: string): Promise<UserProfile | null> {
    const user: UserProfile = {
      id: 'phone-user-id',
      name: name || 'Phone User',
      email: `${phone}@phone.user`,
      phone,
      address: '',
      avatar: '',
      emailVerified: false,
      phoneVerified: true,
      role: 'user',
      loyaltyPoints: 0,
      totalBookings: 0,
      memberSince: new Date()
    };
    this.users.set(user.email, user);
    return user;
  }

  async cleanupVerificationCode(phone: string): Promise<boolean> {
    return true;
  }
}

class MockBookingService implements IBookingService {
  async createBooking(bookingData: any): Promise<any> {
    return { id: 'booking-id', ...bookingData };
  }

  async updateUserTotalBookings(userId: string): Promise<boolean> {
    return true;
  }

  async getDriverInfo(driverId: string): Promise<any> {
    return { id: driverId, name: 'Test Driver' };
  }

  async getUserBookings(userId: string): Promise<any[]> {
    return [];
  }

  async getBookingById(bookingId: string): Promise<any> {
    return { id: bookingId, status: 'pending' };
  }

  async cancelBooking(bookingId: string): Promise<boolean> {
    return true;
  }

  async getAvailableDrivers(): Promise<any[]> {
    return [];
  }

  async getBookingForAutoAssignment(): Promise<any[]> {
    return [];
  }

  async getBookingAssignmentStatus(bookingId: string): Promise<any> {
    return { id: bookingId, status: 'pending' };
  }

  async getBookingForAssignment(bookingId: string): Promise<any> {
    return { id: bookingId, status: 'pending' };
  }

  async listDriverBookings(driverId: string): Promise<any[]> {
    return [];
  }

  async listAvailableJobs(): Promise<any[]> {
    return [];
  }

  async assignJobToDriver(bookingId: string, driverId: string): Promise<boolean> {
    return true;
  }

  async listShopBookings(shopId: string): Promise<any[]> {
    return [];
  }

  async getBookingOwnedByShop(shopId: string, bookingId: string): Promise<any> {
    return { id: bookingId, shopId };
  }

  async updateBookingStatus(bookingId: string, status: any): Promise<boolean> {
    return true;
  }
}

describe('Dependency Injection Testing', () => {
  beforeEach(() => {
    // Clear the container before each test
    ServiceFactory.clear();
    
    // Register mock services
    ServiceFactory.registerSingleton(IUserService, new MockUserService());
    ServiceFactory.registerSingleton(IBookingService, new MockBookingService());
  });

  afterEach(() => {
    // Clean up after each test
    ServiceFactory.clear();
  });

  describe('UserService', () => {
    it('should create a user successfully', async () => {
      const userService = ServiceFactory.getService(IUserService);
      
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '+1234567890',
        address: '123 Test St',
        role: 'user'
      };

      const user = await userService.createUser(userData);
      
      expect(user).toBeDefined();
      expect(user?.name).toBe('Test User');
      expect(user?.email).toBe('test@example.com');
      expect(user?.phone).toBe('+1234567890');
    });

    it('should retrieve user by email', async () => {
      const userService = ServiceFactory.getService(IUserService);
      
      // First create a user
      await userService.createUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '+1234567890',
        address: '123 Test St',
        role: 'user'
      });

      // Then retrieve it
      const user = await userService.getUserByEmail('test@example.com');
      
      expect(user).toBeDefined();
      expect(user?.email).toBe('test@example.com');
    });

    it('should update user profile', async () => {
      const userService = ServiceFactory.getService(IUserService);
      
      // Create a user first
      const user = await userService.createUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '+1234567890',
        address: '123 Test St',
        role: 'user'
      });

      // Update the profile
      const updatedUser = await userService.updateUserProfile(user!.id, {
        name: 'Updated Name',
        address: '456 New St'
      });

      expect(updatedUser).toBeDefined();
      expect(updatedUser?.name).toBe('Updated Name');
      expect(updatedUser?.address).toBe('456 New St');
    });
  });

  describe('Service Integration', () => {
    it('should work with multiple services', async () => {
      const userService = ServiceFactory.getService(IUserService);
      const bookingService = ServiceFactory.getService(IBookingService);

      // Create a user
      const user = await userService.createUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '+1234567890',
        address: '123 Test St',
        role: 'user'
      });

      // Create a booking for the user
      const booking = await bookingService.createBooking({
        userId: user!.id,
        pickupLocation: '123 Test St',
        items: ['item1', 'item2'],
        amount: 50.00
      });

      expect(user).toBeDefined();
      expect(booking).toBeDefined();
      expect(booking.userId).toBe(user!.id);
    });
  });

  describe('Mock Service Behavior', () => {
    it('should verify phone code correctly', async () => {
      const userService = ServiceFactory.getService(IUserService);
      
      const isValid = await userService.verifyPhoneCode('+1234567890', '123456');
      const isInvalid = await userService.verifyPhoneCode('+1234567890', 'wrong');

      expect(isValid).toBe(true);
      expect(isInvalid).toBe(false);
    });
  });
});

/**
 * Example of testing a controller with DI
 */
describe('Controller Testing with DI', () => {
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: any;

  beforeEach(() => {
    ServiceFactory.clear();
    ServiceFactory.registerSingleton(IUserService, new MockUserService());
    ServiceFactory.registerSingleton(IBookingService, new MockBookingService());

    mockRequest = {
      body: {},
      user: { userId: 'test-user-id' },
      services: {
        userService: ServiceFactory.getService(IUserService),
        bookingService: ServiceFactory.getService(IBookingService)
      }
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockNext = jest.fn();
  });

  it('should handle user registration', async () => {
    mockRequest.body = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '+1234567890',
      address: '123 Test St'
    };

    // Simulate the controller logic
    const { userService } = mockRequest.services;
    const user = await userService.createUser(mockRequest.body);

    expect(user).toBeDefined();
    expect(user?.email).toBe('test@example.com');
  });
});
