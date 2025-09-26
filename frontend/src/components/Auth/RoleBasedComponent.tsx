import React from 'react';
import { useRole, UserRole } from '../../context/RoleContext';

interface RoleBasedComponentProps {
  children: React.ReactNode;
  allowedRoles?: UserRole | UserRole[];
  requiredPermissions?: string | string[];
  fallback?: React.ReactNode;
  showForRoles?: UserRole | UserRole[];
  hideForRoles?: UserRole | UserRole[];
}

export const RoleBasedComponent: React.FC<RoleBasedComponentProps> = ({
  children,
  allowedRoles,
  requiredPermissions,
  fallback = null,
  showForRoles,
  hideForRoles,
}) => {
  const { role, hasRole, hasAnyPermission } = useRole();

  // If no role is set, show fallback
  if (!role) {
    return <>{fallback}</>;
  }

  // Check showForRoles (show only for these roles)
  if (showForRoles) {
    const roles = Array.isArray(showForRoles) ? showForRoles : [showForRoles];
    if (!hasRole(roles)) {
      return <>{fallback}</>;
    }
  }

  // Check hideForRoles (hide for these roles)
  if (hideForRoles) {
    const roles = Array.isArray(hideForRoles) ? hideForRoles : [hideForRoles];
    if (hasRole(roles)) {
      return <>{fallback}</>;
    }
  }

  // Check role requirements
  if (allowedRoles && !hasRole(allowedRoles)) {
    return <>{fallback}</>;
  }

  // Check permission requirements
  if (requiredPermissions) {
    const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    if (!hasAnyPermission(permissions)) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

// Convenience components for specific roles
export const UserOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <RoleBasedComponent allowedRoles="user" fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

export const DriverOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <RoleBasedComponent allowedRoles="driver" fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

export const ShopOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <RoleBasedComponent allowedRoles="shop" fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

export const AdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <RoleBasedComponent allowedRoles="admin" fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

export const BusinessOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <RoleBasedComponent allowedRoles="business" fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

// Multi-role component
export const MultiRole: React.FC<{ 
  children: React.ReactNode; 
  roles: UserRole[];
  fallback?: React.ReactNode;
}> = ({ children, roles, fallback }) => (
  <RoleBasedComponent allowedRoles={roles} fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

// Permission-based component
export const PermissionBased: React.FC<{ 
  children: React.ReactNode; 
  permissions: string | string[];
  fallback?: React.ReactNode;
}> = ({ children, permissions, fallback }) => (
  <RoleBasedComponent requiredPermissions={permissions} fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

// Conditional rendering based on permissions
export const ConditionalRender: React.FC<{
  condition: (role: UserRole | null, hasPermission: (permission: string) => boolean) => boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ condition, children, fallback }) => {
  const { role, hasPermission } = useRole();
  
  if (condition(role, hasPermission)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

// Role-based button component
interface RoleBasedButtonProps {
  children: React.ReactNode;
  allowedRoles?: UserRole | UserRole[];
  requiredPermissions?: string | string[];
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const RoleBasedButton: React.FC<RoleBasedButtonProps> = ({
  children,
  allowedRoles,
  requiredPermissions,
  disabled = false,
  ...props
}) => {
  const { role, hasRole, hasAnyPermission } = useRole();

  // Check if button should be disabled based on role/permissions
  const isDisabledByRole = () => {
    if (!role) return true;
    
    if (allowedRoles && !hasRole(allowedRoles)) return true;
    
    if (requiredPermissions) {
      const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
      if (!hasAnyPermission(permissions)) return true;
    }
    
    return false;
  };

  const shouldDisable = disabled || isDisabledByRole();

  return (
    <RoleBasedComponent allowedRoles={allowedRoles} requiredPermissions={requiredPermissions}>
      <button {...props} disabled={shouldDisable}>
        {children}
      </button>
    </RoleBasedComponent>
  );
};

// Role-based menu item component
interface RoleBasedMenuItemProps {
  children: React.ReactNode;
  allowedRoles?: UserRole | UserRole[];
  requiredPermissions?: string | string[];
  onClick?: () => void;
  icon?: React.ReactNode;
}

export const RoleBasedMenuItem: React.FC<RoleBasedMenuItemProps> = ({
  children,
  allowedRoles,
  requiredPermissions,
  onClick,
  icon,
}) => {
  return (
    <RoleBasedComponent allowedRoles={allowedRoles} requiredPermissions={requiredPermissions}>
      <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', cursor: 'pointer' }}>
        {icon}
        {children}
      </div>
    </RoleBasedComponent>
  );
};
