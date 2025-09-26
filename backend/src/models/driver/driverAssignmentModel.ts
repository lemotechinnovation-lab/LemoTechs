// Driver Assignment Model - Data Transfer Objects only
// This file contains simple data models without business logic

export interface DriverMatch {
  driverId: string;
  userId: string;
  name: string;
  phone: string;
  vehicle: string;
  rating: number;
  totalJobs: number;
  currentLocation: {
    lat: number;
    lng: number;
  };
  distance: number;
  estimatedArrivalTime: number; // in minutes
  score: number;
  isAvailable: boolean;
  lastActive: Date;
}

export interface AssignmentRequest {
  bookingId: string;
  pickupLocation: {
    lat: number;
    lng: number;
  };
  priority: 'low' | 'normal' | 'high' | 'urgent';
  estimatedPickupTime: Date;
  specialRequirements?: string[];
  customerTier?: 'regular' | 'premium' | 'vip';
}

export interface AssignmentResult {
  success: boolean;
  assignedDriver?: DriverMatch;
  alternativeDrivers?: DriverMatch[];
  estimatedWaitTime?: number;
  message: string;
  assignmentId?: string;
}

export interface DriverPerformanceStats {
  averageResponseTime: number;
  completionRate: number;
  averageRating: number;
  totalJobs: number;
  lastActive: Date;
}
