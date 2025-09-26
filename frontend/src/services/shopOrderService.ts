// Shop Order Management Service - Focused on cleaning operations
import { apiCall } from './apiConfig';

export interface CleaningOrder {
  id: string;
  bookingId: string; // Reference to original booking
  customerName: string;
  customerPhone: string;
  items: CleaningItem[];
  status: 'pending' | 'received' | 'in_progress' | 'completed' | 'ready_for_pickup';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  estimatedCompletion: Date;
  actualCompletion?: Date;
  specialInstructions?: string;
  driverInfo: {
    name: string;
    phone: string;
    vehicle: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CleaningItem {
  id: string;
  name: string;
  type: 'clothing' | 'shoes' | 'accessories' | 'furniture' | 'other';
  condition: 'good' | 'fair' | 'poor' | 'damaged';
  cleaningMethod: 'standard' | 'delicate' | 'heavy_duty' | 'specialty';
  estimatedTime: number; // minutes
  actualTime?: number;
  notes?: string;
  photos?: string[];
}

export interface ShopInventory {
  id: string;
  name: string;
  category: 'detergent' | 'equipment' | 'supplies' | 'tools';
  quantity: number;
  minQuantity: number;
  unit: string;
  lastRestocked: Date;
  supplier: string;
}

export interface CleaningProcess {
  id: string;
  orderId: string;
  step: 'preparation' | 'cleaning' | 'drying' | 'finishing' | 'quality_check';
  status: 'pending' | 'in_progress' | 'completed';
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
  photos?: string[];
}

export const shopOrderService = {
  // Get all cleaning orders for the shop
  async getCleaningOrders(status?: string): Promise<CleaningOrder[]> {
    try {
      const params = status ? `?status=${status}` : '';
      const data = await apiCall(`/api/shop/orders${params}`);
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch cleaning orders:', error);
      return [];
    }
  },

  // Get a specific cleaning order
  async getCleaningOrder(orderId: string): Promise<CleaningOrder | null> {
    try {
      const data = await apiCall(`/api/shop/orders/${orderId}`);
      return data.data;
    } catch (error) {
      console.error('Failed to fetch cleaning order:', error);
      return null;
    }
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: string, notes?: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const data = await apiCall(`/api/shop/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({
          status,
          notes,
          timestamp: new Date().toISOString()
        })
      });
      return {
        success: true,
        message: data.message || 'Status updated successfully'
      };
    } catch (error) {
      console.error('Failed to update order status:', error);
      return {
        success: false,
        message: 'Failed to update status. Please try again.'
      };
    }
  },

  // Start cleaning process
  async startCleaning(orderId: string, estimatedCompletion: Date): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const data = await apiCall(`/api/shop/orders/${orderId}/start-cleaning`, {
        method: 'POST',
        body: JSON.stringify({
          estimatedCompletion: estimatedCompletion.toISOString(),
          timestamp: new Date().toISOString()
        })
      });
      return {
        success: true,
        message: data.message || 'Cleaning process started'
      };
    } catch (error) {
      console.error('Failed to start cleaning:', error);
      return {
        success: false,
        message: 'Failed to start cleaning. Please try again.'
      };
    }
  },

  // Complete cleaning process
  async completeCleaning(orderId: string, notes?: string, photos?: string[]): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const data = await apiCall(`/api/shop/orders/${orderId}/complete-cleaning`, {
        method: 'POST',
        body: JSON.stringify({
          notes,
          photos,
          completedAt: new Date().toISOString()
        })
      });
      return {
        success: true,
        message: data.message || 'Cleaning completed successfully'
      };
    } catch (error) {
      console.error('Failed to complete cleaning:', error);
      return {
        success: false,
        message: 'Failed to complete cleaning. Please try again.'
      };
    }
  },

  // Get shop inventory
  async getInventory(): Promise<ShopInventory[]> {
    try {
      const data = await apiCall('/api/shop/inventory');
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      return [];
    }
  },

  // Update inventory
  async updateInventory(itemId: string, quantity: number): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const data = await apiCall(`/api/shop/inventory/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
      });
      return {
        success: true,
        message: data.message || 'Inventory updated successfully'
      };
    } catch (error) {
      console.error('Failed to update inventory:', error);
      return {
        success: false,
        message: 'Failed to update inventory. Please try again.'
      };
    }
  },

  // Send message to driver
  async messageDriver(orderId: string, message: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const data = await apiCall(`/api/shop/orders/${orderId}/message-driver`, {
        method: 'POST',
        body: JSON.stringify({
          message,
          timestamp: new Date().toISOString()
        })
      });
      return {
        success: true,
        message: data.message || 'Message sent successfully'
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      return {
        success: false,
        message: 'Failed to send message. Please try again.'
      };
    }
  },

  // Get shop analytics
  async getShopAnalytics(period: 'day' | 'week' | 'month' | 'year' = 'week'): Promise<{
    totalOrders: number;
    completedOrders: number;
    averageCompletionTime: number;
    revenue: number;
    topItems: Array<{ name: string; count: number }>;
  }> {
    try {
      const data = await apiCall(`/api/shop/analytics?period=${period}`);
      return data.data || {
        totalOrders: 0,
        completedOrders: 0,
        averageCompletionTime: 0,
        revenue: 0,
        topItems: []
      };
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      return {
        totalOrders: 0,
        completedOrders: 0,
        averageCompletionTime: 0,
        revenue: 0,
        topItems: []
      };
    }
  }
};
