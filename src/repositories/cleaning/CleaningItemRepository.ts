// Cleaning Item Repository with LINQ capabilities
import { PoolClient } from 'pg';
import { Repository } from '../../infrastructure/advancedLinqQueryBuilder';
import { CleaningItemConfiguration, EntityMappers } from '../../infrastructure/entityConfigurations';
import { CleaningItem } from '../../infrastructure/entities/databaseSchema';

export class CleaningItemRepository extends Repository<CleaningItem> {
  constructor(client: PoolClient) {
    super(client, CleaningItemConfiguration, EntityMappers.cleaningItem);
  }

  /**
   * Find cleaning items by booking ID
   */
  async findByBookingId(bookingId: string): Promise<CleaningItem[]> {
    return await this.findWhere(item => item.bookingId === bookingId);
  }

  /**
   * Find cleaning items by status
   */
  async findByStatus(status: string): Promise<CleaningItem[]> {
    return await this.findWhere(item => item.status === status);
  }

  /**
   * Find cleaning items by shop ID (through booking)
   */
  async findByShopId(shopId: string): Promise<CleaningItem[]> {
    // This would require a join with bookings table
    // For now, return empty array as placeholder
    return [];
  }

  /**
   * Find cleaning items by assigned user
   */
  async findByAssignedTo(userId: string): Promise<CleaningItem[]> {
    // This would require assignment tracking
    // For now, return empty array as placeholder
    return [];
  }

  /**
   * Find cleaning items by type
   */
  async findByType(type: string): Promise<CleaningItem[]> {
    return await this.findWhere(item => item.type === type);
  }

  /**
   * Find cleaning items by cleaning method
   */
  async findByCleaningMethod(method: string): Promise<CleaningItem[]> {
    return await this.findWhere(item => item.cleaningMethod === method);
  }

  /**
   * Find items requiring quality check
   */
  async findItemsRequiringQualityCheck(): Promise<CleaningItem[]> {
    return await this.findWhere(item => item.status === 'completed');
  }

  /**
   * Find items by condition
   */
  async findByCondition(condition: string): Promise<CleaningItem[]> {
    return await this.findWhere(item => item.condition === condition);
  }

  /**
   * Get cleaning item statistics
   */
  async getCleaningItemStats(): Promise<any> {
    const totalItems = await this.count();
    const itemsByStatus = await this.countWhere(item => item.status === 'received');
    const itemsByType = await this.countWhere(item => item.type === 'clothing');
    const itemsByCondition = await this.countWhere(item => item.condition === 'good');
    const itemsRequiringRework = await this.countWhere(item => item.status === 'completed');

    return {
      totalItems,
      itemsByStatus,
      itemsByType,
      itemsByCondition,
      itemsRequiringRework
    };
  }

  /**
   * Find items by date range
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<CleaningItem[]> {
    return await this.findWhere(item => 
      item.createdAt >= startDate && item.createdAt <= endDate
    );
  }

  /**
   * Find items by estimated time range
   */
  async findByEstimatedTimeRange(minTime: number, maxTime: number): Promise<CleaningItem[]> {
    return await this.findWhere(item => 
      item.estimatedTime >= minTime && item.estimatedTime <= maxTime
    );
  }

  /**
   * Find items with notes
   */
  async findWithNotes(): Promise<CleaningItem[]> {
    return await this.findWhere(item => item.notes !== null && item.notes !== '');
  }
}
