import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  Grid,
  LinearProgress,
  Chip,
  Rating,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Slide,
  useTheme
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Message,
  DirectionsCar,
  CheckCircle,
  CleaningServices,
  Refresh,
  Star,
  Close,
  Send,
  Psychology,
  AutoAwesome
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleMap from '../../components/Maps/GoogleMap';
import { bookingService } from '../../services';
import { useParams } from 'react-router-dom';
import { ParticleBackground } from '../../components/Common/ParticleBackground';

// Types
interface BookingStatus {
  id: string;
  label: string;
  description: string;
  timestamp: Date;
  completed: boolean;
  active: boolean;
  icon: React.ReactNode;
  estimatedTime?: string;
}

interface CleanerInfo {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  phone: string;
  vehicle: string;
  location: { lat: number; lng: number };
}

interface BookingDetails {
  id: string;
  serviceType: string;
  carType?: string;
  items: string[];
  pickupLocation: string;
  deliveryLocation: string;
  scheduledTime: Date;
  totalAmount: number;
  status: string;
  cleaner: CleanerInfo;
}

// Mock data
const mockBooking: BookingDetails = {
  id: 'LT-123456',
  serviceType: 'LemoClean Premium',
  carType: 'premium',
  items: ['Business Suit', 'Dress Shoes', 'Leather Bag'],
  pickupLocation: '123 Main Street, Sandton, Johannesburg',
  deliveryLocation: '123 Main Street, Sandton, Johannesburg',
  scheduledTime: new Date(),
  totalAmount: 185,
  status: 'processing',
  cleaner: {
    id: 'cleaner1',
    name: 'James Thompson',
    avatar: '👨‍💼',
    rating: 4.9,
    phone: '+27 123 456 789',
    vehicle: 'Toyota Camry • White • ABC 123 GP',
    location: { lat: -26.1076, lng: 28.0567 }
  }
};

const trackingStatuses: BookingStatus[] = [
  {
    id: 'location',
    label: 'Location Selected',
    description: 'Pickup location has been confirmed',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    completed: true,
    active: false,
    icon: <LocationOn />
  },
  {
    id: 'carType',
    label: 'Service Type Selected',
    description: 'Service type has been chosen based on your needs',
    timestamp: new Date(Date.now() - 90 * 60 * 1000), // 90 minutes ago
    completed: true,
    active: false,
    icon: <DirectionsCar />
  },
  {
    id: 'items',
    label: 'Items Selected',
    description: 'Items to be cleaned have been specified',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    completed: true,
    active: false,
    icon: <CheckCircle />
  },
  {
    id: 'scheduling',
    label: 'Driver Assigned',
    description: 'Driver has been assigned and is en route',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    completed: true,
    active: false,
    icon: <DirectionsCar />
  },
  {
    id: 'confirming',
    label: 'Booking Confirmed',
    description: 'Your booking has been confirmed and payment processed',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    completed: true,
    active: false,
    icon: <CheckCircle />
  },
  {
    id: 'processing',
    label: 'Items Being Cleaned',
    description: 'Your items are currently being professionally cleaned',
    timestamp: new Date(),
    completed: false,
    active: true,
    icon: <CleaningServices />,
    estimatedTime: '2-3 hours remaining'
  },
  {
    id: 'confirmed',
    label: 'Service Complete',
    description: 'Items have been cleaned and delivered',
    timestamp: new Date(),
    completed: false,
    active: false,
    icon: <CheckCircle />
  }
];

