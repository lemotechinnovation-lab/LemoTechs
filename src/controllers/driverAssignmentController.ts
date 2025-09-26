import { Request, Response } from 'express';
import { getServices } from '../infrastructure/di/injector';
import { AssignmentRequest } from '../services/driver/driverAssignmentService';
import { ResponseUtils, ValidationUtils, ErrorUtils, LogUtils } from '../utils/response';
import { HTTP_STATUS } from '../utils/constants';
import { 
  assignDriverValidation,
  updateLocationValidation,
  rejectAssignmentValidation,
  batchAssignValidation
} from '../utils/validation';
import { Logger } from '../utils/logger';

/**
 * Assign driver to a booking
 * POST /api/assignments/assign
 */
export const assignDriver = async (req: Request, res: Response): Promise<void> => {
  try {
    LogUtils.logRequest(req, 'AssignDriver');

    if (!ValidationUtils.checkValidation(req, res)) {
      return;
    }

    const {
      bookingId,
      pickupLocation,
      priority = 'normal',
      estimatedPickupTime,
      specialRequirements = [],
      customerTier = 'regular'
    } = req.body;

    const assignmentRequest: AssignmentRequest = {
      bookingId,
      pickupLocation,
      priority,
      estimatedPickupTime: new Date(estimatedPickupTime),
      specialRequirements,
      customerTier
    };

    const { driverAssignmentService } = getServices(req);
    const result = await driverAssignmentService.findBestDriver(assignmentRequest);

    if (result.success) {
      ResponseUtils.success(res, result.message, {
        assignedDriver: result.assignedDriver,
        alternativeDrivers: result.alternativeDrivers,
        estimatedWaitTime: result.estimatedWaitTime,
        assignmentId: result.assignmentId
      });
    } else {
      ResponseUtils.error(res, result.message, HTTP_STATUS.NOT_FOUND, result.alternativeDrivers);
    }

    LogUtils.logResponse('AssignDriver', result.success);
  } catch (error) {
    ErrorUtils.handleControllerError(error, res, 'AssignDriver');
  }
};

/**
 * Get available drivers in area
 * GET /api/assignments/available-drivers
 */
export const getAvailableDrivers = async (req: Request, res: Response): Promise<void> => {
  try {
    LogUtils.logRequest(req, 'GetAvailableDrivers');

    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      ResponseUtils.error(res, 'Latitude and longitude are required', HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const centerLocation = {
      lat: parseFloat(lat as string),
      lng: parseFloat(lng as string)
    };

    const radiusKm = parseFloat(radius as string);

    // Get available drivers
    const { driverAssignmentService } = getServices(req);
    const drivers = await driverAssignmentService.getAvailableDriversInRadiusPublic(
      centerLocation.lat,
      centerLocation.lng,
      radiusKm
    );

    ResponseUtils.success(res, 'Available drivers retrieved successfully', {
      drivers,
      count: drivers.length,
      searchRadius: radiusKm
    });

    LogUtils.logResponse('GetAvailableDrivers', true);
  } catch (error) {
    ErrorUtils.handleControllerError(error, res, 'GetAvailableDrivers');
  }
};

/**
 * Update driver location
 * PUT /api/assignments/driver-location
 */
export const updateDriverLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    LogUtils.logRequest(req, 'UpdateDriverLocation');

    const userId = req.user?.userId;
    if (!userId) {
      ResponseUtils.unauthorized(res, 'User not authenticated');
      return;
    }

    const { lat, lng, heading, speed } = req.body;

    if (!lat || !lng) {
      ResponseUtils.error(res, 'Latitude and longitude are required', HTTP_STATUS.BAD_REQUEST);
      return;
    }

    // Get driver ID
    const { driverService } = getServices(req);
    const driverId = await driverService.getDriverIdByUserId(userId);

    if (!driverId) {
      ResponseUtils.notFound(res, 'Driver profile not found');
      return;
    }

    const location = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      heading: heading ? parseFloat(heading) : undefined,
      speed: speed ? parseFloat(speed) : undefined,
      timestamp: new Date()
    };

    const { driverAssignmentService } = getServices(req);
    await driverAssignmentService.updateDriverLocation(driverId, location);

    ResponseUtils.success(res, 'Driver location updated successfully', { location });

    LogUtils.logResponse('UpdateDriverLocation', true);
  } catch (error) {
    ErrorUtils.handleControllerError(error, res, 'UpdateDriverLocation');
  }
};

