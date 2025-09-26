// LemoTech Database Schema Definitions
// This file contains all entity interfaces matching the PostgreSQL database schema exactly

// Base Entity Interface
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// User Entity
export interface User extends BaseEntity {
  firebaseUid?: string;
  email: string;
  password?: string;
  name: string;
  phone?: string;
  address?: string;
  avatar?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  provider: string;
  role: 'user' | 'driver' | 'shop' | 'admin';
  loyaltyPoints: number;
  totalBookings: number;
  isActive: boolean;
  memberSince: Date;
}

// Driver Entity
export interface Driver extends BaseEntity {
  userId: string;
  vehicle: string;
  licenseNumber: string;
  licenseExpiry?: Date;
  vehicleRegistration?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  rating: number;
  totalJobs: number;
  totalEarnings: number;
  isActive: boolean;
  isVerified: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  status: 'offline' | 'available' | 'busy';
  lastActive?: Date;
}

// Shop Entity
export interface Shop extends BaseEntity {
  userId: string;
  name: string;
  description?: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  phone?: string;
  email?: string;
  operatingHours?: Record<string, any>;
  services?: Record<string, any>;
  rating: number;
  totalBookings: number;
  totalRevenue: number;
  isActive: boolean;
  isVerified: boolean;
  capacity: number;
  currentLoad: number;
}

// Booking Entity
export interface Booking extends BaseEntity {
  userId: string;
  pickupLocation: string;
  pickupCoords?: {
    lat: number;
    lng: number;
  };
  items: string[];
  driverId?: string;
  shopId?: string;
  status: 'pending' | 'confirmed' | 'pickup' | 'cleaning' | 'delivery' | 'completed' | 'cancelled';
  paymentMethod: 'card' | 'cash' | 'mobile';
  paymentId?: string;
  amount: number;
  contactPhone: string;
  specialInstructions?: string;
  estimatedPickupTime?: Date;
  estimatedDeliveryTime?: Date;
  actualPickupTime?: Date;
  actualDeliveryTime?: Date;
  cleaningStartedAt?: Date;
  cleaningCompletedAt?: Date;
}

// Payment Transaction Entity
export interface PaymentTransaction extends BaseEntity {
  userId: string;
  bookingId?: string;
  paymentMethodId?: string;
  stripePaymentIntentId?: string;
  payfastPaymentId?: string;
  amount: number; // Amount in cents
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled' | 'refunded';
  description?: string;
  metadata?: Record<string, any>;
}

// Payment Method Entity
export interface PaymentMethod extends BaseEntity {
  userId: string;
  stripePaymentMethodId?: string;
  type: 'card' | 'bank_account' | 'digital_wallet';
  provider: 'stripe' | 'paypal' | 'yoco' | 'payfast' | 'ozow' | 'snapscan';
  displayName: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  metadata?: Record<string, any>;
}

// Service Item Entity
export interface ServiceItem extends BaseEntity {
  name: string;
  category: string;
  basePrice: number;
  description?: string;
  estimatedTime?: number; // in minutes
  icon?: string;
  isActive: boolean;
}

// File Entity
export interface File extends BaseEntity {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  userId: string;
}

// Phone Verification Entity
export interface PhoneVerification extends BaseEntity {
  phoneNumber: string;
  verificationCode: string;
  expiresAt: Date;
}

// Booking Step Entity
export interface BookingStep extends BaseEntity {
  stepName: string;
  stepOrder: number;
  description?: string;
}

// Booking History Entity
export interface BookingHistory extends BaseEntity {
  bookingId: string;
  stepId: string;
  userId: string;
  stepData?: Record<string, any>;
  completedAt: Date;
}

// In Progress Booking Entity
export interface InProgressBooking extends BaseEntity {
  userId: string;
  sessionId?: string;
  currentStep: string;
  bookingData: Record<string, any>;
  expiresAt: Date;
}

// Driver Job Entity
export interface DriverJob extends BaseEntity {
  driverId: string;
  bookingId: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
}

// Driver Location Entity
export interface DriverLocation extends BaseEntity {
  driverId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: Date;
}

// Payment Refund Entity
export interface PaymentRefund extends BaseEntity {
  transactionId: string;
  stripeRefundId: string;
  amount: number;
  reason?: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  description?: string;
  metadata?: Record<string, any>;
}

// Shop Inventory Entity
export interface ShopInventory extends BaseEntity {
  shopId: string;
  itemName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  description?: string;
  isActive: boolean;
}

// Shop Order Entity
export interface ShopOrder extends BaseEntity {
  shopId: string;
  bookingId: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: Record<string, any>;
  totalAmount: number;
  notes?: string;
}

// Cleaning Item Entity
export interface CleaningItem extends BaseEntity {
  bookingId: string;
  name: string;
  type: 'clothing' | 'shoes' | 'accessories' | 'furniture';
  condition: 'good' | 'fair' | 'poor' | 'damaged';
  cleaningMethod: 'dry_clean' | 'wash' | 'hand_wash' | 'specialty';
  photos: string[];
  notes?: string;
  estimatedTime: number;
  actualTime?: number;
  status: 'received' | 'assessed' | 'cleaning' | 'completed' | 'ready';
}

// Shop Queue Entity
export interface ShopQueue extends BaseEntity {
  shopId: string;
  bookingId: string;
  cleaningItemId: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'queued' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  estimatedDuration: number; // in minutes
  actualDuration?: number; // in minutes
  assignedTo?: string; // staff member ID
  queuedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
  specialInstructions?: string;
}

