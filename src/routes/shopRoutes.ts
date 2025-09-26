import express from 'express';
import { body } from 'express-validator';
import { injectServices } from '../infrastructure/di/injector';
import {
  getShopProfile,
  createShopProfile,
  updateShopProfile,
  getShopBookings,
  updateBookingStatus,
  getShopAnalytics
} from '../controllers/shopController';
import { authenticateToken } from '../middleware/auth';
import { 
  requireRole, 
  requirePermission, 
  requireAnyPermission,
  PERMISSIONS 
} from '../middleware/roleAuth';

const router = express.Router();

// Validation rules
const shopProfileValidation = [
  body('name').notEmpty().withMessage('Shop name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('phone').optional().isMobilePhone('any'),
  body('email').optional().isEmail(),
  body('coordinates').optional().isObject(),
  body('operatingHours').optional().isObject(),
  body('services').optional().isArray(),
  body('capacity').optional().isInt({ min: 1 })
];

const bookingStatusValidation = [
  body('status').isIn(['pickup', 'cleaning', 'delivery', 'completed']).withMessage('Invalid status')
];

// Shop profile routes - Shops and Admin only
router.get('/profile', 
  authenticateToken, 
  requireAnyPermission([
    PERMISSIONS.SHOP_VIEW_PROFILE,
    PERMISSIONS.ADMIN_VIEW_ALL_SHOPS
  ]),
  injectServices,
  getShopProfile
);

router.post('/profile', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_UPDATE_PROFILE),
  injectServices,
  shopProfileValidation, 
  createShopProfile
);

router.put('/profile', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_UPDATE_PROFILE),
  injectServices,
  shopProfileValidation, 
  updateShopProfile
);

// Shop bookings routes - Shops and Admin only
router.get('/bookings', 
  authenticateToken, 
  requireAnyPermission([
    PERMISSIONS.SHOP_VIEW_ORDERS,
    PERMISSIONS.ADMIN_VIEW_ALL_BOOKINGS
  ]),
  injectServices,
  getShopBookings
);

router.put('/bookings/:bookingId/status', 
  authenticateToken, 
  requirePermission(PERMISSIONS.SHOP_UPDATE_ORDER_STATUS),
  injectServices,
  bookingStatusValidation, 
  updateBookingStatus
);

// Shop analytics routes - Shops and Admin only
router.get('/analytics', 
  authenticateToken, 
  requireAnyPermission([
    PERMISSIONS.SHOP_VIEW_ANALYTICS,
    PERMISSIONS.ADMIN_VIEW_ANALYTICS
  ]),
  injectServices,
  getShopAnalytics
);

export default router;
