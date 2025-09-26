import express from 'express';
import { body, param, query } from 'express-validator';
import { injectServices } from '../infrastructure/di/injector';
import {
  // Order Management
  getLiveOrderQueue,
  getOrderProcessingStatus,
  updateOrderPriority,
  getOrderHistory,
  searchOrders,
  
  // Item Processing
  confirmItemReceipt,
  assessItemCondition,
  selectCleaningMethod,
  updateCleaningProgress,
  performQualityControl,
  confirmItemPackaging,
  
  // Staff Management
  getStaffDashboard,
  assignStaffToJob,
  getWorkloadDistribution,
  getStaffPerformance,
  
  // Inventory & Supplies
  getSupplyTracking,
  updateSupplyLevels,
  getLowStockAlerts,
  
  // Customer Communication
  sendCustomerStatusUpdate,
  getCustomerMessages,
  sendMessageToCustomer,
  
  // Financial Management
  getDailyEarnings,
  getCommissionTracking,
  getExpenseTracking,
  
  // Analytics & Reporting
  getPerformanceMetrics,
  getCustomerSatisfaction,
  getPeakHoursAnalysis,
  
  // Settings & Configuration
  updateOperatingHours,
  updateServiceOfferings,
  updateCapacityManagement,
  
  // Notifications
  getNotificationSettings,
  updateNotificationSettings,
  
  // Quality Assurance
  getQualityChecklist,
  getCustomerFeedback,
  respondToCustomerFeedback
} from '../controllers/shopManagementController';
import { authenticateToken } from '../middleware/auth';
import { 
  requireRole, 
  requirePermission, 
  requireAnyPermission,
  PERMISSIONS 
} from '../middleware/roleAuth';

const router = express.Router();

// ========================================
// 1. ORDER MANAGEMENT DASHBOARD
// ========================================

// Get live order queue
router.get('/orders/queue', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_VIEW_ORDERS),
  injectServices,
  getLiveOrderQueue
);

// Get order processing status
router.get('/orders/:orderId/status', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_VIEW_ORDERS),
  param('orderId').isUUID().withMessage('Invalid order ID'),
  injectServices,
  getOrderProcessingStatus
);

// Update order priority
router.put('/orders/:orderId/priority', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_UPDATE_ORDER_STATUS),
  param('orderId').isUUID().withMessage('Invalid order ID'),
  body('priority').isIn(['low', 'normal', 'high', 'urgent']).withMessage('Invalid priority'),
  body('reason').optional().isString(),
  injectServices,
  updateOrderPriority
);

// Get order history
router.get('/orders/history', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_VIEW_ORDERS),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('status').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
  injectServices,
  getOrderHistory
);

// Search orders
router.post('/orders/search', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_VIEW_ORDERS),
  body('query').optional().isString(),
  body('filters').optional().isObject(),
  body('sortBy').optional().isString(),
  body('sortOrder').optional().isIn(['asc', 'desc']),
  body('limit').optional().isInt({ min: 1, max: 100 }),
  body('offset').optional().isInt({ min: 0 }),
  injectServices,
  searchOrders
);

// ========================================
// 2. ITEM PROCESSING WORKFLOW
// ========================================

// Confirm item receipt
router.post('/orders/:orderId/receipt', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_UPDATE_ORDER_STATUS),
  param('orderId').isUUID().withMessage('Invalid order ID'),
  body('items').isArray().withMessage('Items must be an array'),
  body('receiptNotes').optional().isString(),
  body('receivedBy').isString().withMessage('Received by is required'),
  injectServices,
  confirmItemReceipt
);

// Assess item condition
router.post('/items/:itemId/assessment', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_UPDATE_ORDER_STATUS),
  param('itemId').isUUID().withMessage('Invalid item ID'),
  body('condition').isIn(['excellent', 'good', 'fair', 'poor', 'damaged']).withMessage('Invalid condition'),
  body('photos').optional().isArray(),
  body('notes').optional().isString(),
  body('specialRequirements').optional().isArray(),
  body('assessedBy').isString().withMessage('Assessed by is required'),
  injectServices,
  assessItemCondition
);

