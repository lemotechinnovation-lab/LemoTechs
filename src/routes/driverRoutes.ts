import express from 'express';
import { body } from 'express-validator';
import { injectServices } from '../infrastructure/di/injector';
import {
  getDriverProfile,
  createDriverProfile,
  updateDriverProfile,
  updateDriverStatus,
  getDriverJobs,
  getAvailableJobs,
  acceptJob
} from '../controllers/driverController';
import { authenticateToken } from '../middleware/auth';
import { 
  requireRole, 
  requirePermission, 
  requireAnyPermission,
  PERMISSIONS 
} from '../middleware/roleAuth';

const router = express.Router();

// Validation rules
const driverProfileValidation = [
  body('vehicle').notEmpty().withMessage('Vehicle is required'),
  body('licenseNumber').notEmpty().withMessage('License number is required'),
  body('licenseExpiry').optional().isISO8601().withMessage('Invalid license expiry date'),
  body('vehicleRegistration').optional().isString(),
  body('vehicleModel').optional().isString(),
  body('vehicleColor').optional().isString()
];

const statusValidation = [
  body('status').isIn(['offline', 'available', 'busy']).withMessage('Invalid status'),
  body('currentLocation').optional().isObject().withMessage('Invalid location format')
];

// Driver profile routes - Drivers and Admin only
router.get('/profile', 
  authenticateToken, 
  requireAnyPermission([
    PERMISSIONS.DRIVER_VIEW_PROFILE,
    PERMISSIONS.ADMIN_VIEW_ALL_DRIVERS
  ]),
  injectServices,
  getDriverProfile
);

router.post('/profile', 
  authenticateToken, 
  requirePermission(PERMISSIONS.DRIVER_UPDATE_PROFILE),
  injectServices,
  driverProfileValidation, 
  createDriverProfile
);

router.put('/profile', 
  authenticateToken, 
  requirePermission(PERMISSIONS.DRIVER_UPDATE_PROFILE),
  injectServices,
  driverProfileValidation, 
  updateDriverProfile
);

// Driver status routes - Drivers only
router.put('/status', 
  authenticateToken, 
  requirePermission(PERMISSIONS.DRIVER_UPDATE_STATUS),
  injectServices,
  statusValidation, 
  updateDriverStatus
);

// Driver jobs routes - Drivers and Admin only
router.get('/jobs', 
  authenticateToken, 
  requireAnyPermission([
    PERMISSIONS.DRIVER_VIEW_JOBS,
    PERMISSIONS.ADMIN_VIEW_ALL_DRIVERS
  ]),
  injectServices,
  getDriverJobs
);

router.get('/available-jobs', 
  authenticateToken, 
  requirePermission(PERMISSIONS.DRIVER_VIEW_JOBS),
  injectServices,
  getAvailableJobs
);

router.post('/accept-job/:jobId', 
  authenticateToken, 
  requirePermission(PERMISSIONS.DRIVER_ACCEPT_JOB),
  injectServices,
  acceptJob
);

export default router;
