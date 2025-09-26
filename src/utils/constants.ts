/**
 * Common constants used across the application
 */

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
} as const;

// User Roles
export const USER_ROLES = {
  USER: 'user',
  DRIVER: 'driver',
  SHOP: 'shop',
  ADMIN: 'admin',
  BUSINESS: 'business'
} as const;

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending'
} as const;

// Driver Status
export const DRIVER_STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  OFFLINE: 'offline',
  ON_BREAK: 'on_break'
} as const;

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ASSIGNED: 'assigned',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  AT_SHOP: 'at_shop',
  CLEANING: 'cleaning',
  READY_FOR_DELIVERY: 'ready_for_delivery',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
} as const;

// Booking Priority
export const BOOKING_PRIORITY = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;

// Customer Tiers
export const CUSTOMER_TIER = {
  REGULAR: 'regular',
  PREMIUM: 'premium',
  VIP: 'vip'
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  WALLET: 'wallet'
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
} as const;

// Shop Order Status
export const SHOP_ORDER_STATUS = {
  PENDING: 'pending',
  RECEIVED: 'received',
  IN_PROGRESS: 'in_progress',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

// Vehicle Types
export const VEHICLE_TYPES = {
  CAR: 'car',
  MOTORCYCLE: 'motorcycle',
  BICYCLE: 'bicycle'
} as const;

// File Types
export const FILE_TYPES = {
  IMAGE: 'image',
  DOCUMENT: 'document',
  AUDIO: 'audio',
  VIDEO: 'video'
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  BOOKING_CREATED: 'booking_created',
  BOOKING_ASSIGNED: 'booking_assigned',
  BOOKING_PICKED_UP: 'booking_picked_up',
  BOOKING_DELIVERED: 'booking_delivered',
  BOOKING_CANCELLED: 'booking_cancelled',
  PAYMENT_RECEIVED: 'payment_received',
  DRIVER_ASSIGNED: 'driver_assigned',
  SHOP_NOTIFICATION: 'shop_notification'
} as const;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
} as const;

// Time Constants (in milliseconds)
export const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000
} as const;

// Distance Constants (in meters)
export const DISTANCE_CONSTANTS = {
  METER: 1,
  KILOMETER: 1000,
  MILE: 1609.34
} as const;

// Default Values
export const DEFAULTS = {
  DRIVER_RADIUS_KM: 10,
  MAX_DRIVERS_TO_CONSIDER: 20,
  ESTIMATED_PICKUP_TIME_MINUTES: 30,
  ESTIMATED_DELIVERY_TIME_HOURS: 4,
  DRIVER_TIMEOUT_MINUTES: 15,
  BOOKING_TIMEOUT_MINUTES: 30
} as const;

// Driver Assignment Constants
export const DRIVER_ASSIGNMENT = {
  SCORING_WEIGHTS: {
    DISTANCE: 0.4,        // Distance to pickup location
    RATING: 0.2,          // Driver rating
    RESPONSE_TIME: 0.15,   // How quickly driver responds
    LOAD_BALANCE: 0.15,   // Current driver workload
    PRIORITY_BONUS: 0.1   // Priority customer bonus
  },
  MAX_SEARCH_RADIUS_KM: 50,
  MAX_DRIVERS_TO_CONSIDER: 20
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Resource not found',
  CONFLICT: 'Resource already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_TOKEN: 'Invalid token',
  USER_NOT_FOUND: 'User not found',
  DRIVER_NOT_FOUND: 'Driver not found',
  SHOP_NOT_FOUND: 'Shop not found',
  BOOKING_NOT_FOUND: 'Booking not found',
  NO_DRIVERS_AVAILABLE: 'No drivers available',
  BOOKING_CANNOT_BE_CANCELLED: 'Booking cannot be cancelled at this stage'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  USER_LOGGED_IN: 'Login successful',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  BOOKING_CREATED: 'Booking created successfully',
  BOOKING_CANCELLED: 'Booking cancelled successfully',
  DRIVER_ASSIGNED: 'Driver assigned successfully',
  LOCATION_UPDATED: 'Location updated successfully',
  FILE_UPLOADED: 'File uploaded successfully',
  FILE_DELETED: 'File deleted successfully'
} as const;

// API Response Messages
export const API_MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  FAILED: 'Operation failed',
  PENDING: 'Operation is pending',
  PROCESSING: 'Operation is being processed'
} as const;

// Database Constraints
export const DB_CONSTRAINTS = {
  MAX_STRING_LENGTH: 255,
  MAX_TEXT_LENGTH: 1000,
  MAX_LONG_TEXT_LENGTH: 10000,
  MAX_ARRAY_LENGTH: 100
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  LOGIN_ATTEMPTS: 5,
  LOGIN_WINDOW_MINUTES: 15,
  API_REQUESTS_PER_MINUTE: 100,
  FILE_UPLOADS_PER_HOUR: 10
} as const;

// Cache Keys
export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  DRIVER_LOCATION: 'driver_location',
  AVAILABLE_DRIVERS: 'available_drivers',
  BOOKING_STATUS: 'booking_status',
  SHOP_ANALYTICS: 'shop_analytics'
} as const;

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 900, // 15 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400 // 24 hours
} as const;