// Select cleaning method
router.post('/items/:itemId/cleaning-method', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_UPDATE_ORDER_STATUS),
  param('itemId').isUUID().withMessage('Invalid item ID'),
  body('cleaningMethod').isString().withMessage('Cleaning method is required'),
  body('estimatedTime').optional().isInt({ min: 1 }),
  body('requiredSupplies').optional().isArray(),
  body('specialInstructions').optional().isString(),
  body('selectedBy').isString().withMessage('Selected by is required'),
  injectServices,
  selectCleaningMethod
);

// Update cleaning progress
router.put('/items/:itemId/progress', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_UPDATE_ORDER_STATUS),
  param('itemId').isUUID().withMessage('Invalid item ID'),
  body('status').isIn(['pending', 'in_progress', 'completed', 'on_hold']).withMessage('Invalid status'),
  body('progress').optional().isInt({ min: 0, max: 100 }),
  body('notes').optional().isString(),
  body('photos').optional().isArray(),
  body('updatedBy').isString().withMessage('Updated by is required'),
  injectServices,
  updateCleaningProgress
);

// Perform quality control
router.post('/items/:itemId/quality-control', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_UPDATE_ORDER_STATUS),
  param('itemId').isUUID().withMessage('Invalid item ID'),
  body('qualityChecklist').isArray().withMessage('Quality checklist must be an array'),
  body('beforePhotos').optional().isArray(),
  body('afterPhotos').optional().isArray(),
  body('qualityScore').isInt({ min: 1, max: 10 }).withMessage('Quality score must be between 1-10'),
  body('passed').isBoolean().withMessage('Passed must be a boolean'),
  body('issues').optional().isArray(),
  body('checkedBy').isString().withMessage('Checked by is required'),
  injectServices,
  performQualityControl
);

// Confirm item packaging
router.post('/items/:itemId/packaging', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_UPDATE_ORDER_STATUS),
  param('itemId').isUUID().withMessage('Invalid item ID'),
  body('packagingNotes').optional().isString(),
  body('packagingPhotos').optional().isArray(),
  body('readyForPickup').isBoolean().withMessage('Ready for pickup must be a boolean'),
  body('packagedBy').isString().withMessage('Packaged by is required'),
  injectServices,
  confirmItemPackaging
);

// ========================================
// 3. STAFF MANAGEMENT
// ========================================

// Get staff dashboard
router.get('/staff/dashboard', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_VIEW_ORDERS),
  injectServices,
  getStaffDashboard
);

// Assign staff to job
router.post('/staff/:jobId/assign', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_VIEW_ORDERS),
  param('jobId').isUUID().withMessage('Invalid job ID'),
  body('staffId').isUUID().withMessage('Invalid staff ID'),
  body('assignmentNotes').optional().isString(),
  injectServices,
  assignStaffToJob
);

// Get workload distribution
router.get('/staff/workload', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_VIEW_ORDERS),
  injectServices,
  getWorkloadDistribution
);

// Get staff performance
router.get('/staff/performance', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_VIEW_ORDERS),
  query('staffId').optional().isUUID(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('period').optional().isString(),
  injectServices,
  getStaffPerformance
);

// ========================================
// 4. INVENTORY & SUPPLIES MANAGEMENT
// ========================================

// Get supply tracking
router.get('/supplies/tracking', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_UPDATE_INVENTORY),
  injectServices,
  getSupplyTracking
);

// Update supply levels
router.put('/supplies/levels', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_UPDATE_INVENTORY),
  body('supplies').isArray().withMessage('Supplies must be an array'),
  injectServices,
  updateSupplyLevels
);

// Get low stock alerts
router.get('/supplies/low-stock', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_UPDATE_INVENTORY),
  injectServices,
  getLowStockAlerts
);

// ========================================
// 5. CUSTOMER COMMUNICATION
// ========================================

