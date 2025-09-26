import { ShopOrder, ShopInventory } from '../../models/shop/shopOrderModel';
import { ShopOrderRepository } from '../../repositories/shop/ShopOrderRepository';
import { ShopRepository } from '../../repositories/shop/ShopRepository';
import { ShopInventoryRepository } from '../../repositories/shop/ShopInventoryRepository';
import { IShopOrderService } from '../../infrastructure/di/interfaces';
import { BaseService } from '../base/BaseService';

export class ShopOrderService extends BaseService implements IShopOrderService {
  constructor(
    private shopOrderRepository: ShopOrderRepository,
    private shopRepository: ShopRepository,
    private shopInventoryRepository: ShopInventoryRepository
  ) {
    super();
  }

  // Create a new shop order
  async createOrder(userId: string, orderData: Partial<ShopOrder>): Promise<ShopOrder> {
    this.logMethodEntry('createOrder', { userId });
    
    try {
      const shop = await this.shopRepository.findByUserId(userId);
      if (!shop) {
        throw new Error('Shop not found');
      }

      const order = await this.shopOrderRepository.create({
        id: orderData.id || `order_${Date.now()}`,
        shopId: shop.id,
        bookingId: orderData.bookingId || '',
        status: orderData.status || 'pending',
        items: orderData.items || {},
        totalAmount: orderData.totalAmount || 0,
        notes: orderData.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      this.logMethodExit('createOrder', { orderId: order.id });
      return order;
    } catch (error) {
      this.handleError('createOrder', error);
    }
  }

  // Get orders for a shop
  async getOrders(userId: string, filters: any): Promise<any> {
    this.logMethodEntry('getOrders', { userId, filters });
    
    try {
      const shop = await this.shopRepository.findByUserId(userId);
      if (!shop) {
        throw new Error('Shop not found');
      }

      const orders = await this.shopOrderRepository.findByShopId(shop.id);
      
      this.logMethodExit('getOrders', { count: orders.length });
      return orders;
    } catch (error) {
      this.handleError('getOrders', error);
    }
  }

  // Get order by ID
  async getOrderById(userId: string, orderId: string): Promise<any> {
    this.logMethodEntry('getOrderById', { userId, orderId });
    
    try {
      const shop = await this.shopRepository.findByUserId(userId);
      if (!shop) {
        throw new Error('Shop not found');
      }

      const order = await this.shopOrderRepository.findById(orderId);
      if (!order || order.shopId !== shop.id) {
        this.logMethodExit('getOrderById', null);
        return null;
      }

      this.logMethodExit('getOrderById', { orderId: order.id });
      return order;
    } catch (error) {
      this.handleError('getOrderById', error);
    }
  }

  // Update order status
  async updateOrderStatus(userId: string, orderId: string, status: string, notes?: string): Promise<any> {
    this.logMethodEntry('updateOrderStatus', { userId, orderId, status });
    
    try {
      const shop = await this.shopRepository.findByUserId(userId);
      if (!shop) {
        throw new Error('Shop not found');
      }

      const order = await this.shopOrderRepository.findById(orderId);
      if (!order || order.shopId !== shop.id) {
        throw new Error('Order not found');
      }

      const updateData: any = {
        status,
        updatedAt: new Date()
      };

      if (notes) {
        updateData.notes = notes;
      }

      const updatedOrder = await this.shopOrderRepository.update(orderId, updateData);

      this.logMethodExit('updateOrderStatus', { orderId: updatedOrder?.id });
      return updatedOrder;
    } catch (error) {
      this.handleError('updateOrderStatus', error);
    }
  }

  // Get shop inventory
  async getInventory(userId: string): Promise<any> {
    this.logMethodEntry('getInventory', { userId });
    
    try {
      const shop = await this.shopRepository.findByUserId(userId);
      if (!shop) {
        throw new Error('Shop not found');
      }

      const inventory = await this.shopInventoryRepository.findByShopId(shop.id);
      
      this.logMethodExit('getInventory', { count: inventory.length });
      return inventory;
    } catch (error) {
      this.handleError('getInventory', error);
    }
  }

  // Update inventory item
  async updateInventoryItem(userId: string, itemId: string, quantity: number): Promise<any> {
    this.logMethodEntry('updateInventoryItem', { userId, itemId, quantity });
    
    try {
      const shop = await this.shopRepository.findByUserId(userId);
      if (!shop) {
        throw new Error('Shop not found');
      }

      const item = await this.shopInventoryRepository.findById(itemId);
      if (!item || item.shopId !== shop.id) {
        throw new Error('Inventory item not found');
      }

      const updatedItem = await this.shopInventoryRepository.update(itemId, {
        quantity,
        updatedAt: new Date()
      });

      this.logMethodExit('updateInventoryItem', { itemId: updatedItem?.id });
      return updatedItem;
    } catch (error) {
      this.handleError('updateInventoryItem', error);
    }
  }

  // Get shop analytics
  async getAnalytics(userId: string, period: string): Promise<any> {
    this.logMethodEntry('getAnalytics', { userId, period });
    
    try {
      const shop = await this.shopRepository.findByUserId(userId);
      if (!shop) {
        throw new Error('Shop not found');
      }

      const orders = await this.shopOrderRepository.findByShopId(shop.id);
      const completedOrders = orders.filter(order => order.status === 'completed');
      
      const analytics = {
        totalOrders: orders.length,
        completedOrders: completedOrders.length,
        totalRevenue: completedOrders.reduce((sum, order) => sum + order.totalAmount, 0),
        averageOrderValue: completedOrders.length > 0 
          ? completedOrders.reduce((sum, order) => sum + order.totalAmount, 0) / completedOrders.length 
          : 0,
        period,
        monthlyStats: {
          orders: Math.round(completedOrders.length * 0.15), // 15% monthly growth estimate
          revenue: Math.round(completedOrders.reduce((sum, order) => sum + order.totalAmount, 0) * 0.12) // 12% revenue growth estimate
        }
      };

      this.logMethodExit('getAnalytics', analytics);
      return analytics;
    } catch (error) {
      this.handleError('getAnalytics', error);
    }
  }
}