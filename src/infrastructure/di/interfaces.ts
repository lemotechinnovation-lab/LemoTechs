/**
 * Service Interfaces
 * Define contracts for all services to enable dependency injection
 */

import { UserProfile, CreateUserRequest, UpdateUserRequest } from '../../models/user/userModel';
import { CreateBookingRequest } from '../../models/booking/bookingModel';
import { CreateDriverRequest, UpdateDriverRequest } from '../../models/driver/driverModel';
import { CreateShopRequest, UpdateShopRequest } from '../../models/shop/shopModel';
import { CreateFileRequest } from '../../models/system/fileModel';

// User Service Interface
export interface IUserService {
  getUserByEmail(email: string): Promise<UserProfile | null>;
  getUserByEmailWithPassword(email: string): Promise<{ user: UserProfile | null, password?: string }>;
  getUserById(userId: string): Promise<UserProfile | null>;
  createUser(userData: CreateUserRequest): Promise<UserProfile | null>;
  updateUserProfile(userId: string, updates: UpdateUserRequest): Promise<UserProfile | null>;
  updateUserPassword(userId: string, newPassword: string): Promise<boolean>;
  storePhoneVerification(phone: string, code: string, expiresAt: Date): Promise<boolean>;
  verifyPhoneCode(phone: string, code: string): Promise<boolean>;
  getUserByPhone(phone: string): Promise<UserProfile | null>;
  updatePhoneVerificationStatus(userId: string, phoneVerified: boolean): Promise<boolean>;
  createPhoneUser(phone: string, name?: string): Promise<UserProfile | null>;
  cleanupVerificationCode(phone: string): Promise<boolean>;
}

// Booking Service Interface
export interface IBookingService {
  createBooking(bookingData: CreateBookingRequest): Promise<any>;
  updateUserTotalBookings(userId: string): Promise<boolean>;
  getDriverInfo(driverId: string): Promise<any>;
  getUserBookings(userId: string): Promise<any[]>;
  getBookingById(bookingId: string): Promise<any>;
  cancelBooking(bookingId: string): Promise<boolean>;
  getAvailableDrivers(): Promise<any[]>;
  getBookingForAutoAssignment(): Promise<any[]>;
  getBookingAssignmentStatus(bookingId: string): Promise<any>;
  getBookingForAssignment(bookingId: string): Promise<any>;
  listDriverBookings(driverId: string): Promise<any[]>;
  listAvailableJobs(): Promise<any[]>;
  assignJobToDriver(bookingId: string, driverId: string): Promise<boolean>;
  listShopBookings(shopId: string): Promise<any[]>;
  getBookingOwnedByShop(shopId: string, bookingId: string): Promise<any>;
  updateBookingStatus(bookingId: string, status: string): Promise<boolean>;
}

// Driver Service Interface
export interface IDriverService {
  getDriverIdByUserId(userId: string): Promise<string | null>;
  setDriverStatus(driverId: string, status: string): Promise<boolean>;
  getDriverProfileByUserId(userId: string): Promise<any>;
  createDriverProfileRecord(driverData: any): Promise<any>;
  updateDriverProfileByUserId(userId: string, updates: any): Promise<any>;
  updateDriverStatusByUserId(userId: string, status: string): Promise<boolean>;
  checkDriverProfileExists(userId: string): Promise<boolean>;
  updateUserRole(userId: string, role: string): Promise<boolean>;
}

// Shop Service Interface
export interface IShopService {
  getShopProfileByUserId(userId: string): Promise<any>;
  createShopProfileRecord(shopData: any): Promise<any>;
  updateShopProfileByUserId(userId: string, updates: any): Promise<any>;
  checkShopProfileExists(userId: string): Promise<boolean>;
  getShopAnalytics(shopId: string): Promise<any>;
  updateUserRole(userId: string, role: string): Promise<boolean>;
}

// File Service Interface
export interface IFileService {
  saveFile(fileData: CreateFileRequest): Promise<any>;
  getUserFiles(userId: string): Promise<any[]>;
  getFileById(fileId: string): Promise<any>;
  deleteFile(fileId: string): Promise<boolean>;
  updateUserAvatar(userId: string, avatarUrl: string): Promise<boolean>;
}

// Admin Service Interface
export interface IAdminService {
  getAllUsers(page: number, limit: number, filters?: any): Promise<any>;
  getUserById(userId: string): Promise<any>;
  updateUserStatus(userId: string, status: string): Promise<boolean>;
  getAllBookings(page: number, limit: number): Promise<any>;
  getAllDrivers(page: number, limit: number): Promise<any>;
  getAllShops(page: number, limit: number): Promise<any>;
  getSystemAnalytics(): Promise<any>;
  getSystemLogs(page: number, limit: number): Promise<any>;
  updateSystemSettings(settings: any): Promise<boolean>;
}

