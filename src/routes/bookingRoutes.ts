import { Router } from 'express';
import { body, query } from 'express-validator';
import { injectServices } from '../infrastructure/di/injector';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAvailableDrivers,
  autoAssignDriver,
  getBookingAssignmentStatus
} from '../controllers/bookingController';
import { authenticateToken } from '../middleware/auth';
import { 
  requirePermission, 
  requireRole, 
  requireOwnershipOrAdmin,
  PERMISSIONS, 
  requireAnyPermission
} from '../middleware/roleAuth';

const router = Router();

// Validation rules
const createBookingValidation = [
  body('pickupLocation')
    .trim()
    .notEmpty()
    .withMessage('Pickup location is required'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('paymentMethod')
    .isIn(['card', 'cash', 'mobile'])
    .withMessage('Invalid payment method'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('contactPhone')
    .matches(/^(\+27|0)[0-9]{9}$/)
    .withMessage('Please provide a valid South African phone number'),
  body('specialInstructions')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Special instructions must not exceed 500 characters')
];

const getUserBookingsValidation = [
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
    .isIn(['pending', 'confirmed', 'pickup', 'cleaning', 'delivery', 'completed', 'cancelled'])
    .withMessage('Invalid status')
];

const getAvailableDriversValidation = [
  query('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),
  query('lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude')
];

// Routes with role-based access control

// Create booking - Users only
router.post('/', 
  authenticateToken, 
  requirePermission(PERMISSIONS.USER_CREATE_BOOKING),
  injectServices,
  createBookingValidation, 
  createBooking
);

// Get user bookings - Users, Drivers, Shops, Admin can view their own
router.get('/', 
  authenticateToken, 
  requireAnyPermission([
    PERMISSIONS.USER_VIEW_BOOKINGS,
    PERMISSIONS.DRIVER_VIEW_JOBS,
    PERMISSIONS.SHOP_VIEW_ORDERS,
    PERMISSIONS.ADMIN_VIEW_ALL_BOOKINGS
  ]),
  injectServices,
  getUserBookingsValidation, 
  getUserBookings
);

// Get available drivers - Public endpoint (no auth required)
router.get('/drivers', injectServices, getAvailableDriversValidation, getAvailableDrivers);

// Get specific booking - Users can view their own, Drivers/Shops can view assigned, Admin can view all
router.get('/:id', 
  authenticateToken, 
  requireAnyPermission([
    PERMISSIONS.USER_VIEW_BOOKINGS,
    PERMISSIONS.DRIVER_VIEW_JOBS,
    PERMISSIONS.SHOP_VIEW_ORDERS,
    PERMISSIONS.ADMIN_VIEW_ALL_BOOKINGS
  ]),
  injectServices,
  getBookingById
);

// Cancel booking - Users can cancel their own, Admin can cancel any
router.delete('/:id', 
  authenticateToken, 
  requireAnyPermission([
    PERMISSIONS.USER_CANCEL_BOOKING,
    PERMISSIONS.ADMIN_VIEW_ALL_BOOKINGS
  ]),
  injectServices,
  cancelBooking
);

// Auto-assign driver to booking - Admin only
router.post('/:id/assign-driver',
  authenticateToken,
  requirePermission(PERMISSIONS.ADMIN_MANAGE_SYSTEM),
  injectServices,
  autoAssignDriver
);

// Get booking assignment status - Users, Drivers, Shops, Admin
router.get('/:id/assignment-status',
  authenticateToken,
  requireAnyPermission([
    PERMISSIONS.USER_VIEW_BOOKINGS,
    PERMISSIONS.DRIVER_VIEW_JOBS,
    PERMISSIONS.SHOP_VIEW_ORDERS,
    PERMISSIONS.ADMIN_VIEW_ALL_BOOKINGS
  ]),
  injectServices,
  getBookingAssignmentStatus
);

export default router;