// Shop Inventory Tracking Entity
export interface ShopInventoryTracking extends BaseEntity {
  shopId: string;
  itemName: string;
  category: 'cleaning_supplies' | 'equipment' | 'consumables' | 'tools' | 'safety' | 'packaging';
  subcategory?: string;
  sku?: string;
  barcode?: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  unitPrice: number;
  costPrice: number;
  description?: string;
  specifications?: Record<string, any>;
  supplier?: string;
  supplierContact?: string;
  lastRestocked?: Date;
  expiryDate?: Date;
  isActive: boolean;
  isTrackable: boolean;
  location?: string;
  condition: 'new' | 'good' | 'fair' | 'poor' | 'damaged';
  notes?: string;
}

// Shop Capacity Planning Entity
export interface ShopCapacityPlanning extends BaseEntity {
  shopId: string;
  planType: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  startDate: Date;
  endDate: Date;
  maxConcurrentJobs: number;
  maxDailyJobs: number;
  maxWeeklyJobs: number;
  processingCapacity: number;
  storageCapacity: number;
  staffCount: number;
  equipmentCount: number;
  workstationCount: number;
  vehicleCapacity: number;
  operatingHoursStart: string;
  operatingHoursEnd: string;
  operatingDays: string[]; // Array of days
  breakDuration: number;
  breakFrequency: number;
  maintenanceWindows: string[]; // Array
  currentUtilization: number;
  peakUtilization: number;
  averageUtilization: number;
  efficiency: number;
  expectedDemand: number;
  capacityGap: number;
  recommendedActions: string[]; // Array
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'active' | 'archived';
}

// Additional Cleaning Workflow Entities
export interface ItemPhoto extends BaseEntity {
  itemId: string;
  url: string;
  type: 'before' | 'during' | 'after' | 'damage' | 'special_instruction';
  description?: string;
  uploadedBy: string;
}

export interface CleaningProgress extends BaseEntity {
  itemId: string;
  step: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
  photos?: Record<string, any>; // JSONB field for photos array
  qualityCheck?: Record<string, any>; // JSONB field for quality check data
}

export interface QualityCheck extends BaseEntity {
  itemId: string;
  checkedBy: string;
  checkedAt: Date;
  passed: boolean;
  issues: Record<string, any>; // JSONB field for issues array
  notes?: string;
  photos?: Record<string, any>; // JSONB field for photos array
}

export interface ItemAssessment extends BaseEntity {
  itemId: string;
  assessedBy: string;
  assessedAt: Date;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
  cleaningMethod: string;
  estimatedTime: number;
  specialRequirements: Record<string, any>; // JSONB field for requirements array
  riskFactors: Record<string, any>; // JSONB field for risk factors array
  notes: string;
  photos: Record<string, any>; // JSONB field for photos array
}

export interface CleaningWorkflow extends BaseEntity {
  itemId: string;
  currentStep: string;
  steps: Record<string, any>; // JSONB field for steps array
  status: 'not_started' | 'in_progress' | 'completed' | 'paused' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  totalEstimatedTime: number;
  actualTime?: number;
  assignedTo?: string;
  shopId: string;
}

// Additional Inventory Entities
export interface InventoryTransaction extends BaseEntity {
  shopId: string;
  itemId: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer' | 'waste' | 'return';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  referenceId?: string;
  performedBy: string;
  performedAt: Date;
  notes?: string;
  cost?: number;
}

export interface InventoryAlert extends BaseEntity {
  shopId: string;
  itemId: string;
  type: 'low_stock' | 'out_of_stock' | 'expiring_soon' | 'expired' | 'overstock' | 'maintenance_due';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  isResolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  dueDate?: Date;
}

// Additional Capacity Planning Entities
export interface CapacityForecast extends BaseEntity {
  shopId: string;
  forecastStartDate: Date;
  forecastEndDate: Date;
  methodology: 'historical' | 'trend' | 'seasonal' | 'machine_learning';
  dataPoints: Record<string, any>; // JSONB field for data points array
  predictions: Record<string, any>; // JSONB field for predictions array
  mape: number;
  rmse: number;
  lastValidation: Date;
  recommendations: Record<string, any>; // JSONB field for recommendations array
}

export interface ResourceAllocation extends BaseEntity {
  shopId: string;
  allocationDate: Date;
  staffTotal: number;
  staffAllocated: number;
  staffAvailable: number;
  staffSkills: Record<string, any>; // JSONB field for skills array
  equipmentTotal: number;
  equipmentAllocated: number;
  equipmentAvailable: number;
  equipmentMaintenance: number;
  equipmentTypes: Record<string, any>; // JSONB field for types array
  workstationTotal: number;
  workstationAllocated: number;
  workstationAvailable: number;
  workstationEfficiency: number;
  jobsScheduled: number;
  jobsInProgress: number;
  jobsCompleted: number;
  jobsCancelled: number;
  averageProcessingTime: number;
  resourceUtilization: number;
  throughput: number;
  qualityScore: number;
  customerSatisfaction: number;
  bottlenecks: Record<string, any>; // JSONB field for bottlenecks array
}

export interface CapacityAlert extends BaseEntity {
  shopId: string;
  alertType: 'capacity_exceeded' | 'low_utilization' | 'bottleneck_detected' | 'resource_shortage' | 'quality_decline';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  currentValue: number;
  threshold: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  impact: string;
  recommendations: Record<string, any>; // JSONB field for recommendations array
  isResolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}
