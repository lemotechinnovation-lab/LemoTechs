// Simple Driver Model - Data Transfer Objects only
// This file contains simple data models without business logic

export interface CreateDriverRequest {
  userId: string;
  vehicle: string;
  licenseNumber: string;
  licenseExpiry?: Date;
  vehicleRegistration?: string;
  vehicleModel?: string;
  vehicleColor?: string;
}

export interface UpdateDriverRequest {
  vehicle?: string;
  licenseNumber?: string;
  licenseExpiry?: Date;
  vehicleRegistration?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  isActive?: boolean;
  status?: 'offline' | 'available' | 'busy';
}

export interface DriverProfile {
  id: string;
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
  status: 'offline' | 'available' | 'busy';
  lastActive?: Date;
}

export interface DriverStats {
  totalDrivers: number;
  activeDrivers: number;
  availableDrivers: number;
  averageRating: number;
}

export interface DriverLocationUpdate {
  driverId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface DriverSearchFilters {
  isActive?: boolean;
  status?: 'offline' | 'available' | 'busy';
  minRating?: number;
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
}