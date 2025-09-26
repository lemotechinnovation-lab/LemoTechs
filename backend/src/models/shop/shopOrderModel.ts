// Simple Shop Order Model - Data Transfer Objects only
// This file contains simple data models without business logic

// Shop Order Entity
export interface ShopOrder {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  shopId: string;
  bookingId: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: Record<string, any>;
  totalAmount: number;
  notes?: string;
}

// Shop Inventory Entity
export interface ShopInventory {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  shopId: string;
  itemName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  description?: string;
  isActive: boolean;
}

export interface CreateShopOrderRequest {
  shopId: string;
  bookingId: string;
  items: Record<string, any>;
  totalAmount: number;
  notes?: string;
}

export interface UpdateShopOrderRequest {
  status?: 'pending' | 'processing' | 'completed' | 'cancelled';
  items?: Record<string, any>;
  totalAmount?: number;
  notes?: string;
}

export interface ShopOrderProfile {
  id: string;
  shopId: string;
  bookingId: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: Record<string, any>;
  totalAmount: number;
  notes?: string;
}

export interface ShopOrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
}

export interface ShopOrderSearchFilters {
  shopId?: string;
  bookingId?: string;
  status?: 'pending' | 'processing' | 'completed' | 'cancelled';
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}