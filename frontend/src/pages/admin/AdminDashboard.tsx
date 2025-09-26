import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  People,
  DriveEta,
  Store,
  TrendingUp,
  Refresh,
  Edit,
} from '@mui/icons-material';
import { useRole, PERMISSIONS } from '../../context/RoleContext';
import { AdminOnly } from '../../components/Auth/RoleBasedComponent';
import { apiClient } from '../../services/apiClient';

interface DashboardStats {
  totalUsers: number;
  totalDrivers: number;
  totalShops: number;
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  totalRevenue: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const { hasPermission } = useRole();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load system analytics
      const analyticsResponse = await apiClient.get('/admin/analytics');
      if (analyticsResponse.success) {
        const data = analyticsResponse.data as any;
        setStats({
          totalUsers: data.summary.totalUsers,
          totalDrivers: data.userCounts.find((u: any) => u.role === 'driver')?.count || 0,
          totalShops: data.userCounts.find((u: any) => u.role === 'shop')?.count || 0,
          totalBookings: data.summary.totalBookings,
          activeBookings: data.bookingStats.find((b: any) => b.status === 'confirmed')?.count || 0,
          completedBookings: data.bookingStats.find((b: any) => b.status === 'completed')?.count || 0,
          totalRevenue: data.summary.totalRevenue,
        });
      }

      // Load recent users
      const usersResponse = await apiClient.get('/admin/users?limit=10');
      if (usersResponse.success) {
        setUsers((usersResponse.data as any).users);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserStatus = async () => {
    if (!selectedUser || !newStatus) return;

    try {
      const response = await apiClient.put(`/admin/users/${selectedUser.id}/status`, {
        status: newStatus,
        reason: 'Status updated by admin'
      });

      if (response.success) {
        // Update local state
        setUsers(users.map(user => 
          user.id === selectedUser.id 
            ? { ...user, status: newStatus }
            : user
        ));
        setStatusDialogOpen(false);
        setSelectedUser(null);
        setNewStatus('');
      }
    } catch (err) {
      console.error('Update user status error:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'suspended': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'driver': return 'primary';
      case 'shop': return 'secondary';
      case 'business': return 'warning';
      default: return 'default';
    }
  };

  if (!hasPermission(PERMISSIONS.ADMIN_VIEW_ANALYTICS)) {
    return (
      <Box p={3}>
        <Alert severity="error">
          You don't have permission to access the admin dashboard.
        </Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AdminOnly>
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Admin Dashboard
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadDashboardData}
          >
            Refresh
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Users
                    </Typography>
                    <Typography variant="h4">
                      {stats?.totalUsers || 0}
                    </Typography>
                  </Box>
                  <People color="primary" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Drivers
                    </Typography>
                    <Typography variant="h4">
                      {stats?.totalDrivers || 0}
                    </Typography>
                  </Box>
                  <DriveEta color="primary" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Shops
                    </Typography>
                    <Typography variant="h4">
                      {stats?.totalShops || 0}
                    </Typography>
                  </Box>
                  <Store color="primary" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Revenue
                    </Typography>
                    <Typography variant="h4">
                      R{stats?.totalRevenue?.toFixed(2) || '0.00'}
                    </Typography>
                  </Box>
                  <TrendingUp color="success" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Users Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Users
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={getRoleColor(user.role) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          color={getStatusColor(user.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {hasPermission(PERMISSIONS.ADMIN_UPDATE_USER_STATUS) && (
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedUser(user);
                              setNewStatus(user.status);
                              setStatusDialogOpen(true);
                            }}
                          >
                            <Edit />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Status Update Dialog */}
        <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
          <DialogTitle>Update User Status</DialogTitle>
          <DialogContent>
            <TextField
              select
              fullWidth
              label="Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              SelectProps={{
                native: true,
              }}
              sx={{ mt: 2 }}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateUserStatus} variant="contained">
              Update Status
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminOnly>
  );
};

export { AdminDashboard };
