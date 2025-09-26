import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../components/Auth/UserAuth';

// Define role types
export type UserRole = 'user' | 'driver' | 'shop' | 'admin' | 'business';

// Define permissions (matching backend)
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
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
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

// Define role hierarchy
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 1,
  driver: 2,
  shop: 2,
  business: 3,
  admin: 4,
};

// Role context interface
interface RoleContextType {
  role: UserRole | null;
  permissions: string[];
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  canManageUser: (targetRole: UserRole) => boolean;
  updateRole: (newRole: UserRole) => void;
}

// Create context
const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Role provider component
interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get permissions for current role
  const permissions = role ? ROLE_PERMISSIONS[role] : [];

  // Load user role from auth context or localStorage
  useEffect(() => {
    const loadUserRole = async () => {
      try {
        setIsLoading(true);
        
        if (isAuthenticated && user) {
          // Try to get role from user object first
          let userRole = user.role as UserRole;
          
          // If not in user object, try localStorage
          if (!userRole) {
            userRole = localStorage.getItem('user_role') as UserRole;
          }
          
          // Validate role
          if (userRole && ROLE_PERMISSIONS[userRole]) {
            setRole(userRole);
            localStorage.setItem('user_role', userRole);
          } else {
            // Default to user role if no valid role found
            setRole('user');
            localStorage.setItem('user_role', 'user');
          }
        } else {
          setRole(null);
          localStorage.removeItem('user_role');
        }
      } catch (error) {
        console.error('Error loading user role:', error);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserRole();
  }, [isAuthenticated, user]);

  // Update role function
  const updateRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('user_role', newRole);
  };

  // Check if user has specific permission
  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  // Check if user has specific role(s)
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!role) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(role);
  };

  // Check if user can manage another user (role hierarchy)
  const canManageUser = (targetRole: UserRole): boolean => {
    if (!role) return false;
    const userLevel = ROLE_HIERARCHY[role];
    const targetLevel = ROLE_HIERARCHY[targetRole];
    return userLevel > targetLevel;
  };

  const contextValue: RoleContextType = {
    role,
    permissions,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasRole,
    canManageUser,
    updateRole,
  };

  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  );
};

// Custom hook to use role context
export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

// Helper hook to check specific permission
export const usePermission = (permission: string): boolean => {
  const { hasPermission } = useRole();
  return hasPermission(permission);
};

// Helper hook to check specific role
export const useHasRole = (roles: UserRole | UserRole[]): boolean => {
  const { hasRole } = useRole();
  return hasRole(roles);
};

// Helper hook to get role-specific navigation items
export const useRoleNavigation = () => {
  const { role, hasPermission } = useRole();

  const getNavigationItems = () => {
    if (!role) return [];

    const baseItems = [
      { label: 'Home', path: '/', icon: 'home' },
    ];

    const roleSpecificItems = [];

    // User-specific navigation
    if (hasPermission(PERMISSIONS.USER_CREATE_BOOKING)) {
      roleSpecificItems.push(
        { label: 'Book Service', path: '/book', icon: 'add_circle' },
        { label: 'My Bookings', path: '/bookings', icon: 'list' }
      );
    }

    // Driver-specific navigation
    if (hasPermission(PERMISSIONS.DRIVER_VIEW_JOBS)) {
      roleSpecificItems.push(
        { label: 'Dashboard', path: '/driver', icon: 'dashboard' },
        { label: 'Available Jobs', path: '/driver/jobs', icon: 'work' },
        { label: 'My Earnings', path: '/driver/earnings', icon: 'attach_money' }
      );
    }

    // Shop-specific navigation
    if (hasPermission(PERMISSIONS.SHOP_VIEW_ORDERS)) {
      roleSpecificItems.push(
        { label: 'Dashboard', path: '/shop', icon: 'dashboard' },
        { label: 'Orders', path: '/shop/orders', icon: 'inventory' },
        { label: 'Analytics', path: '/shop/analytics', icon: 'analytics' }
      );
    }

    // Admin-specific navigation
    if (hasPermission(PERMISSIONS.ADMIN_VIEW_ALL_USERS)) {
      roleSpecificItems.push(
        { label: 'Admin Dashboard', path: '/admin', icon: 'admin_panel_settings' },
        { label: 'Users', path: '/admin/users', icon: 'people' },
        { label: 'Bookings', path: '/admin/bookings', icon: 'list' },
        { label: 'Drivers', path: '/admin/drivers', icon: 'drive_eta' },
        { label: 'Shops', path: '/admin/shops', icon: 'store' }
      );
    }

    // Business-specific navigation
    if (hasPermission(PERMISSIONS.BUSINESS_VIEW_ANALYTICS)) {
      roleSpecificItems.push(
        { label: 'Business Dashboard', path: '/business-dashboard', icon: 'business' },
        { label: 'Analytics', path: '/analytics', icon: 'analytics' },
        { label: 'Marketplace', path: '/marketplace', icon: 'storefront' }
      );
    }

    return [...baseItems, ...roleSpecificItems];
  };

  return {
    navigationItems: getNavigationItems(),
    role,
  };
};
