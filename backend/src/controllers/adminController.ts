import { Request, Response } from 'express';
import { getServices } from '../infrastructure/di/injector';
import { Logger } from '../utils/logger';

// Get all users with pagination and filtering
export const getAllUsersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const role = req.query.role as string;

    const { adminService } = getServices(req);
    const result = await adminService.getAllUsers(page, limit, { status, role });

    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users: result.users,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Get all users error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user by ID
export const getUserByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const { adminService } = getServices(req);
    const user = await adminService.getUserById(userId!);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    Logger.logError(error as Error, 'Get user by ID error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user status
export const updateUserStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { status, reason } = req.body;

    const { adminService } = getServices(req);
    const user = await adminService.updateUserStatus(userId!, status);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });
  } catch (error) {
    Logger.logError(error as Error, 'Update user status error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all bookings with pagination
export const getAllBookingsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;

    const { adminService } = getServices(req);
    const result = await adminService.getAllBookings(page, limit);

    res.json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: {
        bookings: result.bookings,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Get all bookings error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all drivers with pagination
export const getAllDriversController = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;

    const { adminService } = getServices(req);
    const result = await adminService.getAllDrivers(page, limit);

    res.json({
      success: true,
      message: 'Drivers retrieved successfully',
      data: {
        drivers: result.drivers,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Get all drivers error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all shops with pagination
export const getAllShopsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;

    const { adminService } = getServices(req);
    const result = await adminService.getAllShops(page, limit);

    res.json({
      success: true,
      message: 'Shops retrieved successfully',
      data: {
        shops: result.shops,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Get all shops error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get system analytics
export const getSystemAnalyticsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { adminService } = getServices(req);
    const analytics = await adminService.getSystemAnalytics();

    res.json({
      success: true,
      message: 'System analytics retrieved successfully',
      data: {
        totalUsers: analytics.totalUsers,
        totalDrivers: analytics.totalDrivers,
        totalShops: analytics.totalShops,
        totalBookings: analytics.totalBookings,
        totalRevenue: analytics.totalRevenue,
        activeUsers: analytics.activeUsers,
        pendingVerifications: analytics.pendingVerifications
      }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Get system analytics error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get system logs
export const getSystemLogsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const { adminService } = getServices(req);
    const result = await adminService.getSystemLogs(page, limit);

    res.json({
      success: true,
      message: 'System logs retrieved successfully',
      data: {
        logs: result.logs,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: 1
        }
      }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Get system logs error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update system settings
export const updateSystemSettingsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { settings } = req.body;

    const { adminService } = getServices(req);
    await adminService.updateSystemSettings(settings);

    res.json({
      success: true,
      message: 'System settings updated successfully',
      data: { settings }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Update system settings error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
