import { Router } from 'express';
import { injectServices } from '../infrastructure/di/injector';
import {
  optimizeRouteController,
  createMultiStopJobController,
  getRealTimeRouteUpdatesController,
  calculateETAController,
  getRouteAnalyticsController,
  getOptimizationMetricsController
} from '../controllers/routeOptimizationController';

const router = Router();

// Route Optimization Routes
router.post('/optimize', injectServices, optimizeRouteController);
router.post('/multi-stop-job', injectServices, createMultiStopJobController);

// Real-time Updates and Analytics
router.get('/route/:routeId/updates', injectServices, getRealTimeRouteUpdatesController);
router.post('/route/:routeId/eta', injectServices, calculateETAController);
router.get('/route/:routeId/analytics', injectServices, getRouteAnalyticsController);

// System Metrics
router.get('/metrics', injectServices, getOptimizationMetricsController);

export default router;
