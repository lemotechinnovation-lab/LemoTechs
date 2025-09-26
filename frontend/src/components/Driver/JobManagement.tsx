import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider} from '@mui/material';
import {
  DirectionsCar,
  LocationOn,
  CheckCircle,
  Schedule,
  Message,
  LocalShipping,
  NavigateNext,
  AttachMoney,
  Route
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { DriverJob, driverJobService } from '../../services/driverJobService';

interface JobCardProps {
  job: DriverJob;
  onStatusUpdate: (jobId: string, status: string) => void;
  onMessageCustomer: (jobId: string) => void;
  onMessageShop: (jobId: string) => void;
  onNavigate: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onStatusUpdate, 
  onMessageCustomer, 
  onMessageShop,
  onNavigate 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [notes, setNotes] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'default';
      case 'accepted': return 'info';
      case 'en_route_pickup': return 'warning';
      case 'arrived_pickup': return 'primary';
      case 'items_collected': return 'success';
      case 'en_route_shop': return 'warning';
      case 'arrived_shop': return 'primary';
      case 'items_dropped': return 'success';
      case 'waiting_cleaning': return 'default';
      case 'items_ready': return 'info';
      case 'en_route_delivery': return 'warning';
      case 'arrived_delivery': return 'primary';
      case 'delivered': return 'success';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned': return <Schedule />;
      case 'accepted': return <CheckCircle />;
      case 'en_route_pickup': return <DirectionsCar />;
      case 'arrived_pickup': return <LocationOn />;
      case 'items_collected': return <LocalShipping />;
      case 'en_route_shop': return <DirectionsCar />;
      case 'arrived_shop': return <LocationOn />;
      case 'items_dropped': return <LocalShipping />;
      case 'waiting_cleaning': return <Schedule />;
      case 'items_ready': return <CheckCircle />;
      case 'en_route_delivery': return <DirectionsCar />;
      case 'arrived_delivery': return <LocationOn />;
      case 'delivered': return <CheckCircle />;
      case 'completed': return <CheckCircle />;
      default: return <Schedule />;
    }
  };

  const getNextAction = (status: string) => {
    switch (status) {
      case 'assigned': return 'Accept Job';
      case 'accepted': return 'Start Navigation';
      case 'en_route_pickup': return 'Mark Arrived';
      case 'arrived_pickup': return 'Mark Items Collected';
      case 'items_collected': return 'Navigate to Shop';
      case 'en_route_shop': return 'Mark Arrived at Shop';
      case 'arrived_shop': return 'Mark Items Dropped';
      case 'items_dropped': return 'Wait for Cleaning';
      case 'waiting_cleaning': return 'Check Shop Status';
      case 'items_ready': return 'Navigate to Customer';
      case 'en_route_delivery': return 'Mark Arrived';
      case 'arrived_delivery': return 'Mark Delivered';
      default: return 'Update Status';
    }
  };

  const handleStatusUpdate = async () => {
    const result = await driverJobService.updateJobStatus(job.id, job.status, undefined);
    if (result.success) {
      onStatusUpdate(job.id, job.status);
      setShowStatusDialog(false);
      setNotes('');
    }
  };

  const handleAcceptJob = async () => {
    const result = await driverJobService.acceptJob(job.id);
    if (result.success) {
      onStatusUpdate(job.id, 'accepted');
    }
  };

  const handleNextAction = async () => {
    let nextStatus = '';
    switch (job.status) {
      case 'assigned': nextStatus = 'accepted'; break;
      case 'accepted': nextStatus = 'en_route_pickup'; break;
      case 'en_route_pickup': nextStatus = 'arrived_pickup'; break;
      case 'arrived_pickup': nextStatus = 'items_collected'; break;
      case 'items_collected': nextStatus = 'en_route_shop'; break;
      case 'en_route_shop': nextStatus = 'arrived_shop'; break;
      case 'arrived_shop': nextStatus = 'items_dropped'; break;
      case 'items_dropped': nextStatus = 'waiting_cleaning'; break;
      case 'waiting_cleaning': nextStatus = 'items_ready'; break;
      case 'items_ready': nextStatus = 'en_route_delivery'; break;
      case 'en_route_delivery': nextStatus = 'arrived_delivery'; break;
      case 'arrived_delivery': nextStatus = 'delivered'; break;
      default: return;
    }
    
    const result = await driverJobService.updateJobStatus(job.id, nextStatus);
    if (result.success) {
      onStatusUpdate(job.id, nextStatus);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ mb: 2, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Job #{job.id.slice(-6)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Customer: {job.customerName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Shop: {job.shopName}
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
              <Chip
                icon={getStatusIcon(job.status)}
                label={job.status.replace(/_/g, ' ').toUpperCase()}
                color={getStatusColor(job.status) as any}
                size="small"
              />
              <Chip
                label={formatCurrency(job.driverEarnings)}
                color="success"
                size="small"
                icon={<AttachMoney />}
              />
            </Box>
          </Box>

          <Box mb={2}>
            <Typography variant="subtitle2" gutterBottom>
              Items ({job.items.length}):
            </Typography>
            <List dense>
              {job.items.slice(0, 3).map((item, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                      <LocalShipping fontSize="small" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`${item.type} • ${item.condition}`}
                  />
                </ListItem>
              ))}
              {job.items.length > 3 && (
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={`+${job.items.length - 3} more items`}
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  />
                </ListItem>
              )}
            </List>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="body2" color="text.secondary">
              Priority: <Chip label={job.priority} size="small" color="secondary" />
            </Typography>
            <Box>
              <Button
                size="small"
                onClick={() => setShowDetails(!showDetails)}
                sx={{ mr: 1 }}
              >
                {showDetails ? 'Hide' : 'Details'}
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Route />}
                onClick={() => onNavigate(job.id)}
              >
                Navigate
              </Button>
            </Box>
          </Box>

          {showDetails && (
            <Box mt={2}>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Pickup Address:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.customerAddress}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Shop Address:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.shopAddress}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Estimated Pickup:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.estimatedPickupTime.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Estimated Delivery:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.estimatedDeliveryTime.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Action Buttons */}
          <Box mt={2} display="flex" gap={1} flexWrap="wrap">
            {job.status === 'assigned' && (
              <Button
                variant="contained"
                startIcon={<CheckCircle />}
                onClick={handleAcceptJob}
                sx={{ bgcolor: 'success.main' }}
              >
                Accept Job
              </Button>
            )}
            {job.status !== 'assigned' && job.status !== 'completed' && (
              <Button
                variant="contained"
                startIcon={<NavigateNext />}
                onClick={handleNextAction}
                sx={{ bgcolor: 'primary.main' }}
              >
                {getNextAction(job.status)}
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<Message />}
              onClick={() => onMessageCustomer(job.id)}
              size="small"
            >
              Message Customer
            </Button>
            <Button
              variant="outlined"
              startIcon={<Message />}
              onClick={() => onMessageShop(job.id)}
              size="small"
            >
              Message Shop
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowStatusDialog(true)}
              size="small"
            >
              Update Status
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onClose={() => setShowStatusDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Job Status</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about the job..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

interface JobListProps {
  jobs: DriverJob[];
  onJobUpdate: (jobId: string, status: string) => void;
  onMessageCustomer: (jobId: string) => void;
  onMessageShop: (jobId: string) => void;
  onNavigate: (jobId: string) => void;
}

export const JobList: React.FC<JobListProps> = ({ 
  jobs, 
  onJobUpdate, 
  onMessageCustomer, 
  onMessageShop,
  onNavigate 
}) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(job => job.status === filter);

  const jobCounts = {
    all: jobs.length,
    assigned: jobs.filter(j => j.status === 'assigned').length,
    accepted: jobs.filter(j => j.status === 'accepted').length,
    en_route_pickup: jobs.filter(j => j.status === 'en_route_pickup').length,
    arrived_pickup: jobs.filter(j => j.status === 'arrived_pickup').length,
    items_collected: jobs.filter(j => j.status === 'items_collected').length,
    en_route_shop: jobs.filter(j => j.status === 'en_route_shop').length,
    arrived_shop: jobs.filter(j => j.status === 'arrived_shop').length,
    items_dropped: jobs.filter(j => j.status === 'items_dropped').length,
    waiting_cleaning: jobs.filter(j => j.status === 'waiting_cleaning').length,
    items_ready: jobs.filter(j => j.status === 'items_ready').length,
    en_route_delivery: jobs.filter(j => j.status === 'en_route_delivery').length,
    arrived_delivery: jobs.filter(j => j.status === 'arrived_delivery').length,
    delivered: jobs.filter(j => j.status === 'delivered').length,
    completed: jobs.filter(j => j.status === 'completed').length,
  };

  return (
    <Box>
      {/* Filter Tabs */}
      <Box display="flex" gap={1} mb={3} flexWrap="wrap">
        {Object.entries(jobCounts).map(([status, count]) => (
          <Chip
            key={status}
            label={`${status.replace(/_/g, ' ')} (${count})`}
            onClick={() => setFilter(status)}
            color={filter === status ? 'primary' : 'default'}
            variant={filter === status ? 'filled' : 'outlined'}
          />
        ))}
      </Box>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No jobs found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Jobs will appear here when customers book cleaning services
          </Typography>
        </Card>
      ) : (
        filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onStatusUpdate={onJobUpdate}
            onMessageCustomer={onMessageCustomer}
            onMessageShop={onMessageShop}
            onNavigate={onNavigate}
          />
        ))
      )}
    </Box>
  );
};
