# 🔐 Role-Based Access Control (RBAC) Implementation

## Overview

LemoTech Innovations now has a comprehensive Role-Based Access Control system that ensures users only see and access features appropriate to their role. This system works across both frontend and backend, providing secure, scalable access control.

## 🎯 User Roles

### 1. **User** (Customer)
- **Purpose**: Regular customers who book cleaning services
- **Permissions**:
  - Create bookings
  - View their own bookings
  - Cancel bookings
  - Track bookings
  - Rate services
  - Update profile

### 2. **Driver** (Delivery Person)
- **Purpose**: Drivers who pick up and deliver items
- **Permissions**:
  - View available jobs
  - Accept/reject jobs
  - Update location and status
  - View earnings
  - Message customers and shops
  - Update profile
  - All user permissions

### 3. **Shop** (Cleaning Service Provider)
- **Purpose**: Cleaning shops that process orders
- **Permissions**:
  - View shop orders
  - Update order status
  - Manage inventory
  - View shop analytics
  - Message customers and drivers
  - Update profile
  - All user permissions

### 4. **Business** (Franchise Owner)
- **Purpose**: Business owners managing multiple locations
- **Permissions**:
  - View business analytics
  - Manage franchises
  - View reports
  - Manage marketplace
  - Basic user permissions

### 5. **Admin** (System Administrator)
- **Purpose**: Platform administrators
- **Permissions**:
  - View all users, drivers, shops
  - Manage user status
  - View system analytics
  - Manage system settings
  - View system logs
  - ALL permissions

## 🏗️ Backend Implementation

### Role-Based Middleware

```typescript
// backend/src/middleware/roleAuth.ts
import { requirePermission, requireRole, PERMISSIONS } from '../middleware/roleAuth';

// Protect route with specific permission
router.post('/bookings', 
  authenticateToken, 
  requirePermission(PERMISSIONS.USER_CREATE_BOOKING),
  createBooking
);

// Protect route with specific role
router.get('/admin/users', 
  authenticateToken, 
  requireRole('admin'),
  getAllUsers
);

// Protect route with multiple roles
router.get('/bookings', 
  authenticateToken, 
  requireAnyPermission([
    PERMISSIONS.USER_VIEW_BOOKINGS,
    PERMISSIONS.DRIVER_VIEW_JOBS,
    PERMISSIONS.SHOP_VIEW_ORDERS
  ]),
  getUserBookings
);
```

### API Endpoint Protection

All API endpoints are now protected with role-based access:

```typescript
// Examples of protected endpoints:

// User endpoints - require user permissions
POST /api/bookings - requires USER_CREATE_BOOKING
GET /api/bookings - requires USER_VIEW_BOOKINGS
DELETE /api/bookings/:id - requires USER_CANCEL_BOOKING

// Driver endpoints - require driver permissions
GET /api/drivers/jobs - requires DRIVER_VIEW_JOBS
POST /api/drivers/accept-job/:id - requires DRIVER_ACCEPT_JOB
PUT /api/drivers/status - requires DRIVER_UPDATE_STATUS

// Shop endpoints - require shop permissions
GET /api/shops/orders - requires SHOP_VIEW_ORDERS
PUT /api/shops/orders/:id/status - requires SHOP_UPDATE_ORDER_STATUS
GET /api/shops/analytics - requires SHOP_VIEW_ANALYTICS

// Admin endpoints - require admin permissions
GET /api/admin/users - requires ADMIN_VIEW_ALL_USERS
PUT /api/admin/users/:id/status - requires ADMIN_UPDATE_USER_STATUS
GET /api/admin/analytics - requires ADMIN_VIEW_ANALYTICS
```

## 🎨 Frontend Implementation

### Role Context Provider

```typescript
// frontend/src/context/RoleContext.tsx
import { RoleProvider, useRole } from '../context/RoleContext';

// Wrap your app with RoleProvider
function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        {/* Your app components */}
      </RoleProvider>
    </AuthProvider>
  );
}
```

