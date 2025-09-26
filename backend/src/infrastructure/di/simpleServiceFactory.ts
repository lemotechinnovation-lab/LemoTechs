/**
 * Simplified Service Factory
 * Creates service instances with proper dependency injection using string identifiers
 */

import { container } from './container';

// Import concrete service implementations
import { UserService } from '../../services/user/userService';
import { BookingService } from '../../services/booking/bookingService';
import { DriverService } from '../../services/driver/driverService';
import { ShopService } from '../../services/shop/shopService';
import { FileService } from '../../services/system/fileService';
import { AdminService } from '../../services/user/adminService';
import { DriverAssignmentService } from '../../services/driver/driverAssignmentService';
import { BookingStateService } from '../../services/booking/bookingStateService';
import { DriverJobService } from '../../services/driver/driverJobService';
import { ShopOrderService } from '../../services/shop/shopOrderService';
import { HybridAuthService } from '../../services/system/hybridAuthService';
import { CleaningWorkflowService } from '../../services/cleaning/cleaningWorkflowService';
import { ShopQueueService } from '../../services/shop/shopQueueService';
import { ShopInventoryTrackingService } from '../../services/shop/shopInventoryTrackingService';
import { RouteOptimizationService } from '../../services/driver/routeOptimizationService';
import { ShopManagementService } from '../../services/shop/shopManagementService';
import { PayFastService } from '../../services/payment/payfastService';

// Import repositories
import { UserRepository } from '../../repositories/user/UserRepository';
import { BookingRepository } from '../../repositories/booking/BookingRepository';
import { DriverRepository } from '../../repositories/driver/DriverRepository';
import { ShopRepository } from '../../repositories/shop/ShopRepository';
import { FileRepository } from '../../repositories/system/FileRepository';
import { PhoneVerificationRepository } from '../../repositories/system/PhoneVerificationRepository';
import { DriverLocationRepository } from '../../repositories/driver/DriverLocationRepository';
import { DriverJobRepository } from '../../repositories/driver/DriverJobRepository';
import { ShopOrderRepository } from '../../repositories/shop/ShopOrderRepository';
import { ShopInventoryRepository } from '../../repositories/shop/ShopInventoryRepository';
import { PaymentTransactionRepository } from '../../repositories/payment/PaymentTransactionRepository';
import { BookingStepRepository } from '../../repositories/booking/BookingStepRepository';
import { BookingHistoryRepository } from '../../repositories/booking/BookingHistoryRepository';
import { InProgressBookingRepository } from '../../repositories/booking/InProgressBookingRepository';
import { CleaningItemRepository } from '../../repositories/cleaning/CleaningItemRepository';
import { ShopQueueRepository } from '../../repositories/shop/ShopQueueRepository';
import { ShopInventoryTrackingRepository } from '../../repositories/shop/ShopInventoryTrackingRepository';

// Import infrastructure services
import { getClient } from '../database';
import { SignalRService } from '../common/signalRService';
import { FirebaseAdminService } from '../common/firebaseAdmin';

// Service instances cache
const serviceInstances = new Map<string, any>();

