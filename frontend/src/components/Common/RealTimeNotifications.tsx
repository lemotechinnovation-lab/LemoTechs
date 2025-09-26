import { useState, useEffect } from 'react';
import { Box, Snackbar, Alert, Typography, IconButton, Slide, Badge } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  CheckCircle,
  DirectionsCar,
  Schedule,
  LocalShipping,
  CleaningServices
} from '@mui/icons-material';
import { BookingStatus } from '../Booking/RealTimeBookingStatus';

interface Notification {
  id: string;
  type: 'booking' | 'driver' | 'payment' | 'delivery' | 'general';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  severity: 'success' | 'info' | 'warning' | 'error';
  icon?: React.ReactNode;
  actionUrl?: string;
}

interface RealTimeNotificationsProps {
  bookingStatus?: BookingStatus;
}

const statusNotifications: Record<BookingStatus, Notification> = {
  'confirmed': {
    id: 'booking-confirmed',
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Your cleaning service has been confirmed and scheduled',
    timestamp: new Date(),
    read: false,
    severity: 'success',
    icon: <CheckCircle />
  },
  'driver_assigned': {
    id: 'driver-assigned',
    type: 'driver',
    title: 'Driver Assigned',
    message: 'John Doe has been assigned to your pickup',
    timestamp: new Date(),
    read: false,
    severity: 'info',
    icon: <DirectionsCar />
  },
  'driver_en_route': {
    id: 'driver-en-route',
    type: 'driver',
    title: 'Driver En Route',
    message: 'Your driver is on the way to your location',
    timestamp: new Date(),
    read: false,
    severity: 'info',
    icon: <DirectionsCar />
  },
  'pickup_arrived': {
    id: 'pickup-arrived',
    type: 'driver',
    title: 'Driver Arrived',
    message: 'Your driver has arrived at the pickup location',
    timestamp: new Date(),
    read: false,
    severity: 'warning',
    icon: <LocalShipping />
  },
  'items_collected': {
    id: 'items-collected',
    type: 'booking',
    title: 'Items Collected',
    message: 'Your items have been collected and are being transported',
    timestamp: new Date(),
    read: false,
    severity: 'info',
    icon: <Schedule />
  },
  'in_cleaning': {
    id: 'in-cleaning',
    type: 'booking',
    title: 'Cleaning Started',
    message: 'Your items are now being professionally cleaned',
    timestamp: new Date(),
    read: false,
    severity: 'info',
    icon: <CleaningServices />
  },
  'ready_for_delivery': {
    id: 'ready-delivery',
    type: 'booking',
    title: 'Ready for Delivery',
    message: 'Cleaning completed! Your items are ready for delivery',
    timestamp: new Date(),
    read: false,
    severity: 'success',
    icon: <CheckCircle />
  },
  'out_for_delivery': {
    id: 'out-delivery',
    type: 'delivery',
    title: 'Out for Delivery',
    message: 'Your cleaned items are on the way back to you',
    timestamp: new Date(),
    read: false,
    severity: 'info',
    icon: <LocalShipping />
  },
  'delivered': {
    id: 'delivered',
    type: 'delivery',
    title: 'Items Delivered',
    message: 'Your items have been successfully delivered',
    timestamp: new Date(),
    read: false,
    severity: 'success',
    icon: <CheckCircle />
  },
  'completed': {
    id: 'completed',
    type: 'booking',
    title: 'Service Complete',
    message: 'Thank you for using LemoTech! Please rate your experience',
    timestamp: new Date(),
    read: false,
    severity: 'success',
    icon: <CheckCircle />
  }
};

