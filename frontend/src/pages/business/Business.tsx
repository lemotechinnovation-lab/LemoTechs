// React and React-related imports

// Third-party libraries
import { Box, Typography, Container, Button, Grid, useTheme, Paper } from '@mui/material';
import { 
  Business as BusinessIcon, 
  AccountBalance, 
  Timeline, 
  Security,
  Assignment,
  Group,
  LocalShipping,
  Phone,
  TrendingUp,
  VerifiedUser
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

// Absolute imports (from src/)
import { ParticleBackground } from '../../components/Common/ParticleBackground';

export const Business = () => {
  const theme = useTheme();

  const businessBenefits = [
    {
      id: 1,
      icon: <BusinessIcon sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Corporate Accounts',
      description: 'Streamlined billing and expense management for your business.',
      details: 'Dedicated account management with custom billing cycles and enterprise-level support.'
    },
    {
      id: 2,
      icon: <AccountBalance sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Centralized Billing',
      description: 'One invoice for all your company cleaning needs across all locations.',
      details: 'Simplified accounting with detailed reporting and integration with your existing systems.'
    },
    {
      id: 3,
      icon: <Timeline sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Analytics Dashboard',
      description: 'Track usage, costs, and trends across all departments and locations.',
      details: 'Real-time insights into spending patterns, service utilization, and cost optimization opportunities.'
    },
    {
      id: 4,
      icon: <Security sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Enterprise Security',
      description: 'Advanced security and compliance for corporate environments.',
      details: 'Background-verified staff, secure data handling, and compliance with industry standards.'
    }
  ];

  const features = [
    {
      icon: <Assignment sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />,
      title: 'Expense Management',
      description: 'Integrate with your existing expense and procurement systems for seamless operations.'
    },
    {
      icon: <Group sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />,
      title: 'Team Management',
      description: 'Manage employee access and spending limits with role-based permissions.'
    },
    {
      icon: <LocalShipping sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />,
      title: 'Multi-Location Support',
      description: 'Coordinate cleaning services across multiple offices and locations from one platform.'
    },
    {
      icon: <VerifiedUser sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />,
      title: 'Compliance Reporting',
      description: 'Automated compliance reporting and audit trails for regulatory requirements.'
    },
    {
      icon: <TrendingUp sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />,
      title: 'Cost Optimization',
      description: 'AI-powered recommendations to optimize your cleaning spend and service efficiency.'
    },
    {
      icon: <Phone sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />,
      title: 'Dedicated Support',
      description: '24/7 dedicated account management and priority customer support for your business.'
    }
  ];

  const businessStats = [
    {
      value: '500+',
      title: 'Enterprise Clients',
      description: 'Companies trust our platform',
      icon: <BusinessIcon sx={{ fontSize: '2.5rem', color: theme.palette.primary.main }} />
    },
    {
      value: '85%',
      title: 'Cost Savings',
      description: 'Average reduction in cleaning costs',
      icon: <TrendingUp sx={{ fontSize: '2.5rem', color: theme.palette.primary.main }} />
    },
    {
      value: '99.9%',
      title: 'Uptime Guarantee',
      description: 'Platform reliability assurance',
      icon: <Security sx={{ fontSize: '2.5rem', color: theme.palette.primary.main }} />
    },
    {
      value: '24/7',
      title: 'Support Available',
      description: 'Dedicated account management',
      icon: <Phone sx={{ fontSize: '2.5rem', color: theme.palette.primary.main }} />
    }
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      price: 'R2,500',
      period: '/month',
      description: 'Perfect for small businesses',
      features: [
        'Up to 5 locations',
        'Basic analytics',
        'Email support',
        'Monthly billing',
        'Standard cleaning services'
      ],
      recommended: false
    },
    {
      name: 'Professional',
      price: 'R5,000',
      period: '/month',
      description: 'Ideal for growing companies',
      features: [
        'Up to 20 locations',
        'Advanced analytics',
        'Priority support',
        'Flexible billing',
        'Specialized cleaning services',
        'Account manager'
      ],
      recommended: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations',
      features: [
        'Unlimited locations',
        'Custom analytics',
        '24/7 dedicated support',
        'Custom billing cycles',
        'All cleaning services',
        'Dedicated account team',
        'API integration',
        'Custom contracts'
      ],
      recommended: false
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
              LemoTech for Business
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
              Enterprise cleaning solutions that scale with your business
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
                Get Started
              </Button>
              <Button
                href="mailto:business@lemotech.co.za"
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
                Contact Sales
              </Button>
            </Box>
          </motion.div>
        </Box>

        {/* Business Benefits Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {businessBenefits.map((benefit, index) => (
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
              Trusted by Leading Companies
            </Typography>
            
            <Grid container spacing={4}>
              {businessStats.map((stat, index) => (
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

        {/* Features Section */}
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
              Enterprise Features
            </Typography>
            
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
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
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>

        {/* Pricing Section */}
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
              Choose Your Plan
            </Typography>
            
            <Grid container spacing={4} justifyContent="center">
              {pricingTiers.map((tier, index) => (
                <Grid item xs={12} md={4} key={index}>
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
                        background: tier.recommended 
                          ? 'rgba(255, 107, 53, 0.1)' 
                          : 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(20px)',
                        border: tier.recommended 
                          ? `2px solid ${theme.palette.primary.main}` 
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        textAlign: 'center',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          background: tier.recommended 
                            ? 'rgba(255, 107, 53, 0.15)' 
                            : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${theme.palette.primary.main}`,
                          boxShadow: '0 20px 40px rgba(255, 107, 53, 0.1)'
                        }
                      }}
                    >
                      {tier.recommended && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '-12px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                            px: 3,
                            py: 1,
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            fontFamily: '"Plus Jakarta Sans", sans-serif'
                          }}
                        >
                          Recommended
                        </Box>
                      )}
                      
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          color: 'white',
                          mb: 1,
                          fontFamily: '"Plus Jakarta Sans", sans-serif'
                        }}
                      >
                        {tier.name}
                      </Typography>
                      
                      <Typography
                        sx={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          mb: 3,
                          fontFamily: '"Plus Jakarta Sans", sans-serif'
                        }}
                      >
                        {tier.description}
                      </Typography>
                      
                      <Box sx={{ mb: 4 }}>
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 700,
                            color: theme.palette.primary.main,
                            fontFamily: '"Plus Jakarta Sans", sans-serif'
                          }}
                        >
                          {tier.price}
                          <Typography
                            component="span"
                            variant="h6"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontFamily: '"Plus Jakarta Sans", sans-serif'
                            }}
                          >
                            {tier.period}
                          </Typography>
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 4, textAlign: 'left', flexGrow: 1 }}>
                        {tier.features.map((feature, featureIndex) => (
                          <Box key={featureIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: theme.palette.primary.main,
                                mr: 2,
                                flexShrink: 0
                              }}
                            />
                            <Typography
                              sx={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.9rem',
                                fontFamily: '"Plus Jakarta Sans", sans-serif'
                              }}
                            >
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      
                      <Button
                        component={RouterLink}
                        to="/login"
                        variant={tier.recommended ? "contained" : "outlined"}
                        fullWidth
                        sx={{
                          py: 2,
                          borderRadius: '12px',
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          textTransform: 'none',
                          fontSize: '1rem',
                          ...(tier.recommended ? {
                            backgroundColor: theme.palette.primary.main,
                            '&:hover': { 
                              backgroundColor: 'rgba(255, 107, 53, 0.8)',
                              transform: 'translateY(-2px)'
                            }
                          } : {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            color: 'white',
                            '&:hover': { 
                              borderColor: theme.palette.primary.main,
                              backgroundColor: 'rgba(255, 107, 53, 0.1)'
                            }
                          })
                        }}
                      >
                        {tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                      </Button>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
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
                Ready to Transform Your Business?
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4, 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                }}
              >
                Join hundreds of companies already saving time and money with LemoTech
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
                  Start Free Trial
                </Button>
                <Button
                  href="mailto:business@lemotech.co.za"
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
                  Schedule Demo
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default Business;