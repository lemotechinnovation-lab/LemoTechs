// Simple Booking Steps Model - Data Transfer Objects only
// This file contains simple data models without business logic

export interface CreateBookingStepRequest {
  stepName: string;
  stepOrder: number;
  description?: string;
}

export interface UpdateBookingStepRequest {
  stepName?: string;
  stepOrder?: number;
  description?: string;
}

export interface BookingStepProfile {
  id: string;
  stepName: string;
  stepOrder: number;
  description?: string;
  createdAt: Date;
}

export interface BookingStepSearchFilters {
  stepOrder?: number;
  stepName?: string;
}
