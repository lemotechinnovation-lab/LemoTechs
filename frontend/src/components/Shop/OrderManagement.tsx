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
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Alert,
  Divider
} from '@mui/material';
import {
  CleaningServices,
  CheckCircle,
  Schedule,
  Phone,
  Message,
  LocalShipping,
  Inventory,
  Assessment,
  PlayArrow,
  Pause,
  Stop,
  Add,
  Edit,
  Delete
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { CleaningOrder, CleaningItem, shopOrderService } from '../../services/shopOrderService';

interface OrderCardProps {
  order: CleaningOrder;
  onStatusUpdate: (orderId: string, status: string) => void;
  onMessageDriver: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusUpdate, onMessageDriver }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState(order.status);
  const [notes, setNotes] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'received': return 'info';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
      case 'ready_for_pickup': return 'primary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Schedule />;
      case 'received': return <LocalShipping />;
      case 'in_progress': return <CleaningServices />;
      case 'completed': return <CheckCircle />;
      case 'ready_for_pickup': return <LocalShipping />;
      default: return <Schedule />;
    }
  };

  const handleStatusUpdate = async () => {
    const result = await shopOrderService.updateOrderStatus(order.id, newStatus, notes);
    if (result.success) {
      onStatusUpdate(order.id, newStatus);
      setShowStatusDialog(false);
      setNotes('');
    }
  };

  const handleStartCleaning = async () => {
    const estimatedCompletion = new Date();
    estimatedCompletion.setHours(estimatedCompletion.getHours() + 2); // Default 2 hours
    
    const result = await shopOrderService.startCleaning(order.id, estimatedCompletion);
    if (result.success) {
      onStatusUpdate(order.id, 'in_progress');
    }
  };

  const handleCompleteCleaning = async () => {
    const result = await shopOrderService.completeCleaning(order.id, notes);
    if (result.success) {
      onStatusUpdate(order.id, 'ready_for_pickup');
    }
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
                Order #{order.id.slice(-6)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Customer: {order.customerName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Driver: {order.driverInfo.name}
              </Typography>
            </Box>
            <Chip
              icon={getStatusIcon(order.status)}
              label={order.status.replace('_', ' ').toUpperCase()}
              color={getStatusColor(order.status) as any}
              size="small"
            />
          </Box>

          <Box mb={2}>
            <Typography variant="subtitle2" gutterBottom>
              Items ({order.items.length}):
            </Typography>
            <List dense>
              {order.items.slice(0, 3).map((item, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                      <CleaningServices fontSize="small" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`${item.type} • ${item.cleaningMethod}`}
                  />
                </ListItem>
              ))}
              {order.items.length > 3 && (
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={`+${order.items.length - 3} more items`}
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  />
                </ListItem>
              )}
            </List>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Priority: <Chip label={order.priority} size="small" color="secondary" />
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
                startIcon={<Message />}
                onClick={() => onMessageDriver(order.id)}
              >
                Message Driver
              </Button>
            </Box>
          </Box>

          {showDetails && (
            <Box mt={2}>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Special Instructions:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.specialInstructions || 'None'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Estimated Completion:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.estimatedCompletion.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Action Buttons based on status */}
          <Box mt={2} display="flex" gap={1}>
            {order.status === 'received' && (
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={handleStartCleaning}
                sx={{ bgcolor: 'success.main' }}
              >
                Start Cleaning
              </Button>
            )}
            {order.status === 'in_progress' && (
              <Button
                variant="contained"
                startIcon={<CheckCircle />}
                onClick={handleCompleteCleaning}
                sx={{ bgcolor: 'primary.main' }}
              >
                Mark Complete
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={() => setShowStatusDialog(true)}
            >
              Update Status
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onClose={() => setShowStatusDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as typeof order.status)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="received">Received</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="ready_for_pickup">Ready for Pickup</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about the cleaning process..."
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

interface OrderListProps {
  orders: CleaningOrder[];
  onOrderUpdate: (orderId: string, status: string) => void;
  onMessageDriver: (orderId: string) => void;
}

export const OrderList: React.FC<OrderListProps> = ({ orders, onOrderUpdate, onMessageDriver }) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const orderCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    received: orders.filter(o => o.status === 'received').length,
    in_progress: orders.filter(o => o.status === 'in_progress').length,
    completed: orders.filter(o => o.status === 'completed').length,
    ready_for_pickup: orders.filter(o => o.status === 'ready_for_pickup').length,
  };

  return (
    <Box>
      {/* Filter Tabs */}
      <Box display="flex" gap={1} mb={3} flexWrap="wrap">
        {Object.entries(orderCounts).map(([status, count]) => (
          <Chip
            key={status}
            label={`${status.replace('_', ' ')} (${count})`}
            onClick={() => setFilter(status)}
            color={filter === status ? 'primary' : 'default'}
            variant={filter === status ? 'filled' : 'outlined'}
          />
        ))}
      </Box>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No orders found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Orders will appear here when drivers drop off items for cleaning
          </Typography>
        </Card>
      ) : (
        filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onStatusUpdate={onOrderUpdate}
            onMessageDriver={onMessageDriver}
          />
        ))
      )}
    </Box>
  );
};
