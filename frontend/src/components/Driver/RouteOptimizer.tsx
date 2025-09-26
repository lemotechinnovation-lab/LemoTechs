import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Alert,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  DirectionsCar,
  Schedule,
  NavigateNext,
  Refresh,
  Map,
  Timeline
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { DriverJob, RouteOptimization, driverJobService } from '../../services/driverJobService';

interface RouteOptimizerProps {
  jobs: DriverJob[];
  onRouteUpdate: (optimizedRoute: RouteOptimization) => void;
}

export const RouteOptimizer: React.FC<RouteOptimizerProps> = ({ jobs, onRouteUpdate }) => {
  const [optimizedRoute, setOptimizedRoute] = useState<RouteOptimization | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  const availableJobs = jobs.filter(job => 
    ['accepted', 'en_route_pickup', 'en_route_shop', 'en_route_delivery'].includes(job.status)
  );

  useEffect(() => {
    if (selectedJobs.length > 1) {
      optimizeRoute();
    }
  }, [selectedJobs]);

  const optimizeRoute = async () => {
    if (selectedJobs.length < 2) return;
    
    setLoading(true);
    try {
      const route = await driverJobService.getOptimizedRoute(selectedJobs);
      if (route) {
        setOptimizedRoute(route);
        onRouteUpdate(route);
      }
    } catch (error) {
      console.error('Failed to optimize route:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobToggle = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDistance = (km: number) => {
    return `${km.toFixed(1)} km`;
  };

  return (
    <Box>
      {/* Route Optimization Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Route Optimization</Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={optimizeRoute}
            disabled={selectedJobs.length < 2 || loading}
          >
            Optimize Route
          </Button>
          <Button
            variant="contained"
            startIcon={<Map />}
            onClick={() => setShowRouteDetails(true)}
            disabled={!optimizedRoute}
          >
            View Route
          </Button>
        </Box>
      </Box>

      {/* Available Jobs Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Select Jobs for Route Optimization
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select multiple jobs to get an optimized route that minimizes travel time and distance.
          </Typography>
          
          {availableJobs.length === 0 ? (
            <Alert severity="info">
              No jobs available for route optimization. Jobs need to be accepted and in progress.
            </Alert>
          ) : (
            <List>
              {availableJobs.map((job) => (
                <ListItem
                  key={job.id}
                  button
                  onClick={() => handleJobToggle(job.id)}
                  sx={{
                    backgroundColor: selectedJobs.includes(job.id) ? 'primary.light' : 'transparent',
                    borderRadius: 1,
                    mb: 1
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <DirectionsCar />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`Job #${job.id.slice(-6)} - ${job.customerName}`}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {job.customerAddress} → {job.shopAddress}
                        </Typography>
                        <Box display="flex" gap={1} mt={1}>
                          <Chip label={job.status.replace(/_/g, ' ')} size="small" />
                          <Chip label={`R${job.driverEarnings}`} size="small" color="success" />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Route Optimization Results */}
      {optimizedRoute && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Optimized Route
              </Typography>
              
              {/* Route Summary */}
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {optimizedRoute.jobs.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Jobs
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main">
                      {formatDistance(optimizedRoute.totalDistance)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Distance
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="info.main">
                      {formatTime(optimizedRoute.totalTime)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Time
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Route Steps */}
              <Typography variant="subtitle1" gutterBottom>
                Route Steps:
              </Typography>
              <List>
                {optimizedRoute.optimizedRoute.map((step, index) => {
                  const job = optimizedRoute.jobs.find(j => j.id === step.jobId);
                  return (
                    <ListItem key={index} sx={{ py: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={step.address}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Job #{step.jobId.slice(-6)} - {job?.customerName}
                            </Typography>
                            <Box display="flex" gap={1} mt={1}>
                              <Chip 
                                icon={<Schedule />} 
                                label={`ETA: ${step.estimatedArrival.toLocaleTimeString()}`} 
                                size="small" 
                              />
                              <Chip 
                                icon={<Timeline />} 
                                label={`Duration: ${formatTime(step.estimatedDuration)}`} 
                                size="small" 
                                color="secondary"
                              />
                            </Box>
                          </Box>
                        }
                      />
                      <IconButton size="small">
                        <NavigateNext />
                      </IconButton>
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <Box mt={2}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            Optimizing route...
          </Typography>
        </Box>
      )}

      {/* Route Details Dialog */}
      <Dialog open={showRouteDetails} onClose={() => setShowRouteDetails(false)} maxWidth="md" fullWidth>
        <DialogTitle>Route Details</DialogTitle>
        <DialogContent>
          {optimizedRoute && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Complete Route Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Total Distance:</Typography>
                  <Typography variant="body1">{formatDistance(optimizedRoute.totalDistance)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Total Time:</Typography>
                  <Typography variant="body1">{formatTime(optimizedRoute.totalTime)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Number of Jobs:</Typography>
                  <Typography variant="body1">{optimizedRoute.jobs.length}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Average Time per Job:</Typography>
                  <Typography variant="body1">
                    {formatTime(optimizedRoute.totalTime / optimizedRoute.jobs.length)}
                  </Typography>
                </Grid>
              </Grid>
              
              <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
                Detailed Route Steps:
              </Typography>
              {optimizedRoute.optimizedRoute.map((step, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="subtitle2">
                    Step {index + 1}: {step.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estimated Arrival: {step.estimatedArrival.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estimated Duration: {formatTime(step.estimatedDuration)}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRouteDetails(false)}>Close</Button>
          <Button variant="contained" onClick={() => setShowRouteDetails(false)}>
            Start Navigation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
