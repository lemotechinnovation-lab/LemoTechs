// Simple Shop Model - Data Transfer Objects only
// This file contains simple data models without business logic

export interface CreateShopRequest {
  userId: string;
  name: string;
  description?: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  phone?: string;
  email?: string;
  operatingHours?: Record<string, any>;
  services?: Record<string, any>;
  capacity?: number;
}

export interface UpdateShopRequest {
  name?: string;
  description?: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  phone?: string;
  email?: string;
  operatingHours?: Record<string, any>;
  services?: Record<string, any>;
  capacity?: number;
  isActive?: boolean;
}

export interface ShopProfile {
  id: string;
  userId: string;
  name: string;
  description?: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  phone?: string;
  email?: string;
  operatingHours?: Record<string, any>;
  services?: Record<string, any>;
  rating: number;
  totalBookings: number;
  totalRevenue: number;
  isActive: boolean;
  isVerified: boolean;
  capacity: number;
  currentLoad: number;
}

export interface ShopStats {
  totalShops: number;
  activeShops: number;
  averageRating: number;
  totalCapacity: number;
}

export interface ShopInventoryItem {
  id: string;
  shopId: string;
  itemName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  description?: string;
  isActive: boolean;
}

export interface ShopSearchFilters {
  isActive?: boolean;
  isVerified?: boolean;
  minRating?: number;
  hasCapacity?: boolean;
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
}