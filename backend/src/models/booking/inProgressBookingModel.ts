// Simple In Progress Booking Model - Data Transfer Objects only
// This file contains simple data models without business logic

export interface CreateInProgressBookingRequest {
  userId: string;
  sessionId?: string;
  currentStep: string;
  bookingData: Record<string, any>;
  expiresAt: Date;
}

export interface UpdateInProgressBookingRequest {
  currentStep?: string;
  bookingData?: Record<string, any>;
  expiresAt?: Date;
}

export interface InProgressBookingProfile {
  id: string;
  userId: string;
  sessionId?: string;
  currentStep: string;
  bookingData: Record<string, any>;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InProgressBookingSearchFilters {
  userId?: string;
  sessionId?: string;
  currentStep?: string;
  expired?: boolean;
}

export interface BookingStateData {
  location?: string;
  coordinates?: { lat: number; lng: number } | null;
  items?: { [key: string]: number };
  scheduledFor?: 'now' | 'later';
  paymentMethod?: string;
  specialInstructions?: string;
  contactPhone?: string;
  selectedCarType?: string | null;
  estimatedPrice?: number;
}

export interface InProgressBooking {
  id: string;
  userId?: string;
  sessionId?: string;
  currentStep: string;
  bookingData: BookingStateData;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}