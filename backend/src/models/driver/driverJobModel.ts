// Simple Driver Job Model - Data Transfer Objects only
// This file contains simple data models without business logic

// Base Entity Interface
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
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

export interface CreateDriverJobRequest {
  driverId: string;
  bookingId: string;
  notes?: string;
}

export interface UpdateDriverJobRequest {
  status?: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
}

export interface DriverJobProfile {
  id: string;
  driverId: string;
  bookingId: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DriverJobStats {
  totalJobs: number;
  assignedJobs: number;
  inProgressJobs: number;
  completedJobs: number;
  cancelledJobs: number;
}

export interface DriverJobSearchFilters {
  driverId?: string;
  bookingId?: string;
  status?: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}