### Role-Based Route Protection

```typescript
// frontend/src/components/Auth/RoleBasedRoute.tsx
import { RoleBasedRoute, UserRoute, DriverRoute, ShopRoute, AdminRoute } from '../Auth/RoleBasedRoute';

// Protect routes by role
<Route path="/driver" element={
  <DriverRoute>
    <DriverDashboard />
  </DriverRoute>
} />

<Route path="/admin" element={
  <AdminRoute>
    <AdminDashboard />
  </AdminRoute>
} />

// Protect routes by permission
<Route path="/book" element={
  <PermissionRoute permissions={PERMISSIONS.USER_CREATE_BOOKING}>
    <BookingPage />
  </PermissionRoute>
} />
```

### Role-Based Components

```typescript
// frontend/src/components/Auth/RoleBasedComponent.tsx
import { 
  UserOnly, 
  DriverOnly, 
  ShopOnly, 
  AdminOnly,
  PermissionBased,
  RoleBasedComponent 
} from '../Auth/RoleBasedComponent';

// Show component only for specific roles
<UserOnly fallback={<div>Access denied</div>}>
  <BookingButton />
</UserOnly>

<AdminOnly>
  <AdminPanel />
</AdminOnly>

// Show component based on permissions
<PermissionBased permissions={PERMISSIONS.DRIVER_VIEW_JOBS}>
  <JobList />
</PermissionBased>

// Custom role-based component
<RoleBasedComponent allowedRoles={['driver', 'shop']}>
  <SharedComponent />
</RoleBasedComponent>
```

### Role-Based Navigation

```typescript
// frontend/src/components/Navigation/RoleBasedNavigation.tsx
import Navigation from '../Navigation/RoleBasedNavigation';

// Navigation automatically shows/hides items based on user role
function Layout() {
  return (
    <Box>
      <Navigation /> {/* Automatically adapts to user role */}
      <main>
        {/* Your content */}
      </main>
    </Box>
  );
}
```

## 🎯 Usage Examples

### 1. **User Dashboard**
```typescript
// Only users can see this
<UserOnly>
  <Card>
    <CardContent>
      <Typography>Your Bookings</Typography>
      <Button onClick={() => navigate('/book')}>
        Book New Service
      </Button>
    </CardContent>
  </Card>
</UserOnly>
```

### 2. **Driver Dashboard**
```typescript
// Only drivers can see this
<DriverOnly>
  <Card>
    <CardContent>
      <Typography>Available Jobs</Typography>
      <Button onClick={() => navigate('/driver/jobs')}>
        View Jobs
      </Button>
    </CardContent>
  </Card>
</DriverOnly>
```

### 3. **Shop Dashboard**
```typescript
// Only shop owners can see this
<ShopOnly>
  <Card>
    <CardContent>
      <Typography>Shop Orders</Typography>
      <Button onClick={() => navigate('/shop/orders')}>
        Manage Orders
      </Button>
    </CardContent>
  </Card>
</ShopOnly>
```

### 4. **Admin Panel**
```typescript
// Only admins can see this
<AdminOnly>
  <Card>
    <CardContent>
      <Typography>System Administration</Typography>
      <Button onClick={() => navigate('/admin/users')}>
        Manage Users
      </Button>
    </CardContent>
  </Card>
</AdminOnly>
```

### 5. **Permission-Based Features**
```typescript
// Show based on specific permissions
<PermissionBased permissions={PERMISSIONS.USER_CREATE_BOOKING}>
  <BookingForm />
</PermissionBased>

<PermissionBased permissions={PERMISSIONS.DRIVER_UPDATE_LOCATION}>
  <LocationTracker />
</PermissionBased>

<PermissionBased permissions={PERMISSIONS.SHOP_VIEW_ANALYTICS}>
  <AnalyticsChart />
</PermissionBased>
```

## 🔧 Custom Hooks

