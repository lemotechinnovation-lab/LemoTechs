import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { User } from '../types';
import { Logger } from '../utils/logger';

// Define role permissions
export interface RolePermissions {
  [key: string]: string[];
}

// Define all available permissions
export const PERMISSIONS = {
  // User permissions
  USER_CREATE_BOOKING: 'user:create_booking',
  USER_VIEW_BOOKINGS: 'user:view_bookings',
  USER_CANCEL_BOOKING: 'user:cancel_booking',
  USER_TRACK_BOOKING: 'user:track_booking',
  USER_RATE_SERVICE: 'user:rate_service',
  USER_UPDATE_PROFILE: 'user:update_profile',
  USER_VIEW_PROFILE: 'user:view_profile',
  
  // Driver permissions
  DRIVER_VIEW_JOBS: 'driver:view_jobs',
  DRIVER_ACCEPT_JOB: 'driver:accept_job',
  DRIVER_REJECT_JOB: 'driver:reject_job',
  DRIVER_UPDATE_LOCATION: 'driver:update_location',
  DRIVER_UPDATE_STATUS: 'driver:update_status',
  DRIVER_VIEW_EARNINGS: 'driver:view_earnings',
  DRIVER_MESSAGE_CUSTOMER: 'driver:message_customer',
  DRIVER_MESSAGE_SHOP: 'driver:message_shop',
  DRIVER_VIEW_PROFILE: 'driver:view_profile',
  DRIVER_UPDATE_PROFILE: 'driver:update_profile',
  
  // Shop permissions
  SHOP_VIEW_ORDERS: 'shop:view_orders',
  SHOP_UPDATE_ORDER_STATUS: 'shop:update_order_status',
  SHOP_VIEW_INVENTORY: 'shop:view_inventory',
  SHOP_UPDATE_INVENTORY: 'shop:update_inventory',
  SHOP_VIEW_ANALYTICS: 'shop:view_analytics',
  SHOP_MESSAGE_CUSTOMER: 'shop:message_customer',
  SHOP_MESSAGE_DRIVER: 'shop:message_driver',
  SHOP_VIEW_PROFILE: 'shop:view_profile',
  SHOP_UPDATE_PROFILE: 'shop:update_profile',
  
  // Admin permissions
  ADMIN_VIEW_ALL_USERS: 'admin:view_all_users',
  ADMIN_VIEW_ALL_BOOKINGS: 'admin:view_all_bookings',
  ADMIN_VIEW_ALL_DRIVERS: 'admin:view_all_drivers',
  ADMIN_VIEW_ALL_SHOPS: 'admin:view_all_shops',
  ADMIN_UPDATE_USER_STATUS: 'admin:update_user_status',
  ADMIN_VIEW_ANALYTICS: 'admin:view_analytics',
  ADMIN_MANAGE_SYSTEM: 'admin:manage_system',
  ADMIN_VIEW_LOGS: 'admin:view_logs',
  
  // Business permissions
  BUSINESS_VIEW_ANALYTICS: 'business:view_analytics',
  BUSINESS_MANAGE_FRANCHISE: 'business:manage_franchise',
  BUSINESS_VIEW_REPORTS: 'business:view_reports',
  BUSINESS_MANAGE_MARKETPLACE: 'business:manage_marketplace',
} as const;

