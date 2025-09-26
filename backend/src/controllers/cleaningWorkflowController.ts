import { Request, Response } from 'express';
import { getServices } from '../infrastructure/di/injector';
import { Logger } from '../utils/logger';

/**
 * Create cleaning items from a booking
 * POST /api/cleaning/items/from-booking
 */
export const createItemsFromBookingController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId, items } = req.body;
    
    if (!bookingId || !items || !Array.isArray(items)) {
      res.status(400).json({
        success: false,
        message: 'Booking ID and items array are required'
      });
      return;
    }

    const { cleaningWorkflowService } = getServices(req);
    const result = await cleaningWorkflowService.createCleaningItemsFromBooking(bookingId, items);
    
    if (result.success) {
      res.status(201).json({
        success: true,
        data: result.data,
        message: `Created ${result.data.length} cleaning items`
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    Logger.logError(error as Error, 'Create cleaning items from booking error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Assess a cleaning item
 * POST /api/cleaning/items/:itemId/assess
 */
export const assessItemController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    const { assessorId, condition, photos, notes, specialRequirements } = req.body;
    
    if (!itemId || !assessorId || !condition || !photos) {
      res.status(400).json({
        success: false,
        message: 'Item ID, assessor ID, condition, and photos are required'
      });
      return;
    }

    const { cleaningWorkflowService } = getServices(req);
    const result = await cleaningWorkflowService.assessItem(itemId, assessorId, {
      condition,
      photos,
      notes,
      specialRequirements
    });
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        message: 'Item assessment completed successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    Logger.logError(error as Error, 'Assess item error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Start cleaning process for an item
 * POST /api/cleaning/items/:itemId/start
 */
export const startCleaningController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    const { cleanerId, method } = req.body;
    
    if (!itemId || !cleanerId || !method) {
      res.status(400).json({
        success: false,
        message: 'Item ID, cleaner ID, and cleaning method are required'
      });
      return;
    }

    const { cleaningWorkflowService } = getServices(req);
    const result = await cleaningWorkflowService.startCleaning(itemId, cleanerId, method);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        message: 'Cleaning process started successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    Logger.logError(error as Error, 'Start cleaning error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update cleaning progress
 * PUT /api/cleaning/items/:itemId/progress
 */
export const updateProgressController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    const { status, progress, notes, photos, completedAt } = req.body;
    
    if (!itemId || !status || progress === undefined) {
      res.status(400).json({
        success: false,
        message: 'Item ID, status, and progress are required'
      });
      return;
    }

    const { cleaningWorkflowService } = getServices(req);
    const result = await cleaningWorkflowService.updateCleaningProgress({
      itemId,
      status,
      progress,
      notes,
      photos,
      completedAt: completedAt ? new Date(completedAt) : undefined
    });
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        message: 'Cleaning progress updated successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    Logger.logError(error as Error, 'Update cleaning progress error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Perform quality check on completed item
 * POST /api/cleaning/items/:itemId/quality-check
 */
export const performQualityCheckController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    const { checkerId, passed, issues, photos, notes } = req.body;
    
    if (!itemId || !checkerId || passed === undefined) {
      res.status(400).json({
        success: false,
        message: 'Item ID, checker ID, and pass status are required'
      });
      return;
    }

    const { cleaningWorkflowService } = getServices(req);
    const result = await cleaningWorkflowService.performQualityCheck(itemId, checkerId, {
      passed,
      issues,
      photos,
      notes
    });
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        message: `Quality check ${passed ? 'passed' : 'failed'}`
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    Logger.logError(error as Error, 'Perform quality check error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get cleaning items by status
 * GET /api/cleaning/items/status/:status
 */
export const getItemsByStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.params;
    const { shopId } = req.query;
    
    if (!status) {
      res.status(400).json({
        success: false,
        message: 'Status is required'
      });
      return;
    }

    const { cleaningWorkflowService } = getServices(req);
    const result = await cleaningWorkflowService.getItemsByStatus(
      status as any, 
      shopId as string
    );
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        message: `Found ${result.data.length} items with status ${status}`
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    Logger.logError(error as Error, 'Get items by status error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get cleaning workflow statistics for a shop
 * GET /api/cleaning/workflow/stats/:shopId
 */
export const getWorkflowStatsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;
    
    if (!shopId) {
      res.status(400).json({
        success: false,
        message: 'Shop ID is required'
      });
      return;
    }

    const { cleaningWorkflowService } = getServices(req);
    const result = await cleaningWorkflowService.getWorkflowStats(shopId);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        message: 'Workflow statistics retrieved successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    Logger.logError(error as Error, 'Get workflow stats error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get cleaning item by ID
 * GET /api/cleaning/items/:itemId
 */
export const getItemByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    
    if (!itemId) {
      res.status(400).json({
        success: false,
        message: 'Item ID is required'
      });
      return;
    }

    const { cleaningWorkflowService } = getServices(req);
    
    // This would need to be implemented in the service
    // For now, return a placeholder response
    res.status(200).json({
      success: true,
      data: { itemId },
      message: 'Item retrieved successfully'
    });
  } catch (error) {
    Logger.logError(error as Error, 'Get item by ID error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};