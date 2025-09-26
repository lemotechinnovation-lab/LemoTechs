// React and React-related imports
import React, { useState } from 'react';

// Third-party libraries
import { Box, Typography, Container, Button, Grid, Tabs, Tab, Avatar, useTheme, Paper } from '@mui/material';
import { 
  DriveEta, 
  MonetizationOn,
  Schedule,
  Support,
  Security,
  TrendingUp,
  VerifiedUser,
  Star,
  Phone
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

// Absolute imports (from src/)
import { ParticleBackground } from '../../components/Common/ParticleBackground';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Drive = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const driverBenefits = [
    {
      id: 1,
      icon: <MonetizationOn sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Flexible Earnings',
      description: 'Earn competitive rates with opportunities for tips and bonuses.',
      details: 'Average earnings of R15,000-R25,000 per month with flexible scheduling options.'
    },
    {
      id: 2,
      icon: <Schedule sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Your Schedule',
      description: 'Work when you want with complete control over your availability.',
      details: 'Set your own hours, choose your service areas, and balance work with life.'
    },
    {
      id: 3,
      icon: <Support sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: '24/7 Support',
      description: 'Get help whenever you need it with our dedicated driver support team.',
      details: 'Technical support, customer service backup, and driver assistance available round the clock.'
    },
    {
      id: 4,
      icon: <Security sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Safe & Secure',
      description: 'Verified customers, secure payments, and comprehensive insurance coverage.',
      details: 'Background-checked customers, cashless transactions, and full liability protection.'
    }
  ];

  const driverStats = [
    {
      value: '500+',
      title: 'Active Drivers',
      description: 'Professional drivers earning daily',
      icon: <DriveEta sx={{ fontSize: '2.5rem', color: theme.palette.primary.main }} />
    },
    {
      value: 'R20k',
      title: 'Average Monthly',
      description: 'Typical driver earnings per month',
      icon: <MonetizationOn sx={{ fontSize: '2.5rem', color: theme.palette.primary.main }} />
    },
    {
      value: '4.8★',
      title: 'Driver Rating',
      description: 'Average customer satisfaction',
      icon: <Star sx={{ fontSize: '2.5rem', color: theme.palette.primary.main }} />
    },
    {
      value: '24/7',
      title: 'Support Available',
      description: 'Help when you need it most',
      icon: <Support sx={{ fontSize: '2.5rem', color: theme.palette.primary.main }} />
    }
  ];

  const features = [
    {
      icon: <DriveEta sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />,
      title: 'Smart Route Planning',
      description: 'Optimized pickup and delivery routes to maximize your earnings per hour.'
    },
    {
      icon: <MonetizationOn sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />,
      title: 'Instant Payments',
      description: 'Get paid immediately after each completed job with our instant payment system.'
    },
    {
      icon: <Support sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />,
      title: 'Driver Training',
      description: 'Comprehensive training program to help you succeed and earn more.'
    },
    {
      icon: <TrendingUp sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />,
      title: 'Performance Bonuses',
      description: 'Earn extra with our performance-based bonus system and customer ratings.'
    },
    {
      icon: <Security sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />,
      title: 'Insurance Coverage',
      description: 'Comprehensive insurance coverage for you and your vehicle while working.'
    },
    {
      icon: <VerifiedUser sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />,
      title: 'Verified Platform',
      description: 'Work with verified customers on our secure, trusted platform.'
    }
  ];

  const requirements = [
    'Valid driver\'s license (minimum 2 years)',
    'Clean driving record',
    'Reliable vehicle (2015 or newer)',
    'Smartphone with data plan',
    'Professional attitude',
    'Background check clearance',
    'Vehicle insurance',
    'Good physical condition'
  ];

  const testimonials = [
    {
      name: 'Sipho Mthembu',
      location: 'Johannesburg',
      rating: 5,
      quote: 'LemoTech has changed my life. I earn more than my previous full-time job and have complete flexibility.',
      image: '/api/placeholder/60/60'
    },
    {
      name: 'Sarah Johnson',
      location: 'Cape Town',
      rating: 5,
      quote: 'The support team is amazing and the app makes everything so easy. Best decision I\'ve made.',
      image: '/api/placeholder/60/60'
    },
    {
      name: 'Mike Ndlovu',
      location: 'Durban',
      rating: 5,
      quote: 'Started part-time, now it\'s my main income. The flexibility allows me to spend time with family.',
      image: '/api/placeholder/60/60'
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
              Drive with LemoTech
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
                mb: 4
              }}
            >
              Join South Africa's premium cleaning service network and build your own successful driving business
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  borderRadius: '12px',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  textTransform: 'none',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 107, 53, 0.8)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)'
                  }
                }}
              >
                Start Driving Today
              </Button>
              <Button
                href="mailto:drivers@lemotech.co.za"
                variant="outlined"
                size="large"
                startIcon={<Phone />}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  borderRadius: '12px',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  textTransform: 'none',
                  '&:hover': { 
                    borderColor: theme.palette.primary.main,
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    color: 'white'
                  }
                }}
              >
                Contact Support
              </Button>
            </Box>
          </motion.div>
        </Box>

        {/* Driver Benefits Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {driverBenefits.map((benefit, index) => (
            <Grid item xs={12} md={6} lg={3} key={benefit.id}>
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

        {/* Stats Section */}
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
              Driver Success Stats
            </Typography>
            
            <Grid container spacing={4}>
              {driverStats.map((stat, index) => (
                <Grid item xs={12} md={6} lg={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
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
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 107, 53, 0.3)',
                          boxShadow: '0 20px 40px rgba(255, 107, 53, 0.1)'
                        }
                      }}
                    >
                      <Box sx={{ mb: 3 }}>
                        {stat.icon}
                      </Box>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          mb: 1, 
                          fontWeight: 700,
                          color: theme.palette.primary.main,
                          fontFamily: '"Plus Jakarta Sans", sans-serif'
                        }}
                      >
                        {stat.value}
                      </Typography>
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
                        {stat.title}
                      </Typography>
                      <Typography 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          lineHeight: 1.6,
                          fontSize: '0.9rem',
                          fontFamily: '"Plus Jakarta Sans", sans-serif'
                        }}
                      >
                        {stat.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>

        {/* Features & Requirements Tabs */}
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
              Why Choose LemoTech?
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                centered
                sx={{
                  '& .MuiTab-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    '&.Mui-selected': {
                      color: 'white'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: theme.palette.primary.main
                  }
                }}
              >
                <Tab label="Driver Features" />
                <Tab label="Requirements" />
                <Tab label="Driver Stories" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={4}>
                {features.map((feature, index) => (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 107, 53, 0.3)',
                          boxShadow: '0 20px 40px rgba(255, 107, 53, 0.1)'
                        }
                      }}
                    >
                      <Box sx={{ color: theme.palette.primary.main, mt: 0.5 }}>
                        {feature.icon}
                      </Box>
                      <Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            mb: 1, 
                            fontWeight: 600, 
                            color: 'white',
                            fontFamily: '"Plus Jakarta Sans", sans-serif'
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography 
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)', 
                            lineHeight: 1.6,
                            fontFamily: '"Plus Jakarta Sans", sans-serif'
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} md={8}>
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
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 3, 
                        fontWeight: 600, 
                        color: 'white', 
                        textAlign: 'center',
                        fontFamily: '"Plus Jakarta Sans", sans-serif'
                      }}
                    >
                      Driver Requirements
                    </Typography>
                    <Grid container spacing={2}>
                      {requirements.map((req, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              backgroundColor: theme.palette.primary.main 
                            }} />
                            <Typography 
                              sx={{ 
                                color: 'white', 
                                fontWeight: 500,
                                fontFamily: '"Plus Jakarta Sans", sans-serif'
                              }}
                            >
                              {req}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                      <Button
                        component={RouterLink}
                        to="/login"
                        variant="contained"
                        size="large"
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          px: 4,
                          py: 2,
                          borderRadius: '12px',
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          textTransform: 'none',
                          fontSize: '1.1rem',
                          '&:hover': { 
                            backgroundColor: 'rgba(255, 107, 53, 0.8)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)'
                          }
                        }}
                      >
                        Apply Now
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={4}>
                {testimonials.map((testimonial, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 107, 53, 0.3)',
                          boxShadow: '0 20px 40px rgba(255, 107, 53, 0.1)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Avatar 
                          src={testimonial.image} 
                          sx={{ width: 60, height: 60, mr: 2 }}
                        />
                        <Box>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 600, 
                              color: 'white',
                              fontFamily: '"Plus Jakarta Sans", sans-serif'
                            }}
                          >
                            {testimonial.name}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontFamily: '"Plus Jakarta Sans", sans-serif'
                            }}
                          >
                            {testimonial.location}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} sx={{ fontSize: '1rem', color: '#FFD700' }} />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                      <Typography sx={{ 
                        color: 'rgba(255, 255, 255, 0.8)', 
                        fontStyle: 'italic',
                        lineHeight: 1.6,
                        fontSize: '0.95rem',
                        fontFamily: '"Plus Jakarta Sans", sans-serif'
                      }}>
                        "{testimonial.quote}"
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
          </motion.div>
        </Box>

        {/* CTA Section */}
        <Box sx={{ mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Paper
              elevation={0}
              sx={{
                textAlign: 'center',
                p: 6,
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                color: 'white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 107, 53, 0.3)',
                  boxShadow: '0 20px 40px rgba(255, 107, 53, 0.1)'
                }
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  background: 'linear-gradient(135deg, #ffffff 0%, #FF6B35 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                Ready to start earning?
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4, 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                }}
              >
                Join thousands of drivers already earning with LemoTech
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    borderRadius: '12px',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    textTransform: 'none',
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 107, 53, 0.8)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)'
                    }
                  }}
                >
                  Start Driving Today
                </Button>
                <Button
                  href="mailto:drivers@lemotech.co.za"
                  variant="outlined"
                  size="large"
                  startIcon={<Phone />}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    borderRadius: '12px',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    textTransform: 'none',
                    '&:hover': { 
                      borderColor: theme.palette.primary.main,
                      backgroundColor: 'rgba(255, 107, 53, 0.1)',
                      color: 'white'
                    }
                  }}
                >
                  Contact Support
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export { Drive };