export class SimpleServiceFactory {
  /**
   * Initialize all services with their dependencies
   */
  static async initialize(): Promise<void> {
    // Get database client
    const dbClient = await getClient();

    // Create repository instances
    const userRepository = new UserRepository(dbClient);
    const bookingRepository = new BookingRepository(dbClient);
    const driverRepository = new DriverRepository(dbClient);
    const shopRepository = new ShopRepository(dbClient);
    const fileRepository = new FileRepository(dbClient);
    const phoneVerificationRepository = new PhoneVerificationRepository(dbClient);
    const driverLocationRepository = new DriverLocationRepository(dbClient);
    const driverJobRepository = new DriverJobRepository(dbClient);
    const shopOrderRepository = new ShopOrderRepository(dbClient);
    const shopInventoryRepository = new ShopInventoryRepository(dbClient);
    const paymentTransactionRepository = new PaymentTransactionRepository(dbClient);
    const bookingStepRepository = new BookingStepRepository(dbClient);
    const bookingHistoryRepository = new BookingHistoryRepository(dbClient);
    const inProgressBookingRepository = new InProgressBookingRepository(dbClient);
    const cleaningItemRepository = new CleaningItemRepository(dbClient);
    const shopQueueRepository = new ShopQueueRepository(dbClient);

    // Create infrastructure service instances
    const signalRService = SignalRService.getInstance();
    const firebaseAdminService = new FirebaseAdminService();

    // Register repositories as singletons
    container.registerSingleton(UserRepository, userRepository);
    container.registerSingleton(BookingRepository, bookingRepository);
    container.registerSingleton(DriverRepository, driverRepository);
    container.registerSingleton(ShopRepository, shopRepository);
    container.registerSingleton(FileRepository, fileRepository);
    container.registerSingleton(PhoneVerificationRepository, phoneVerificationRepository);
    container.registerSingleton(DriverLocationRepository, driverLocationRepository);
    container.registerSingleton(DriverJobRepository, driverJobRepository);
    container.registerSingleton(ShopOrderRepository, shopOrderRepository);
    container.registerSingleton(ShopInventoryRepository, shopInventoryRepository);
    container.registerSingleton(PaymentTransactionRepository, paymentTransactionRepository);
    container.registerSingleton(BookingStepRepository, bookingStepRepository);
    container.registerSingleton(BookingHistoryRepository, bookingHistoryRepository);
    container.registerSingleton(InProgressBookingRepository, inProgressBookingRepository);
    container.registerSingleton(CleaningItemRepository, cleaningItemRepository);

    container.registerSingleton(ShopQueueRepository, shopQueueRepository);

    const shopInventoryTrackingRepository = new ShopInventoryTrackingRepository(dbClient);
    container.registerSingleton(ShopInventoryTrackingRepository, shopInventoryTrackingRepository);

    // Register infrastructure services as singletons
    container.registerSingleton(FirebaseAdminService, firebaseAdminService);

    // Create and cache business service instances
    const userService = new UserService(
      container.resolve(UserRepository),
      container.resolve(PhoneVerificationRepository)
    );
    serviceInstances.set('userService', userService);

    const bookingService = new BookingService(
      container.resolve(BookingRepository),
      container.resolve(UserRepository),
      container.resolve(DriverRepository)
    );
    serviceInstances.set('bookingService', bookingService);

    const driverService = new DriverService(
      container.resolve(DriverRepository),
      container.resolve(UserRepository)
    );
    serviceInstances.set('driverService', driverService);

    const shopService = new ShopService(
      container.resolve(ShopRepository),
      container.resolve(UserRepository)
    );
    serviceInstances.set('shopService', shopService);

    const fileService = new FileService(
      container.resolve(FileRepository),
      container.resolve(UserRepository)
    );
    serviceInstances.set('fileService', fileService);

    const adminService = new AdminService(
      container.resolve(UserRepository),
      container.resolve(BookingRepository),
      container.resolve(DriverRepository),
      container.resolve(ShopRepository)
    );
    serviceInstances.set('adminService', adminService);

    const driverAssignmentService = new DriverAssignmentService(
      container.resolve(DriverRepository),
      container.resolve(DriverLocationRepository),
      container.resolve(DriverJobRepository),
      container.resolve(BookingRepository)
    );
    serviceInstances.set('driverAssignmentService', driverAssignmentService);

    const bookingStateService = new BookingStateService(
      container.resolve(InProgressBookingRepository),
      container.resolve(BookingStepRepository),
      container.resolve(BookingHistoryRepository),
      signalRService
    );
    serviceInstances.set('bookingStateService', bookingStateService);

    const driverJobService = new DriverJobService(
      container.resolve(DriverJobRepository),
      container.resolve(DriverRepository),
      container.resolve(DriverLocationRepository)
    );
    serviceInstances.set('driverJobService', driverJobService);

    const shopOrderService = new ShopOrderService(
      container.resolve(ShopOrderRepository),
      container.resolve(ShopRepository),
      container.resolve(ShopInventoryRepository)
    );
    serviceInstances.set('shopOrderService', shopOrderService);

    const hybridAuthService = new HybridAuthService(
      container.resolve(UserRepository),
      container.resolve(PhoneVerificationRepository),
      container.resolve(FirebaseAdminService),
      signalRService // Using SignalRService as placeholder for SMS service
    );
    serviceInstances.set('hybridAuthService', hybridAuthService);

    const cleaningWorkflowService = new CleaningWorkflowService(dbClient);
    serviceInstances.set('cleaningWorkflowService', cleaningWorkflowService);

    const shopQueueService = new ShopQueueService(dbClient);
    serviceInstances.set('shopQueueService', shopQueueService);

    const shopInventoryTrackingService = new ShopInventoryTrackingService(dbClient);
    serviceInstances.set('shopInventoryTrackingService', shopInventoryTrackingService);

    const routeOptimizationService = new RouteOptimizationService(dbClient);
    serviceInstances.set('routeOptimizationService', routeOptimizationService);

    const shopManagementService = new ShopManagementService(
      container.resolve(ShopRepository),
      container.resolve(BookingRepository),
      container.resolve(CleaningItemRepository),
      container.resolve(ShopInventoryRepository),
      container.resolve(PaymentTransactionRepository),
      container.resolve(ShopQueueRepository)
    );
    serviceInstances.set('shopManagementService', shopManagementService);

    const payfastService = new PayFastService(
      container.resolve(PaymentTransactionRepository),
      container.resolve(BookingRepository)
    );
    serviceInstances.set('payfastService', payfastService);
  }

  /**
   * Get a service instance by name
   */
  static getService<T>(serviceName: string): T {
    const service = serviceInstances.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found. Make sure to call initialize() first.`);
    }
    return service as T;
  }

  /**
   * Clear all services (useful for testing)
   */
  static clear(): void {
    serviceInstances.clear();
    container.clear();
  }
}
