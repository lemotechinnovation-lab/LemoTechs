import { Request, Response } from 'express';
import { getServices } from '../infrastructure/di/injector';
import { ShopOrder, ShopInventory } from '../types';
import { Logger } from '../utils/logger';

// Shop Order Management Controller
export class ShopOrderController {
  // Get all orders for a shop
  static async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { status, page = 1, limit = 20 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { shopOrderService } = getServices(req);
      const orders = await shopOrderService.getOrders(userId, {
        status: status as string,
        limit: Number(limit),
        offset
      });

      res.json({
        success: true,
        message: 'Orders retrieved successfully',
        data: orders
      });
    } catch (error) {
      Logger.error('Error getting shop orders:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve orders',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get a specific order
  static async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { orderId } = req.params;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { shopOrderService } = getServices(req);
      const order = await shopOrderService.getOrderById(userId, orderId!);

      if (!order) {
        res.status(404).json({ success: false, message: 'Order not found' });
        return;
      }

      res.json({
        success: true,
        message: 'Order retrieved successfully',
        data: order
      });
    } catch (error) {
      Logger.error('Error getting shop order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve order',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update order status
  static async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { orderId } = req.params;
      const { status, notes } = req.body;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { shopOrderService } = getServices(req);
      const updatedOrder = await shopOrderService.updateOrderStatus(userId, orderId!, status, notes);

      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: updatedOrder
      });
    } catch (error) {
      Logger.error('Error updating order status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update order status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Send message to driver
  static async sendOrderMessage(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { orderId } = req.params;
      const { message, toRole } = req.body;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      // This would integrate with your messaging system (SignalR, SMS, etc.)
      Logger.info(`Shop ${userId} sending message to ${toRole} for order ${orderId}: ${message}`);

      res.json({
        success: true,
        message: 'Message sent successfully'
      });
    } catch (error) {
      Logger.error('Error sending order message:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send message',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get shop inventory
  static async getInventory(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { shopOrderService } = getServices(req);
      const inventory = await shopOrderService.getInventory(userId);

      res.json({
        success: true,
        message: 'Inventory retrieved successfully',
        data: inventory
      });
    } catch (error) {
      Logger.error('Error getting shop inventory:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve inventory',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update inventory item
  static async updateInventoryItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { itemId } = req.params;
      const { quantity } = req.body;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { shopOrderService } = getServices(req);
      const updatedItem = await shopOrderService.updateInventoryItem(userId, itemId!, quantity);

      res.json({
        success: true,
        message: 'Inventory updated successfully',
        data: updatedItem
      });
    } catch (error) {
      Logger.error('Error updating inventory:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update inventory',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get shop analytics
  static async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { period = 'week' } = req.query;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { shopOrderService } = getServices(req);
      const analytics = await shopOrderService.getAnalytics(userId, period as 'day' | 'week' | 'month' | 'year');

      res.json({
        success: true,
        message: 'Analytics retrieved successfully',
        data: analytics
      });
    } catch (error) {
      Logger.error('Error getting shop analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve analytics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Start cleaning process
  static async startCleaning(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { orderId } = req.params;
      const { estimatedCompletion } = req.body;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { shopOrderService } = getServices(req);
      const updatedOrder = await shopOrderService.updateOrderStatus(userId, orderId!, 'in_progress');

      res.json({
        success: true,
        message: 'Cleaning started successfully',
        data: updatedOrder
      });
    } catch (error) {
      Logger.error('Error starting cleaning:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start cleaning',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Complete cleaning process
  static async completeCleaning(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { orderId } = req.params;
      const { notes } = req.body;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { shopOrderService } = getServices(req);
      const updatedOrder = await shopOrderService.updateOrderStatus(userId, orderId!, 'ready_for_pickup', notes);

      res.json({
        success: true,
        message: 'Cleaning completed successfully',
        data: updatedOrder
      });
    } catch (error) {
      Logger.error('Error completing cleaning:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to complete cleaning',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