export const RealTimeNotifications = ({ bookingStatus }: RealTimeNotificationsProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  // Add notification when booking status changes
  useEffect(() => {
    if (bookingStatus && statusNotifications[bookingStatus]) {
      const newNotification = {
        ...statusNotifications[bookingStatus],
        id: `${bookingStatus}-${Date.now()}`,
        timestamp: new Date()
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setActiveNotification(newNotification);
      
      // Auto-hide notification after 4 seconds
      setTimeout(() => {
        setActiveNotification(null);
      }, 4000);
    }
  }, [bookingStatus]);

  // Simulate additional notifications
  useEffect(() => {
    const additionalNotifications: Partial<Notification>[] = [
      {
        type: 'general',
        title: 'Welcome to LemoTech',
        message: 'Track your order in real-time and get instant updates',
        severity: 'info'
      },
      {
        type: 'payment',
        title: 'Payment Confirmed',
        message: 'Your payment of R185 has been processed successfully',
        severity: 'success'
      }
    ];

    additionalNotifications.forEach((notif, index) => {
      setTimeout(() => {
        const fullNotification: Notification = {
          id: `general-${Date.now()}-${index}`,
          type: notif.type as Notification['type'],
          title: notif.title!,
          message: notif.message!,
          timestamp: new Date(),
          read: false,
          severity: notif.severity as Notification['severity'],
          icon: <NotificationsIcon />
        };
        
        setNotifications(prev => [fullNotification, ...prev]);
      }, (index + 1) * 3000);
    });
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  return (
    <>
      {/* Notification Bell Icon */}
      <Box sx={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <IconButton
            onClick={() => setShowNotificationPanel(!showNotificationPanel)}
            sx={{
              background: 'linear-gradient(135deg, rgba(255,107,53,0.2) 0%, rgba(247,147,30,0.2) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,107,53,0.3)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(255,107,53,0.3) 0%, rgba(247,147,30,0.3) 100%)',
              }
            }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </motion.div>
      </Box>

      {/* Notification Panel */}
      <AnimatePresence>
        {showNotificationPanel && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 80,
              right: 20,
              width: '380px',
              maxHeight: '500px',
              background: 'linear-gradient(135deg, rgba(26, 16, 64, 0.98) 0%, rgba(37, 20, 84, 0.98) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,107,53,0.2)',
              borderRadius: '16px',
              padding: '20px',
              zIndex: 9998,
              overflowY: 'auto'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                Notifications
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {unreadCount > 0 && (
                  <Typography
                    variant="caption"
                    onClick={markAllAsRead}
                    sx={{
                      color: '#FF6B35',
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Mark all as read
                  </Typography>
                )}
                <IconButton
                  size="small"
                  onClick={() => setShowNotificationPanel(false)}
                  sx={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {notifications.length === 0 ? (
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', py: 4 }}>
                  No notifications yet
                </Typography>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Box
                      onClick={() => markAsRead(notification.id)}
                      sx={{
                        p: 2,
                        background: notification.read 
                          ? 'rgba(255,255,255,0.03)' 
                          : 'rgba(255,107,53,0.1)',
                        border: `1px solid ${notification.read 
                          ? 'rgba(255,255,255,0.1)' 
                          : 'rgba(255,107,53,0.2)'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: notification.read 
                            ? 'rgba(255,255,255,0.05)' 
                            : 'rgba(255,107,53,0.15)',
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ color: '#FF6B35', flexShrink: 0, mt: 0.5 }}>
                          {notification.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              color: 'white', 
                              fontWeight: notification.read ? 400 : 600,
                              mb: 0.5
                            }}
                          >
                            {notification.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'rgba(255,255,255,0.7)',
                              fontSize: '0.85rem',
                              mb: 1
                            }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ color: 'rgba(255,255,255,0.5)' }}
                          >
                            {notification.timestamp.toLocaleTimeString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </motion.div>
                ))
              )}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Notification Snackbar */}
      <Snackbar
        open={!!activeNotification}
        autoHideDuration={4000}
        onClose={() => setActiveNotification(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={() => setActiveNotification(null)}
          severity={activeNotification?.severity}
          variant="filled"
          sx={{
            background: 'linear-gradient(135deg, rgba(255,107,53,0.9) 0%, rgba(247,147,30,0.9) 100%)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            },
            '& .MuiAlert-action': {
              color: 'white'
            }
          }}
          icon={activeNotification?.icon}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {activeNotification?.title}
            </Typography>
            <Typography variant="body2">
              {activeNotification?.message}
            </Typography>
          </Box>
        </Alert>
      </Snackbar>
    </>
  );
};
