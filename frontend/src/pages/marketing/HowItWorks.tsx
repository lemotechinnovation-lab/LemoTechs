import { Box, Container, Typography, Paper, Grid, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { ParticleBackground } from '../../components/Common/ParticleBackground';
import { 
  LocationOn as LocationIcon,
  LocalShipping as PickupIcon,
  CleaningServices as CleanIcon,
  LocalShipping as DeliveryIcon
} from '@mui/icons-material';

const HowItWorks = () => {
  const theme = useTheme();

  const steps = [
    {
      id: 1,
      icon: <LocationIcon sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Book Pickup',
      description: 'Select your items and choose a convenient pickup time from our easy-to-use booking system.',
      details: 'Simply choose your items, set your location, and pick a time that works for you. Our system will instantly confirm your booking.'
    },
    {
      id: 2,
      icon: <PickupIcon sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'We Collect',
      description: 'Our professional team picks up your items directly from your location at the scheduled time.',
      details: 'Our verified drivers will arrive at your location with protective bags and collection materials to safely transport your items.'
    },
    {
      id: 3,
      icon: <CleanIcon sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Professional Clean',
      description: 'Expert cleaning and restoration using industry-leading techniques and eco-friendly solutions.',
      details: 'Our specialists use advanced cleaning methods, quality materials, and proven techniques to restore your items to their best condition.'
    },
    {
      id: 4,
      icon: <DeliveryIcon sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Fresh Delivery',
      description: 'Your freshly cleaned items are delivered back to your door, ready to wear and enjoy.',
      details: 'Items are carefully packaged and delivered back to you within 24-48 hours, looking and feeling like new.'
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
              How It Works
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
                lineHeight: 1.6
              }}
            >
              Professional cleaning made simple with our 4-step process
            </Typography>
          </motion.div>
        </Box>

        {/* Steps Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {steps.map((step, index) => (
            <Grid item xs={12} md={6} lg={3} key={step.id}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
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
                  {/* Step Number */}
                  <Box
                    sx={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 107, 53, 0.1) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px auto',
                      border: '2px solid rgba(255, 107, 53, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        fontFamily: '"Plus Jakarta Sans", sans-serif'
                      }}
                    >
                      {step.id}
                    </Typography>
                  </Box>

                  {/* Icon */}
                  <Box sx={{ mb: 3 }}>
                    {step.icon}
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: '1.3rem',
                      fontWeight: 600,
                      color: 'white',
                      mb: 2,
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}
                  >
                    {step.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      mb: 2,
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}
                  >
                    {step.description}
                  </Typography>

                  {/* Details */}
                  <Typography
                    sx={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}
                  >
                    {step.details}
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
              textAlign: 'center',
              mb: 8
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 600,
                color: 'white',
                mb: 4,
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}
            >
              Why Choose LemoTech?
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={3}>
                <Typography
                  sx={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    mb: 1,
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}
                >
                  1000+
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '1rem',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}
                >
                  Items Restored
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Typography
                  sx={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    mb: 1,
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}
                >
                  5.0★
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '1rem',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}
                >
                  Customer Rating
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Typography
                  sx={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    mb: 1,
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}
                >
                  24hr
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '1rem',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}
                >
                  Turnaround Time
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Typography
                  sx={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    mb: 1,
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}
                >
                  100%
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '1rem',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}
                >
                  Satisfaction Guarantee
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export { HowItWorks };