// Driver Assignment Service Interface
export interface IDriverAssignmentService {
  findBestDriver(request: any): Promise<any>;
  getAvailableDriversInRadiusPublic(lat: number, lng: number, radius: number): Promise<any>;
  updateDriverLocation(driverId: string, location: any): Promise<boolean>;
  handleDriverRejection(driverId: string, bookingId: string, reason: string): Promise<any>;
  getDriverStats(driverId: string): Promise<any>;
  batchAssignJobs(requests: any[]): Promise<any>;
  getAlternativeDrivers(bookingId: string, excludedDriverIds: string[]): Promise<any>;
}

// Booking State Service Interface
export interface IBookingStateService {
  saveBookingState(userId: string, sessionId: string, bookingData: any): Promise<string>;
  loadBookingState(userId: string, sessionId: string): Promise<any>;
  deleteBookingState(userId: string, sessionId: string): Promise<boolean>;
  transferSessionToUser(sessionId: string, userId: string): Promise<boolean>;
  recordBookingStep(bookingId: string, stepName: string, userId: string, stepData: any): Promise<boolean>;
}

// Driver Job Service Interface
export interface IDriverJobService {
  getJobs(userId: string, filters: any): Promise<any>;
  getJobById(userId: string, jobId: string): Promise<any>;
  acceptJob(userId: string, jobId: string): Promise<any>;
  updateJobStatus(userId: string, jobId: string, status: string, location?: any): Promise<any>;
  updateLocation(userId: string, location: any): Promise<boolean>;
  getOptimizedRoute(userId: string, jobIds: string[]): Promise<any>;
  getStats(userId: string, period: string): Promise<any>;
  completeJob(userId: string, jobId: string): Promise<any>;
  getAvailableJobs(userId: string, radius: number): Promise<any>;
}

// Shop Order Service Interface
export interface IShopOrderService {
  getOrders(userId: string, filters: any): Promise<any>;
  getOrderById(userId: string, orderId: string): Promise<any>;
  updateOrderStatus(userId: string, orderId: string, status: string, notes?: string): Promise<any>;
  getInventory(userId: string): Promise<any>;
  updateInventoryItem(userId: string, itemId: string, quantity: number): Promise<any>;
  getAnalytics(userId: string, period: string): Promise<any>;
}

// Hybrid Auth Service Interface
export interface IHybridAuthService {
  verifyFirebaseToken(firebaseToken: string): Promise<any>;
  createUserFromPhoneVerification(phoneNumber: string, firebaseToken: string): Promise<any>;
  sendPhoneVerificationCode(phoneNumber: string): Promise<boolean>;
}

// Cleaning Workflow Service Interface
export interface ICleaningWorkflowService {
  createCleaningItemsFromBooking(bookingId: string, items: any[]): Promise<any>;
  assessItem(itemId: string, assessorId: string, assessment: any): Promise<any>;
  startCleaning(itemId: string, cleanerId: string, method: string): Promise<any>;
  updateCleaningProgress(update: any): Promise<any>;
  performQualityCheck(itemId: string, checkerId: string, check: any): Promise<any>;
  getItemsByStatus(status: string, shopId?: string): Promise<any>;
  getWorkflowStats(shopId: string): Promise<any>;
}

// Shop Queue Service Interface
export interface IShopQueueService {
  addToQueue(shopId: string, bookingId: string, cleaningItemId: string, priority: string, estimatedDuration: number, assignedTo?: string, notes?: string, specialInstructions?: string): Promise<any>;
  updateQueueItemStatus(shopId: string, queueItemId: string, status: string, actualDuration?: number, notes?: string): Promise<any>;
  getQueueStatus(shopId: string): Promise<any>;
  getQueueAnalytics(shopId: string, period?: 'day' | 'week' | 'month'): Promise<any>;
  getQueueOptimization(shopId: string): Promise<any>;
  assignStaffToItem(shopId: string, queueItemId: string, staffId: string): Promise<any>;
  completeQueueItem(shopId: string, queueItemId: string, actualDuration: number, notes?: string): Promise<any>;
  getStaffWorkload(shopId: string, staffId?: string): Promise<any>;
  getQueueHistory(shopId: string, startDate: Date, endDate: Date): Promise<any>;
  optimizeQueue(shopId: string): Promise<any>;
}