// Define role permissions mapping
export const ROLE_PERMISSIONS: RolePermissions = {
  user: [
    PERMISSIONS.USER_CREATE_BOOKING,
    PERMISSIONS.USER_VIEW_BOOKINGS,
    PERMISSIONS.USER_CANCEL_BOOKING,
    PERMISSIONS.USER_TRACK_BOOKING,
    PERMISSIONS.USER_RATE_SERVICE,
    PERMISSIONS.USER_UPDATE_PROFILE,
    PERMISSIONS.USER_VIEW_PROFILE,
  ],
  driver: [
    PERMISSIONS.DRIVER_VIEW_JOBS,
    PERMISSIONS.DRIVER_ACCEPT_JOB,
    PERMISSIONS.DRIVER_REJECT_JOB,
    PERMISSIONS.DRIVER_UPDATE_LOCATION,
    PERMISSIONS.DRIVER_UPDATE_STATUS,
    PERMISSIONS.DRIVER_VIEW_EARNINGS,
    PERMISSIONS.DRIVER_MESSAGE_CUSTOMER,
    PERMISSIONS.DRIVER_MESSAGE_SHOP,
    PERMISSIONS.DRIVER_VIEW_PROFILE,
    PERMISSIONS.DRIVER_UPDATE_PROFILE,
    // Drivers also have user permissions
    PERMISSIONS.USER_VIEW_PROFILE,
    PERMISSIONS.USER_UPDATE_PROFILE,
  ],
  shop: [
    PERMISSIONS.SHOP_VIEW_ORDERS,
    PERMISSIONS.SHOP_UPDATE_ORDER_STATUS,
    PERMISSIONS.SHOP_VIEW_INVENTORY,
    PERMISSIONS.SHOP_UPDATE_INVENTORY,
    PERMISSIONS.SHOP_VIEW_ANALYTICS,
    PERMISSIONS.SHOP_MESSAGE_CUSTOMER,
    PERMISSIONS.SHOP_MESSAGE_DRIVER,
    PERMISSIONS.SHOP_VIEW_PROFILE,
    PERMISSIONS.SHOP_UPDATE_PROFILE,
    // Shops also have user permissions
    PERMISSIONS.USER_VIEW_PROFILE,
    PERMISSIONS.USER_UPDATE_PROFILE,
  ],
  admin: [
    // Admin has all permissions
    ...Object.values(PERMISSIONS),
  ],
  business: [
    PERMISSIONS.BUSINESS_VIEW_ANALYTICS,
    PERMISSIONS.BUSINESS_MANAGE_FRANCHISE,
    PERMISSIONS.BUSINESS_VIEW_REPORTS,
    PERMISSIONS.BUSINESS_MANAGE_MARKETPLACE,
    // Business users also have user permissions
    PERMISSIONS.USER_VIEW_PROFILE,
    PERMISSIONS.USER_UPDATE_PROFILE,
  ],
};

// Extended Request interface to include user data
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    type: 'access' | 'refresh';
    role?: string;
    permissions?: string[];
    firebaseUid?: string;
    driverId?: string;
    shopId?: string;
  };
}

// Middleware to verify JWT token and extract user info
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token required'
      });
      return;
    }

    // Verify JWT token
    const decoded = verifyAccessToken(token);
    
    // Get user permissions based on role
    const userPermissions = decoded.role ? ROLE_PERMISSIONS[decoded.role] || [] : [];
    
    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      type: decoded.type || 'access',
      role: decoded.role,
      permissions: userPermissions
    };

    next();
  } catch (error) {
    Logger.error('Token verification error:', error);
    res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Middleware to check if user has specific permission
export const requirePermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (!req.user.permissions?.includes(permission)) {
      res.status(403).json({
        success: false,
        message: `Insufficient permissions. Required: ${permission}`
      });
      return;
    }

    next();
  };
};

// Middleware to check if user has any of the specified permissions
export const requireAnyPermission = (permissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const hasPermission = permissions.some(permission => 
      req.user!.permissions?.includes(permission)
    );

    if (!hasPermission) {
      res.status(403).json({
        success: false,
        message: `Insufficient permissions. Required one of: ${permissions.join(', ')}`
      });
      return;
    }

    next();
  };
};

// Middleware to check if user has specific role
export const requireRole = (roles: string | string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!req.user.role || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
      });
      return;
    }

    next();
  };
};

// Middleware to check if user can access resource (owner or admin)
export const requireOwnershipOrAdmin = (resourceUserIdField: string = 'userId') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      next();
      return;
    }

    // Check if user owns the resource
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (resourceUserId && resourceUserId === req.user.userId) {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.'
    });
  };
};

// Helper function to get user permissions
export const getUserPermissions = (role: string): string[] => {
  return ROLE_PERMISSIONS[role] || [];
};

// Helper function to check if role has permission
export const hasPermission = (role: string, permission: string): boolean => {
  const permissions = getUserPermissions(role);
  return permissions.includes(permission);
};

// Helper function to get available roles
export const getAvailableRoles = (): string[] => {
  return Object.keys(ROLE_PERMISSIONS);
};

// Helper function to get role hierarchy
export const getRoleHierarchy = (): { [key: string]: number } => {
  return {
    user: 1,
    driver: 2,
    shop: 2,
    business: 3,
    admin: 4,
  };
};

// Helper function to check if user can manage another user
export const canManageUser = (managerRole: string, targetRole: string): boolean => {
  const hierarchy = getRoleHierarchy();
  const managerLevel = hierarchy[managerRole] || 0;
  const targetLevel = hierarchy[targetRole] || 0;
  
  return managerLevel > targetLevel;
};