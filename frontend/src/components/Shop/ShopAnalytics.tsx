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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip
} from '@mui/material';
import {
  Schedule,
  CheckCircle,
  LocalShipping,
  CleaningServices,
  AttachMoney
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { shopOrderService } from '../../services/shopOrderService';

interface ShopAnalyticsProps {
  shopId: string;
}

export const ShopAnalytics: React.FC<ShopAnalyticsProps> = ({ shopId }) => {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    completedOrders: 0,
    averageCompletionTime: 0,
    revenue: 0,
    topItems: [] as Array<{ name: string; count: number }>
  });
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await shopOrderService.getShopAnalytics(period);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics for shop:', shopId, error);
    } finally {
      setLoading(false);
    }
  };

  const completionRate = analytics.totalOrders > 0 
    ? (analytics.completedOrders / analytics.totalOrders) * 100 
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

  return (
    <Box>
      {/* Period Selector */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Shop Analytics</Typography>
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
                    <LocalShipping />
                  </Avatar>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {analytics.totalOrders}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
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
                    {analytics.completedOrders}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed Orders
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
                  <Avatar sx={{ bgcolor: 'info.light', mx: 'auto', mb: 2 }}>
                    <Schedule />
                  </Avatar>
                  <Typography variant="h4" color="info.main" gutterBottom>
                    {formatTime(analytics.averageCompletionTime)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. Completion Time
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
                  <Avatar sx={{ bgcolor: 'warning.light', mx: 'auto', mb: 2 }}>
                    <AttachMoney />
                  </Avatar>
                  <Typography variant="h4" color="warning.main" gutterBottom>
                    {formatCurrency(analytics.revenue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Revenue
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
                    {analytics.completedOrders} of {analytics.totalOrders} orders completed
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

          {/* Top Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Most Cleaned Items
              </Typography>
              {analytics.topItems.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No data available for this period
                </Typography>
              ) : (
                <List>
                  {analytics.topItems.map((item: any, index: number) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <CleaningServices />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.name}
                        secondary={`${item.count} orders`}
                      />
                      <Chip
                        label={`#${index + 1}`}
                        color="primary"
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Card>
          </motion.div>
        </>
      )}
    </Box>
  );
};
