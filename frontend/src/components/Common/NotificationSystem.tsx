import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Badge,
  Menu,
  Avatar,
  Chip,
  Divider,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Drawer,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Notifications,
  Close,
  Circle,
  CheckCircle,
  DirectionsCar,
  LocalOffer,
  Person,
  Payment,
  Info,
  Warning,
  Error as ErrorIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

export interface Notification {
  id: string;
  type: 'booking' | 'promotion' | 'system' | 'payment' | 'driver' | 'support';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  metadata?: {
    bookingId?: string;
    driverId?: string;
    orderId?: string;
    amount?: number;
  };
}

interface NotificationSystemProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onNotificationClick: (notification: Notification) => void;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onNotificationClick
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    if (isMobile) {
      setDrawerOpen(true);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setDrawerOpen(false);
  };

  const handleNotificationItemClick = (notification: Notification) => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    onNotificationClick(notification);
    handleClose();
  };

  const getNotificationIcon = (type: string, priority: string) => {
    const iconProps = {
      sx: {
        fontSize: 24,
        color: priority === 'urgent' ? '#f44336' : 
               priority === 'high' ? '#FF6B35' :
               priority === 'medium' ? '#2196F3' : '#4CAF50'
      }
    };

    switch (type) {
      case 'booking':
        return <CheckCircle {...iconProps} />;
      case 'driver':
        return <DirectionsCar {...iconProps} />;
      case 'payment':
        return <Payment {...iconProps} />;
      case 'promotion':
        return <LocalOffer {...iconProps} />;
      case 'support':
        return <Person {...iconProps} />;
      case 'system':
        return priority === 'urgent' ? <ErrorIcon {...iconProps} /> :
               priority === 'high' ? <Warning {...iconProps} /> :
               <Info {...iconProps} />;
      default:
        return <Notifications {...iconProps} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#f44336';
      case 'high': return '#FF6B35';
      case 'medium': return '#2196F3';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  const NotificationItem: React.FC<{ notification: Notification; index: number }> = ({ 
    notification, 
    index 
  }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <ListItem
        onClick={() => handleNotificationItemClick(notification)}
        sx={{
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          borderLeft: `4px solid ${getPriorityColor(notification.priority)}`,
          background: notification.isRead 
            ? 'transparent' 
            : 'rgba(255, 107, 53, 0.05)',
          '&:hover': {
            background: 'rgba(255, 107, 53, 0.1)',
            transform: 'translateX(4px)'
          }
        }}
      >
        <ListItemAvatar>
          <Avatar sx={{
            background: notification.isRead 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
            width: 40,
            height: 40
          }}>
            {getNotificationIcon(notification.type, notification.priority)}
          </Avatar>
        </ListItemAvatar>
        
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="subtitle2" 
                sx={{
                  color: 'white',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: notification.isRead ? 500 : 700,
                  flex: 1
                }}
              >
                {notification.title}
              </Typography>
              {!notification.isRead && (
                <Circle sx={{ color: '#FF6B35', fontSize: 8 }} />
              )}
            </Box>
          }
          secondary={
            <Box>
              <Typography 
                variant="body2" 
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  mb: 0.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {notification.message}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography 
                  variant="caption" 
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}
                >
                  {formatTimestamp(notification.timestamp)}
                </Typography>
                <Chip
                  label={notification.type}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.6rem',
                    fontWeight: 600,
                    background: getPriorityColor(notification.priority),
                    color: 'white',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}
                />
              </Box>
            </Box>
          }
        />
        
        <ListItemSecondaryAction>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNotification(notification.id);
            }}
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              '&:hover': {
                color: '#f44336',
                background: 'rgba(244, 67, 54, 0.1)'
              }
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </motion.div>
  );

  const NotificationContent = () => (
    <Box sx={{ width: isMobile ? '100vw' : 400, maxHeight: 600 }}>
      <Paper sx={{
        background: 'rgba(15, 10, 40, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: isMobile ? 0 : '20px',
        minHeight: isMobile ? '100vh' : 'auto'
      }}>
        {/* Header */}
        <Box sx={{
          p: 3,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(247, 147, 30, 0.05) 100%)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{
              color: 'white',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 700
            }}>
              🔔 Notifications
              {unreadCount > 0 && (
                <Chip
                  label={unreadCount}
                  size="small"
                  sx={{
                    ml: 1,
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    color: 'white',
                    fontWeight: 700
                  }}
                />
              )}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {unreadCount > 0 && (
                <Button
                  size="small"
                  onClick={onMarkAllAsRead}
                  sx={{
                    color: '#FF6B35',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      background: 'rgba(255, 107, 53, 0.1)'
                    }
                  }}
                >
                  Mark All Read
                </Button>
              )}
              
              {isMobile && (
                <IconButton
                  onClick={handleClose}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <Close />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>

        {/* Notifications List */}
        <Box sx={{ maxHeight: isMobile ? 'calc(100vh - 120px)' : 400, overflow: 'auto' }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Notifications sx={{ 
                fontSize: 48, 
                color: 'rgba(255, 255, 255, 0.3)', 
                mb: 2 
              }} />
              <Typography sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}>
                No notifications yet
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              <AnimatePresence>
                {notifications.map((notification, index) => (
                  <Box key={notification.id}>
                    <NotificationItem notification={notification} index={index} />
                    {index < notifications.length - 1 && (
                      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                    )}
                  </Box>
                ))}
              </AnimatePresence>
            </List>
          )}
        </Box>

        {/* Footer */}
        {notifications.length > 0 && (
          <Box sx={{
            p: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                borderColor: 'rgba(255, 107, 53, 0.5)',
                color: '#FF6B35',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#FF6B35',
                  background: 'rgba(255, 107, 53, 0.1)'
                }
              }}
            >
              View All Notifications
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );

  return (
    <>
      {/* Notification Button */}
      <IconButton
        onClick={handleNotificationClick}
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.15)',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        <Badge 
          badgeContent={unreadCount} 
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 700
            }
          }}
        >
          <Notifications />
        </Badge>
      </IconButton>

      {/* Desktop Menu */}
      {!isMobile && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              background: 'transparent',
              boxShadow: 'none',
              mt: 1
            }
          }}
        >
          <NotificationContent />
        </Menu>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={handleClose}
          PaperProps={{
            sx: {
              background: 'transparent',
              boxShadow: 'none'
            }
          }}
        >
          <NotificationContent />
        </Drawer>
      )}
    </>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'booking',
      priority: 'high',
      title: 'Booking Confirmed',
      message: 'Your LemoTech cleaning service has been confirmed for today at 2:00 PM.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      isRead: false,
      metadata: { bookingId: 'LT-123456' }
    },
    {
      id: '2',
      type: 'driver',
      priority: 'medium',
      title: 'Driver Assigned',
      message: 'James Thompson has been assigned to your order and is on the way.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      isRead: false,
      metadata: { bookingId: 'LT-123456', driverId: 'driver1' }
    },
    {
      id: '3',
      type: 'promotion',
      priority: 'low',
      title: 'Special Offer',
      message: '🎉 Get 20% off your next premium cleaning service! Limited time only.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: true
    },
    {
      id: '4',
      type: 'payment',
      priority: 'medium',
      title: 'Payment Successful',
      message: 'Your payment of R185 has been processed successfully.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      isRead: true,
      metadata: { amount: 185, orderId: 'PAY-789' }
    },
    {
      id: '5',
      type: 'system',
      priority: 'low',
      title: 'App Update Available',
      message: 'Version 2.1.0 is now available with improved tracking features.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isRead: true
    }
  ]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  };
};

export default NotificationSystem;
