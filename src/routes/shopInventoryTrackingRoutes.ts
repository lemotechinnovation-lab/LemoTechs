import { Router } from 'express';
import { injectServices } from '../infrastructure/di/injector';
import {
  addInventoryItemController,
  updateInventoryQuantityController,
  getInventoryDashboardController,
  generateInventoryReportController,
  getInventoryOptimizationController,
  getLowStockItemsController,
  getExpiringItemsController,
  searchInventoryItemsController
} from '../controllers/shopInventoryTrackingController';

const router = Router();

// Inventory Management Routes
router.post('/inventory/:shopId/add', injectServices, addInventoryItemController);
router.put('/inventory/:shopId/:itemId/quantity', injectServices, updateInventoryQuantityController);

// Dashboard and Analytics Routes
router.get('/inventory/:shopId/dashboard', injectServices, getInventoryDashboardController);
router.get('/inventory/:shopId/report', injectServices, generateInventoryReportController);
router.get('/inventory/:shopId/optimization', injectServices, getInventoryOptimizationController);

// Search and Filter Routes
router.get('/inventory/:shopId/low-stock', injectServices, getLowStockItemsController);
router.get('/inventory/:shopId/expiring', injectServices, getExpiringItemsController);
router.get('/inventory/:shopId/search', injectServices, searchInventoryItemsController);

export default router;
