import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  AdminOnly,
  DriverOnly,
  ShopOnly,
  UserOnly,
  BusinessOnly,
  RoleBasedComponent,
  PermissionBased,
} from '../Auth/RoleBasedComponent';
import { useRole, PERMISSIONS } from '../../context/RoleContext';

const RoleBasedExample: React.FC = () => {
  const { role, permissions, hasPermission, hasRole } = useRole();

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Role-Based Access Control Demo
      </Typography>

      {/* Current User Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current User Information
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Chip label={`Role: ${role || 'Guest'}`} color="primary" />
            <Chip label={`Permissions: ${permissions.length}`} color="secondary" />
          </Box>
          
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Available Permissions:
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap" sx={{ mt: 1 }}>
            {permissions.map((permission) => (
              <Chip key={permission} label={permission} size="small" variant="outlined" />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Role-Specific Components */}
      <Grid container spacing={3}>
        {/* User Only Component */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Only Component
              </Typography>
              <UserOnly
                fallback={
                  <Alert severity="info">
                    This component is only visible to users with 'user' role.
                  </Alert>
                }
              >
                <Alert severity="success">
                  ✅ You are a user! You can see this content.
                </Alert>
                <Box mt={2}>
                  <Button variant="contained" color="primary">
                    Book a Service
                  </Button>
                </Box>
              </UserOnly>
            </CardContent>
          </Card>
        </Grid>

        {/* Driver Only Component */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Driver Only Component
              </Typography>
              <DriverOnly
                fallback={
                  <Alert severity="info">
                    This component is only visible to users with 'driver' role.
                  </Alert>
                }
              >
                <Alert severity="success">
                  ✅ You are a driver! You can see this content.
                </Alert>
                <Box mt={2}>
                  <Button variant="contained" color="primary">
                    View Available Jobs
                  </Button>
                </Box>
              </DriverOnly>
            </CardContent>
          </Card>
        </Grid>

        {/* Shop Only Component */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Shop Only Component
              </Typography>
              <ShopOnly
                fallback={
                  <Alert severity="info">
                    This component is only visible to users with 'shop' role.
                  </Alert>
                }
              >
                <Alert severity="success">
                  ✅ You are a shop owner! You can see this content.
                </Alert>
                <Box mt={2}>
                  <Button variant="contained" color="primary">
                    Manage Orders
                  </Button>
                </Box>
              </ShopOnly>
            </CardContent>
          </Card>
        </Grid>

        {/* Admin Only Component */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Admin Only Component
              </Typography>
              <AdminOnly
                fallback={
                  <Alert severity="info">
                    This component is only visible to users with 'admin' role.
                  </Alert>
                }
              >
                <Alert severity="success">
                  ✅ You are an admin! You can see this content.
                </Alert>
                <Box mt={2}>
                  <Button variant="contained" color="error">
                    Manage System
                  </Button>
                </Box>
              </AdminOnly>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Permission-Based Components */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Permission-Based Components
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <PermissionBased
                permissions={PERMISSIONS.USER_CREATE_BOOKING}
                fallback={
                  <Alert severity="warning">
                    You don't have permission to create bookings.
                  </Alert>
                }
              >
                <Alert severity="success">
                  ✅ You can create bookings!
                </Alert>
              </PermissionBased>
            </Grid>

            <Grid item xs={12} sm={6}>
              <PermissionBased
                permissions={PERMISSIONS.DRIVER_VIEW_JOBS}
                fallback={
                  <Alert severity="warning">
                    You don't have permission to view driver jobs.
                  </Alert>
                }
              >
                <Alert severity="success">
                  ✅ You can view driver jobs!
                </Alert>
              </PermissionBased>
            </Grid>

            <Grid item xs={12} sm={6}>
              <PermissionBased
                permissions={PERMISSIONS.SHOP_VIEW_ORDERS}
                fallback={
                  <Alert severity="warning">
                    You don't have permission to view shop orders.
                  </Alert>
                }
              >
                <Alert severity="success">
                  ✅ You can view shop orders!
                </Alert>
              </PermissionBased>
            </Grid>

            <Grid item xs={12} sm={6}>
              <PermissionBased
                permissions={PERMISSIONS.ADMIN_VIEW_ALL_USERS}
                fallback={
                  <Alert severity="warning">
                    You don't have admin permissions.
                  </Alert>
                }
              >
                <Alert severity="success">
                  ✅ You have admin permissions!
                </Alert>
              </PermissionBased>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Multi-Role Component */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Multi-Role Component (Driver OR Shop)
          </Typography>
          <RoleBasedComponent
            allowedRoles={['driver', 'shop']}
            fallback={
              <Alert severity="info">
                This component is visible to drivers and shop owners only.
              </Alert>
            }
          >
            <Alert severity="success">
              ✅ You are a driver or shop owner! You can see this content.
            </Alert>
          </RoleBasedComponent>
        </CardContent>
      </Card>

      {/* Conditional Rendering Example */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Conditional Rendering Based on Permissions
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText
                primary="Can create bookings"
                secondary={hasPermission(PERMISSIONS.USER_CREATE_BOOKING) ? 'Yes' : 'No'}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Can view driver jobs"
                secondary={hasPermission(PERMISSIONS.DRIVER_VIEW_JOBS) ? 'Yes' : 'No'}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Can view shop orders"
                secondary={hasPermission(PERMISSIONS.SHOP_VIEW_ORDERS) ? 'Yes' : 'No'}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Has admin access"
                secondary={hasPermission(PERMISSIONS.ADMIN_VIEW_ALL_USERS) ? 'Yes' : 'No'}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Is driver role"
                secondary={hasRole('driver') ? 'Yes' : 'No'}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Is shop role"
                secondary={hasRole('shop') ? 'Yes' : 'No'}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Is admin role"
                secondary={hasRole('admin') ? 'Yes' : 'No'}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RoleBasedExample;
