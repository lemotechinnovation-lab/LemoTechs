import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRole, UserRole } from '../../context/RoleContext';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole | UserRole[];
  requiredPermissions?: string | string[];
  fallbackPath?: string;
  showLoading?: boolean;
  showError?: boolean;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermissions,
  fallbackPath = '/',
  showLoading = true,
  showError = true,
}) => {
  const { role, hasRole, hasAnyPermission, isLoading } = useRole();
  const location = useLocation();

  // Show loading state
  if (isLoading && showLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="200px"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // Check role requirements
  if (allowedRoles && role && !hasRole(allowedRoles)) {
    if (showError) {
      return (
        <Box p={3}>
          <Alert severity="error">
            <Typography variant="h6">Access Denied</Typography>
            <Typography variant="body2">
              You don't have permission to access this page. 
              Required role: {Array.isArray(allowedRoles) ? allowedRoles.join(' or ') : allowedRoles}
            </Typography>
          </Alert>
        </Box>
      );
    }
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check permission requirements
  if (requiredPermissions) {
    const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    const hasRequiredPermission = hasAnyPermission(permissions);

    if (!hasRequiredPermission) {
      if (showError) {
        return (
          <Box p={3}>
            <Alert severity="error">
              <Typography variant="h6">Access Denied</Typography>
              <Typography variant="body2">
                You don't have permission to access this page. 
                Required permissions: {permissions.join(', ')}
              </Typography>
            </Alert>
          </Box>
        );
      }
      return <Navigate to={fallbackPath} state={{ from: location }} replace />;
    }
  }

  // If no role is set but we have requirements, redirect to login
  if (!role && (allowedRoles || requiredPermissions)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Convenience components for specific roles
export const UserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedRoute allowedRoles="user" fallbackPath="/login">
    {children}
  </RoleBasedRoute>
);

export const DriverRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedRoute allowedRoles="driver" fallbackPath="/login">
    {children}
  </RoleBasedRoute>
);

export const ShopRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedRoute allowedRoles="shop" fallbackPath="/login">
    {children}
  </RoleBasedRoute>
);

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedRoute allowedRoles="admin" fallbackPath="/login">
    {children}
  </RoleBasedRoute>
);

export const BusinessRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedRoute allowedRoles="business" fallbackPath="/login">
    {children}
  </RoleBasedRoute>
);

// Multi-role route component
export const MultiRoleRoute: React.FC<{ 
  children: React.ReactNode; 
  roles: UserRole[];
}> = ({ children, roles }) => (
  <RoleBasedRoute allowedRoles={roles}>
    {children}
  </RoleBasedRoute>
);

// Permission-based route component
export const PermissionRoute: React.FC<{ 
  children: React.ReactNode; 
  permissions: string | string[];
}> = ({ children, permissions }) => (
  <RoleBasedRoute requiredPermissions={permissions}>
    {children}
  </RoleBasedRoute>
);