### useRole Hook
```typescript
import { useRole } from '../context/RoleContext';

function MyComponent() {
  const { role, hasPermission, hasRole, permissions } = useRole();

  return (
    <div>
      <p>Current role: {role}</p>
      <p>Can create bookings: {hasPermission(PERMISSIONS.USER_CREATE_BOOKING) ? 'Yes' : 'No'}</p>
      <p>Is driver: {hasRole('driver') ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

### usePermission Hook
```typescript
import { usePermission } from '../context/RoleContext';

function MyComponent() {
  const canCreateBookings = usePermission(PERMISSIONS.USER_CREATE_BOOKING);
  const canViewJobs = usePermission(PERMISSIONS.DRIVER_VIEW_JOBS);

  return (
    <div>
      {canCreateBookings && <BookingButton />}
      {canViewJobs && <JobList />}
    </div>
  );
}
```

## 🚀 Benefits

### 1. **Security**
- API endpoints are protected by role-based permissions
- Frontend components only render for authorized users
- No sensitive data exposed to unauthorized roles

### 2. **User Experience**
- Users only see relevant features for their role
- Clean, focused interfaces
- No confusion about inaccessible features

### 3. **Maintainability**
- Centralized permission management
- Easy to add new roles or permissions
- Consistent access control across the platform

### 4. **Scalability**
- Easy to add new features with appropriate permissions
- Role hierarchy supports complex business logic
- Flexible permission system

## 🧪 Testing

### Backend Testing
```typescript
// Test role-based API access
describe('Booking API', () => {
  it('should allow users to create bookings', async () => {
    const userToken = await getAuthToken('user');
    const response = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${userToken}`)
      .send(bookingData)
      .expect(200);
  });

  it('should deny drivers from creating bookings', async () => {
    const driverToken = await getAuthToken('driver');
    const response = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${driverToken}`)
      .send(bookingData)
      .expect(403);
  });
});
```

### Frontend Testing
```typescript
// Test role-based component rendering
describe('RoleBasedComponent', () => {
  it('should show content for authorized roles', () => {
    render(
      <RoleProvider>
        <UserOnly>
          <div>User Content</div>
        </UserOnly>
      </RoleProvider>
    );
    
    expect(screen.getByText('User Content')).toBeInTheDocument();
  });

  it('should hide content for unauthorized roles', () => {
    render(
      <RoleProvider role="driver">
        <UserOnly fallback={<div>Access Denied</div>}>
          <div>User Content</div>
        </UserOnly>
      </RoleProvider>
    );
    
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.queryByText('User Content')).not.toBeInTheDocument();
  });
});
```

## 📋 Implementation Checklist

### Backend ✅
- [x] Role-based middleware (`roleAuth.ts`)
- [x] Permission definitions (`PERMISSIONS`)
- [x] Route protection for all endpoints
- [x] Admin controller and routes
- [x] Role-based API responses

### Frontend ✅
- [x] Role context provider (`RoleContext.tsx`)
- [x] Role-based route protection
- [x] Role-based components
- [x] Permission-based components
- [x] Role-based navigation
- [x] Admin dashboard
- [x] Role-based UI examples

### Integration ✅
- [x] Backend and frontend permission sync
- [x] Role-based authentication flow
- [x] Error handling for unauthorized access
- [x] Loading states for role verification

## 🎉 Result

Your LemoTech platform now has a complete role-based access control system that:

1. **Secures API endpoints** based on user roles and permissions
2. **Shows relevant UI** only to authorized users
3. **Provides clear navigation** based on user capabilities
4. **Maintains security** across the entire application
5. **Scales easily** for new roles and permissions

Users will now see a completely different experience based on their role:
- **Users** see booking and tracking features
- **Drivers** see job management and earnings
- **Shops** see order management and analytics
- **Admins** see system administration tools
- **Business owners** see franchise management tools

This creates a professional, secure, and user-friendly experience for each type of user on your platform! 🚀
