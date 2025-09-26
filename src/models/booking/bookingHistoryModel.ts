// Simple Booking History Model - Data Transfer Objects only
// This file contains simple data models without business logic

export interface CreateBookingHistoryRequest {
  bookingId: string;
  stepId: string;
  userId: string;
  stepData?: Record<string, any>;
}

export interface BookingHistoryProfile {
  id: string;
  bookingId: string;
  stepId: string;
  userId: string;
  stepData?: Record<string, any>;
  completedAt: Date;
  createdAt: Date;
}

export interface BookingHistorySearchFilters {
  bookingId?: string;
  stepId?: string;
  userId?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}