// Send customer status update
router.post('/orders/:orderId/customer-update', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_MESSAGE_CUSTOMER),
  param('orderId').isUUID().withMessage('Invalid order ID'),
  body('status').isString().withMessage('Status is required'),
  body('message').isString().withMessage('Message is required'),
  body('photos').optional().isArray(),
  body('estimatedCompletionTime').optional().isISO8601(),
  injectServices,
  sendCustomerStatusUpdate
);

// Get customer messages
router.get('/orders/:orderId/messages', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_MESSAGE_CUSTOMER),
  param('orderId').isUUID().withMessage('Invalid order ID'),
  injectServices,
  getCustomerMessages
);

// Send message to customer
router.post('/orders/:orderId/messages', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_MESSAGE_CUSTOMER),
  param('orderId').isUUID().withMessage('Invalid order ID'),
  body('message').isString().withMessage('Message is required'),
  body('attachments').optional().isArray(),
  injectServices,
  sendMessageToCustomer
);

// ========================================
// 6. FINANCIAL MANAGEMENT
// ========================================

// Get daily earnings
router.get('/finance/daily-earnings', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_VIEW_ANALYTICS),
  query('date').optional().isISO8601(),
  injectServices,
  getDailyEarnings
);

// Get commission tracking
router.get('/finance/commission', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_VIEW_ANALYTICS),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('period').optional().isString(),
  injectServices,
  getCommissionTracking
);

// Get expense tracking
router.get('/finance/expenses', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_VIEW_ANALYTICS),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('category').optional().isString(),
  query('period').optional().isString(),
  injectServices,
  getExpenseTracking
);

// ========================================
// 7. SHOP ANALYTICS & REPORTING
// ========================================

// Get performance metrics
router.get('/analytics/performance', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_VIEW_ANALYTICS),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('period').optional().isString(),
  injectServices,
  getPerformanceMetrics
);

// Get customer satisfaction
router.get('/analytics/satisfaction', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_VIEW_ANALYTICS),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('period').optional().isString(),
  injectServices,
  getCustomerSatisfaction
);

// Get peak hours analysis
router.get('/analytics/peak-hours', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_VIEW_ANALYTICS),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('period').optional().isString(),
  injectServices,
  getPeakHoursAnalysis
);

// ========================================
// 8. SHOP SETTINGS & CONFIGURATION
// ========================================

// Update operating hours
router.put('/settings/operating-hours', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_UPDATE_PROFILE),
  body('operatingHours').isObject().withMessage('Operating hours must be an object'),
  injectServices,
  updateOperatingHours
);

// Update service offerings
router.put('/settings/services', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_UPDATE_PROFILE),
  body('services').isArray().withMessage('Services must be an array'),
  injectServices,
  updateServiceOfferings
);

// Update capacity management
router.put('/settings/capacity', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_UPDATE_PROFILE),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
  body('maxOrdersPerDay').isInt({ min: 1 }).withMessage('Max orders per day must be a positive integer'),
  injectServices,
  updateCapacityManagement
);

// ========================================
// 9. REAL-TIME NOTIFICATIONS
// ========================================

// Get notification settings
router.get('/settings/notifications', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_UPDATE_PROFILE),
  injectServices,
  getNotificationSettings
);

// Update notification settings
router.put('/settings/notifications', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_UPDATE_PROFILE),
  body('settings').isObject().withMessage('Settings must be an object'),
  injectServices,
  updateNotificationSettings
);

// ========================================
// 10. QUALITY ASSURANCE
// ========================================

// Get quality checklist
router.get('/quality/checklist', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_VIEW_ORDERS),
  query('itemType').optional().isString(),
  injectServices,
  getQualityChecklist
);

// Get customer feedback
router.get('/quality/feedback', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_VIEW_ANALYTICS),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('rating').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
  injectServices,
  getCustomerFeedback
);

// Respond to customer feedback
router.post('/quality/feedback/:feedbackId/respond', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_MESSAGE_CUSTOMER),
  param('feedbackId').isUUID().withMessage('Invalid feedback ID'),
  body('response').isString().withMessage('Response is required'),
  body('responseType').isIn(['acknowledgment', 'apology', 'resolution']).withMessage('Invalid response type'),
  injectServices,
  respondToCustomerFeedback
);

export default router;
