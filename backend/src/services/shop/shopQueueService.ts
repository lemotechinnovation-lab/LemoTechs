import { PoolClient } from 'pg';
import { ShopQueueRepository } from '../../repositories/shop/ShopQueueRepository';
import { CleaningItemRepository } from '../../repositories/cleaning/CleaningItemRepository';
import { ShopRepository } from '../../repositories/shop/ShopRepository';
import { 
  QueueItem, 
  QueueStatus, 
  QueueManagementRequest, 
  QueueManagementResult, 
  StaffWorkload, 
  QueueAnalytics, 
  QueueOptimization 
} from '../../models/shop/shopQueueModel';
import { BaseService } from '../base/BaseService';
import { IShopQueueService } from '../../infrastructure/di/interfaces';
import { Logger } from '../../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export class ShopQueueService extends BaseService implements IShopQueueService {
  private shopQueueRepository: ShopQueueRepository;
  private cleaningItemRepository: CleaningItemRepository;
  private shopRepository: ShopRepository;

  constructor(client: PoolClient) {
    super();
    this.shopQueueRepository = new ShopQueueRepository(client);
    this.cleaningItemRepository = new CleaningItemRepository(client);
    this.shopRepository = new ShopRepository(client);
  }

  /**
   * Add item to shop queue
   */
  async addToQueue(shopId: string, bookingId: string, cleaningItemId: string, priority: string, estimatedDuration: number, assignedTo?: string, notes?: string, specialInstructions?: string): Promise<QueueManagementResult> {
    this.logMethodEntry('addToQueue', { shopId, bookingId, cleaningItemId, priority });
    
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

      // Check if cleaning item exists
      const cleaningItem = await this.cleaningItemRepository.findById(cleaningItemId);
      if (!cleaningItem) {
        return {
          success: false,
          message: 'Cleaning item not found',
          error: 'ITEM_NOT_FOUND'
        };
      }

      // Check shop capacity
      const queueStatus = await this.getQueueStatus(shopId);
      if (queueStatus.currentCapacity >= queueStatus.maxCapacity) {
        return {
          success: false,
          message: 'Shop is at full capacity',
          error: 'CAPACITY_EXCEEDED'
        };
      }

      // Create queue item
      const queueItem: Partial<QueueItem> = {
        id: uuidv4(),
        shopId,
        bookingId,
        cleaningItemId,
        priority: priority as 'low' | 'normal' | 'high' | 'urgent',
        status: 'queued',
        estimatedDuration: cleaningItem.estimatedTime,
        queuedAt: new Date(),
        notes: cleaningItem.notes,
        specialInstructions: cleaningItem.notes
      };

      await this.shopQueueRepository.create(queueItem as any);

      // Get updated queue status
      const updatedStatus = await this.getQueueStatus(shopId);

      Logger.info('Item added to queue', { shopId, itemId: queueItem.id, priority });

      this.logMethodExit('addToQueue', { success: true });
      return {
        success: true,
        message: 'Item added to queue successfully',
        queueStatus: updatedStatus,
        updatedItem: queueItem as QueueItem
      };
    } catch (error) {
      Logger.error('Failed to add item to queue:', error);
      return {
        success: false,
        message: 'Failed to add item to queue',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Get current queue status for a shop
   */
  async getQueueStatus(shopId: string): Promise<QueueStatus> {
    this.logMethodEntry('getQueueStatus', { shopId });
    
    try {
      const stats = await this.shopQueueRepository.getQueueStats(shopId);
      const averageWaitTime = await this.shopQueueRepository.getAverageProcessingTime(shopId);
      const nextAvailableSlot = await this.shopQueueRepository.getNextAvailableSlot(shopId);
      
      const shop = await this.shopRepository.findById(shopId);
      const maxCapacity = shop?.capacity || 50;
      const currentCapacity = stats.inProgressItems + stats.queuedItems;
      const utilizationRate = (currentCapacity / maxCapacity) * 100;

      const status: QueueStatus = {
        shopId,
        totalItems: stats.totalItems,
        queuedItems: stats.queuedItems,
        inProgressItems: stats.inProgressItems,
        completedItems: stats.completedItems,
        cancelledItems: stats.cancelledItems,
        averageWaitTime,
        estimatedCompletionTime: nextAvailableSlot,
        currentCapacity,
        maxCapacity,
        utilizationRate
      };

      this.logMethodExit('getQueueStatus', status);
      return status;
    } catch (error) {
      Logger.error('Failed to get queue status:', error);
      throw error;
    }
  }

  /**
   * Assign item to staff member
   */
  async assignItem(itemId: string, staffId: string): Promise<QueueManagementResult> {
    this.logMethodEntry('assignItem', { itemId, staffId });
    
    try {
      const item = await this.shopQueueRepository.findById(itemId);
      if (!item) {
        return {
          success: false,
          message: 'Queue item not found',
          error: 'ITEM_NOT_FOUND'
        };
      }

      if (item.status !== 'queued') {
        return {
          success: false,
          message: 'Item is not in queued status',
          error: 'INVALID_STATUS'
        };
      }

      // Update item
      const updatedItem = await this.shopQueueRepository.update(itemId, {
        assignedTo: staffId,
        status: 'in_progress',
        startedAt: new Date()
      });

      // Get updated queue status
      const queueStatus = await this.getQueueStatus(item.shopId);

      Logger.info('Item assigned to staff', { itemId, staffId });

      this.logMethodExit('assignItem', { success: true });
      return {
        success: true,
        message: 'Item assigned successfully',
        queueStatus,
        updatedItem: updatedItem as QueueItem
      };
    } catch (error) {
      Logger.error('Failed to assign item:', error);
      return {
        success: false,
        message: 'Failed to assign item',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Complete queue item
   */
  async completeItem(itemId: string, actualDuration?: number, notes?: string): Promise<QueueManagementResult> {
    this.logMethodEntry('completeItem', { itemId, actualDuration });
    
    try {
      const item = await this.shopQueueRepository.findById(itemId);
      if (!item) {
        return {
          success: false,
          message: 'Queue item not found',
          error: 'ITEM_NOT_FOUND'
        };
      }

      if (item.status !== 'in_progress') {
        return {
          success: false,
          message: 'Item is not in progress',
          error: 'INVALID_STATUS'
        };
      }

      // Calculate actual duration if not provided
      const duration = actualDuration || (item.startedAt ? 
        Math.round((Date.now() - item.startedAt.getTime()) / 60000) : 
        item.estimatedDuration
      );

      // Update item
      const updatedItem = await this.shopQueueRepository.update(itemId, {
        status: 'completed',
        completedAt: new Date(),
        actualDuration: duration,
        notes: notes || item.notes
      });

      // Update cleaning item status
      await this.cleaningItemRepository.update(item.cleaningItemId, {
        status: 'completed',
        actualTime: duration
      });

      // Get updated queue status
      const queueStatus = await this.getQueueStatus(item.shopId);

      Logger.info('Item completed', { itemId, duration });

      this.logMethodExit('completeItem', { success: true });
      return {
        success: true,
        message: 'Item completed successfully',
        queueStatus,
        updatedItem: updatedItem as QueueItem
      };
    } catch (error) {
      Logger.error('Failed to complete item:', error);
      return {
        success: false,
        message: 'Failed to complete item',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Get staff workload
   */
  async getStaffWorkload(staffId: string): Promise<StaffWorkload> {
    this.logMethodEntry('getStaffWorkload', { staffId });
    
    try {
      const workload = await this.shopQueueRepository.getStaffWorkload(staffId);
      
      const staffWorkload: StaffWorkload = {
        staffId,
        name: 'Staff Member', // In production, get from user service
        currentItems: workload.currentItems,
        maxCapacity: 10, // In production, get from staff profile
        utilizationRate: (workload.currentItems / 10) * 100,
        averageCompletionTime: workload.averageProcessingTime,
        isAvailable: workload.currentItems < 10,
        nextAvailableTime: workload.currentItems > 0 ? 
          new Date(Date.now() + (workload.averageProcessingTime * 60000)) : 
          new Date()
      };

      this.logMethodExit('getStaffWorkload', staffWorkload);
      return staffWorkload;
    } catch (error) {
      Logger.error('Failed to get staff workload:', error);
      throw error;
    }
  }

  /**
   * Get queue analytics
   */
  async getQueueAnalytics(shopId: string, period: 'day' | 'week' | 'month' = 'week'): Promise<QueueAnalytics> {
    this.logMethodEntry('getQueueAnalytics', { shopId, period });
    
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case 'day':
          startDate.setDate(endDate.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
      }

      const items = await this.shopQueueRepository.findByDateRange(shopId, startDate, endDate);
      const completedItems = items.filter(item => item.status === 'completed');
      const totalProcessingTime = completedItems.reduce((sum, item) => sum + (item.actualDuration || 0), 0);
      
      const analytics: QueueAnalytics = {
        shopId,
        period,
        totalItemsProcessed: completedItems.length,
        averageProcessingTime: completedItems.length > 0 ? totalProcessingTime / completedItems.length : 0,
        peakHours: this.calculatePeakHours(items),
        bottleneckItems: this.identifyBottlenecks(items),
        staffEfficiency: [], // Would need staff data
        completionRate: items.length > 0 ? (completedItems.length / items.length) * 100 : 0,
        customerSatisfactionScore: 4.5 // Placeholder
      };

      this.logMethodExit('getQueueAnalytics', analytics);
      return analytics;
    } catch (error) {
      Logger.error('Failed to get queue analytics:', error);
      throw error;
    }
  }

  /**
   * Get queue optimization recommendations
   */
  async getQueueOptimization(shopId: string): Promise<QueueOptimization> {
    this.logMethodEntry('getQueueOptimization', { shopId });
    
    try {
      const queueStatus = await this.getQueueStatus(shopId);
      const analytics = await this.getQueueAnalytics(shopId);
      
      const recommendations = [];
      
      // Capacity recommendations
      if (queueStatus.utilizationRate > 90) {
        recommendations.push({
          type: 'capacity' as const,
          priority: 'high' as const,
          description: 'Consider increasing shop capacity or adding more staff',
          expectedImpact: 'Reduce wait times by 30-40%',
          implementationCost: 'medium' as const
        });
      }
      
      // Process recommendations
      if (analytics.averageProcessingTime > 60) {
        recommendations.push({
          type: 'process' as const,
          priority: 'medium' as const,
          description: 'Optimize cleaning processes to reduce processing time',
          expectedImpact: 'Reduce processing time by 20-25%',
          implementationCost: 'low' as const
        });
      }

      const optimization: QueueOptimization = {
        shopId,
        recommendations,
        estimatedImprovement: {
          processingTimeReduction: recommendations.length > 0 ? 25 : 0,
          capacityIncrease: queueStatus.utilizationRate > 90 ? 30 : 0,
          costSavings: recommendations.length > 0 ? 15 : 0
        }
      };

      this.logMethodExit('getQueueOptimization', optimization);
      return optimization;
    } catch (error) {
      Logger.error('Failed to get queue optimization:', error);
      throw error;
    }
  }

  // Helper methods
  private calculatePeakHours(items: any[]): string[] {
    const hourCounts: { [key: string]: number } = {};
    
    items.forEach(item => {
      const hour = new Date(item.queuedAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    return Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => `${hour}:00`);
  }

  private identifyBottlenecks(items: any[]): string[] {
    const bottlenecks: string[] = [];
    
    // Find items that took significantly longer than estimated
    items.forEach(item => {
      if (item.actualDuration && item.estimatedDuration) {
        const ratio = item.actualDuration / item.estimatedDuration;
        if (ratio > 1.5) {
          bottlenecks.push(item.cleaningItemId);
        }
      }
    });
    
    return [...new Set(bottlenecks)];
  }

  /**
   * Update queue item status
   */
  async updateQueueItemStatus(shopId: string, queueItemId: string, status: string, actualDuration?: number, notes?: string): Promise<QueueManagementResult> {
    this.logMethodEntry('updateQueueItemStatus', { shopId, queueItemId, status });
    
    try {
      const item = await this.shopQueueRepository.findById(queueItemId);
      if (!item || item.shopId !== shopId) {
        return {
          success: false,
          message: 'Queue item not found',
          error: 'ITEM_NOT_FOUND'
        };
      }

      const updateData: Partial<QueueItem> = {
        status: status as any,
        actualDuration,
        notes
      };

      if (status === 'completed') {
        updateData.completedAt = new Date();
      }

      await this.shopQueueRepository.update(queueItemId, updateData);

      Logger.info('Queue item status updated', { queueItemId, status });

      this.logMethodExit('updateQueueItemStatus', { success: true });
      return {
        success: true,
        message: 'Queue item status updated successfully',
        updatedItem: { ...item, ...updateData }
      };
    } catch (error) {
      Logger.error('Failed to update queue item status:', error);
      return {
        success: false,
        message: 'Failed to update queue item status',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Assign staff to item
   */
  async assignStaffToItem(shopId: string, queueItemId: string, staffId: string): Promise<QueueManagementResult> {
    return await this.assignItem(queueItemId, staffId);
  }

  /**
   * Complete queue item
   */
  async completeQueueItem(shopId: string, queueItemId: string, actualDuration: number, notes?: string): Promise<QueueManagementResult> {
    return await this.completeItem(queueItemId, actualDuration, notes);
  }

  /**
   * Get queue history
   */
  async getQueueHistory(shopId: string, startDate: Date, endDate: Date): Promise<any> {
    this.logMethodEntry('getQueueHistory', { shopId, startDate, endDate });
    
    try {
      const items = await this.shopQueueRepository.findByDateRange(shopId, startDate, endDate);
      
      const history = {
        shopId,
        period: { startDate, endDate },
        totalItems: items.length,
        completedItems: items.filter(item => item.status === 'completed').length,
        cancelledItems: items.filter(item => item.status === 'cancelled').length,
        averageProcessingTime: this.calculateAverageProcessingTime(items),
        items: items.map(item => ({
          id: item.id,
          bookingId: item.bookingId,
          cleaningItemId: item.cleaningItemId,
          priority: item.priority,
          status: item.status,
          estimatedDuration: item.estimatedDuration,
          actualDuration: item.actualDuration,
          queuedAt: item.queuedAt,
          startedAt: item.startedAt,
          completedAt: item.completedAt,
          assignedTo: item.assignedTo
        }))
      };

      this.logMethodExit('getQueueHistory', history);
      return history;
    } catch (error) {
      Logger.error('Failed to get queue history:', error);
      throw error;
    }
  }

  /**
   * Optimize queue
   */
  async optimizeQueue(shopId: string): Promise<QueueOptimization> {
    return await this.getQueueOptimization(shopId);
  }

  private calculateAverageProcessingTime(items: any[]): number {
    const completedItems = items.filter(item => item.actualDuration);
    if (completedItems.length === 0) return 0;
    
    const totalTime = completedItems.reduce((sum, item) => sum + item.actualDuration, 0);
    return totalTime / completedItems.length;
  }
}
