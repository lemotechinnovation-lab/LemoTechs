import { PoolClient } from 'pg';
import { Repository } from '../../infrastructure/advancedLinqQueryBuilder';
import { ShopQueueConfiguration, EntityMappers } from '../../infrastructure/entityConfigurations';
import { ShopQueue } from '../../infrastructure/entities/databaseSchema';

export class ShopQueueRepository extends Repository<ShopQueue> {
  constructor(client: PoolClient) {
    super(client, ShopQueueConfiguration, EntityMappers.shopQueue);
  }

  async findByShopId(shopId: string): Promise<ShopQueue[]> {
    return await this.findWhere(item => item.shopId === shopId);
  }

  async findByStatus(status: string): Promise<ShopQueue[]> {
    return await this.findWhere(item => item.status === status);
  }

  async findByShopAndStatus(shopId: string, status: string): Promise<ShopQueue[]> {
    return await this.findWhere(item => item.shopId === shopId && item.status === status);
  }

  async findByAssignedTo(staffId: string): Promise<ShopQueue[]> {
    return await this.findWhere(item => item.assignedTo === staffId);
  }

  async findByPriority(priority: string): Promise<ShopQueue[]> {
    return await this.findWhere(item => item.priority === priority);
  }

  async findOverdueItems(): Promise<ShopQueue[]> {
    const now = new Date();
    return await this.findWhere(item => {
      const estimatedCompletion = new Date(item.queuedAt.getTime() + (item.estimatedDuration * 60000));
      return item.status === 'in_progress' && now > estimatedCompletion;
    });
  }

  async getQueueStats(shopId: string): Promise<any> {
    const totalItems = await this.countWhere(item => item.shopId === shopId);
    const queuedItems = await this.countWhere(item => item.shopId === shopId && item.status === 'queued');
    const inProgressItems = await this.countWhere(item => item.shopId === shopId && item.status === 'in_progress');
    const completedItems = await this.countWhere(item => item.shopId === shopId && item.status === 'completed');
    const cancelledItems = await this.countWhere(item => item.shopId === shopId && item.status === 'cancelled');

    return {
      totalItems,
      queuedItems,
      inProgressItems,
      completedItems,
      cancelledItems
    };
  }

  async getAverageProcessingTime(shopId: string): Promise<number> {
    const completedItems = await this.findWhere(item => 
      item.shopId === shopId && 
      item.status === 'completed' && 
      item.actualDuration !== null
    );
    
    if (completedItems.length === 0) return 0;
    
    const totalTime = completedItems.reduce((sum, item) => sum + (item.actualDuration || 0), 0);
    return totalTime / completedItems.length;
  }

  async getStaffWorkload(staffId: string): Promise<any> {
    const currentItems = await this.countWhere(item => 
      item.assignedTo === staffId && 
      (item.status === 'in_progress' || item.status === 'queued')
    );
    
    const completedItems = await this.findWhere(item => 
      item.assignedTo === staffId && 
      item.status === 'completed' && 
      item.actualDuration !== null
    );
    
    const averageTime = completedItems.length > 0 
      ? completedItems.reduce((sum, item) => sum + (item.actualDuration || 0), 0) / completedItems.length
      : 0;

    return {
      currentItems,
      averageProcessingTime: averageTime,
      totalCompleted: completedItems.length
    };
  }

  async findByDateRange(shopId: string, startDate: Date, endDate: Date): Promise<ShopQueue[]> {
    return await this.findWhere(item =>
      item.shopId === shopId &&
      item.queuedAt >= startDate &&
      item.queuedAt <= endDate
    );
  }

  async getNextAvailableSlot(shopId: string): Promise<Date> {
    const inProgressItems = await this.findWhere(item => 
      item.shopId === shopId && 
      item.status === 'in_progress'
    );
    
    if (inProgressItems.length === 0) {
      return new Date();
    }
    
    // Calculate when the earliest item will be completed
    const earliestCompletion = Math.min(
      ...inProgressItems.map(item => 
        item.startedAt ? 
          item.startedAt.getTime() + (item.estimatedDuration * 60000) : 
          Date.now()
      )
    );
    
    return new Date(earliestCompletion);
  }
}
