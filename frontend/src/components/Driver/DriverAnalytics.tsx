import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Avatar} from '@mui/material';
import {
  DirectionsCar,
  AttachMoney,
  Schedule,
  CheckCircle,
  Star,
  Route,
  TrendingUp
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { driverJobService, DriverStats } from '../../services/driverJobService';

interface DriverAnalyticsProps {
  driverId: string;
}

export const DriverAnalytics: React.FC<DriverAnalyticsProps> = ({ driverId }) => {
  const [stats, setStats] = useState<DriverStats>({
    totalJobs: 0,
    completedJobs: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalDistance: 0,
    averageJobTime: 0,
    currentStreak: 0
  });
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await driverJobService.getDriverStats(period);
      setStats(data);
    } catch (error) {
      console.error('Failed to load driver stats for:', driverId, error);
    } finally {
      setLoading(false);
    }
  };

  const completionRate = stats.totalJobs > 0 
    ? (stats.completedJobs / stats.totalJobs) * 100 
    : 0;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const formatDistance = (km: number) => {
    return `${km.toFixed(1)} km`;
  };

  return (
    <Box>
      {/* Period Selector */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Driver Analytics</Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Period</InputLabel>
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
          >
            <MenuItem value="day">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <LinearProgress sx={{ width: '100%' }} />
        </Box>
      ) : (
        <>
          {/* Key Metrics */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card sx={{ textAlign: 'center', p: 2, height: '100%' }}>
                  <Avatar sx={{ bgcolor: 'primary.light', mx: 'auto', mb: 2 }}>
                    <DirectionsCar />
                  </Avatar>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {stats.totalJobs}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Jobs
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card sx={{ textAlign: 'center', p: 2, height: '100%' }}>
                  <Avatar sx={{ bgcolor: 'success.light', mx: 'auto', mb: 2 }}>
                    <CheckCircle />
                  </Avatar>
                  <Typography variant="h4" color="success.main" gutterBottom>
                    {stats.completedJobs}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed Jobs
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card sx={{ textAlign: 'center', p: 2, height: '100%' }}>
                  <Avatar sx={{ bgcolor: 'warning.light', mx: 'auto', mb: 2 }}>
                    <AttachMoney />
                  </Avatar>
                  <Typography variant="h4" color="warning.main" gutterBottom>
                    {formatCurrency(stats.totalEarnings)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Earnings
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Card sx={{ textAlign: 'center', p: 2, height: '100%' }}>
                  <Avatar sx={{ bgcolor: 'info.light', mx: 'auto', mb: 2 }}>
                    <Star />
                  </Avatar>
                  <Typography variant="h4" color="info.main" gutterBottom>
                    {stats.averageRating.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Rating
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Performance Metrics */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <Card sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Completion Rate
                  </Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box flexGrow={1}>
                      <LinearProgress
                        variant="determinate"
                        value={completionRate}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ ml: 2, minWidth: 50 }}>
                      {completionRate.toFixed(1)}%
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {stats.completedJobs} of {stats.totalJobs} jobs completed
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <Card sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Efficiency Score
                  </Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box flexGrow={1}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(completionRate * 1.2, 100)}
                        color="success"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ ml: 2, minWidth: 50 }}>
                      {Math.min(completionRate * 1.2, 100).toFixed(1)}%
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Based on completion rate and average time
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Additional Stats */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.light', mx: 'auto', mb: 2 }}>
                    <Route />
                  </Avatar>
                  <Typography variant="h4" color="secondary.main" gutterBottom>
                    {formatDistance(stats.totalDistance)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Distance
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Avatar sx={{ bgcolor: 'error.light', mx: 'auto', mb: 2 }}>
                    <Schedule />
                  </Avatar>
                  <Typography variant="h4" color="error.main" gutterBottom>
                    {formatTime(stats.averageJobTime)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. Job Time
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
              >
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.light', mx: 'auto', mb: 2 }}>
                    <TrendingUp />
                  </Avatar>
                  <Typography variant="h4" color="success.main" gutterBottom>
                    {stats.currentStreak}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Day Streak
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.0 }}
              >
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Avatar sx={{ bgcolor: 'info.light', mx: 'auto', mb: 2 }}>
                    <AttachMoney />
                  </Avatar>
                  <Typography variant="h4" color="info.main" gutterBottom>
                    {formatCurrency(stats.totalEarnings / Math.max(stats.completedJobs, 1))}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. per Job
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Performance Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.1 }}
          >
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Performance Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Total Jobs:</strong> {stats.totalJobs}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Completion Rate:</strong> {completionRate.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Average Rating:</strong> {stats.averageRating.toFixed(1)}/5
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Total Earnings:</strong> {formatCurrency(stats.totalEarnings)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Total Distance:</strong> {formatDistance(stats.totalDistance)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Current Streak:</strong> {stats.currentStreak} days
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </motion.div>
        </>
      )}
    </Box>
  );
};
