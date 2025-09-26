import { PoolClient } from 'pg';
import { ShopInventoryTrackingRepository } from '../../repositories/shop/ShopInventoryTrackingRepository';
import { ShopRepository } from '../../repositories/shop/ShopRepository';
import { 
  InventoryItem, 
  InventoryTransaction, 
  InventoryAlert, 
  InventoryReport, 
  InventoryOptimization,
  InventoryTrackingRequest,
  InventoryTrackingResult,
  InventoryDashboard
} from '../../models/shop/shopInventoryTrackingModel';
import { BaseService } from '../base/BaseService';
import { IShopInventoryTrackingService } from '../../infrastructure/di/interfaces';
import { Logger } from '../../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export class ShopInventoryTrackingService extends BaseService implements IShopInventoryTrackingService {
  public inventoryRepository: ShopInventoryTrackingRepository;
  private shopRepository: ShopRepository;

  constructor(client: PoolClient) {
    super();
    this.inventoryRepository = new ShopInventoryTrackingRepository(client);
    this.shopRepository = new ShopRepository(client);
  }

  /**
   * Add new inventory item
   */
  async addInventoryItem(shopId: string, itemData: Partial<InventoryItem>, performedBy: string): Promise<InventoryTrackingResult> {
    this.logMethodEntry('addInventoryItem', { shopId, itemName: itemData.itemName });
    
    try {
      // Check if shop exists and is active
      const shop = await this.shopRepository.findById(shopId);
      if (!shop || !shop.isActive) {
        return {
          success: false,
          message: 'Shop not found or inactive',
          error: 'SHOP_NOT_FOUND'
        };
      }

      // Create inventory item
      const inventoryItem: Partial<InventoryItem> = {
        id: uuidv4(),
        shopId,
        itemName: itemData.itemName || '',
        category: itemData.category || 'consumables',
        subcategory: itemData.subcategory,
        sku: itemData.sku,
        barcode: itemData.barcode,
        quantity: itemData.quantity || 0,
        minQuantity: itemData.minQuantity || 5,
        maxQuantity: itemData.maxQuantity || 100,
        unitPrice: itemData.unitPrice || 0,
        costPrice: itemData.costPrice || 0,
        description: itemData.description,
        specifications: itemData.specifications,
        supplier: itemData.supplier,
        supplierContact: itemData.supplierContact,
        lastRestocked: new Date(),
        expiryDate: itemData.expiryDate,
        isActive: true,
        isTrackable: itemData.isTrackable !== false,
        location: itemData.location,
        condition: itemData.condition || 'new',
        notes: itemData.notes
      };

      await this.inventoryRepository.create(inventoryItem as any);

      // Create transaction record
      const transaction: Partial<InventoryTransaction> = {
        id: uuidv4(),
        shopId,
        itemId: inventoryItem.id!,
        type: 'in',
        quantity: inventoryItem.quantity!,
        previousQuantity: 0,
        newQuantity: inventoryItem.quantity!,
        reason: 'Initial stock',
        performedBy,
        performedAt: new Date(),
        notes: 'Item added to inventory',
        cost: inventoryItem.quantity! * inventoryItem.costPrice!
      };

      // Check for alerts
      const alerts = await this.checkInventoryAlerts(shopId, inventoryItem.id!);

      Logger.info('Inventory item added', { shopId, itemId: inventoryItem.id, itemName: inventoryItem.itemName });

      this.logMethodExit('addInventoryItem', { success: true });
      return {
        success: true,
        message: 'Inventory item added successfully',
        item: inventoryItem as InventoryItem,
        transaction: transaction as InventoryTransaction,
        alerts
      };
    } catch (error) {
      Logger.error('Failed to add inventory item:', error);
      return {
        success: false,
        message: 'Failed to add inventory item',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Update inventory quantity
   */
  async updateInventoryQuantity(
    shopId: string, 
    itemId: string, 
    newQuantity: number, 
    reason: string, 
    performedBy: string,
    referenceId?: string
  ): Promise<InventoryTrackingResult> {
    this.logMethodEntry('updateInventoryQuantity', { shopId, itemId, newQuantity, reason });
    
    try {
      const item = await this.inventoryRepository.findById(itemId);
      if (!item || item.shopId !== shopId) {
        return {
          success: false,
          message: 'Inventory item not found',
          error: 'ITEM_NOT_FOUND'
        };
      }

      const previousQuantity = item.quantity;
      const quantityChange = newQuantity - previousQuantity;
      const transactionType = quantityChange > 0 ? 'in' : quantityChange < 0 ? 'out' : 'adjustment';

      // Update item
      const updatedItem = await this.inventoryRepository.update(itemId, {
        quantity: newQuantity,
        lastRestocked: transactionType === 'in' ? new Date() : item.lastRestocked
      });

      // Create transaction record
      const transaction: Partial<InventoryTransaction> = {
        id: uuidv4(),
        shopId,
        itemId,
        type: transactionType,
        quantity: Math.abs(quantityChange),
        previousQuantity,
        newQuantity,
        reason,
        referenceId,
        performedBy,
        performedAt: new Date(),
        cost: Math.abs(quantityChange) * item.costPrice
      };

      // Check for alerts
      const alerts = await this.checkInventoryAlerts(shopId, itemId);

      Logger.info('Inventory quantity updated', { shopId, itemId, previousQuantity, newQuantity });

      this.logMethodExit('updateInventoryQuantity', { success: true });
      return {
        success: true,
        message: 'Inventory quantity updated successfully',
        item: updatedItem as InventoryItem,
        transaction: transaction as InventoryTransaction,
        alerts
      };
    } catch (error) {
      Logger.error('Failed to update inventory quantity:', error);
      return {
        success: false,
        message: 'Failed to update inventory quantity',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Get inventory dashboard data
   */
  async getInventoryDashboard(shopId: string): Promise<InventoryDashboard> {
    this.logMethodEntry('getInventoryDashboard', { shopId });
    
    try {
      const stats = await this.inventoryRepository.getInventoryStats(shopId);
      const lowStockItems = await this.inventoryRepository.findLowStockItems(shopId);
      const outOfStockItems = await this.inventoryRepository.findOutOfStockItems(shopId);
      const expiringItems = await this.inventoryRepository.findExpiringItems(shopId, 30);
      const topMovingItems = await this.inventoryRepository.getTopMovingItems(shopId, 5);
      const categoryValues = await this.inventoryRepository.getInventoryValueByCategory(shopId);
      const monthlyTrends = await this.inventoryRepository.getInventoryTrends(shopId, 6);

      // Generate recent movements (simplified)
      const recentMovements = topMovingItems.map(item => ({
        itemId: item.itemId,
        itemName: item.itemName,
        category: item.category,
        movementType: 'out' as const,
        quantity: Math.floor(Math.random() * 10) + 1, // Mock data
        date: new Date(),
        reason: 'Cleaning service usage',
        performedBy: 'system',
        value: Math.floor(Math.random() * 100) + 10
      }));

      // Generate active alerts
      const activeAlerts: InventoryAlert[] = [];
      
      lowStockItems.forEach(item => {
        activeAlerts.push({
          id: uuidv4(),
          shopId,
          itemId: item.id,
          type: 'low_stock',
          severity: item.quantity === 0 ? 'critical' : 'high',
          message: `Low stock alert: ${item.itemName} has ${item.quantity} units remaining`,
          isResolved: false,
          createdAt: new Date()
        });
      });

      expiringItems.forEach(item => {
        activeAlerts.push({
          id: uuidv4(),
          shopId,
          itemId: item.id,
          type: 'expiring_soon',
          severity: 'medium',
          message: `${item.itemName} expires on ${item.expiryDate?.toLocaleDateString()}`,
          isResolved: false,
          createdAt: new Date(),
          dueDate: item.expiryDate
        });
      });

      const dashboard: InventoryDashboard = {
        shopId,
        totalItems: stats.totalItems,
        totalValue: stats.totalValue,
        lowStockItems: stats.lowStockItems,
        outOfStockItems: stats.outOfStockItems,
        expiringItems: expiringItems.length,
        recentMovements,
        activeAlerts,
        topCategories: Object.entries(categoryValues).map(([category, value]) => ({
          category,
          itemCount: stats.categoryBreakdown[category]?.count || 0,
          totalValue: value
        })),
        monthlyTrends: monthlyTrends.map(trend => ({
          month: trend.month,
          totalValue: trend.totalValue,
          itemsAdded: trend.itemsAdded,
          itemsConsumed: Math.floor(trend.itemsAdded * 0.8) // Mock consumption data
        }))
      };

      this.logMethodExit('getInventoryDashboard', dashboard);
      return dashboard;
    } catch (error) {
      Logger.error('Failed to get inventory dashboard:', error);
      throw error;
    }
  }

  /**
   * Generate inventory report
   */
  async generateInventoryReport(shopId: string, period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<InventoryReport> {
    this.logMethodEntry('generateInventoryReport', { shopId, period });
    
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case 'daily':
          startDate.setDate(endDate.getDate() - 1);
          break;
        case 'weekly':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'monthly':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'yearly':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      const stats = await this.inventoryRepository.getInventoryStats(shopId);
      const topMovingItems = await this.inventoryRepository.getTopMovingItems(shopId, 10);
      const slowMovingItems = await this.inventoryRepository.getSlowMovingItems(shopId, 30);
      const categoryValues = await this.inventoryRepository.getInventoryValueByCategory(shopId);

      const report: InventoryReport = {
        shopId,
        period,
        startDate,
        endDate,
        totalItems: stats.totalItems,
        totalValue: stats.totalValue,
        totalCost: stats.totalCost,
        profitMargin: stats.profitMargin,
        turnoverRate: 85, // Mock turnover rate
        topMovingItems: topMovingItems.map(item => ({
          itemId: item.itemId,
          itemName: item.itemName,
          quantityMoved: Math.floor(Math.random() * 50) + 10, // Mock data
          valueMoved: Math.floor(Math.random() * 500) + 100
        })),
        slowMovingItems: slowMovingItems.map(item => ({
          itemId: item.itemId,
          itemName: item.itemName,
          daysSinceLastMove: item.daysSinceLastUpdate,
          currentQuantity: item.currentQuantity
        })),
        categoryBreakdown: Object.entries(categoryValues).map(([category, value]) => ({
          category,
          itemCount: stats.categoryBreakdown[category]?.count || 0,
          totalValue: value,
          percentageOfTotal: stats.totalValue > 0 ? (value / stats.totalValue) * 100 : 0
        })),
        alertsGenerated: stats.lowStockItems + stats.outOfStockItems,
        stockAdjustments: Math.floor(Math.random() * 20) + 5 // Mock data
      };

      this.logMethodExit('generateInventoryReport', report);
      return report;
    } catch (error) {
      Logger.error('Failed to generate inventory report:', error);
      throw error;
    }
  }

  /**
   * Get inventory optimization recommendations
   */
  async getInventoryOptimization(shopId: string): Promise<InventoryOptimization> {
    this.logMethodEntry('getInventoryOptimization', { shopId });
    
    try {
      const lowStockItems = await this.inventoryRepository.findLowStockItems(shopId);
      const overstockItems = await this.inventoryRepository.findOverstockItems(shopId);
      const slowMovingItems = await this.inventoryRepository.getSlowMovingItems(shopId, 60);
      const reorderSuggestions = await this.inventoryRepository.getReorderSuggestions(shopId);

      const recommendations: {
        type: 'reorder' | 'reduce' | 'dispose' | 'maintenance' | 'relocation';
        priority: 'low' | 'medium' | 'high' | 'critical';
        itemId: string;
        itemName: string;
        description: string;
        expectedImpact: string;
        estimatedSavings?: number;
        implementationCost?: number;
      }[] = [];
      
      // Reorder recommendations
      lowStockItems.forEach(item => {
        recommendations.push({
          type: 'reorder' as const,
          priority: item.quantity === 0 ? 'critical' as const : 'high' as const,
          itemId: item.id,
          itemName: item.itemName,
          description: `Reorder ${item.itemName} - Current stock: ${item.quantity}`,
          expectedImpact: 'Prevent stockouts and service interruptions',
          estimatedSavings: 1000, // Mock savings
          implementationCost: 500
        });
      });

      // Reduce stock recommendations
      overstockItems.forEach(item => {
        recommendations.push({
          type: 'reduce' as const,
          priority: 'medium' as const,
          itemId: item.id,
          itemName: item.itemName,
          description: `Reduce stock of ${item.itemName} - Overstock by ${item.quantity - item.maxQuantity} units`,
          expectedImpact: 'Free up capital and storage space',
          estimatedSavings: (item.quantity - item.maxQuantity) * item.costPrice,
          implementationCost: 100
        });
      });

      // Dispose recommendations for slow-moving items
      slowMovingItems.forEach(item => {
        if (item.daysSinceLastUpdate > 90) {
          recommendations.push({
            type: 'dispose' as const,
            priority: 'low' as const,
            itemId: item.itemId,
            itemName: item.itemName,
            description: `Consider disposing ${item.itemName} - No movement for ${item.daysSinceLastUpdate} days`,
            expectedImpact: 'Free up storage space and reduce carrying costs',
            estimatedSavings: item.currentQuantity * 10, // Mock savings
            implementationCost: 50
          });
        }
      });

      const optimization: InventoryOptimization = {
        shopId,
        recommendations,
        reorderSuggestions: reorderSuggestions.map(item => ({
          itemId: item.itemId,
          itemName: item.itemName,
          currentQuantity: item.currentQuantity,
          suggestedQuantity: item.suggestedQuantity,
          estimatedCost: item.estimatedCost,
          urgency: item.urgency
        })),
        wasteReduction: slowMovingItems.map(item => ({
          itemId: item.itemId,
          itemName: item.itemName,
          wastePercentage: Math.min(item.daysSinceLastUpdate / 10, 50), // Mock calculation
          suggestedAction: 'Promote item or reduce reorder quantity',
          potentialSavings: item.currentQuantity * 5
        }))
      };

      this.logMethodExit('getInventoryOptimization', optimization);
      return optimization;
    } catch (error) {
      Logger.error('Failed to get inventory optimization:', error);
      throw error;
    }
  }

  /**
   * Check and generate inventory alerts
   */
  private async checkInventoryAlerts(shopId: string, itemId: string): Promise<InventoryAlert[]> {
    const item = await this.inventoryRepository.findById(itemId);
    if (!item) return [];

    const alerts: InventoryAlert[] = [];

    // Low stock alert
    if (item.quantity <= item.minQuantity) {
      alerts.push({
        id: uuidv4(),
        shopId,
        itemId,
        type: item.quantity === 0 ? 'out_of_stock' : 'low_stock',
        severity: item.quantity === 0 ? 'critical' : 'high',
        message: `${item.itemName} is ${item.quantity === 0 ? 'out of stock' : 'running low'} (${item.quantity} units remaining)`,
        isResolved: false,
        createdAt: new Date()
      });
    }

    // Expiry alert
    if (item.expiryDate) {
      const daysUntilExpiry = Math.ceil((item.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
        alerts.push({
          id: uuidv4(),
          shopId,
          itemId,
          type: daysUntilExpiry <= 7 ? 'expired' : 'expiring_soon',
          severity: daysUntilExpiry <= 7 ? 'critical' : 'medium',
          message: `${item.itemName} ${daysUntilExpiry <= 7 ? 'has expired' : 'expires in'} ${daysUntilExpiry} days`,
          isResolved: false,
          createdAt: new Date(),
          dueDate: item.expiryDate
        });
      }
    }

    // Overstock alert
    if (item.quantity > item.maxQuantity) {
      alerts.push({
        id: uuidv4(),
        shopId,
        itemId,
        type: 'overstock',
        severity: 'low',
        message: `${item.itemName} is overstocked (${item.quantity} units, max: ${item.maxQuantity})`,
        isResolved: false,
        createdAt: new Date()
      });
    }

    return alerts;
  }
}
