// React and React-related imports
import { useState, useEffect } from 'react';

// Third-party libraries
import { Box, Typography, Container, Paper, Grid, useTheme, Alert, Snackbar } from '@mui/material';
import { 
  LocalLaundryService,
  Schedule,
  Security,
  Star,
  CheckCircle,
  Groups,
  Verified,
  DriveEta,
  CleaningServices
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

// Absolute imports (from src/)
import { getCardTitleSxProps } from '../utils/cardSizing';
import { RideBooking } from '../components/Booking';
import { useBooking } from '../context/BookingContext';
import { ParticleBackground } from '../components/Common/ParticleBackground';

export const Home = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [showRideBooking, setShowRideBooking] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);
  const { setIsBookingActive } = useBooking();

  // Handle welcome message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setWelcomeMessage(location.state.message);
      // Clear the message from history state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleBackToHome = () => {
    setTimeout(() => {
      setShowRideBooking(false);
      setIsBookingActive(false); // Show footer when booking is closed
    }, 300);
  };

  // Update booking context when component mounts/unmounts
  useEffect(() => {
    return () => {
      setIsBookingActive(false); // Cleanup when component unmounts
    };
  }, [setIsBookingActive]);

  // Note: Floating button visibility is now controlled by TrackingContext
  // No need to automatically hide it on home page

  const features = [
    {
      icon: <LocalLaundryService sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Professional Cleaning',
      description: 'Expert cleaning services using industry-leading techniques and eco-friendly solution(s).'
    },
    {
      icon: <Schedule sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Fast Turnaround',
      description: 'Quick and reliable service with 24-48 hour(s) standard delivery for most items.'
    },
    {
      icon: <Security sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Secure & Trusted',
      description: 'Your items are in safe hands with our verified drivers and secure handling process.'
    }
  ];

  const trustSignals = [
    {
      icon: <Groups sx={{ color: theme.palette.primary.main }} />,
      number: '10,000+',
      label: 'Happy Customers'
    },
    {
      icon: <Star sx={{ color: '#FFD700' }} />,
      number: '4.9',
      label: 'Average Rating'
    },
    {
      icon: <Verified sx={{ color: theme.palette.primary.main }} />,
      number: '100%',
      label: 'Satisfaction Guarantee'
    },
    {
      icon: <CheckCircle sx={{ color: '#4CAF50' }} />,
      number: '50,000+',
      label: 'Items Cleaned'
    }
  ];

  // If ride booking is active, show the RideBooking component
  if (showRideBooking) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="booking"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <RideBooking onBackToHome={handleBackToHome} />
        </motion.div>
      </AnimatePresence>
    );
  }

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
        <Box sx={{ textAlign: 'center', mb: 12 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', md: '3.5rem', lg: '4.5rem' },
                fontWeight: 500,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                background: 'linear-gradient(135deg, #ffffff 0%, #FF6B35 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 3,
                letterSpacing: '-0.02em'
              }}
            >
              Cleaning excellence, delivered to your door
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                fontWeight: 400,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6,
                mb: 6
              }}
            >
              Book pickup, get professional cleaning, and enjoy fresh delivery - all from the comfort of your home
            </Typography>

            {/* Uber-style Service Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: '600px', mx: 'auto' }}>
                {/* Clean Option */}
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={0}
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Clean card clicked - Navigating to booking');
                      navigate('/book');
                    }}
                    sx={{
                      height: '260px',
                      p: 2.5,
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 107, 53, 0.3)',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 40px rgba(255, 107, 53, 0.1)'
                      }
                    }}
                  >
                    <CleaningServices sx={{ 
                      fontSize: '3rem', 
                      color: theme.palette.primary.main,
                      mb: 2
                    }} />
                    <Typography
                      variant="h4"
                      sx={{
                        ...getCardTitleSxProps('medium'),
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        color: 'white',
                        mb: 1
                      }}
                    >
                      Clean
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '1rem',
                        fontFamily: '"Plus Jakarta Sans", sans-serif'
                      }}
                    >
                      Professional cleaning services
                    </Typography>
                  </Paper>
                </Grid>

                {/* Drive Option */}
                <Grid item xs={12} sm={6}>
                  <Paper
                    component={RouterLink}
                    to="/drive"
                    elevation={0}
                    sx={{
                      height: '260px',
                      p: 2.5,
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '20px',
                      textAlign: 'center',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 107, 53, 0.3)',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 40px rgba(255, 107, 53, 0.1)'
                      }
                    }}
                  >
                    <DriveEta sx={{ 
                      fontSize: '3rem', 
                      color: theme.palette.primary.main,
                      mb: 2
                    }} />
                    <Typography
                      variant="h4"
                      sx={{
                        ...getCardTitleSxProps('medium'),
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        color: 'white',
                        mb: 1
                      }}
                    >
                      Drive
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '1rem',
                        fontFamily: '"Plus Jakarta Sans", sans-serif'
                      }}
                    >
                      Earn money as a driver
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </motion.div>
          </motion.div>
        </Box>

        {/* Features Section */}
        <Grid container spacing={4} sx={{ mb: 12 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={feature.title}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    height: '350px',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 107, 53, 0.3)',
                      boxShadow: '0 20px 40px rgba(255, 107, 53, 0.1)'
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    },
                    '&:hover::before': {
                      opacity: 1
                    }
                  }}
                >
                  {/* Icon */}
                  <Box sx={{ mb: 3 }}>
                    {feature.icon}
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      ...getCardTitleSxProps('large'),
                      color: 'white',
                      mb: 2,
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}
                  >
                    {feature.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Trust Signals Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 6,
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              mb: 8
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: '1.8rem', md: '2.2rem' },
                fontWeight: 600,
                color: 'white',
                mb: 4,
                textAlign: 'center',
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}
            >
              Trusted by Thousands
            </Typography>

            <Grid container spacing={4}>
              {trustSignals.map((signal) => (
                <Grid item xs={6} md={3} key={signal.label}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {signal.icon}
                    </Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: { xs: '1.8rem', md: '2.5rem' },
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        mb: 1,
                        fontFamily: '"Plus Jakarta Sans", sans-serif'
                      }}
                    >
                      {signal.number}
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.9rem',
                        fontFamily: '"Plus Jakarta Sans", sans-serif'
                      }}
                    >
                      {signal.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </motion.div>


      </Container>

      {/* Welcome Message Snackbar */}
      <Snackbar
        open={!!welcomeMessage}
        autoHideDuration={4000}
        onClose={() => setWelcomeMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 8 }}
      >
        <Alert
          onClose={() => setWelcomeMessage(null)}
          severity="success"
          variant="filled"
          sx={{
            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
            color: 'white',
            fontWeight: 600,
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          {welcomeMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
