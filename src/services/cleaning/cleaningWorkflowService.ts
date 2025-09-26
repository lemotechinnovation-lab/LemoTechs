import { PoolClient } from 'pg';
import { CleaningItemRepository } from '../../repositories/cleaning/CleaningItemRepository';
import { BookingRepository } from '../../repositories/booking/BookingRepository';
import { ShopRepository } from '../../repositories/shop/ShopRepository';
import { CleaningItem, CleaningMethod, CleaningStatus, ItemCondition, ItemType, CleaningWorkflowResult, ItemAssessmentResult, CleaningProgressUpdate, QualityCheckResult } from '../../models';
import { BaseService } from '../base/BaseService';
import { Logger } from '../../utils/logger';
import { ICleaningWorkflowService } from '../../infrastructure/di/interfaces';

export class CleaningWorkflowService extends BaseService implements ICleaningWorkflowService {
  private cleaningItemRepository: CleaningItemRepository;
  private bookingRepository: BookingRepository;
  private shopRepository: ShopRepository;

  constructor(client: PoolClient) {
    super();
    this.cleaningItemRepository = new CleaningItemRepository(client);
    this.bookingRepository = new BookingRepository(client);
    this.shopRepository = new ShopRepository(client);
  }

  /**
   * Create cleaning items from a booking
   */
  async createCleaningItemsFromBooking(bookingId: string, items: Partial<CleaningItem>[]): Promise<CleaningWorkflowResult> {
    try {
      // Verify booking exists and is in correct status
      const booking = await this.bookingRepository.findById(bookingId);
      if (!booking) {
        return { success: false, error: 'Booking not found' };
      }

      if (booking.status !== 'confirmed' && booking.status !== 'cleaning') {
        return { success: false, error: 'Booking must be confirmed or in progress to create cleaning items' };
      }

      // Create cleaning items
      const createdItems: CleaningItem[] = [];
      for (const itemData of items) {
        const cleaningItem: Partial<CleaningItem> = {
          ...itemData,
          bookingId,
          status: 'received',
          estimatedTime: this.calculateEstimatedTime(itemData.type!, itemData.condition!),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const createdItem = await this.cleaningItemRepository.create(cleaningItem);
        createdItems.push(createdItem);
      }

      // Update booking status to cleaning if needed
      if (booking.status === 'confirmed') {
        await this.bookingRepository.update(bookingId, { 
          status: 'cleaning',
          updatedAt: new Date()
        });
      }

      Logger.info(`Created ${createdItems.length} cleaning items for booking ${bookingId}`);
      return { success: true, data: createdItems };

    } catch (error) {
      Logger.error('Error creating cleaning items from booking:', error);
      return { success: false, error: 'Failed to create cleaning items' };
    }
  }

  /**
   * Assess an item and recommend cleaning method
   */
  async assessItem(itemId: string, assessorId: string, assessment: {
    condition: ItemCondition;
    photos: string[];
    notes?: string;
    specialRequirements?: string;
  }): Promise<CleaningWorkflowResult> {
    try {
      const item = await this.cleaningItemRepository.findById(itemId);
      if (!item) {
        return { success: false, error: 'Cleaning item not found' };
      }

      // Update item with assessment
      const updatedItem = await this.cleaningItemRepository.update(itemId, {
        condition: assessment.condition,
        photos: [...(item.photos || []), ...assessment.photos],
        notes: assessment.notes,
        status: 'assessed',
        updatedAt: new Date()
      });

      // Determine recommended cleaning method
      const recommendedMethod = this.determineCleaningMethod(item.type, assessment.condition, assessment.specialRequirements);
      const estimatedTime = this.calculateEstimatedTime(item.type, assessment.condition);
      const riskLevel = this.assessRiskLevel(item.type, assessment.condition);

      const assessmentResult: ItemAssessmentResult = {
        item: updatedItem,
        recommendedMethod,
        estimatedTime,
        riskLevel,
        specialInstructions: assessment.specialRequirements
      };

      Logger.info(`Item ${itemId} assessed by ${assessorId}`);
      return { success: true, data: assessmentResult };

    } catch (error) {
      Logger.error('Error assessing item:', error);
      return { success: false, error: 'Failed to assess item' };
    }
  }

  /**
   * Start cleaning process for an item
   */
  async startCleaning(itemId: string, cleanerId: string, method: CleaningMethod): Promise<CleaningWorkflowResult> {
    try {
      const item = await this.cleaningItemRepository.findById(itemId);
      if (!item) {
        return { success: false, error: 'Cleaning item not found' };
      }

      if (item.status !== 'assessed') {
        return { success: false, error: 'Item must be assessed before cleaning can start' };
      }

      // Update item status and method
      const updatedItem = await this.cleaningItemRepository.update(itemId, {
        cleaningMethod: method,
        status: 'cleaning',
        updatedAt: new Date()
      });

      Logger.info(`Started cleaning item ${itemId} with method ${method} by ${cleanerId}`);
      return { success: true, data: updatedItem };

    } catch (error) {
      Logger.error('Error starting cleaning:', error);
      return { success: false, error: 'Failed to start cleaning' };
    }
  }

  /**
   * Update cleaning progress
   */
  async updateCleaningProgress(update: CleaningProgressUpdate): Promise<CleaningWorkflowResult> {
    try {
      const item = await this.cleaningItemRepository.findById(update.itemId);
      if (!item) {
        return { success: false, error: 'Cleaning item not found' };
      }

      if (item.status !== 'cleaning') {
        return { success: false, error: 'Item must be in cleaning status to update progress' };
      }

      // Update item with progress
      const updatedItem = await this.cleaningItemRepository.update(update.itemId, {
        status: update.status,
        notes: update.notes,
        photos: update.photos ? [...(item.photos || []), ...update.photos] : item.photos,
        actualTime: update.status === 'completed' ? this.calculateActualTime(item.createdAt, new Date()) : item.actualTime,
        updatedAt: new Date()
      });

      Logger.info(`Updated cleaning progress for item ${update.itemId}: ${update.progress}%`);
      return { success: true, data: updatedItem };

    } catch (error) {
      Logger.error('Error updating cleaning progress:', error);
      return { success: false, error: 'Failed to update cleaning progress' };
    }
  }

  /**
   * Perform quality check on completed item
   */
  async performQualityCheck(itemId: string, checkerId: string, check: {
    passed: boolean;
    issues?: string[];
    photos?: string[];
    notes?: string;
  }): Promise<CleaningWorkflowResult> {
    try {
      const item = await this.cleaningItemRepository.findById(itemId);
      if (!item) {
        return { success: false, error: 'Cleaning item not found' };
      }

      if (item.status !== 'completed') {
        return { success: false, error: 'Item must be completed before quality check' };
      }

      // Update item based on quality check result
      const newStatus = check.passed ? 'ready' : 'cleaning';
      const updatedItem = await this.cleaningItemRepository.update(itemId, {
        status: newStatus,
        notes: check.notes,
        photos: check.photos ? [...(item.photos || []), ...check.photos] : item.photos,
        updatedAt: new Date()
      });

      const qualityResult: QualityCheckResult = {
        itemId,
        passed: check.passed,
        issues: check.issues,
        photos: check.photos,
        approvedBy: checkerId,
        approvedAt: new Date()
      };

      Logger.info(`Quality check ${check.passed ? 'passed' : 'failed'} for item ${itemId} by ${checkerId}`);
      return { success: true, data: { item: updatedItem, qualityCheck: qualityResult } };

    } catch (error) {
      Logger.error('Error performing quality check:', error);
      return { success: false, error: 'Failed to perform quality check' };
    }
  }

  /**
   * Get cleaning items by status for shop management
   */
  async getItemsByStatus(status: CleaningStatus, shopId?: string): Promise<CleaningWorkflowResult> {
    try {
      let items: CleaningItem[];
      
      if (shopId) {
        // Get items for specific shop
        const shop = await this.shopRepository.findById(shopId);
        if (!shop) {
          return { success: false, error: 'Shop not found' };
        }
        
        // This would need to be implemented in the repository
        // For now, get all items with status
        items = await this.cleaningItemRepository.findByStatus(status);
      } else {
        items = await this.cleaningItemRepository.findByStatus(status);
      }

      return { success: true, data: items };

    } catch (error) {
      Logger.error('Error getting items by status:', error);
      return { success: false, error: 'Failed to get items by status' };
    }
  }

  /**
   * Get cleaning workflow statistics for a shop
   */
  async getWorkflowStats(shopId: string): Promise<CleaningWorkflowResult> {
    try {
      const shop = await this.shopRepository.findById(shopId);
      if (!shop) {
        return { success: false, error: 'Shop not found' };
      }

      // Get all items for this shop (this would need proper implementation)
      const allItems = await this.cleaningItemRepository.findByStatus('received'); // Placeholder
      
      const stats = {
        totalItems: allItems.length,
        itemsByStatus: {
          received: allItems.filter(item => item.status === 'received').length,
          assessed: allItems.filter(item => item.status === 'assessed').length,
          cleaning: allItems.filter(item => item.status === 'cleaning').length,
          completed: allItems.filter(item => item.status === 'completed').length,
          ready: allItems.filter(item => item.status === 'ready').length
        },
        averageCleaningTime: this.calculateAverageCleaningTime(allItems),
        qualityPassRate: this.calculateQualityPassRate(allItems)
      };

      return { success: true, data: stats };

    } catch (error) {
      Logger.error('Error getting workflow stats:', error);
      return { success: false, error: 'Failed to get workflow stats' };
    }
  }

  // Helper methods
  private calculateEstimatedTime(type: ItemType, condition: ItemCondition): number {
    const baseTimes = {
      clothing: { good: 30, fair: 45, poor: 60, damaged: 90 },
      shoes: { good: 45, fair: 60, poor: 90, damaged: 120 },
      accessories: { good: 20, fair: 30, poor: 45, damaged: 60 },
      furniture: { good: 120, fair: 180, poor: 240, damaged: 300 }
    };

    return baseTimes[type][condition];
  }

  private determineCleaningMethod(type: ItemType, condition: ItemCondition, specialRequirements?: string): CleaningMethod {
    if (specialRequirements?.toLowerCase().includes('dry clean')) return 'dry_clean';
    if (specialRequirements?.toLowerCase().includes('hand wash')) return 'hand_wash';
    if (specialRequirements?.toLowerCase().includes('specialty')) return 'specialty';
    
    if (type === 'clothing' && condition === 'good') return 'wash';
    if (type === 'shoes') return 'specialty';
    if (type === 'accessories') return 'hand_wash';
    if (type === 'furniture') return 'specialty';
    
    return 'wash';
  }

  private assessRiskLevel(type: ItemType, condition: ItemCondition): 'low' | 'medium' | 'high' {
    if (condition === 'damaged' || type === 'furniture') return 'high';
    if (condition === 'poor' || type === 'shoes') return 'medium';
    return 'low';
  }

  private calculateActualTime(startTime: Date, endTime: Date): number {
    return Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)); // minutes
  }

  private calculateAverageCleaningTime(items: CleaningItem[]): number {
    const completedItems = items.filter(item => item.actualTime);
    if (completedItems.length === 0) return 0;
    
    const totalTime = completedItems.reduce((sum, item) => sum + (item.actualTime || 0), 0);
    return Math.round(totalTime / completedItems.length);
  }

  private calculateQualityPassRate(items: CleaningItem[]): number {
    const qualityCheckedItems = items.filter(item => item.status === 'ready' || item.status === 'completed');
    if (qualityCheckedItems.length === 0) return 0;
    
    const passedItems = qualityCheckedItems.filter(item => item.status === 'ready').length;
    return Math.round((passedItems / qualityCheckedItems.length) * 100);
  }
}
