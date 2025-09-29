// React and React-related imports
import { useState } from 'react';

// Third-party libraries
import { Box, Typography, Container, Button, Grid, TextField, Stepper, Step, StepLabel, useTheme, Paper } from '@mui/material';
import { 
  CleaningServices, 
  MonetizationOn,
  Schedule,
  Support,
  Store,
  Business,
  VerifiedUser,
  TrendingUp
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

// Absolute imports (from src/)
import { ParticleBackground } from '../../components/Common/ParticleBackground';

const CleanerSignup = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    services: [] as string[],
    experience: '',
    equipment: '',
    availability: ''
  });

  const steps = ['Business Info', 'Services', 'Details', 'Verification', 'Complete'];
  
  const benefits = [
    {
      icon: <MonetizationOn sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Flexible Earnings',
      description: 'Set your own rates and earn more with our premium cleaning marketplace.',
      details: 'Competitive rates with opportunities for bonuses and premium service charges.'
    },
    {
      icon: <Schedule sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Flexible Schedule',
      description: 'Work when you want with complete control over your schedule.',
      details: 'Choose your working hours and days to fit your lifestyle perfectly.'
    },
    {
      icon: <Support sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Full Support',
      description: 'Get training, tools, and ongoing support to grow your business.',
      details: '24/7 Support team, training materials, and business development resources.'
    },
    {
      icon: <TrendingUp sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Grow Your Business',
      description: 'Build your cleaning empire with our digital storefront platform.',
      details: 'Digital marketing tools, customer management, and business analytics.'
    }
  ];

  const requirements = [
    { icon: <VerifiedUser />, text: 'Valid Business License' },
    { icon: <CleaningServices />, text: 'Cleaning Experience' },
    { icon: <Business />, text: 'Insurance Coverage' },
    { icon: <Store />, text: 'Professional Equipment' }
  ];

  const serviceTypes = [
    'Residential Cleaning', 'Commercial Cleaning', 'Deep Cleaning', 
    'Move-in/Move-out', 'Carpet Cleaning', 'Window Cleaning',
    'Post-Construction Cleanup', 'Event Cleanup'
  ];

  const equipmentOptions = [
    'Vacuum Cleaners', 'Steam Cleaners', 'Pressure Washers',
    'Professional Chemicals', 'Microfiber Cloths', 'Safety Equipment'
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Business Name"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Person"
                value={formData.contactPerson}
                onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Address"
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  color: 'white',
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                }}
              >
                Select Your Cleaning Service(s)
              </Typography>
              <Grid container spacing={2}>
                {serviceTypes.map((service) => (
                  <Grid item xs={12} sm={6} key={service}>
                    <Paper
                      elevation={0}
                      onClick={() => handleServiceToggle(service)}
                      sx={{ 
                        p: 2, 
                        cursor: 'pointer',
                        border: formData.services.includes(service) 
                          ? `2px solid ${theme.palette.primary.main}` 
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        background: formData.services.includes(service) 
                          ? 'rgba(255, 107, 53, 0.1)' 
                          : 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: `1px solid ${theme.palette.primary.main}`
                        }
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontFamily: '"Plus Jakarta Sans", sans-serif'
                        }}
                      >
                        {service}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Years of Experience"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  color: 'white',
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                }}
              >
                Available Equipment
              </Typography>
              <Grid container spacing={2}>
                {equipmentOptions.map((equipment) => (
                  <Grid item xs={12} sm={6} key={equipment}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 107, 53, 0.3)'
                        }
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontFamily: '"Plus Jakarta Sans", sans-serif'
                        }}
                      >
                        {equipment}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <VerifiedUser sx={{ fontSize: '4rem', color: theme.palette.primary.main, mb: 2 }} />
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{ 
                color: 'white',
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}
            >
              Document Verification
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                mb: 3,
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}
            >
              Please upload your business license and insurance documents for verification.
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}
                >
                  <Typography 
                    variant="body1" 
                    gutterBottom
                    sx={{ 
                      color: 'white',
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}
                  >
                    Business License
                  </Typography>
                  <Button 
                    variant="outlined" 
                    component="label"
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: 'rgba(255, 107, 53, 0.1)'
                      }
                    }}
                  >
                    Upload File
                    <input type="file" hidden accept="image/*,.pdf" />
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}
                >
                  <Typography 
                    variant="body1" 
                    gutterBottom
                    sx={{ 
                      color: 'white',
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}
                  >
                    Insurance Certificate
                  </Typography>
                  <Button 
                    variant="outlined" 
                    component="label"
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: 'rgba(255, 107, 53, 0.1)'
                      }
                    }}
                  >
                    Upload File
                    <input type="file" hidden accept="image/*,.pdf" />
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      case 4:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Store sx={{ fontSize: '4rem', color: theme.palette.primary.main, mb: 2 }} />
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{ 
                color: 'white',
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}
            >
              Welcome to LemoTech Partners!
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                mb: 3,
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}
            >
              Your cleaning business application has been submitted successfully. 
              We'll review your application and set up your digital storefront within 24-48 hours.
            </Typography>
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              sx={{ 
                backgroundColor: theme.palette.primary.main, 
                '&:hover': { backgroundColor: 'rgba(255, 107, 53, 0.8)' },
                borderRadius: '12px',
                px: 4,
                py: 2
              }}
            >
              Return to Home
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

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
              Become a Cleaner
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
              Join our premium cleaning network and build your successful business
            </Typography>
          </motion.div>
        </Box>

        {/* Benefits Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} md={6} lg={3} key={index}>
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
                  <Box sx={{ mb: 3 }}>
                    {benefit.icon}
                  </Box>
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
                    {benefit.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      lineHeight: 1.6,
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      mb: 2,
                      flexGrow: 1
                    }}
                  >
                    {benefit.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '0.85rem',
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}
                  >
                    {benefit.details}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Requirements Section */}
        <Box sx={{ mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              align="center"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 600,
                color: 'white',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                mb: 6
              }}
            >
              Partner Requirements
            </Typography>
            
            <Grid container spacing={3} justifyContent="center">
              {requirements.map((req, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        textAlign: 'center',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 107, 53, 0.3)',
                          boxShadow: '0 20px 40px rgba(255, 107, 53, 0.1)'
                        }
                      }}
                    >
                      <Box sx={{ 
                        color: theme.palette.primary.main, 
                        mb: 2,
                        fontSize: '2rem' 
                      }}>
                        {req.icon}
                      </Box>
                      <Typography 
                        sx={{ 
                          fontWeight: 500, 
                          color: 'white',
                          fontFamily: '"Plus Jakarta Sans", sans-serif'
                        }}
                      >
                        {req.text}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>

        {/* Application Form Section */}
        <Box sx={{ mb: 8 }} id="application-form">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              align="center"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 600,
                color: 'white',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                mb: 6
              }}
            >
              Join Our Cleaning Network
            </Typography>

            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '24px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 107, 53, 0.3)',
                    boxShadow: '0 20px 40px rgba(255, 107, 53, 0.1)'
                  }
                }}
              >
                <Stepper 
                  activeStep={activeStep} 
                  alternativeLabel 
                  sx={{ 
                    mb: 4,
                    '& .MuiStepLabel-label': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-active': { color: 'white' },
                      '&.Mui-completed': { color: 'white' }
                    },
                    '& .MuiStepIcon-root': {
                      color: 'rgba(255, 255, 255, 0.3)',
                      '&.Mui-active': { color: theme.palette.primary.main },
                      '&.Mui-completed': { color: theme.palette.primary.main }
                    }
                  }}
                >
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {renderStepContent(activeStep)}

                {activeStep < steps.length - 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        '&:hover': { backgroundColor: 'rgba(255, 107, 53, 0.8)' },
                        borderRadius: '12px',
                        px: 4
                      }}
                    >
                      {activeStep === steps.length - 2 ? 'Submit Application' : 'Next'}
                    </Button>
                  </Box>
                )}
              </Paper>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export { CleanerSignup };