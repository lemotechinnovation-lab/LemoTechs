import { Request, Response } from 'express';
import { getServices } from '../infrastructure/di/injector';
import { Logger } from '../utils/logger';

export const addInventoryItemController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;
    const { itemData, performedBy } = req.body;
    
    if (!shopId || !itemData || !performedBy) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: shopId, itemData, performedBy'
      });
      return;
    }

    const services = getServices(req);
    const result = await services.shopInventoryTrackingService.addInventoryItem(shopId, itemData, performedBy);
    
    if (result.success) {
      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          item: result.item,
          transaction: result.transaction,
          alerts: result.alerts
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    Logger.error('Add inventory item controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateInventoryQuantityController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shopId, itemId } = req.params;
    const { newQuantity, reason, performedBy, referenceId } = req.body;
    
    if (!shopId || !itemId || newQuantity === undefined || !reason || !performedBy) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: shopId, itemId, newQuantity, reason, performedBy'
      });
      return;
    }

    const services = getServices(req);
    const result = await services.shopInventoryTrackingService.updateInventoryQuantity(
      shopId, 
      itemId, 
      newQuantity, 
      reason, 
      performedBy,
      referenceId
    );
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          item: result.item,
          transaction: result.transaction,
          alerts: result.alerts
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    Logger.error('Update inventory quantity controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getInventoryDashboardController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;
    
    if (!shopId) {
      res.status(400).json({
        success: false,
        message: 'Shop ID is required'
      });
      return;
    }

    const services = getServices(req);
    const dashboard = await services.shopInventoryTrackingService.getInventoryDashboard(shopId);
    
    res.status(200).json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    Logger.error('Get inventory dashboard controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const generateInventoryReportController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;
    const { period = 'monthly' } = req.query;
    
    if (!shopId) {
      res.status(400).json({
        success: false,
        message: 'Shop ID is required'
      });
      return;
    }

    const services = getServices(req);
    const report = await services.shopInventoryTrackingService.generateInventoryReport(
      shopId, 
      period as 'daily' | 'weekly' | 'monthly' | 'yearly'
    );
    
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    Logger.error('Generate inventory report controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getInventoryOptimizationController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;
    
    if (!shopId) {
      res.status(400).json({
        success: false,
        message: 'Shop ID is required'
      });
      return;
    }

    const services = getServices(req);
    const optimization = await services.shopInventoryTrackingService.getInventoryOptimization(shopId);
    
    res.status(200).json({
      success: true,
      data: optimization
    });
  } catch (error) {
    Logger.error('Get inventory optimization controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getLowStockItemsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;
    const { threshold } = req.query;
    
    if (!shopId) {
      res.status(400).json({
        success: false,
        message: 'Shop ID is required'
      });
      return;
    }

    const services = getServices(req);
    const lowStockItems = await services.shopInventoryTrackingService.inventoryRepository.findLowStockItems(
      shopId, 
      threshold ? parseInt(threshold as string) : undefined
    );
    
    res.status(200).json({
      success: true,
      data: lowStockItems
    });
  } catch (error) {
    Logger.error('Get low stock items controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getExpiringItemsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;
    const { daysAhead = '30' } = req.query;
    
    if (!shopId) {
      res.status(400).json({
        success: false,
        message: 'Shop ID is required'
      });
      return;
    }

    const services = getServices(req);
    const expiringItems = await services.shopInventoryTrackingService.inventoryRepository.findExpiringItems(
      shopId, 
      parseInt(daysAhead as string)
    );
    
    res.status(200).json({
      success: true,
      data: expiringItems
    });
  } catch (error) {
    Logger.error('Get expiring items controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const searchInventoryItemsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;
    const { searchTerm } = req.query;
    
    if (!shopId || !searchTerm) {
      res.status(400).json({
        success: false,
        message: 'Shop ID and search term are required'
      });
      return;
    }

    const services = getServices(req);
    const items = await services.shopInventoryTrackingService.inventoryRepository.searchItems(
      shopId, 
      searchTerm as string
    );
    
    res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    Logger.error('Search inventory items controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
