import { Router } from 'express';
import { injectServices } from '../infrastructure/di/injector';
import {
  addToQueueController,
  getQueueStatusController,
  assignItemController,
  completeItemController,
  getStaffWorkloadController,
  getQueueAnalyticsController,
  getQueueOptimizationController
} from '../controllers/shopQueueController';

const router = Router();

// Queue Management Routes
router.post('/queue/add', injectServices, addToQueueController);
router.get('/queue/status/:shopId', injectServices, getQueueStatusController);
router.post('/queue/assign/:itemId', injectServices, assignItemController);
router.post('/queue/complete/:itemId', injectServices, completeItemController);

// Analytics and Optimization Routes
router.get('/queue/workload/:staffId', injectServices, getStaffWorkloadController);
router.get('/queue/analytics/:shopId', injectServices, getQueueAnalyticsController);
router.get('/queue/optimization/:shopId', injectServices, getQueueOptimizationController);

export default router;