// Route Optimization Service Interface
export interface IRouteOptimizationService {
  optimizeRoute(request: any): Promise<any>;
  createMultiStopJob(driverId: string, stops: any[], constraints: any): Promise<any>;
  getRealTimeRouteUpdates(routeId: string): Promise<any>;
  calculateETA(routeId: string, currentLocation: any): Promise<Date>;
  getRouteAnalytics(routeId: string, period?: 'day' | 'week' | 'month'): Promise<any>;
  getOptimizationMetrics(driverId?: string): Promise<any>;
}

// Shop Inventory Tracking Service Interface
export interface IShopInventoryTrackingService {
  addInventoryItem(shopId: string, itemData: any, performedBy: string): Promise<any>;
  updateInventoryQuantity(shopId: string, itemId: string, newQuantity: number, reason: string, performedBy: string, referenceId?: string): Promise<any>;
  getInventoryDashboard(shopId: string): Promise<any>;
  generateInventoryReport(shopId: string, period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<any>;
  getInventoryOptimization(shopId: string): Promise<any>;
  inventoryRepository: any;
}

// PayFast Service Interface
export interface IPayFastService {
  createPaymentRequest(paymentData: any): Promise<any>;
  verifyITN(itnData: any): Promise<any>;
  getPaymentStatus(transactionId: string): Promise<any>;
  processRefund(transactionId: string, amount: number, reason: string): Promise<any>;
  getPaymentHistory(userId: string, filters: any): Promise<any>;
  getPaymentStatistics(userId: string, options: any): Promise<any>;
}

// Shop Management Service Interface
export interface IShopManagementService {
  getLiveOrderQueue(shopUserId: string, filters: any): Promise<any[]>;
  getOrderProcessingStatus(shopUserId: string, orderId: string): Promise<any>;
  updateOrderPriority(shopUserId: string, orderId: string, update: any): Promise<any>;
  getOrderHistory(shopUserId: string, filters: any): Promise<any[]>;
  searchOrders(shopUserId: string, query: string): Promise<any[]>;
  confirmItemReceipt(shopUserId: string, orderId: string, receiptData: any): Promise<any>;
  assessItemCondition(shopUserId: string, itemId: string, assessment: any): Promise<any>;
  selectCleaningMethod(shopUserId: string, itemId: string, method: string): Promise<any>;
  updateCleaningProgress(shopUserId: string, itemId: string, progressData: any): Promise<any>;
  performQualityControl(shopUserId: string, itemId: string, qualityData: any): Promise<any>;
  confirmItemPackaging(shopUserId: string, itemId: string, packagingData: any): Promise<any>;
  getStaffDashboard(shopUserId: string): Promise<any>;
  assignStaffToJob(shopUserId: string, jobId: string, assignment: any): Promise<any>;
  getWorkloadDistribution(shopUserId: string): Promise<any>;
  getStaffPerformance(shopUserId: string, filters: any): Promise<any>;
  getSupplyTracking(shopUserId: string): Promise<any>;
  updateSupplyLevels(shopUserId: string, supplies: any[]): Promise<any>;
  getLowStockAlerts(shopUserId: string): Promise<any[]>;
  sendCustomerStatusUpdate(shopUserId: string, orderId: string, update: any): Promise<any>;
  getCustomerMessages(shopUserId: string, orderId: string): Promise<any>;
  sendMessageToCustomer(shopUserId: string, orderId: string, message: any): Promise<any>;
  getDailyEarnings(shopUserId: string, date: Date): Promise<any>;
  getCommissionTracking(shopUserId: string, filters: any): Promise<any>;
  getExpenseTracking(shopUserId: string, filters: any): Promise<any>;
  getPerformanceMetrics(shopUserId: string, filters: any): Promise<any>;
  getCustomerSatisfaction(shopUserId: string, filters: any): Promise<any>;
  getPeakHoursAnalysis(shopUserId: string, filters: any): Promise<any>;
  updateOperatingHours(shopUserId: string, operatingHours: any): Promise<any>;
  updateServiceOfferings(shopUserId: string, services: any): Promise<any>;
  updateCapacityManagement(shopUserId: string, capacity: any): Promise<any>;
  getNotificationSettings(shopUserId: string): Promise<any>;
  updateNotificationSettings(shopUserId: string, settings: any): Promise<any>;
  getQualityChecklist(shopUserId: string, itemType: string): Promise<any>;
  getCustomerFeedback(shopUserId: string, filters: any): Promise<any[]>;
  respondToCustomerFeedback(shopUserId: string, feedbackId: string, response: any): Promise<any>;
}