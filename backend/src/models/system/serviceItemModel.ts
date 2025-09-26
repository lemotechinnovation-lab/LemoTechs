// Simple Service Item Model - Data Transfer Objects only
// This file contains simple data models without business logic

export interface CreateServiceItemRequest {
  name: string;
  category: string;
  basePrice: number;
  description?: string;
  estimatedTime?: number;
  icon?: string;
}

export interface UpdateServiceItemRequest {
  name?: string;
  category?: string;
  basePrice?: number;
  description?: string;
  estimatedTime?: number;
  icon?: string;
  isActive?: boolean;
}

export interface ServiceItemProfile {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  description?: string;
  estimatedTime?: number;
  icon?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceItemSearchFilters {
  category?: string;
  isActive?: boolean;
  priceRange?: {
    minPrice: number;
    maxPrice: number;
  };
  searchTerm?: string;
}

export interface ServiceItemStats {
  totalItems: number;
  activeItems: number;
  itemsByCategory: Record<string, number>;
}
