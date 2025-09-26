import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  alpha
} from '@mui/material';
import {
  Phone,
  Message,
  DirectionsCar,
  LocationOn,
  AccessTime,
  Star,
  CheckCircle,
  Close
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface UberStyleTrackerProps {
  bookingId?: string;
  onBack?: () => void;
}

// Mock booking data
const mockBooking = {
  id: 'LT-123456',
  status: 'processing',
  driver: {
    name: 'James M.',
    avatar: '👨‍💼',
    rating: 4.9,
    phone: '+27 82 123 4567',
    vehicle: 'Toyota Camry',
    licensePlate: 'ABC 123 GP',
    color: 'White',
    estimatedArrival: '3 min',
    location: { lat: -26.1076, lng: 28.0567 }
  },
  pickup: {
    address: '123 Main Street, Sandton',
    coords: { lat: -26.1076, lng: 28.0567 }
  },
  service: {
    type: 'LemoClean Premium',
    carType: 'premium',
    items: ['Business Suit', 'Dress Shoes', 'Leather Bag'],
    totalAmount: 185
  },
  timeline: [
    { status: 'location', label: 'Location Selected', time: '2:30 PM', completed: true },
    { status: 'carType', label: 'Service Type Selected', time: '2:32 PM', completed: true },
    { status: 'items', label: 'Items Selected', time: '2:35 PM', completed: true },
    { status: 'scheduling', label: 'Driver Assigned', time: '2:38 PM', completed: true },
    { status: 'confirming', label: 'Booking Confirmed', time: '2:40 PM', completed: true },
    { status: 'processing', label: 'Items Being Cleaned', time: '3:00 PM', completed: false, active: true },
    { status: 'confirmed', label: 'Service Complete', time: '5:30 PM', completed: false }
  ]
};

export const UberStyleTracker: React.FC<UberStyleTrackerProps> = ({ 
  onBack 
}) => {
  const [currentStatus, setCurrentStatus] = useState(mockBooking.status);

  // Simulate status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatus(prev => {
        const statuses = ['location', 'carType', 'items', 'scheduling', 'confirming', 'processing', 'confirmed'];
        const currentIndex = statuses.indexOf(prev);
        if (currentIndex < statuses.length - 1) {
          return statuses[currentIndex + 1];
        }
        return prev;
      });
    }, 10000); // Update every 10 seconds for demo

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'location': return '#2196F3';
      case 'carType': return '#9C27B0';
      case 'items': return '#FF9800';
      case 'scheduling': return '#FF6B35';
      case 'confirming': return '#4CAF50';
      case 'processing': return '#9C27B0';
      case 'confirmed': return '#4CAF50';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'location': return <LocationOn />;
      case 'carType': return <DirectionsCar />;
      case 'items': return <CheckCircle />;
      case 'scheduling': return <DirectionsCar />;
      case 'confirming': return <CheckCircle />;
      case 'processing': return <Star />;
      case 'confirmed': return <CheckCircle />;
      default: return <AccessTime />;
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 50%, #190F32 100%)',
      position: 'relative',
      pt: 2
    }}>
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          pt: 2
        }}>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: 600,
              fontFamily: '"Plus Jakarta Sans", sans-serif'
            }}
          >
            Track Your Order
          </Typography>
          {onBack && (
            <IconButton
              onClick={onBack}
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                background: alpha('#ffffff', 0.1),
                '&:hover': {
                  background: alpha('#ffffff', 0.2)
                }
              }}
            >
              <Close />
            </IconButton>
          )}
        </Box>

        {/* Current Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            mb: 3,
            overflow: 'hidden'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${getStatusColor(currentStatus)} 0%, ${alpha(getStatusColor(currentStatus), 0.7)} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: '2rem',
                    color: 'white',
                    boxShadow: `0 8px 32px ${alpha(getStatusColor(currentStatus), 0.3)}`
                  }}>
                    {getStatusIcon(currentStatus)}
                  </Box>
                </motion.div>
                
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    mb: 1
                  }}
                >
                  {mockBooking.timeline.find(t => t.status === currentStatus)?.label}
                </Typography>
                
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}
                >
                  Order #{mockBooking.id}
                </Typography>
              </Box>

              {/* Driver Info */}
              <Box sx={{
                p: 2,
                borderRadius: 2,
                background: alpha('#ffffff', 0.05),
                border: '1px solid rgba(255, 255, 255, 0.1)',
                mb: 3
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{
                    width: 50,
                    height: 50,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: '1.5rem'
                  }}>
                    {mockBooking.driver.avatar}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontSize: '1.1rem'
                      }}
                    >
                      {mockBooking.driver.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Star sx={{ fontSize: 16, color: '#FFD700' }} />
                      <Typography sx={{ color: '#FFD700', fontSize: '0.9rem', fontWeight: 600 }}>
                        {mockBooking.driver.rating}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
                        • {mockBooking.driver.vehicle}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Phone />}
                    sx={{
                      flex: 1,
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      textTransform: 'none',
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      '&:hover': {
                        borderColor: '#4CAF50',
                        color: '#4CAF50'
                      }
                    }}
                  >
                    Call
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Message />}
                    sx={{
                      flex: 1,
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      textTransform: 'none',
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      '&:hover': {
                        borderColor: '#2196F3',
                        color: '#2196F3'
                      }
                    }}
                  >
                    Message
                  </Button>
                </Box>
              </Box>

              {/* Service Details */}
              <Box sx={{
                p: 2,
                borderRadius: 2,
                background: alpha('#ffffff', 0.05),
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <Typography
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    mb: 1
                  }}
                >
                  Service Details
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', mb: 1 }}>
                  {mockBooking.service.type}
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem', mb: 1 }}>
                  Service Type: {mockBooking.service.carType?.charAt(0).toUpperCase() + mockBooking.service.carType?.slice(1)}
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', mb: 2 }}>
                  {mockBooking.service.items.join(', ')}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ color: 'white', fontWeight: 600 }}>
                    Total Amount
                  </Typography>
                  <Typography sx={{ color: '#FFD700', fontWeight: 700, fontSize: '1.1rem' }}>
                    R{mockBooking.service.totalAmount}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Timeline */}
        <Card sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              sx={{
                color: 'white',
                fontWeight: 600,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                mb: 3
              }}
            >
              Order Timeline
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {mockBooking.timeline.map((step, index) => (
                <motion.div
                  key={step.status}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: step.completed 
                        ? `linear-gradient(135deg, ${getStatusColor(step.status)} 0%, ${alpha(getStatusColor(step.status), 0.7)} 100%)`
                        : 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: step.completed ? 'white' : 'rgba(255, 255, 255, 0.5)',
                      fontSize: '1.2rem',
                      border: step.active ? `2px solid ${getStatusColor(step.status)}` : 'none'
                    }}>
                      {step.completed ? <CheckCircle /> : getStatusIcon(step.status)}
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          color: step.completed ? 'white' : 'rgba(255, 255, 255, 0.7)',
                          fontWeight: step.active ? 600 : 500,
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontSize: '0.9rem'
                        }}
                      >
                        {step.label}
                      </Typography>
                      <Typography
                        sx={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontSize: '0.8rem',
                          fontFamily: '"Plus Jakarta Sans", sans-serif'
                        }}
                      >
                        {step.time}
                      </Typography>
                    </Box>
                    
                    {step.active && (
                      <Chip
                        label="Now"
                        size="small"
                        sx={{
                          background: `linear-gradient(135deg, ${getStatusColor(step.status)} 0%, ${alpha(getStatusColor(step.status), 0.7)} 100%)`,
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.7rem'
                        }}
                      />
                    )}
                  </Box>
                </motion.div>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
