// Simple Booking Model - Data Transfer Objects only
// This file contains simple data models without business logic

export interface CreateBookingRequest {
  userId: string;
  pickupLocation: string;
  pickupCoords?: {
    lat: number;
    lng: number;
  };
  items: string[];
  driverId?: string;
  shopId?: string;
  paymentMethod: 'card' | 'cash' | 'mobile';
  paymentId?: string;
  amount: number;
  contactPhone: string;
  specialInstructions?: string;
  estimatedPickupTime?: Date;
  estimatedDeliveryTime?: Date;
}

export interface UpdateBookingRequest {
  status?: 'pending' | 'confirmed' | 'pickup' | 'cleaning' | 'delivery' | 'completed' | 'cancelled';
  driverId?: string;
  shopId?: string;
  paymentId?: string;
  actualPickupTime?: Date;
  actualDeliveryTime?: Date;
  cleaningStartedAt?: Date;
  cleaningCompletedAt?: Date;
  specialInstructions?: string;
}

export interface BookingProfile {
  id: string;
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

export interface BookingStats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalRevenue: number;
}

export interface BookingSearchFilters {
  userId?: string;
  driverId?: string;
  shopId?: string;
  status?: 'pending' | 'confirmed' | 'pickup' | 'cleaning' | 'delivery' | 'completed' | 'cancelled';
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  paymentMethod?: 'card' | 'cash' | 'mobile';
}

export interface BookingStepData {
  stepId: string;
  stepName: string;
  stepOrder: number;
  completed: boolean;
  completedAt?: Date;
  data?: Record<string, any>;
}