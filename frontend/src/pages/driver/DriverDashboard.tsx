import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Grid,
  Tabs,
  Tab,
  Paper,
  Alert,
  CircularProgress,
  Avatar
} from '@mui/material';
import {
  DirectionsCar,
  Work,
  Assessment,
  Route
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { ParticleBackground } from '../../components/Common/ParticleBackground';
import { 
  JobList, 
  DriverAnalytics, 
  RouteOptimizer 
} from '../../components/Driver';
import { 
  DriverJob, 
  RouteOptimization, 
  driverJobService 
} from '../../services/driverJobService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`driver-tabpanel-${index}`}
      aria-labelledby={`driver-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const DriverDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [jobs, setJobs] = useState<DriverJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDriverData();
  }, []);

  const loadDriverData = async () => {
    setLoading(true);
    try {
      const jobsData = await driverJobService.getDriverJobs();
      setJobs(jobsData);
    } catch (err) {
      setError('Failed to load driver data');
      console.error('Error loading driver data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJobUpdate = (jobId: string, status: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: status as any } : job
    ));
  };

  const handleMessageCustomer = (jobId: string) => {
    // This would open a message dialog or redirect to messaging
    console.log('Messaging customer for job:', jobId);
  };

  const handleMessageShop = (jobId: string) => {
    // This would open a message dialog or redirect to messaging
    console.log('Messaging shop for job:', jobId);
  };

  const handleNavigate = (jobId: string) => {
    // This would open navigation or redirect to maps
    console.log('Navigating to job:', jobId);
  };

  const handleRouteUpdate = (route: RouteOptimization) => {
    // Route optimization completed - could be used for navigation
    console.log('Route optimized:', route);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <ParticleBackground />
      
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
          color: 'white',
          py: 4,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 60, height: 60 }}>
                <DirectionsCar sx={{ fontSize: 30 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  🚗 Driver Dashboard
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Welcome back, {user?.name || 'Driver'}!
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 600 }}>
              Manage your delivery jobs, optimize routes, and track your performance.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Quick Stats */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="primary">
                  {jobs.filter(j => ['assigned', 'accepted'].includes(j.status)).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Jobs
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
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="success.main">
                  {jobs.filter(j => j.status === 'completed').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed Today
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
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="warning.main">
                  R{jobs.reduce((sum, job) => sum + job.driverEarnings, 0).toFixed(0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Today's Earnings
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
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="info.main">
                  {jobs.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Jobs
                </Typography>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Main Content Tabs */}
        <Paper sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="driver dashboard tabs">
              <Tab 
                icon={<Work />} 
                label="Jobs" 
                iconPosition="start"
              />
              <Tab 
                icon={<Route />} 
                label="Route Optimization" 
                iconPosition="start"
              />
              <Tab 
                icon={<Assessment />} 
                label="Analytics" 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <TabPanel value={activeTab} index={0}>
            <JobList
              jobs={jobs}
              onJobUpdate={handleJobUpdate}
              onMessageCustomer={handleMessageCustomer}
              onMessageShop={handleMessageShop}
              onNavigate={handleNavigate}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <RouteOptimizer
              jobs={jobs}
              onRouteUpdate={handleRouteUpdate}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <DriverAnalytics driverId={user?.id || 'default'} />
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};