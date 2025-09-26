// Simple Shop Inventory Model - Data Transfer Objects only
// This file contains simple data models without business logic

export interface CreateShopInventoryRequest {
  shopId: string;
  itemName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  description?: string;
}

export interface UpdateShopInventoryRequest {
  itemName?: string;
  category?: string;
  quantity?: number;
  unitPrice?: number;
  description?: string;
  isActive?: boolean;
}

export interface ShopInventoryProfile {
  id: string;
  shopId: string;
  itemName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopInventorySearchFilters {
  shopId?: string;
  category?: string;
  isActive?: boolean;
  lowStock?: boolean;
  stockThreshold?: number;
  searchTerm?: string;
}

export interface ShopInventoryStats {
  totalItems: number;
  activeItems: number;
  lowStockItems: number;
  totalValue: number;
  itemsByCategory: Record<string, number>;
}
