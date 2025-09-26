import { Router } from 'express';
import { ShopOrderController } from '../controllers/shopOrderController';
import { DriverJobController } from '../controllers/driverJobController';
import { authenticateToken } from '../middleware/auth';
import { requireRole } from '../middleware/roleAuth';
import { injectServices } from '../infrastructure/di/injector';

const router = Router();

// Shop Order Routes (Shop role only) - Updated paths to match frontend expectations
router.get('/shop/orders', authenticateToken, requireRole(['shop', 'admin']), injectServices, ShopOrderController.getOrders);
router.get('/shop/orders/:orderId', authenticateToken, requireRole(['shop', 'admin']), injectServices, ShopOrderController.getOrderById);
router.put('/shop/orders/:orderId/status', authenticateToken, requireRole(['shop', 'admin']), injectServices, ShopOrderController.updateOrderStatus);
router.post('/shop/orders/:orderId/message', authenticateToken, requireRole(['shop', 'admin']), injectServices, ShopOrderController.sendOrderMessage);
router.post('/shop/orders/:orderId/start-cleaning', authenticateToken, requireRole(['shop', 'admin']), injectServices, ShopOrderController.startCleaning);
router.post('/shop/orders/:orderId/complete-cleaning', authenticateToken, requireRole(['shop', 'admin']), injectServices, ShopOrderController.completeCleaning);

// Shop Inventory Routes (Shop role only)
router.get('/shop/inventory', authenticateToken, requireRole(['shop', 'admin']), injectServices, ShopOrderController.getInventory);
router.put('/shop/inventory/:itemId', authenticateToken, requireRole(['shop', 'admin']), injectServices, ShopOrderController.updateInventoryItem);

// Shop Analytics Routes (Shop role only)
router.get('/shop/analytics', authenticateToken, requireRole(['shop', 'admin']), injectServices, ShopOrderController.getAnalytics);

// Driver Job Routes (Driver role only)
router.get('/driver/jobs', authenticateToken, requireRole(['driver', 'admin']), injectServices, DriverJobController.getJobs);
router.get('/driver/jobs/:jobId', authenticateToken, requireRole(['driver', 'admin']), injectServices, DriverJobController.getJobById);
router.post('/driver/jobs/:jobId/accept', authenticateToken, requireRole(['driver', 'admin']), injectServices, DriverJobController.acceptJob);
router.put('/driver/jobs/:jobId/status', authenticateToken, requireRole(['driver', 'admin']), injectServices, DriverJobController.updateJobStatus);
router.post('/driver/jobs/:jobId/complete', authenticateToken, requireRole(['driver', 'admin']), injectServices, DriverJobController.completeJob);

// Driver Location Routes (Driver role only)
router.put('/driver/location', authenticateToken, requireRole(['driver', 'admin']), injectServices, DriverJobController.updateLocation);

// Driver Route Optimization Routes (Driver role only)
router.post('/driver/route-optimization', authenticateToken, requireRole(['driver', 'admin']), injectServices, DriverJobController.getOptimizedRoute);

// Driver Communication Routes (Driver role only)
router.post('/driver/jobs/:jobId/message-customer', authenticateToken, requireRole(['driver', 'admin']), injectServices, DriverJobController.messageCustomer);
router.post('/driver/jobs/:jobId/message-shop', authenticateToken, requireRole(['driver', 'admin']), injectServices, DriverJobController.messageShop);

// Driver Statistics Routes (Driver role only)
router.get('/driver/stats', authenticateToken, requireRole(['driver', 'admin']), injectServices, DriverJobController.getStats);

// Driver Available Jobs Routes (Driver role only)
router.get('/driver/available-jobs', authenticateToken, requireRole(['driver', 'admin']), injectServices, DriverJobController.getAvailableJobs);

export default router;
