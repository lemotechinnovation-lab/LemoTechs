import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Booking, ApiResponse, PaginatedResponse } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { BookingHubServer } from '../hubs/bookingHubServer';
import { DriverAssignmentService, AssignmentRequest } from '../services/driver/driverAssignmentService';
import { getServices } from '../infrastructure/di/injector';
import { Logger } from '../utils/logger';

// Global reference to the booking hub (will be set by app.ts)
let bookingHub: BookingHubServer | null = null;

export const setBookingHub = (hub: BookingHubServer) => {
  bookingHub = hub;
};

// Create a new booking
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    Logger.info('🔥 CreateBooking: Starting booking creation');
    Logger.info('🔥 CreateBooking: User ID:', req.user?.userId);
    Logger.info('🔥 CreateBooking: Request body:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      Logger.info('🔥 CreateBooking: Validation errors:', errors.array());
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const userId = req.user?.userId;
    const {
      pickupLocation,
      pickupCoords,
      items,
      driverId,
      paymentMethod,
      paymentId,
      amount,
      contactPhone,
      specialInstructions
    } = req.body;

    Logger.info('🔥 CreateBooking: Extracted data:', {
      userId,
      pickupLocation,
      pickupCoords,
      items,
      driverId,
      paymentMethod,
      amount,
      contactPhone
    });

    // Calculate estimated times
    const now = new Date();
    const estimatedPickupTime = new Date(now.getTime() + 30 * 60000); // 30 minutes from now
    const estimatedDeliveryTime = new Date(now.getTime() + 4 * 60 * 60000); // 4 hours from now

    Logger.info('🔥 CreateBooking: About to insert into database');

    // Create booking
    const { bookingService } = getServices(req);
    const booking = await bookingService.createBooking({
      userId: userId!,
      pickupLocation,
      pickupCoords,
      items,
      driverId,
      paymentMethod,
      paymentId,
      amount,
      contactPhone,
      specialInstructions,
      estimatedPickupTime,
      estimatedDeliveryTime
    });

    Logger.info('🔥 CreateBooking: Database insert result:', booking);

    // Update user's total bookings
    await bookingService.updateUserTotalBookings(userId!);

    Logger.info('🔥 CreateBooking: Updated user total bookings');

    // Get driver info if assigned
    let driverInfo = null;
    if (driverId) {
      const { bookingService } = getServices(req);
      driverInfo = await bookingService.getDriverInfo(driverId);
    }

    Logger.info('🔥 CreateBooking: Booking created successfully, sending response');

    // Broadcast real-time update
    if (bookingHub) {
      await bookingHub.updateBookingStatus(booking.id, booking.status, {
        bookingId: booking.id,
        status: booking.status,
        message: 'Your booking has been confirmed!',
        timestamp: new Date()
      });
      Logger.info('🔥 CreateBooking: Real-time update broadcasted');
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        bookingId: booking.id,
        status: booking.status,
        estimatedPickupTime: booking.estimated_pickup_time,
        estimatedDeliveryTime: booking.estimated_delivery_time,
        totalAmount: parseFloat(booking.amount),
        driverInfo
      }
    });
  } catch (error) {
    Logger.logError(error as Error, '🔥 CreateBooking: Error occurred:');
    res.status(500).json({
      success: false,
      message: 'Internal server error during booking creation'
    });
  }
};

// Get user's bookings
export const getUserBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const { bookingService } = getServices(req);
    const bookings = await bookingService.getUserBookings(userId!);
    
    // Apply pagination and filtering
    let filteredBookings = bookings;
    if (status) {
      filteredBookings = bookings.filter((booking: any) => booking.status === status);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBookings = filteredBookings.slice(startIndex, endIndex);
    
    const result = {
      bookings: paginatedBookings,
      total: filteredBookings.length
    };

    const formattedBookings = result.bookings.map((booking: any) => ({
      id: booking.id,
      pickupLocation: booking.pickup_location,
      pickupCoords: booking.pickup_coords,
      items: booking.items,
      status: booking.status,
      paymentMethod: booking.payment_method,
      amount: parseFloat(booking.amount),
      contactPhone: booking.contact_phone,
      specialInstructions: booking.special_instructions,
      estimatedPickupTime: booking.estimated_pickup_time,
      estimatedDeliveryTime: booking.estimated_delivery_time,
      actualPickupTime: booking.actual_pickup_time,
      actualDeliveryTime: booking.actual_delivery_time,
      createdAt: booking.created_at,
      driver: booking.driver_name ? {
        name: booking.driver_name,
        phone: booking.driver_phone,
        vehicle: booking.driver_vehicle,
        rating: parseFloat(booking.driver_rating)
      } : null
    }));

    res.json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: formattedBookings,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit)
      }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Get user bookings error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get booking by ID
