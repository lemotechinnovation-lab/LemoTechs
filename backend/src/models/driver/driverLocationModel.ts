// Simple Driver Location Model - Data Transfer Objects only
// This file contains simple data models without business logic

export interface CreateDriverLocationRequest {
  driverId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface DriverLocationProfile {
  id: string;
  driverId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: Date;
  createdAt: Date;
}

export interface DriverLocationSearchFilters {
  driverId?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
}

export interface DriverLocationStats {
  totalLocations: number;
  activeDrivers: number;
  averageAccuracy: number;
}
