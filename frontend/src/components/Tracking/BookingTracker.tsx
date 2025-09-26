import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  LinearProgress, 
  Avatar, 
  Button,
  IconButton,
  Divider,
  Chip,
  useTheme
} from '@mui/material';
import { 
  LocationOn, 
  Phone, 
  Message, 
  AccessTime,
  CheckCircle,
  LocalShipping,
  CleaningServices,
  Star
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { GoogleMap } from '../Maps';

export interface BookingStatus {
  id: string;
  status: 'confirmed' | 'driver_assigned' | 'pickup' | 'cleaning' | 'delivery' | 'completed';
  driverInfo?: {
    name: string;
    phone: string;
    rating: number;
    photo: string;
    vehicle: string;
    location: { lat: number; lng: number };
  };
  timeline: {
    confirmed: Date;
    driverAssigned?: Date;
    pickup?: Date;
    cleaning?: Date;
    delivery?: Date;
    completed?: Date;
  };
  estimatedCompletion: Date;
  items: Array<{
    name: string;
    service: string;
    status: 'pending' | 'cleaning' | 'completed';
  }>;
}

interface BookingTrackerProps {
  bookingId: string;
  onClose: () => void;
}

export const BookingTracker = ({ bookingId, onClose }: BookingTrackerProps) => {
  const theme = useTheme();
  const [booking, setBooking] = useState<BookingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    const fetchBookingStatus = () => {
      // Mock booking data - in production, this would come from your API
      const mockBooking: BookingStatus = {
        id: bookingId,
        status: 'pickup',
        driverInfo: {
          name: 'Thabo Mthembu',
          phone: '+27 82 123 4567',
          rating: 4.8,
          photo: '/api/placeholder/100/100',
          vehicle: 'Toyota Corolla - CA 123-456',
          location: { lat: -26.2041, lng: 28.0473 }
        },
        timeline: {
          confirmed: new Date(Date.now() - 30 * 60000), // 30 mins ago
          driverAssigned: new Date(Date.now() - 20 * 60000), // 20 mins ago
          pickup: new Date(Date.now() - 5 * 60000), // 5 mins ago
        },
        estimatedCompletion: new Date(Date.now() + 3 * 60 * 60000), // 3 hours from now
        items: [
          { name: 'Leather Shoes', service: 'Premium Clean', status: 'cleaning' },
          { name: 'Business Suit', service: 'Dry Clean', status: 'pending' },
          { name: 'Cotton Shirt', service: 'Wash & Press', status: 'pending' }
        ]
      };

      setBooking(mockBooking);
      setLoading(false);
    };

    fetchBookingStatus();

    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchBookingStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [bookingId]);

  const getStatusProgress = (status: BookingStatus['status']) => {
    const statusMap = {
      confirmed: 20,
      driver_assigned: 30,
      pickup: 50,
      cleaning: 70,
      delivery: 90,
      completed: 100
    };
    return statusMap[status] || 0;
  };

  const getStatusColor = (status: BookingStatus['status']) => {
    const colorMap = {
      confirmed: '#2196F3',
      driver_assigned: '#FF9800',
      pickup: '#FF6B35',
      cleaning: '#9C27B0',
      delivery: '#4CAF50',
      completed: '#4CAF50'
    };
    return colorMap[status] || theme.palette.primary.main;
  };

  const getStatusText = (status: BookingStatus['status']) => {
    const textMap = {
      confirmed: 'Booking Confirmed',
      driver_assigned: 'Driver Assigned',
      pickup: 'Items Picked Up',
      cleaning: 'Professional Cleaning',
      delivery: 'Out for Delivery',
      completed: 'Completed'
    };
    return textMap[status] || 'Processing';
  };

  if (loading || !booking) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 50%, #190F32 100%)'
      }}>
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px'
        }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography sx={{ color: 'white' }}>Loading booking details...</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 50%, #190F32 100%)',
      position: 'relative'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
          Booking #{booking.id}
        </Typography>
        <Button
          onClick={onClose}
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': { color: 'white' }
          }}
        >
          ✕ Close
        </Button>
      </Box>

      {/* Status Progress */}
      <Paper sx={{
        m: 2,
        p: 3,
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Chip
            label={getStatusText(booking.status)}
            sx={{
              backgroundColor: getStatusColor(booking.status),
              color: 'white',
              fontWeight: 600
            }}
          />
          <Box sx={{ flex: 1, ml: 2 }}>
            <LinearProgress
              variant="determinate"
              value={getStatusProgress(booking.status)}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getStatusColor(booking.status)
                }
              }}
            />
          </Box>
        </Box>

        <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
          Estimated completion: {booking.estimatedCompletion.toLocaleTimeString()}
        </Typography>
      </Paper>

      {/* Driver Info */}
      {booking.driverInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper sx={{
            m: 2,
            p: 3,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px'
          }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              Your Driver
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={booking.driverInfo.photo}
                sx={{ width: 60, height: 60, mr: 2 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  {booking.driverInfo.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Star sx={{ color: '#FFD700', fontSize: '1rem', mr: 0.5 }} />
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                    {booking.driverInfo.rating} rating
                  </Typography>
                </Box>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
                  {booking.driverInfo.vehicle}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': { backgroundColor: '#E55A2B' }
                  }}
                >
                  <Phone />
                </IconButton>
                <IconButton
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                  }}
                >
                  <Message />
                </IconButton>
              </Box>
            </Box>

            {/* Live Map */}
            <Box sx={{ 
              height: 200, 
              borderRadius: '12px', 
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <GoogleMap
                center={booking.driverInfo.location}
                zoom={15}
                drivers={[{
                  id: 'current-driver',
                  name: booking.driverInfo.name,
                  position: booking.driverInfo.location,
                  estimatedArrival: '5 mins'
                }]}
              />
            </Box>
          </Paper>
        </motion.div>
      )}

      {/* Items Status */}
      <Paper sx={{
        m: 2,
        p: 3,
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px'
      }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          Your Items
        </Typography>
        
        {booking.items.map((item, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ color: 'white', fontWeight: 500 }}>
                  {item.name}
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
                  {item.service}
                </Typography>
              </Box>
              
              <Chip
                icon={item.status === 'completed' ? <CheckCircle /> : 
                      item.status === 'cleaning' ? <CleaningServices /> : <AccessTime />}
                label={item.status === 'completed' ? 'Done' : 
                       item.status === 'cleaning' ? 'Cleaning' : 'Pending'}
                size="small"
                sx={{
                  backgroundColor: item.status === 'completed' ? '#4CAF50' :
                                   item.status === 'cleaning' ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }}
              />
            </Box>
            {index < booking.items.length - 1 && <Divider sx={{ mt: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />}
          </Box>
        ))}
      </Paper>

      {/* Timeline */}
      <Paper sx={{
        m: 2,
        p: 3,
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px'
      }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          Timeline
        </Typography>
        
        {Object.entries(booking.timeline).map(([key, date]) => {
          if (!date) return null;
          
          const icons = {
            confirmed: <CheckCircle />,
            driverAssigned: <LocalShipping />,
            pickup: <LocationOn />,
            cleaning: <CleaningServices />,
            delivery: <LocalShipping />,
            completed: <CheckCircle />
          };

          const labels = {
            confirmed: 'Booking Confirmed',
            driverAssigned: 'Driver Assigned',
            pickup: 'Items Picked Up',
            cleaning: 'Cleaning Started',
            delivery: 'Out for Delivery',
            completed: 'Completed'
          };

          return (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ 
                color: theme.palette.primary.main, 
                mr: 2,
                display: 'flex',
                alignItems: 'center'
              }}>
                {icons[key as keyof typeof icons]}
              </Box>
              <Box>
                <Typography sx={{ color: 'white', fontWeight: 500 }}>
                  {labels[key as keyof typeof labels]}
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
                  {date.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Paper>
    </Box>
  );
};
