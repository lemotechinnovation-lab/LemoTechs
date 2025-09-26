import express from 'express';
import { body, query } from 'express-validator';
import { injectServices } from '../infrastructure/di/injector';
import {
  getAllUsersController,
  getUserByIdController,
  updateUserStatusController,
  getAllBookingsController,
  getAllDriversController,
  getAllShopsController,
  getSystemAnalyticsController,
  getSystemLogsController,
  updateSystemSettingsController
} from '../controllers/adminController';
import { authenticateToken } from '../middleware/auth';
import { 
  requireRole, 
  requirePermission, 
  PERMISSIONS 
} from '../middleware/roleAuth';

const router = express.Router();

// Validation rules
const userStatusValidation = [
  body('status').isIn(['active', 'inactive', 'suspended', 'pending']).withMessage('Invalid status'),
  body('reason').optional().isString().withMessage('Reason must be a string')
];

const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isString()
    .withMessage('Status must be a string'),
  query('role')
    .optional()
    .isIn(['user', 'driver', 'shop', 'admin', 'business'])
    .withMessage('Invalid role')
];

// User management routes - Admin only
router.get('/users', 
  authenticateToken, 
  requirePermission(PERMISSIONS.ADMIN_VIEW_ALL_USERS),
  injectServices,
  paginationValidation,
  getAllUsersController
);

router.get('/users/:userId', 
  authenticateToken, 
  requirePermission(PERMISSIONS.ADMIN_VIEW_ALL_USERS),
  injectServices,
  getUserByIdController
);

router.put('/users/:userId/status', 
  authenticateToken, 
  requirePermission(PERMISSIONS.ADMIN_UPDATE_USER_STATUS),
  injectServices,
  userStatusValidation,
  updateUserStatusController
);

// Booking management routes - Admin only
router.get('/bookings', 
  authenticateToken, 
  requirePermission(PERMISSIONS.ADMIN_VIEW_ALL_BOOKINGS),
  injectServices,
  paginationValidation,
  getAllBookingsController
);

// Driver management routes - Admin only
router.get('/drivers', 
  authenticateToken, 
  requirePermission(PERMISSIONS.ADMIN_VIEW_ALL_DRIVERS),
  injectServices,
  paginationValidation,
  getAllDriversController
);

// Shop management routes - Admin only
router.get('/shops', 
  authenticateToken, 
  requirePermission(PERMISSIONS.ADMIN_VIEW_ALL_SHOPS),
  injectServices,
  paginationValidation,
  getAllShopsController
);

// System analytics routes - Admin only
router.get('/analytics', 
  authenticateToken, 
  requirePermission(PERMISSIONS.ADMIN_VIEW_ANALYTICS),
  injectServices,
  getSystemAnalyticsController
);

// System logs routes - Admin only
router.get('/logs', 
  authenticateToken, 
  requirePermission(PERMISSIONS.ADMIN_VIEW_LOGS),
  injectServices,
  getSystemLogsController
);

// System settings routes - Admin only
router.put('/settings', 
  authenticateToken, 
  requirePermission(PERMISSIONS.ADMIN_MANAGE_SYSTEM),
  injectServices,
  updateSystemSettingsController
);

export default router;
