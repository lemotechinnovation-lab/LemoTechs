import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getServices } from '../infrastructure/di/injector';
import { Logger } from '../utils/logger';

// Get driver profile
export const getDriverProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { driverService } = getServices(req);
    const driver = await driverService.getDriverProfileByUserId(userId);

    if (!driver) {
      res.status(404).json({
        success: false,
        message: 'Driver profile not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Driver profile retrieved successfully',
      data: {
        id: driver.id,
        userId: driver.user_id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        address: driver.address,
        avatar: driver.avatar,
        vehicle: driver.vehicle,
        licenseNumber: driver.license_number,
        licenseExpiry: driver.license_expiry,
        vehicleRegistration: driver.vehicle_registration,
        vehicleModel: driver.vehicle_model,
        vehicleColor: driver.vehicle_color,
        rating: parseFloat(driver.rating),
        totalJobs: driver.total_jobs,
        totalEarnings: parseFloat(driver.total_earnings),
        isActive: driver.is_active,
        isVerified: driver.is_verified,
        currentLocation: driver.current_location,
        status: driver.status,
        lastActive: driver.last_active,
        createdAt: driver.created_at
      }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Get driver profile error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create driver profile
export const createDriverProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const userId = req.user?.userId;
    const {
      vehicle,
      licenseNumber,
      licenseExpiry,
      vehicleRegistration,
      vehicleModel,
      vehicleColor
    } = req.body;

    // Check if driver profile already exists
    const { driverService } = getServices(req);
    const profileExists = await driverService.checkDriverProfileExists(userId!);

    if (profileExists) {
      res.status(409).json({
        success: false,
        message: 'Driver profile already exists'
      });
      return;
    }

    // Create driver profile
    const driver = await driverService.createDriverProfileRecord({
      userId: userId!,
      vehicle,
      licenseNumber,
      licenseExpiry,
      vehicleRegistration,
      vehicleModel,
      vehicleColor,
    });

    // Update user role to driver
    await driverService.updateUserRole(userId!, 'driver');

    res.status(201).json({
      success: true,
      message: 'Driver profile created successfully',
      data: {
        id: driver.id,
        userId: driver.user_id,
        vehicle: driver.vehicle,
        licenseNumber: driver.license_number,
        licenseExpiry: driver.license_expiry,
        vehicleRegistration: driver.vehicle_registration,
        vehicleModel: driver.vehicle_model,
        vehicleColor: driver.vehicle_color,
        rating: parseFloat(driver.rating),
        totalJobs: driver.total_jobs,
        totalEarnings: parseFloat(driver.total_earnings),
        isActive: driver.is_active,
        isVerified: driver.is_verified,
        status: driver.status,
        createdAt: driver.created_at
      }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Create driver profile error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update driver profile
export const updateDriverProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const userId = req.user?.userId;
    const {
      vehicle,
      licenseNumber,
      licenseExpiry,
      vehicleRegistration,
      vehicleModel,
      vehicleColor
    } = req.body;

    const { driverService } = getServices(req);
    const driver = await driverService.updateDriverProfileByUserId(userId!, {
      vehicle,
      licenseNumber,
      licenseExpiry,
      vehicleRegistration,
      vehicleModel,
      vehicleColor,
    });

    if (!driver) {
      res.status(404).json({
        success: false,
        message: 'Driver profile not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Driver profile updated successfully',
      data: {
        id: driver.id,
        userId: driver.user_id,
        vehicle: driver.vehicle,
        licenseNumber: driver.license_number,
        licenseExpiry: driver.license_expiry,
        vehicleRegistration: driver.vehicle_registration,
        vehicleModel: driver.vehicle_model,
        vehicleColor: driver.vehicle_color,
        rating: parseFloat(driver.rating),
        totalJobs: driver.total_jobs,
        totalEarnings: parseFloat(driver.total_earnings),
        isActive: driver.is_active,
        isVerified: driver.is_verified,
        status: driver.status,
        updatedAt: driver.updated_at
      }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Update driver profile error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update driver status
export const updateDriverStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { status, currentLocation } = req.body;

    if (!['offline', 'available', 'busy'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status. Must be offline, available, or busy'
      });
      return;
    }
    const { driverService } = getServices(req);
    const success = await driverService.updateDriverStatusByUserId(userId!, status);
    if (!success) {
      res.status(404).json({
        success: false,
        message: 'Driver profile not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Driver status updated successfully',
      data: {
        status,
        currentLocation: null,
        lastActive: new Date()
      }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Update driver status error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get driver jobs
export const getDriverJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    const { status, limit = 20, offset = 0 } = req.query;
    const statusStr = typeof status === 'string' ? status : undefined;
    const limitNum = Number(limit);
    const offsetNum = Number(offset);
    const { driverService } = getServices(req);
    const driverId = await driverService.getDriverIdByUserId(userId);
    if (!driverId) {
      res.status(404).json({
        success: false,
        message: 'Driver profile not found'
      });
      return;
    }
    
    const { bookingService } = getServices(req);
    const bookings = await bookingService.listDriverBookings(driverId);
    const formattedBookings = bookings.map((booking: any) => ({
      id: booking.id,
      customerName: booking.customer_name,
      customerPhone: booking.customer_phone,
      customerAddress: booking.customer_address,
      pickupLocation: booking.pickup_location,
      pickupCoords: booking.pickup_coords,
      items: booking.items,
      status: booking.status,
      paymentMethod: booking.payment_method,
      amount: parseFloat((booking.amount ?? 0) as number as any),
      contactPhone: booking.contact_phone,
      specialInstructions: booking.special_instructions,
      estimatedPickupTime: booking.estimated_pickup_time,
      estimatedDeliveryTime: booking.estimated_delivery_time,
      actualPickupTime: booking.actual_pickup_time,
      actualDeliveryTime: booking.actual_delivery_time,
      createdAt: booking.created_at
    }));

    res.json({
      success: true,
      message: 'Driver jobs retrieved successfully',
      data: formattedBookings
    });
  } catch (error) {
    Logger.logError(error as Error, 'Get driver jobs error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get available jobs for drivers
export const getAvailableJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const lat = Number(req.query.lat ?? 0);
    const lng = Number(req.query.lng ?? 0);
    const limitNum = Number(limit);
    const offsetNum = Number(offset);
    const { bookingService } = getServices(req);
    const jobs = await bookingService.listAvailableJobs();
    const formattedJobs = jobs.map((job: any) => ({
      id: job.id,
      customerName: job.customer_name,
      customerPhone: job.customer_phone,
      customerAddress: job.customer_address,
      pickupLocation: job.pickup_location,
      pickupCoords: job.pickup_coords,
      items: job.items,
      amount: parseFloat((job.amount ?? 0) as number as any),
      contactPhone: job.contact_phone,
      specialInstructions: job.special_instructions,
      estimatedPickupTime: job.estimated_pickup_time,
      estimatedDeliveryTime: job.estimated_delivery_time,
      distance: typeof job.distance === 'string' ? parseFloat(job.distance) : job.distance,
      createdAt: job.created_at
    }));

    res.json({
      success: true,
      message: 'Available jobs retrieved successfully',
      data: formattedJobs
    });
  } catch (error) {
    Logger.logError(error as Error, 'Get available jobs error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Accept a job
export const acceptJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    const { jobId } = req.params;
    if (!jobId) {
      res.status(400).json({ success: false, message: 'Missing jobId' });
      return;
    }
    const { driverService } = getServices(req);
    const driverId = await driverService.getDriverIdByUserId(userId);
    if (!driverId) {
      res.status(404).json({
        success: false,
        message: 'Driver profile not found or inactive'
      });
      return;
    }
    const { bookingService } = getServices(req);
    const success = await bookingService.assignJobToDriver(jobId, driverId);
    await driverService.setDriverStatus(driverId, 'busy');

    res.json({
      success: true,
      message: 'Job accepted successfully',
      data: {
        id: jobId,
        status: 'assigned',
        driverId: driverId
      }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Accept job error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
