// React and React-related imports
import React, { useState, useEffect } from 'react';

// Third-party libraries
import { Box, Typography, Button, Container, Grid, Card, Chip, LinearProgress, Avatar } from '@mui/material';
import { CheckCircle, LocationOn, Phone, AccessTime, DirectionsCar, ArrowBack, MyLocation } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Absolute imports (from src/)
import { RealTimeBookingStatus, BookingStatus } from '../../components/Booking/RealTimeBookingStatus';
import { ParticleBackground } from '../../components/Common/ParticleBackground';
import { LiveTrackingPopup } from '../../components/Tracking/LiveTrackingPopup';

interface BookingConfirmationProps {
  bookingId?: string;
  onBackToHome?: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingId = 'CC-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
  onBackToHome
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [_currentStep, _setCurrentStep] = useState<'confirmed' | 'pickup' | 'cleaning' | 'delivery'>('confirmed');
  const [driverStatus, setDriverStatus] = useState<'en-route' | 'arrived' | 'picked-up'>('en-route');
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [_realTimeStatus, setRealTimeStatus] = useState<BookingStatus>('confirmed');
  const [showTrackingPopup, setShowTrackingPopup] = useState(false);

  // Simulate booking data
  const bookingData = {
    id: bookingId,
    pickupLocation: '123 Main Street, Sandton, Johannesburg',
    items: ['Clothing', 'Shoes', 'Bedding'],
    driver: {
      name: 'Mike Johnson',
      rating: 4.9,
      vehicle: 'Toyota Corolla',
      licensePlate: 'GP 123 ABC',
      phone: '+27 82 123 4567',
      estimatedArrival: '5-8 min',
      profileImage: '👨‍💼'
    },
    estimatedPrice: 185,
    pickupTime: new Date(Date.now() + 300000), // 5 minutes from now
    cleaningTime: '24 hours',
    specialInstructions: 'Handle with care - delicate items'
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setDriverStatus('arrived');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const bookingDetails = [
    {
      id: 1,
      icon: <CheckCircle sx={{ fontSize: '2rem', color: theme.palette.success.main }} />,
      title: 'Booking Confirmed',
      description: `Your booking #${bookingData.id} has been confirmed and our team has been notified.`,
      status: 'Completed'
    },
    {
      id: 2,
      icon: <DirectionsCar sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />,
      title: 'Driver Assigned',
      description: `${bookingData.driver.name} is on the way in a ${bookingData.driver.vehicle}.`,
      status: driverStatus === 'en-route' ? 'In Progress' : 'Completed'
    },
    {
      id: 3,
      icon: <LocationOn sx={{ fontSize: '2rem', color: theme.palette.warning.main }} />,
      title: 'Pickup Scheduled',
      description: `Pickup from ${bookingData.pickupLocation} in approximately ${timeRemaining > 0 ? formatTime(timeRemaining) : 'now'}.`,
      status: timeRemaining > 0 ? 'Pending' : 'Ready'
    },
    {
      id: 4,
      icon: <AccessTime sx={{ fontSize: '2rem', color: theme.palette.info.main }} />,
      title: 'Cleaning & Delivery',
      description: `Your items will be professionally cleaned and delivered within ${bookingData.cleaningTime}.`,
      status: 'Pending'
    }
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 50%, #190F32 100%)',
      position: 'relative',
      pt: 10
    }}>
      <ParticleBackground />
      
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
        <motion.div
            initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)'
              }}>
                <CheckCircle sx={{ fontSize: 40, color: '#fff' }} />
              </Box>
            </motion.div>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                fontWeight: 700,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                background: 'linear-gradient(135deg, #ffffff 0%, #4CAF50 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 3,
                letterSpacing: '-0.02em'
              }}
            >
              Booking Confirmed!
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                fontWeight: 400,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                mb: 3
              }}
            >
              Your cleaning service has been successfully booked
            </Typography>

            <Chip
              label={`Booking ID: ${bookingData.id}`}
              sx={{
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                color: '#4CAF50',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                fontFamily: 'monospace',
                fontWeight: 600,
                fontSize: '0.9rem',
                mb: 2
              }}
            />
          </motion.div>
          </Box>

        {/* Booking Progress Steps */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {bookingDetails.map((detail, index) => (
            <Grid item xs={12} md={6} lg={3} key={detail.id}>
        <motion.div
                initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
        >
                <Card
              sx={{
                    height: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    p: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                      transform: 'translateY(-8px)',
                      border: '1px solid rgba(255, 107, 53, 0.3)',
                      boxShadow: '0 20px 40px rgba(255, 107, 53, 0.1)'
                    }
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    mb: 2 
                  }}>
                    <Box sx={{ mr: 2 }}>
                      {detail.icon}
                    </Box>
                  <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#fff',
                          fontWeight: 600,
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          mb: 1,
                          fontSize: '1.1rem'
                        }}
                      >
                        {detail.title}
                      </Typography>
                      <Chip
                        label={detail.status}
                        size="small"
                        sx={{
                          backgroundColor: detail.status === 'Completed' ? 'rgba(76, 175, 80, 0.2)' :
                                          detail.status === 'In Progress' ? 'rgba(255, 193, 7, 0.2)' :
                                          detail.status === 'Ready' ? 'rgba(33, 150, 243, 0.2)' :
                                          'rgba(158, 158, 158, 0.2)',
                          color: detail.status === 'Completed' ? '#4CAF50' :
                                detail.status === 'In Progress' ? '#FFC107' :
                                detail.status === 'Ready' ? '#2196F3' :
                                '#9E9E9E',
                          border: '1px solid',
                          borderColor: detail.status === 'Completed' ? 'rgba(76, 175, 80, 0.3)' :
                                      detail.status === 'In Progress' ? 'rgba(255, 193, 7, 0.3)' :
                                      detail.status === 'Ready' ? 'rgba(33, 150, 243, 0.3)' :
                                      'rgba(158, 158, 158, 0.3)',
                          fontSize: '0.75rem',
                          mb: 2
                        }}
                      />
                    </Box>
                  </Box>

                  <Typography
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.95rem',
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      lineHeight: 1.6
                    }}
                  >
                    {detail.description}
                      </Typography>
              </Card>
            </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Driver Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
          <Card
                            sx={{
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              p: 4,
              mb: 6,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: '#fff',
                fontWeight: 600,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                mb: 3,
                textAlign: 'center'
              }}
            >
              Your Driver
              </Typography>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 60, height: 60, fontSize: '1.5rem' }}>
                  {bookingData.driver.profileImage}
                </Avatar>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#fff',
                      fontWeight: 600,
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}
                  >
                    {bookingData.driver.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.9rem'
                    }}
                  >
                    {bookingData.driver.vehicle} • {bookingData.driver.licensePlate}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.9rem'
                    }}
                  >
                    ⭐ {bookingData.driver.rating} • ETA: {bookingData.driver.estimatedArrival}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: 'right' }}>
              <Button
                  variant="outlined"
                  startIcon={<Phone />}
                sx={{
                    borderColor: 'rgba(255, 107, 53, 0.5)',
                    color: '#FF6B35',
                  '&:hover': {
                      borderColor: '#FF6B35',
                      backgroundColor: 'rgba(255, 107, 53, 0.1)'
                    }
                  }}
                  href={`tel:${bookingData.driver.phone}`}
                >
                  Call Driver
                </Button>
              </Box>
            </Box>

            {/* Progress Bar */}
            {timeRemaining > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.9rem',
                    mb: 1,
                    textAlign: 'center'
                  }}
                >
                  Estimated arrival: {formatTime(timeRemaining)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={((300 - timeRemaining) / 300) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#FF6B35',
                      borderRadius: 3
                    }
                  }}
                />
              </Box>
            )}
            </Card>
          </motion.div>

        {/* Real-time Status Component */}
        <Box sx={{ mb: 6 }}>
          <RealTimeBookingStatus
            bookingId={bookingData.id}
            onStatusUpdate={setRealTimeStatus}
          />
        </Box>

        {/* Action Buttons */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
        >
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={onBackToHome}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: '#fff',
                mr: 2,
                '&:hover': {
                  borderColor: '#fff',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Back to Home
            </Button>

            <Button
              variant="contained"
              startIcon={<MyLocation />}
              onClick={() => setShowTrackingPopup(true)}
              sx={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                color: '#fff',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                mr: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #F7931E 0%, #FF6B35 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)'
                }
              }}
            >
              Track Your Pickup
            </Button>

            <Button
              variant="outlined"
              startIcon={<LocationOn />}
              onClick={() => navigate('/dashboard')}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: '#fff',
                '&:hover': {
                  borderColor: '#fff',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Go to Dashboard
            </Button>
          </motion.div>
          </Box>
      </Container>

      {/* Live Tracking Popup */}
      <LiveTrackingPopup
        bookingId={bookingData.id}
        isOpen={showTrackingPopup}
        onClose={() => setShowTrackingPopup(false)}
        onGoToDashboard={() => navigate('/dashboard')}
        driverInfo={{
          name: bookingData.driver.name,
          phone: bookingData.driver.phone,
          vehicle: bookingData.driver.vehicle,
          rating: bookingData.driver.rating,
          avatar: bookingData.driver.profileImage,
          location: { lat: -26.2041, lng: 28.0473 }
        }}
        pickupLocation={bookingData.pickupLocation}
        estimatedArrival={bookingData.driver.estimatedArrival}
      />
    </Box>
  );
};