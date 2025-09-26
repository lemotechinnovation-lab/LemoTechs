// Enhanced Shop Inventory Tracking Models
// This file contains comprehensive models for advanced inventory management

export interface InventoryItem {
  id: string;
  shopId: string;
  itemName: string;
  category: 'cleaning_supplies' | 'equipment' | 'consumables' | 'tools' | 'safety' | 'packaging';
  subcategory?: string;
  sku?: string;
  barcode?: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  unitPrice: number;
  costPrice: number;
  description?: string;
  specifications?: Record<string, any>;
  supplier?: string;
  supplierContact?: string;
  lastRestocked?: Date;
  expiryDate?: Date;
  isActive: boolean;
  isTrackable: boolean;
  location?: string; // Shelf/room location
  condition: 'new' | 'good' | 'fair' | 'poor' | 'damaged';
  notes?: string;
}

export interface InventoryTransaction {
  id: string;
  shopId: string;
  itemId: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer' | 'waste' | 'return';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  referenceId?: string; // Booking ID, Order ID, etc.
  performedBy: string; // User ID
  performedAt: Date;
  notes?: string;
  cost?: number;
}

export interface InventoryAlert {
  id: string;
  shopId: string;
  itemId: string;
  type: 'low_stock' | 'out_of_stock' | 'expiring_soon' | 'expired' | 'overstock' | 'maintenance_due';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  isResolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  createdAt: Date;
  dueDate?: Date;
}

export interface InventoryReport {
  shopId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  totalItems: number;
  totalValue: number;
  totalCost: number;
  profitMargin: number;
  turnoverRate: number;
  topMovingItems: {
    itemId: string;
    itemName: string;
    quantityMoved: number;
    valueMoved: number;
  }[];
  slowMovingItems: {
    itemId: string;
    itemName: string;
    daysSinceLastMove: number;
    currentQuantity: number;
  }[];
  categoryBreakdown: {
    category: string;
    itemCount: number;
    totalValue: number;
    percentageOfTotal: number;
  }[];
  alertsGenerated: number;
  stockAdjustments: number;
}

export interface InventoryOptimization {
  shopId: string;
  recommendations: {
    type: 'reorder' | 'reduce' | 'dispose' | 'maintenance' | 'relocation';
    priority: 'low' | 'medium' | 'high' | 'critical';
    itemId: string;
    itemName: string;
    description: string;
    expectedImpact: string;
    estimatedSavings?: number;
    implementationCost?: number;
  }[];
  reorderSuggestions: {
    itemId: string;
    itemName: string;
    currentQuantity: number;
    suggestedQuantity: number;
    estimatedCost: number;
    urgency: 'low' | 'medium' | 'high';
  }[];
  wasteReduction: {
    itemId: string;
    itemName: string;
    wastePercentage: number;
    suggestedAction: string;
    potentialSavings: number;
  }[];
}

export interface InventoryTrackingRequest {
  shopId: string;
  action: 'add' | 'update' | 'adjust' | 'transfer' | 'dispose' | 'restock';
  itemId?: string;
  itemData?: Partial<InventoryItem>;
  quantity?: number;
  reason?: string;
  referenceId?: string;
  performedBy: string;
  notes?: string;
}

export interface InventoryTrackingResult {
  success: boolean;
  message: string;
  item?: InventoryItem;
  transaction?: InventoryTransaction;
  alerts?: InventoryAlert[];
  error?: string;
}

export interface StockMovement {
  itemId: string;
  itemName: string;
  category: string;
  movementType: 'in' | 'out';
  quantity: number;
  date: Date;
  reason: string;
  performedBy: string;
  value: number;
}

export interface InventoryDashboard {
  shopId: string;
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiringItems: number;
  recentMovements: StockMovement[];
  activeAlerts: InventoryAlert[];
  topCategories: {
    category: string;
    itemCount: number;
    totalValue: number;
  }[];
  monthlyTrends: {
    month: string;
    totalValue: number;
    itemsAdded: number;
    itemsConsumed: number;
  }[];
}