export const BookingTracking: React.FC = () => {
  const theme = useTheme();
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<BookingDetails>(mockBooking);
  const [statuses, setStatuses] = useState<BookingStatus[]>(trackingStatuses);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🧠 Intelligent State Management
  const [eta, setEta] = useState<string>('8 minutes');
  const [driverSpeed, setDriverSpeed] = useState<number>(45); // km/h
  const [trafficCondition, setTrafficCondition] = useState<'light' | 'moderate' | 'heavy'>('moderate');
  const [smartNotifications, setSmartNotifications] = useState<string[]>([]);
  const [isDriverNearby, setIsDriverNearby] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');

  // Fetch booking data on mount
  useEffect(() => {
    const fetchBookingData = async () => {
      if (!bookingId) {
        // Try to get from localStorage if no bookingId in URL
        const storedBooking = localStorage.getItem('currentBooking');
        if (storedBooking) {
          const parsedBooking = JSON.parse(storedBooking);
          // Ensure the booking has a complete cleaner object
          if (!parsedBooking.cleaner) {
            parsedBooking.cleaner = mockBooking.cleaner;
          }
          // Ensure the booking has items array
          if (!parsedBooking.items) {
            parsedBooking.items = mockBooking.items;
          }
          // Ensure other required properties exist
          if (!parsedBooking.serviceType) {
            parsedBooking.serviceType = mockBooking.serviceType;
          }
          if (!parsedBooking.pickupLocation) {
            parsedBooking.pickupLocation = mockBooking.pickupLocation;
          }
          if (!parsedBooking.deliveryLocation) {
            parsedBooking.deliveryLocation = mockBooking.deliveryLocation;
          }
          if (!parsedBooking.totalAmount) {
            parsedBooking.totalAmount = mockBooking.totalAmount;
          }
          if (!parsedBooking.scheduledTime) {
            parsedBooking.scheduledTime = mockBooking.scheduledTime;
          }
          setBooking(parsedBooking);
        } else {
        }
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Load booking details
        const [details, bookingStatus] = await Promise.all([
          bookingService.getBookingDetails(bookingId).catch(() => null),
          bookingService.getBookingStatus(bookingId)
        ]);
        if (details) {
          setBooking((prev) => ({
            ...prev,
            id: details.id || bookingId,
            serviceType: details.serviceType || prev.serviceType,
            items: details.items || prev.items,
            pickupLocation: details.pickupLocation || prev.pickupLocation,
            deliveryLocation: details.deliveryLocation || prev.deliveryLocation || details.pickupLocation,
            totalAmount: details.amount || prev.totalAmount,
            scheduledTime: details.estimatedPickupTime ? new Date(details.estimatedPickupTime) : prev.scheduledTime,
            status: details.status || prev.status,
            cleaner: {
              id: details.driver?.id || prev.cleaner.id,
              name: details.driver?.name || prev.cleaner.name,
              avatar: prev.cleaner.avatar,
              rating: details.driver?.rating || prev.cleaner.rating,
              phone: details.driver?.phone || prev.cleaner.phone,
              vehicle: details.driver?.vehicle || prev.cleaner.vehicle,
              location: details.driver?.currentLocation || prev.cleaner.location
            }
          }));
        }
        
        // Update booking status based on API response
        const updatedStatuses = trackingStatuses.map(status => {
          if (status.id === bookingStatus.status) {
            return { ...status, active: true, completed: false };
          } else if (trackingStatuses.indexOf(status) < trackingStatuses.findIndex(s => s.id === bookingStatus.status)) {
            return { ...status, completed: true, active: false };
          }
          return { ...status, completed: false, active: false };
        });
        
        setStatuses(updatedStatuses);
        setLastUpdated(new Date());
      } catch (err) {
        setError('Failed to load booking details. Please try again.');
        console.error('Error fetching booking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId]);

  // 🧠 Intelligent ETA Calculation
  const calculateSmartETA = useCallback(() => {
    const baseTime = 8; // Base 8 minutes
    let adjustedTime = baseTime;

    // Adjust based on traffic conditions
    switch (trafficCondition) {
      case 'light': adjustedTime *= 0.8; break;
      case 'moderate': adjustedTime *= 1.0; break;
      case 'heavy': adjustedTime *= 1.5; break;
    }

    // Adjust based on driver speed
    if (driverSpeed < 30) adjustedTime *= 1.3;
    else if (driverSpeed > 60) adjustedTime *= 0.9;

    // Add some randomness for realism
    const randomFactor = 0.9 + Math.random() * 0.2;
    adjustedTime *= randomFactor;

    return Math.max(2, Math.round(adjustedTime));
  }, [trafficCondition, driverSpeed]);

  // 🧠 Smart Notification System
  const addSmartNotification = useCallback((message: string, severity: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setSmartNotifications(prev => [...prev.slice(-4), message]); // Keep last 5 notifications
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setShowSnackbar(true);
  }, []);

  // 🧠 Intelligent Real-time Updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentActiveIndex = statuses.findIndex(s => s.active);
      
      // Update ETA intelligently
      const newETA = calculateSmartETA();
      setEta(`${newETA} minutes`);

      // Simulate traffic condition changes
      if (Math.random() < 0.1) {
        const conditions: Array<'light' | 'moderate' | 'heavy'> = ['light', 'moderate', 'heavy'];
        const newCondition = conditions[Math.floor(Math.random() * conditions.length)];
        if (newCondition !== trafficCondition) {
          setTrafficCondition(newCondition);
          addSmartNotification(`Traffic conditions updated: ${newCondition}`, 'info');
        }
      }

      // Simulate driver speed changes
      if (Math.random() < 0.15) {
        const newSpeed = 25 + Math.random() * 50;
        setDriverSpeed(Math.round(newSpeed));
      }

      // Check if driver is nearby
      const distance = Math.random() * 2; // Simulate distance in km
      const nearby = distance < 0.5;
      if (nearby !== isDriverNearby) {
        setIsDriverNearby(nearby);
        if (nearby) {
          addSmartNotification('🚗 Your driver is approaching!', 'success');
        }
      }

      // Update status progression
      if (currentActiveIndex < statuses.length - 1) {
        setStatuses(prev => prev.map((status, index) => {
          if (index === currentActiveIndex) {
            return { ...status, completed: true, active: false, timestamp: now };
          }
          if (index === currentActiveIndex + 1) {
            return { ...status, active: true, timestamp: now };
          }
          return status;
        }));
        setLastUpdated(now);

        // Add smart notification for status changes
        const nextStatus = statuses[currentActiveIndex + 1];
        if (nextStatus) {
          addSmartNotification(`✅ ${nextStatus.label}`, 'success');
      }
      }
    }, 10000); // Update every 10 seconds for more responsive feel

    return () => clearInterval(interval);
  }, [statuses, calculateSmartETA, addSmartNotification, trafficCondition, isDriverNearby]);

  const activeStatus = statuses.find(s => s.active);
  const completedSteps = statuses.filter(s => s.completed).length;
  const progress = (completedSteps / statuses.length) * 100;

  const handleContactCleaner = () => {
    setShowContactDialog(true);
  };

  const handleSendMessage = () => {
    // Simulate sending message
    setMessage('');
    setShowContactDialog(false);
  };


  const handleSubmitRating = () => {
    // Simulate submitting rating
    setShowRatingDialog(false);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography>Loading booking details...</Typography>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error" variant="h6" gutterBottom>
            {error}
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 50%, #190F32 100%)',
      position: 'relative',
      pt: 4
    }}>
      <ParticleBackground />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
      <motion.div
          initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Modern Dark Header */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography 
                  variant="h4" 
                  sx={{
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontWeight: 600,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    background: 'linear-gradient(135deg, #ffffff 0%, #FF6B35 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  letterSpacing: '-0.02em'
                  }}
                >
                Track Your Order
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: '0.875rem',
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                }}>
                  Updated {lastUpdated.toLocaleTimeString()}
                  </Typography>
                  <IconButton 
                    size="small"
                    sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    border: '1px solid rgba(255, 107, 53, 0.3)',
                      '&:hover': {
                      backgroundColor: 'rgba(255, 107, 53, 0.2)',
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.3s ease'
                    }}
                  >
                <Refresh />
              </IconButton>
            </Box>
          </Box>
          
            {/* Booking ID */}
              <Typography 
              variant="body1" 
                sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: '1rem'
                }}
              >
              Order #{booking.id || 'LT-123456'}
          </Typography>
          </Paper>
          
          {/* Modern Progress Bar */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ 
                color: 'white', 
                fontWeight: 600,
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}>
                {activeStatus?.label || 'Processing'}
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}>
                {Math.round(progress)}% complete
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
                  sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                    }
                  }}
                />
          </Paper>
          
          {/* Modern Status Description */}
          {activeStatus && (
            <Paper
              elevation={0}
                  sx={{
                p: 3,
                mb: 4,
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px'
              }}
            >
                    <Typography 
                variant="body1" 
                      sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  fontSize: '1.1rem'
                      }}
                    >
                {activeStatus.description}
                    </Typography>
              {activeStatus.estimatedTime && (
                    <Typography 
                      variant="body2" 
                      sx={{
                    color: 'rgba(255, 107, 53, 0.8)',
                    mt: 2,
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 500
                      }}
                    >
                  ⏱️ {activeStatus.estimatedTime}
                </Typography>
              )}
            </Paper>
          )}

          {/* Modern ETA Panel */}
          <Paper
            elevation={0}
                        sx={{
              p: 4,
              mb: 4,
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 107, 53, 0.3)',
                boxShadow: '0 20px 40px rgba(255, 107, 53, 0.1)'
              }
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ 
                    color: theme.palette.primary.main, 
                    fontWeight: 700, 
                    mb: 1,
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}>
                    {eta}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}>
                    ETA
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ 
                          color: 'white',
                          fontWeight: 600,
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}>
                    {trafficCondition} traffic
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}>
                    {driverSpeed} km/h
                  </Typography>
              </Box>
              </Grid>
              
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ 
                    color: 'white', 
                    fontWeight: 600,
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}>
                    {isDriverNearby ? '🚗 Nearby' : '📍 En route'}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}>
                    Driver status
                  </Typography>
            </Box>
              </Grid>
            </Grid>
        </Paper>

          {/* Modern Timeline */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px'
            }}
          >
                <Typography 
              variant="h5" 
                  sx={{
                    color: 'white',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 600,
                mb: 4,
                textAlign: 'center'
                  }}
                >
                  📋 Order Timeline
              </Typography>
              
                  {statuses.map((status, index) => (
                    <motion.div
                      key={status.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                  alignItems: 'center',
                        mb: 3, 
                  p: 3,
                  background: status.active 
                    ? 'rgba(255, 107, 53, 0.1)' 
                    : status.completed 
                    ? 'rgba(255, 255, 255, 0.02)' 
                    : 'transparent',
                  borderRadius: '16px',
                  border: status.active 
                    ? '1px solid rgba(255, 107, 53, 0.3)' 
                    : status.completed 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: status.active 
                      ? 'rgba(255, 107, 53, 0.15)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    transform: 'translateX(8px)'
                  }
                }}>
                  <Box sx={{ 
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: status.completed 
                      ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                              : status.active
                      ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                                : 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 3,
                    flexShrink: 0,
                    border: status.active ? '2px solid rgba(255, 107, 53, 0.5)' : 'none'
                  }}>
                    {status.completed && (
                      <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
                    )}
                    {status.active && !status.completed && (
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        animation: 'pulse 2s infinite'
                      }} />
                    )}
                    {!status.completed && !status.active && (
                      <Typography sx={{ 
                        color: 'rgba(255, 255, 255, 0.5)', 
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}>
                        {index + 1}
                      </Typography>
                    )}
                        </Box>
                        
                  <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="h6" 
                            sx={{
                        color: status.active 
                          ? theme.palette.primary.main 
                          : status.completed 
                          ? 'white' 
                          : 'rgba(255, 255, 255, 0.7)',
                              fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: status.active ? 600 : 500,
                        mb: 1
                            }}
                          >
                            {status.label}
                          </Typography>
                          <Typography 
                      variant="body1" 
                            sx={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontFamily: '"Plus Jakarta Sans", sans-serif',
                        lineHeight: 1.5,
                        mb: 1
                            }}
                          >
                        {status.description}
                      </Typography>
                      {(status.completed || status.active) && (
                            <Typography 
                        variant="body2" 
                              sx={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontSize: '0.875rem'
                              }}
                            >
                        🕒 {status.timestamp.toLocaleString()}
                        </Typography>
                      )}
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
            </Paper>

          {/* Modern Driver Info */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 107, 53, 0.3)',
                boxShadow: '0 20px 40px rgba(255, 107, 53, 0.1)'
              }
            }}
          >
            <Typography 
              variant="h5" 
              sx={{
                color: 'white',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 600,
                mb: 4,
                textAlign: 'center'
              }}
            >
              👨‍💼 Your Driver
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4, 
              mb: 4,
              p: 3,
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                fontSize: '2rem',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                color: 'white',
                border: '3px solid rgba(255, 107, 53, 0.3)'
              }}>
                {booking?.cleaner?.avatar ?? '👨‍💼'}
              </Avatar>
                
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="h5"
                  sx={{
                    color: 'white',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 600,
                    mb: 1
                  }}
                >
                  {booking?.cleaner?.name ?? 'Unknown'}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Rating 
                    value={booking?.cleaner?.rating ?? 0} 
                    precision={0.1} 
                    size="medium" 
                    readOnly 
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: theme.palette.primary.main
                      },
                      '& .MuiRating-iconEmpty': {
                        color: 'rgba(255, 255, 255, 0.3)'
                      }
                    }}
                  />
                  <Typography 
                    variant="h6"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}
                  >
                    {booking?.cleaner?.rating ?? '-'}
                  </Typography>
                </Box>
                
                <Typography 
                  variant="body1" 
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontSize: '1.1rem'
                  }}
                >
                  🚗 {booking?.cleaner?.vehicle ?? ''}
                </Typography>
              </Box>
            </Box>
            
            {/* Modern Action Buttons */}
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Phone />}
                  href={`tel:${booking.cleaner?.phone || '+27 123 456 789'}`}
                  sx={{
                    py: 2,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    borderRadius: '12px',
                    border: '2px solid',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: 'rgba(255, 107, 53, 0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  📞 Call Driver
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Message />}
                  onClick={handleContactCleaner}
                  sx={{
                    py: 2,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    color: 'white',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    borderRadius: '12px',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  💬 Message Driver
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Modern Map Section */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 107, 53, 0.3)',
                boxShadow: '0 20px 40px rgba(255, 107, 53, 0.1)'
              }
            }}
          >
            <Typography 
              variant="h5" 
              sx={{
                color: 'white',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 600,
                mb: 3,
                textAlign: 'center'
              }}
            >
              🗺️ Live Location
            </Typography>
          
            <Box sx={{ 
              height: 400, 
              borderRadius: '16px', 
              overflow: 'hidden',
              border: '2px solid rgba(255, 107, 53, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <GoogleMap
                center={booking.cleaner?.location || { lat: -26.1076, lng: 28.0567 }}
                zoom={13}
                drivers={[
                  {
                    id: booking.cleaner?.id || 'cleaner1',
                    name: booking.cleaner?.name || 'James Thompson',
                    position: booking.cleaner?.location || { lat: -26.1076, lng: 28.0567 },
                    estimatedArrival: '10 min'
                  }
                ]}
              />
            </Box>
          </Paper>

          {/* Modern Order Details */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 107, 53, 0.3)',
                boxShadow: '0 20px 40px rgba(255, 107, 53, 0.1)'
              }
            }}
          >
            <Typography 
              variant="h5" 
              sx={{
                color: 'white',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 600,
                mb: 4,
                textAlign: 'center'
              }}
            >
              📋 Order Details
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  mb: 3
                }}>
                  <Typography variant="h6" sx={{ 
                    color: theme.palette.primary.main, 
                    mb: 2,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 600
                  }}>
                    🧽 Service Type
                  </Typography>
                  <Typography variant="h5" sx={{ 
                    color: 'white',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 600
                  }}>
                    {booking.serviceType || 'Premium Clean'}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  mb: 3
                }}>
                  <Typography variant="h6" sx={{ 
                    color: theme.palette.primary.main, 
                    mb: 2,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 600
                  }}>
                    📦 Items
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {(booking.items || []).map((item, index) => (
                      <Chip 
                        key={index} 
                        label={item} 
                        size="medium" 
                        sx={{
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                          color: 'white',
                          border: 'none',
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontWeight: 600,
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  mb: 3
                }}>
                  <Typography variant="h6" sx={{ 
                    color: theme.palette.primary.main, 
                    mb: 2,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 600
                  }}>
                    💰 Total Amount
                  </Typography>
                  <Typography variant="h3" sx={{ 
                    color: theme.palette.primary.main,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 700,
                    textShadow: '0 2px 8px rgba(255, 107, 53, 0.3)'
                  }}>
                    R{booking.totalAmount || 185}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <Typography variant="h6" sx={{ 
                    color: theme.palette.primary.main, 
                    mb: 2,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 600
                  }}>
                    📍 Pickup Location
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    lineHeight: 1.6
                  }}>
                    {booking.pickupLocation || '123 Main Street, Sandton, Johannesburg'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Container>

      {/* 🧠 Intelligent Contact Dialog */}
      <Dialog
        open={showContactDialog}
        onClose={() => setShowContactDialog(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Psychology sx={{ fontSize: 24 }} />
          Smart Message to {booking.cleaner?.name || 'James Thompson'}
          <IconButton
            onClick={() => setShowContactDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
              💡 Smart suggestions:
                  </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['Running 5 min late', 'Please call when you arrive', 'I\'m ready for pickup', 'Thank you!'].map((suggestion) => (
                <Chip
                  key={suggestion}
                  label={suggestion}
                    size="small" 
                  onClick={() => setMessage(suggestion)}
                    sx={{
                    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    cursor: 'pointer',
                      '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
              </Box>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here or use smart suggestions above..."
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#667eea'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea'
                }
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setShowContactDialog(false)}
            sx={{
              color: '#666',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendMessage}
            variant="contained"
            startIcon={<Send />}
            disabled={!message.trim()}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Send Smart Message
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onClose={() => setShowRatingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Rate Your Service</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              How was your experience with {booking.cleaner?.name || 'James Thompson'}?
            </Typography>
            <Rating
              value={rating}
              onChange={(_, newValue) => setRating(newValue || 5)}
              size="large"
              sx={{ mb: 2 }}
            />
          </Box>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Additional Feedback (Optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us about your experience..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRatingDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitRating}
            startIcon={<Star />}
          >
            Submit Rating
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🧠 Smart Notification System */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity={snackbarSeverity}
          sx={{
            width: '100%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesome sx={{ color: '#667eea', fontSize: 20 }} />
            {snackbarMessage}
          </Box>
        </Alert>
      </Snackbar>

      {/* 🧠 Smart Notifications Panel */}
      <AnimatePresence>
        {smartNotifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: 20,
              left: 20,
              zIndex: 1300,
              maxWidth: '300px'
            }}
          >
            <Paper elevation={8} sx={{
              p: 2,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Psychology sx={{ color: 'white', fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                  Smart Updates
                </Typography>
              </Box>
              <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                {smartNotifications.slice(-3).map((notification, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Typography variant="body2" sx={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '0.8rem',
                      mb: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}>
                      <Box sx={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        backgroundColor: '#4CAF50',
                        flexShrink: 0
                      }} />
                      {notification}
                    </Typography>
                  </motion.div>
                ))}
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🧠 Enhanced CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
        
        @keyframes intelligentGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 107, 53, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 107, 53, 0.6);
          }
        }
        
        @keyframes smartBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .intelligent-glow {
          animation: intelligentGlow 3s ease-in-out infinite;
        }
        
        .smart-bounce {
          animation: smartBounce 2s ease-in-out infinite;
        }
        
        .professional-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </Box>
  );
};
