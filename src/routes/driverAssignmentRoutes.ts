import { Router } from 'express';
import { injectServices } from '../infrastructure/di/injector';
import {
  assignDriver,
  getAvailableDrivers,
  updateDriverLocation,
  rejectAssignment,
  getDriverStats,
  batchAssignJobs,
  getAlternativeDrivers
} from '../controllers/driverAssignmentController';
import {
  assignDriverValidation,
  updateLocationValidation,
  rejectAssignmentValidation,
  batchAssignValidation
} from '../utils/validation';
import { authenticateToken } from '../middleware/auth';
import { requireRole, requirePermission } from '../middleware/roleAuth';

const router = Router();

// Driver Assignment Routes
router.post(
  '/assign',
  authenticateToken,
  requirePermission('admin:manage_system'),
  injectServices,
  assignDriverValidation,
  assignDriver
);

router.get(
  '/available-drivers',
  authenticateToken,
  requireRole(['driver', 'admin']),
  injectServices,
  getAvailableDrivers
);

router.put(
  '/driver-location',
  authenticateToken,
  requireRole(['driver', 'admin']),
  requirePermission('driver:update_location'),
  injectServices,
  updateLocationValidation,
  updateDriverLocation
);

router.post(
  '/reject',
  authenticateToken,
  requireRole(['driver', 'admin']),
  requirePermission('driver:reject_job'),
  injectServices,
  rejectAssignmentValidation,
  rejectAssignment
);

router.get(
  '/driver-stats/:driverId',
  authenticateToken,
  requireRole(['admin', 'business']),
  injectServices,
  getDriverStats
);

router.post(
  '/batch-assign',
  authenticateToken,
  requirePermission('admin:manage_system'),
  injectServices,
  batchAssignValidation,
  batchAssignJobs
);

router.get(
  '/alternatives/:bookingId',
  authenticateToken,
  requireRole(['user', 'admin']),
  injectServices,
  getAlternativeDrivers
);

export default router;
