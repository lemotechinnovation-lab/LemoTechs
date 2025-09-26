import { Router } from 'express';
import { injectServices } from '../infrastructure/di/injector';
import {
  createItemsFromBookingController,
  getItemByIdController,
  assessItemController,
  startCleaningController,
  updateProgressController,
  performQualityCheckController,
  getItemsByStatusController,
  getWorkflowStatsController
} from '../controllers/cleaningWorkflowController';

const router = Router();

/**
 * Cleaning Workflow Routes
 * Handles all cleaning item management and workflow operations
 */

// Create cleaning items from booking
router.post('/items/from-booking', injectServices, createItemsFromBookingController);

// Get cleaning item by ID
router.get('/items/:itemId', injectServices, getItemByIdController);

// Assess a cleaning item
router.post('/items/:itemId/assess', injectServices, assessItemController);

// Start cleaning process
router.post('/items/:itemId/start', injectServices, startCleaningController);

// Update cleaning progress
router.put('/items/:itemId/progress', injectServices, updateProgressController);

// Perform quality check
router.post('/items/:itemId/quality-check', injectServices, performQualityCheckController);

// Get items by status
router.get('/items/status/:status', injectServices, getItemsByStatusController);

// Get workflow statistics for shop
router.get('/workflow/stats/:shopId', injectServices, getWorkflowStatsController);

export default router;
