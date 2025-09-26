import { Request, Response } from 'express';
import { getServices } from '../infrastructure/di/injector';
import { Logger } from '../utils/logger';

export const addToQueueController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shopId, bookingId, cleaningItemId, priority } = req.body;
    
    if (!shopId || !bookingId || !cleaningItemId) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: shopId, bookingId, cleaningItemId'
      });
      return;
    }

    const services = getServices(req);
    const result = await services.shopQueueService.addToQueue(shopId, bookingId, cleaningItemId, priority);
    
    if (result.success) {
      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          queueStatus: result.queueStatus,
          item: result.updatedItem
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
    Logger.error('Add to queue controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getQueueStatusController = async (req: Request, res: Response): Promise<void> => {
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
    const queueStatus = await services.shopQueueService.getQueueStatus(shopId);
    
    res.status(200).json({
      success: true,
      data: queueStatus
    });
  } catch (error) {
    Logger.error('Get queue status controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const assignItemController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    const { staffId } = req.body;
    
    if (!itemId || !staffId) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: itemId, staffId'
      });
      return;
    }

    const services = getServices(req);
    const result = await services.shopQueueService.assignItem(itemId, staffId);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          queueStatus: result.queueStatus,
          item: result.updatedItem
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
    Logger.error('Assign item controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const completeItemController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    const { actualDuration, notes } = req.body;
    
    if (!itemId) {
      res.status(400).json({
        success: false,
        message: 'Item ID is required'
      });
      return;
    }

    const services = getServices(req);
    const result = await services.shopQueueService.completeItem(itemId, actualDuration, notes);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          queueStatus: result.queueStatus,
          item: result.updatedItem
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
    Logger.error('Complete item controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getStaffWorkloadController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { staffId } = req.params;
    
    if (!staffId) {
      res.status(400).json({
        success: false,
        message: 'Staff ID is required'
      });
      return;
    }

    const services = getServices(req);
    const workload = await services.shopQueueService.getStaffWorkload(staffId);
    
    res.status(200).json({
      success: true,
      data: workload
    });
  } catch (error) {
    Logger.error('Get staff workload controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getQueueAnalyticsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;
    const { period = 'week' } = req.query;
    
    if (!shopId) {
      res.status(400).json({
        success: false,
        message: 'Shop ID is required'
      });
      return;
    }

    const services = getServices(req);
    const analytics = await services.shopQueueService.getQueueAnalytics(
      shopId, 
      period as 'day' | 'week' | 'month'
    );
    
    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    Logger.error('Get queue analytics controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getQueueOptimizationController = async (req: Request, res: Response): Promise<void> => {
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
    const optimization = await services.shopQueueService.getQueueOptimization(shopId);
    
    res.status(200).json({
      success: true,
      data: optimization
    });
  } catch (error) {
    Logger.error('Get queue optimization controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