/**
 * Handle driver rejection
 * POST /api/assignments/reject
 */
export const rejectAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    LogUtils.logRequest(req, 'RejectAssignment');

    const userId = req.user?.userId;
    if (!userId) {
      ResponseUtils.unauthorized(res, 'User not authenticated');
      return;
    }

    const { bookingId, reason } = req.body;

    if (!bookingId) {
      ResponseUtils.error(res, 'Booking ID is required', HTTP_STATUS.BAD_REQUEST);
      return;
    }

    // Get driver ID
    const { driverService } = getServices(req);
    const driverId = await driverService.getDriverIdByUserId(userId);

    if (!driverId) {
      ResponseUtils.notFound(res, 'Driver profile not found');
      return;
    }

    const { driverAssignmentService } = getServices(req);
    const result = await driverAssignmentService.handleDriverRejection(
      bookingId,
      driverId,
      reason
    );

    if (result.success) {
      ResponseUtils.success(res, 'Assignment rejected and alternative driver found', {
        newDriver: result.assignedDriver,
        alternatives: result.alternativeDrivers
      });
    } else {
      ResponseUtils.error(res, result.message, HTTP_STATUS.BAD_REQUEST);
    }

    LogUtils.logResponse('RejectAssignment', result.success);
  } catch (error) {
    ErrorUtils.handleControllerError(error, res, 'RejectAssignment');
  }
};

/**
 * Get driver statistics
 * GET /api/assignments/driver-stats/:driverId
 */
export const getDriverStats = async (req: Request, res: Response): Promise<void> => {
  try {
    LogUtils.logRequest(req, 'GetDriverStats');

    const { driverId } = req.params;

    const { driverAssignmentService } = getServices(req);
    const stats = await driverAssignmentService.getDriverStats(driverId!);

    ResponseUtils.success(res, 'Driver statistics retrieved successfully', stats);

    LogUtils.logResponse('GetDriverStats', true);
  } catch (error) {
    ErrorUtils.handleControllerError(error, res, 'GetDriverStats');
  }
};

/**
 * Batch assign multiple jobs
 * POST /api/assignments/batch-assign
 */
export const batchAssignJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    LogUtils.logRequest(req, 'BatchAssignJobs');

    const { requests } = req.body;

    if (!Array.isArray(requests) || requests.length === 0) {
      ResponseUtils.error(res, 'Requests array is required and must not be empty', HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const { driverAssignmentService } = getServices(req);
    const results = await driverAssignmentService.batchAssignJobs(requests);

    ResponseUtils.success(res, 'Batch assignment completed', {
      results,
      successCount: results.filter((r: any) => r.success).length,
      failureCount: results.filter((r: any) => !r.success).length
    });

    LogUtils.logResponse('BatchAssignJobs', true);
  } catch (error) {
    ErrorUtils.handleControllerError(error, res, 'BatchAssignJobs');
  }
};

/**
 * Get alternative drivers for a booking
 * GET /api/assignments/alternatives/:bookingId
 */
export const getAlternativeDrivers = async (req: Request, res: Response): Promise<void> => {
  try {
    LogUtils.logRequest(req, 'GetAlternativeDrivers');

    const { bookingId } = req.params;
    const { excludeDriverIds = [] } = req.query;

    // Get booking details
    const { bookingService } = getServices(req);
    const booking = await bookingService.getBookingForAssignment(bookingId!);

    if (!booking) {
      ResponseUtils.notFound(res, 'Booking not found');
      return;
    }

    const request: AssignmentRequest = {
      bookingId: bookingId!,
      pickupLocation: booking.pickup_coords,
      priority: booking.priority,
      estimatedPickupTime: booking.estimated_pickup_time
    };

    const excludeIds = Array.isArray(excludeDriverIds) 
      ? excludeDriverIds.map(id => String(id))
      : [String(excludeDriverIds)].filter(Boolean);

    const { driverAssignmentService } = getServices(req);
    const alternatives = await driverAssignmentService.getAlternativeDrivers(
      bookingId!,
      excludeIds
    );

    ResponseUtils.success(res, 'Alternative drivers retrieved successfully', {
      alternatives,
      count: alternatives.length
    });

    LogUtils.logResponse('GetAlternativeDrivers', true);
  } catch (error) {
    ErrorUtils.handleControllerError(error, res, 'GetAlternativeDrivers');
  }
};
