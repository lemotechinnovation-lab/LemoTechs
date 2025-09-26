// Simple Admin Model - Data Transfer Objects only
// This file contains simple data models without business logic

export interface AdminDashboardStats {
  totalUsers: number;
  totalDrivers: number;
  totalShops: number;
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  pendingVerifications: number;
}

export interface AdminUserManagement {
  userId: string;
  name: string;
  email: string;
  role: 'user' | 'driver' | 'shop' | 'admin';
  emailVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  memberSince: Date;
  totalBookings: number;
}

export interface AdminDriverManagement {
  driverId: string;
  userId: string;
  name: string;
  email: string;
  vehicle: string;
  licenseNumber: string;
  rating: number;
  totalJobs: number;
  isActive: boolean;
  isVerified: boolean;
  status: 'offline' | 'available' | 'busy';
}

export interface AdminShopManagement {
  shopId: string;
  userId: string;
  name: string;
  email: string;
  address: string;
  rating: number;
  totalBookings: number;
  isActive: boolean;
  isVerified: boolean;
  capacity: number;
  currentLoad: number;
}

export interface AdminBookingManagement {
  bookingId: string;
  userId: string;
  userName: string;
  driverId?: string;
  driverName?: string;
  shopId?: string;
  shopName?: string;
  status: 'pending' | 'confirmed' | 'pickup' | 'cleaning' | 'delivery' | 'completed' | 'cancelled';
  amount: number;
  createdAt: Date;
}

export interface AdminSearchFilters {
  entityType: 'users' | 'drivers' | 'shops' | 'bookings';
  status?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  searchTerm?: string;
  page?: number;
  limit?: number;
}