export const getBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const { bookingService } = getServices(req);
    const booking = await bookingService.getBookingById(id!);

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Booking retrieved successfully',
      data: {
        id: booking.id,
        pickupLocation: booking.pickup_location,
        pickupCoords: booking.pickup_coords,
        items: booking.items,
        status: booking.status,
        paymentMethod: booking.payment_method,
        paymentId: booking.payment_id,
        amount: parseFloat(booking.amount),
        contactPhone: booking.contact_phone,
        specialInstructions: booking.special_instructions,
        estimatedPickupTime: booking.estimated_pickup_time,
        estimatedDeliveryTime: booking.estimated_delivery_time,
        actualPickupTime: booking.actual_pickup_time,
        actualDeliveryTime: booking.actual_delivery_time,
        createdAt: booking.created_at,
        driver: booking.driver_name ? {
          name: booking.driver_name,
          phone: booking.driver_phone,
          vehicle: booking.driver_vehicle,
          rating: parseFloat(booking.driver_rating),
          currentLocation: booking.driver_location
        } : null
      }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Get booking by ID error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Cancel booking
export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const { bookingService } = getServices(req);
    const result = await bookingService.cancelBooking(id!);

    if (!result) {
      res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    Logger.logError(error as Error, 'Cancel booking error:');
    if (error instanceof Error && error.message === 'Booking cannot be cancelled at this stage') {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get available drivers near location
export const getAvailableDrivers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
      return;
    }

    // For now, return all available drivers
    // In production, you'd calculate distance and filter by proximity
    const { bookingService } = getServices(req);
    const drivers = await bookingService.getAvailableDrivers();

    const formattedDrivers = drivers.map((driver: any) => ({
      id: driver.id,
      name: driver.name,
      vehicle: driver.vehicle,
      rating: parseFloat(driver.rating),
      completedJobs: driver.total_jobs,
      estimatedArrival: `${Math.floor(Math.random() * 15) + 5} minutes`, // Random for demo
      location: driver.current_location || { lat: parseFloat(lat as string), lng: parseFloat(lng as string) },
      photo: '/api/placeholder/150/150' // Placeholder
    }));

    res.json({
      success: true,
      message: 'Available drivers retrieved successfully',
      data: formattedDrivers
    });
  } catch (error) {
    Logger.logError(error as Error, 'Get available drivers error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Auto-assign driver to a booking using intelligent matching
export const autoAssignDriver = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const { priority = 'normal', customerTier = 'regular' } = req.body;

    if (!bookingId) {
      res.status(400).json({
        success: false,
        message: 'Booking ID is required'
      });
      return;
    }

    // Get booking details
    const { bookingService } = getServices(req);
    const bookings = await bookingService.getBookingForAutoAssignment();
    const booking = bookings.find((b: any) => b.id === bookingId);

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found or already assigned'
      });
      return;
    }

    // Create assignment request
    const assignmentRequest: AssignmentRequest = {
      bookingId,
      pickupLocation: booking.pickup_coords,
      priority,
      estimatedPickupTime: booking.estimated_pickup_time,
      specialRequirements: booking.special_instructions ? [booking.special_instructions] : [],
      customerTier
    };

    // Find and assign best driver
    const { driverAssignmentService } = getServices(req);
    const result = await driverAssignmentService.findBestDriver(assignmentRequest);

    if (result.success && result.assignedDriver) {
      // Send real-time notification
      if (bookingHub) {
        await bookingHub.notifyDriverAssignment(
          result.assignedDriver.userId,
          bookingId,
          result.assignedDriver
        );

        await bookingHub.notifyCustomerDriverAssigned(
          booking.user_id,
          bookingId,
          result.assignedDriver
        );
      }

      res.json({
        success: true,
        message: 'Driver assigned successfully',
        data: {
          assignedDriver: result.assignedDriver,
          estimatedWaitTime: result.estimatedWaitTime,
          assignmentId: result.assignmentId
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.message || 'No drivers available',
        data: {
          alternativeDrivers: result.alternativeDrivers,
          estimatedWaitTime: result.estimatedWaitTime
        }
      });
    }
  } catch (error) {
    Logger.logError(error as Error, 'Auto assign driver error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get booking assignment status
export const getBookingAssignmentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;

    const { bookingService } = getServices(req);
    const booking = await bookingService.getBookingAssignmentStatus(bookingId!);

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Booking assignment status retrieved',
      data: {
        bookingId: booking.id,
        status: booking.status,
        hasDriver: !!booking.driver_id,
        driver: booking.driver_id ? {
          id: booking.driver_id,
          name: booking.driver_name,
          phone: booking.driver_phone,
          vehicle: booking.vehicle,
          rating: parseFloat(booking.rating),
          currentLocation: booking.current_location
        } : null,
        estimatedPickupTime: booking.estimated_pickup_time
      }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Get booking assignment status error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
