import { PoolClient } from 'pg';
import { Repository } from '../../infrastructure/advancedLinqQueryBuilder';
import { ShopInventoryTrackingConfiguration, EntityMappers } from '../../infrastructure/entityConfigurations';
import { ShopInventoryTracking } from '../../infrastructure/entities/databaseSchema';

export class ShopInventoryTrackingRepository extends Repository<ShopInventoryTracking> {
  constructor(client: PoolClient) {
    super(client, ShopInventoryTrackingConfiguration, EntityMappers.shopInventoryTracking);
  }

  // Enhanced inventory queries
  async findByShopId(shopId: string): Promise<ShopInventoryTracking[]> {
    return await this.findWhere(item => item.shopId === shopId);
  }

  async findByCategory(category: string): Promise<ShopInventoryTracking[]> {
    return await this.findWhere(item => item.category === category);
  }

  async findLowStockItems(shopId: string, threshold?: number): Promise<ShopInventoryTracking[]> {
    return await this.findWhere(item => 
      item.shopId === shopId && 
      item.isActive && 
      item.quantity <= (threshold || item.minQuantity)
    );
  }

  async findOutOfStockItems(shopId: string): Promise<ShopInventoryTracking[]> {
    return await this.findWhere(item => 
      item.shopId === shopId && 
      item.isActive && 
      item.quantity === 0
    );
  }

  async findExpiringItems(shopId: string, daysAhead: number = 30): Promise<ShopInventoryTracking[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    
    return await this.findWhere(item => 
      item.shopId === shopId && 
      item.isActive && 
      item.expiryDate !== null &&
      item.expiryDate !== undefined &&
      item.expiryDate <= futureDate
    );
  }

  async findOverstockItems(shopId: string): Promise<ShopInventoryTracking[]> {
    return await this.findWhere(item => 
      item.shopId === shopId && 
      item.isActive && 
      item.quantity > item.maxQuantity
    );
  }

  async findByLocation(shopId: string, location: string): Promise<ShopInventoryTracking[]> {
    return await this.findWhere(item => 
      item.shopId === shopId && 
      item.location === location
    );
  }

  async findBySupplier(shopId: string, supplier: string): Promise<ShopInventoryTracking[]> {
    return await this.findWhere(item => 
      item.shopId === shopId && 
      item.supplier === supplier
    );
  }

  async searchItems(shopId: string, searchTerm: string): Promise<ShopInventoryTracking[]> {
    return await this.findWhere(item => {
      if (item.shopId !== shopId) return false;
      
      const term = searchTerm.toLowerCase();
      const itemName = item.itemName.toLowerCase();
      const sku = item.sku?.toLowerCase() || '';
      const barcode = item.barcode?.toLowerCase() || '';
      
      return itemName.includes(term) || sku.includes(term) || barcode.includes(term);
    });
  }

  async getInventoryStats(shopId: string): Promise<any> {
    const items = await this.findByShopId(shopId);
    const activeItems = items.filter(item => item.isActive);
    const lowStockItems = items.filter(item => item.quantity <= item.minQuantity);
    const outOfStockItems = items.filter(item => item.quantity === 0);
    
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalCost = items.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
    
    const categoryBreakdown: Record<string, { count: number; value: number }> = {};
    items.forEach(item => {
      const category = item.category;
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = { count: 0, value: 0 };
      }
      categoryBreakdown[category]!.count++;
      categoryBreakdown[category]!.value += item.quantity * item.unitPrice;
    });

    return {
      totalItems: items.length,
      activeItems: activeItems.length,
      lowStockItems: lowStockItems.length,
      outOfStockItems: outOfStockItems.length,
      totalValue,
      totalCost,
      profitMargin: totalValue > 0 ? ((totalValue - totalCost) / totalValue) * 100 : 0,
      categoryBreakdown
    };
  }

  async getTopMovingItems(shopId: string, limit: number = 10): Promise<any[]> {
    // This would typically join with transaction table
    // For now, return items with recent updates
    const items = await this.findByShopId(shopId);
    return items
      .filter(item => item.isActive)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit)
      .map(item => ({
        itemId: item.id,
        itemName: item.itemName,
        category: item.category,
        currentQuantity: item.quantity,
        lastUpdated: item.updatedAt
      }));
  }

  async getSlowMovingItems(shopId: string, daysThreshold: number = 30): Promise<any[]> {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);
    
    const items = await this.findByShopId(shopId);
    return items
      .filter(item => 
        item.isActive && 
        item.updatedAt < thresholdDate &&
        item.quantity > 0
      )
      .map(item => ({
        itemId: item.id,
        itemName: item.itemName,
        category: item.category,
        currentQuantity: item.quantity,
        daysSinceLastUpdate: Math.floor((Date.now() - item.updatedAt.getTime()) / (1000 * 60 * 60 * 24))
      }));
  }

  async getInventoryValueByCategory(shopId: string): Promise<Record<string, number>> {
    const items = await this.findByShopId(shopId);
    const categoryValues: Record<string, number> = {};
    
    items.forEach(item => {
      const category = item.category;
      if (!categoryValues[category]) {
        categoryValues[category] = 0;
      }
      categoryValues[category]! += item.quantity * item.unitPrice;
    });
    
    return categoryValues;
  }

  async getReorderSuggestions(shopId: string): Promise<any[]> {
    const items = await this.findByShopId(shopId);
    return items
      .filter(item => 
        item.isActive && 
        item.quantity <= item.minQuantity
      )
      .map(item => ({
        itemId: item.id,
        itemName: item.itemName,
        currentQuantity: item.quantity,
        minQuantity: item.minQuantity,
        maxQuantity: item.maxQuantity,
        suggestedQuantity: item.maxQuantity - item.quantity,
        unitCost: item.costPrice,
        estimatedCost: (item.maxQuantity - item.quantity) * item.costPrice,
        urgency: item.quantity === 0 ? 'critical' : 
                 item.quantity <= item.minQuantity * 0.5 ? 'high' : 'medium'
      }));
  }

  async findByDateRange(shopId: string, startDate: Date, endDate: Date): Promise<ShopInventoryTracking[]> {
    return await this.findWhere(item =>
      item.shopId === shopId &&
      item.createdAt >= startDate &&
      item.createdAt <= endDate
    );
  }

  async getInventoryTrends(shopId: string, months: number = 6): Promise<any[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - months);
    
    const items = await this.findByDateRange(shopId, startDate, endDate);
    
    // Group by month
    const monthlyData: Record<string, { itemsAdded: number; totalValue: number }> = {};
    
    items.forEach(item => {
      const monthKey = item.createdAt.toISOString().substring(0, 7); // YYYY-MM
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { itemsAdded: 0, totalValue: 0 };
      }
      monthlyData[monthKey].itemsAdded++;
      monthlyData[monthKey].totalValue += item.quantity * item.unitPrice;
    });
    
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      itemsAdded: data.itemsAdded,
      totalValue: data.totalValue
    }));
  }
}
