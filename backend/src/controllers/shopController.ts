import { Request, Response } from 'express';
import { Logger } from '../utils/logger';
import { validationResult } from 'express-validator';
import { getServices } from '../infrastructure/di/injector';

// Get shop profile
export const getShopProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopService } = getServices(req);
    const shop = await shopService.getShopProfileByUserId(userId);

    if (!shop) {
      res.status(404).json({
        success: false,
        message: 'Shop profile not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Shop profile retrieved successfully',
      data: {
        id: shop.id,
        userId: shop.user_id,
        name: shop.name,
        description: shop.description,
        address: shop.address,
        coordinates: shop.coordinates,
        phone: shop.phone,
        email: shop.email,
        operatingHours: shop.operating_hours,
        services: shop.services,
        rating: parseFloat(shop.rating),
        totalBookings: shop.total_bookings,
        totalRevenue: parseFloat(shop.total_revenue),
        isActive: shop.is_active,
        isVerified: shop.is_verified,
        capacity: shop.capacity,
        currentLoad: shop.current_load,
        createdAt: shop.created_at
      }
    });
  } catch (error) {
    Logger.error('Get shop profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create shop profile
export const createShopProfile = async (req: Request, res: Response): Promise<void> => {
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
      name,
      description,
      address,
      coordinates,
      phone,
      email,
      operatingHours,
      services,
      capacity
    } = req.body;

    // Check if shop profile already exists
    const { shopService } = getServices(req);
    const profileExists = await shopService.checkShopProfileExists(userId!);

    if (profileExists) {
      res.status(409).json({
        success: false,
        message: 'Shop profile already exists'
      });
      return;
    }

    // Create shop profile
    const shop = await shopService.createShopProfileRecord(userId!, {
      name,
      description,
      address,
      coordinates,
      phone,
      email,
      operatingHours,
      services,
      capacity,
    });

    // Update user role to shop
    const { userService } = getServices(req);
    await userService.updateUserRole(userId!, 'shop');

    res.status(201).json({
      success: true,
      message: 'Shop profile created successfully',
      data: {
        id: shop.id,
        userId: shop.user_id,
        name: shop.name,
        description: shop.description,
        address: shop.address,
        coordinates: shop.coordinates,
        phone: shop.phone,
        email: shop.email,
        operatingHours: shop.operating_hours,
        services: shop.services,
        rating: parseFloat(shop.rating),
        totalBookings: shop.total_bookings,
        totalRevenue: parseFloat(shop.total_revenue),
        isActive: shop.is_active,
        isVerified: shop.is_verified,
        capacity: shop.capacity,
        currentLoad: shop.current_load,
        createdAt: shop.created_at
      }
    });
  } catch (error) {
    Logger.error('Create shop profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update shop profile
export const updateShopProfile = async (req: Request, res: Response): Promise<void> => {
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
      name,
      description,
      address,
      coordinates,
      phone,
      email,
      operatingHours,
      services,
      capacity
    } = req.body;

    const { shopService } = getServices(req);
    const shop = await shopService.updateShopProfileByUserId(userId!, {
      name,
      description,
      address,
      coordinates,
      phone,
      email,
      operatingHours,
      services,
      capacity,
    });

    if (!shop) {
      res.status(404).json({
        success: false,
        message: 'Shop profile not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Shop profile updated successfully',
      data: {
        id: shop.id,
        userId: shop.user_id,
        name: shop.name,
        description: shop.description,
        address: shop.address,
        coordinates: shop.coordinates,
        phone: shop.phone,
        email: shop.email,
        operatingHours: shop.operating_hours,
        services: shop.services,
        rating: parseFloat(shop.rating),
        totalBookings: shop.total_bookings,
        totalRevenue: parseFloat(shop.total_revenue),
        isActive: shop.is_active,
        isVerified: shop.is_verified,
        capacity: shop.capacity,
        currentLoad: shop.current_load,
        updatedAt: shop.updated_at
      }
    });
  } catch (error) {
    Logger.error('Update shop profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get shop bookings
export const getShopBookings = async (req: Request, res: Response): Promise<void> => {
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
    const { bookingService } = getServices(req);
    const rows = await bookingService.listShopBookings(userId);
    const bookings = rows.map((booking: any) => ({
      id: booking.id,
      customerName: booking.customer_name,
      customerPhone: booking.customer_phone,
      customerAddress: booking.customer_address,
      pickupLocation: booking.pickup_location,
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
      cleaningStartedAt: booking.cleaning_started_at,
      cleaningCompletedAt: booking.cleaning_completed_at,
      createdAt: booking.created_at
    }));

    res.json({
      success: true,
      message: 'Shop bookings retrieved successfully',
      data: bookings
    });
  } catch (error) {
    Logger.error('Get shop bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update booking status (for shop)
export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    const { bookingId } = req.params;
    const { status } = req.body as { status?: string };
    if (!bookingId) {
      res.status(400).json({ success: false, message: 'Missing bookingId' });
      return;
    }
    if (!status) {
      res.status(400).json({ success: false, message: 'Missing status' });
      return;
    }

    if (!['pickup', 'cleaning', 'delivery', 'completed'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status for shop update'
      });
      return;
    }

    const { bookingService } = getServices(req);
    const owned = await bookingService.getBookingOwnedByShop(bookingId, userId);
    if (!owned) {
      res.status(404).json({
        success: false,
        message: 'Booking not found or not assigned to this shop'
      });
      return;
    }
    const booking = await bookingService.updateBookingStatus(bookingId, status, status === 'cleaning', status === 'completed');

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: {
        id: booking.id,
        status: booking.status,
        cleaningStartedAt: booking.cleaning_started_at,
        cleaningCompletedAt: booking.cleaning_completed_at,
        updatedAt: booking.updated_at
      }
    });
  } catch (error) {
    Logger.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get shop analytics
export const getShopAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { period = '30' } = req.query; // days

    const { shopService } = getServices(req);
    const analytics = await shopService.getShopAnalytics(userId!, period as string);

    res.json({
      success: true,
      message: 'Shop analytics retrieved successfully',
      data: {
        totalBookings: parseInt(analytics.total_bookings),
        totalRevenue: parseFloat(analytics.total_revenue || 0),
        avgOrderValue: parseFloat(analytics.avg_order_value || 0),
        completedBookings: parseInt(analytics.completed_bookings),
        activeBookings: parseInt(analytics.active_bookings),
        recentBookings: parseInt(analytics.recent_bookings),
        recentRevenue: parseFloat(analytics.recent_revenue || 0),
        period: `${period} days`
      }
    });
  } catch (error) {
    Logger.error('Get shop analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
