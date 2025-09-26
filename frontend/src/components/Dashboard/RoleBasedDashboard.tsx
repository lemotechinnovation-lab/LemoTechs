import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  DriveEta,
  Store,
  AdminPanelSettings,
  Business,
  Person,
} from '@mui/icons-material';
import { useRole, UserRole } from '../../context/RoleContext';
import { RoleBasedComponent } from '../Auth/RoleBasedComponent';

interface DashboardOption {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  roles: UserRole[];
}

const RoleBasedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useRole();

  const dashboardOptions: DashboardOption[] = [
    {
      title: 'User Dashboard',
      description: 'Manage your bookings and track your services',
      icon: <Person sx={{ fontSize: 40 }} />,
      path: '/dashboard',
      color: '#1976d2',
      roles: ['user'],
    },
    {
      title: 'Driver Dashboard',
      description: 'View available jobs, manage deliveries, and track earnings',
      icon: <DriveEta sx={{ fontSize: 40 }} />,
      path: '/driver',
      color: '#388e3c',
      roles: ['driver'],
    },
    {
      title: 'Shop Dashboard',
      description: 'Manage orders, inventory, and shop operations',
      icon: <Store sx={{ fontSize: 40 }} />,
      path: '/shop',
      color: '#f57c00',
      roles: ['shop'],
    },
    {
      title: 'Business Dashboard',
      description: 'View analytics, manage franchises, and marketplace',
      icon: <Business sx={{ fontSize: 40 }} />,
      path: '/business-dashboard',
      color: '#7b1fa2',
      roles: ['business'],
    },
    {
      title: 'Admin Dashboard',
      description: 'System administration, user management, and analytics',
      icon: <AdminPanelSettings sx={{ fontSize: 40 }} />,
      path: '/admin',
      color: '#d32f2f',
      roles: ['admin'],
    },
  ];

  const handleDashboardSelect = (path: string) => {
    navigate(path);
  };

  return (
    <Box p={3}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to LemoTech
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Choose your dashboard to get started
        </Typography>
        {role && (
          <Chip
            label={`Current Role: ${role.toUpperCase()}`}
            color="primary"
            sx={{ mt: 2 }}
          />
        )}
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {dashboardOptions.map((option) => (
          <Grid item xs={12} sm={6} md={4} key={option.path}>
            <RoleBasedComponent
              allowedRoles={option.roles}
              fallback={
                <Card sx={{ opacity: 0.5, filter: 'grayscale(100%)' }}>
                  <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                      <Avatar
                        sx={{
                          bgcolor: option.color,
                          width: 80,
                          height: 80,
                          mb: 2,
                        }}
                      >
                        {option.icon}
                      </Avatar>
                      <Typography variant="h6" gutterBottom>
                        {option.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {option.description}
                      </Typography>
                      <Button variant="outlined" disabled>
                        Access Restricted
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              }
            >
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => handleDashboardSelect(option.path)}
              >
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                    <Avatar
                      sx={{
                        bgcolor: option.color,
                        width: 80,
                        height: 80,
                        mb: 2,
                      }}
                    >
                      {option.icon}
                    </Avatar>
                    <Typography variant="h6" gutterBottom>
                      {option.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {option.description}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ bgcolor: option.color }}
                      startIcon={<DashboardIcon />}
                    >
                      Access Dashboard
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </RoleBasedComponent>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions Section */}
      <Box mt={6}>
        <Typography variant="h5" gutterBottom textAlign="center">
          Quick Actions
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <RoleBasedComponent allowedRoles={['user']}>
              <Button
                variant="outlined"
                onClick={() => navigate('/book')}
                startIcon={<Person />}
              >
                Book a Service
              </Button>
            </RoleBasedComponent>
          </Grid>
          
          <Grid item>
            <RoleBasedComponent allowedRoles={['driver']}>
              <Button
                variant="outlined"
                onClick={() => navigate('/driver/jobs')}
                startIcon={<DriveEta />}
              >
                View Available Jobs
              </Button>
            </RoleBasedComponent>
          </Grid>
          
          <Grid item>
            <RoleBasedComponent allowedRoles={['shop']}>
              <Button
                variant="outlined"
                onClick={() => navigate('/shop/orders')}
                startIcon={<Store />}
              >
                Manage Orders
              </Button>
            </RoleBasedComponent>
          </Grid>
          
          <Grid item>
            <RoleBasedComponent allowedRoles={['admin']}>
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/users')}
                startIcon={<AdminPanelSettings />}
              >
                Manage Users
              </Button>
            </RoleBasedComponent>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default RoleBasedDashboard;
