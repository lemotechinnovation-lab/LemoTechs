// Simple User Model - Data Transfer Objects only
// This file contains simple data models without business logic

export type UserRole = 'user' | 'driver' | 'shop' | 'admin';

export interface CreateUserRequest {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: UserRole;
  loyaltyPoints: number;
  totalBookings: number;
  memberSince: Date;
}

export interface UserStats {
  totalUsers: number;
  verifiedUsers: number;
  drivers: number;
  shops: number;
  admins: number;
}

export interface UserSearchFilters {
  role?: UserRole;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  minLoyaltyPoints?: number;
  searchTerm?: string;
}

export interface UserListResponse {
  users: UserProfile[];
  total: number;
  page: number;
  limit: number;
}