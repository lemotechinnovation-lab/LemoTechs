import { Box, Typography, Container, Grid, Card, CardContent, Button, useTheme } from '@mui/material';
import { getCardTitleSxProps } from '../../utils/cardSizing';
import { 
  TrackChanges,
  Dashboard,
  Schedule,
  Business,
  Star
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

export const FeatureShowcase = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <TrackChanges sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Real-Time Tracking',
      description: 'Track your items with live driver location, status updates, and estimated completion times.',
      features: ['Live driver tracking', 'Status notifications', 'ETA updates', 'Item progress'],
      link: '/dashboard',
      demo: true
    },
    {
      icon: <Dashboard sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'User Dashboard',
      description: 'Comprehensive dashboard with booking history, loyalty points, and personal analytics.',
      features: ['Booking history', 'Loyalty rewards', 'Personal stats', 'Quick rebooking'],
      link: '/dashboard',
      demo: true
    },
    {
      icon: <Schedule sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Advanced Booking',
      description: 'Schedule future pickups, set up recurring services, and batch multiple items.',
      features: ['Scheduled pickups', 'Recurring bookings', 'Bulk discounts', 'Photo uploads'],
      link: '/',
      demo: true
    },
    {
      icon: <Business sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Business Dashboard',
      description: 'Enterprise-grade management for corporate accounts with team oversight.',
      features: ['Employee management', 'Budget tracking', 'Analytics', 'Bulk billing'],
      link: '/business-dashboard',
      demo: true
    }
  ];

  return (
    <Box sx={{
      py: 8,
      background: 'linear-gradient(135deg, rgba(15, 10, 40, 0.9) 0%, rgba(30, 20, 64, 0.9) 100%)',
      position: 'relative'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD700 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            🚀 New Premium Features
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            World-class features that make LemoTech the most advanced cleaning service platform
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={feature.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '450px',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 20px 40px rgba(255, 107, 53, 0.2)`
                    }
                  }}
                >
                  <CardContent sx={{ p: 3.5, display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}>
                    {/* Icon */}
                    <Box sx={{ mb: 3 }}>
                      {feature.icon}
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h5"
                      sx={{
                        ...getCardTitleSxProps('xl'),
                        color: 'white'
                      }}
                    >
                      {feature.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        mb: 3,
                        lineHeight: 1.6
                      }}
                    >
                      {feature.description}
                    </Typography>

                    {/* Feature List */}
                    <Box sx={{ mb: 4 }}>
                      {feature.features.map((item, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Star sx={{ 
                            fontSize: '1rem', 
                            color: theme.palette.primary.main, 
                            mr: 1 
                          }} />
                          <Typography sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.9rem'
                          }}>
                            {item}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {/* CTA Button */}
                    <Button
                      component={RouterLink}
                      to={feature.link}
                      variant="contained"
                      fullWidth
                      sx={{
                        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                        py: 1.5,
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: '1rem',
                        textTransform: 'none',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #E55A2B 0%, #E8851A 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)'
                        }
                      }}
                    >
                      {feature.demo ? 'Try It Now' : 'Learn More'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Stats Section */}
        <Box sx={{ 
          mt: 8, 
          textAlign: 'center',
          p: 4,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
            🏆 Platform Completion Status
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} sm={3}>
              <Box>
                <Typography variant="h3" sx={{ 
                  color: theme.palette.primary.main, 
                  fontWeight: 700,
                  mb: 1
                }}>
                  98%
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Feature Complete
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Box>
                <Typography variant="h3" sx={{ 
                  color: '#4CAF50', 
                  fontWeight: 700,
                  mb: 1
                }}>
                  15+
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Major Features
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Box>
                <Typography variant="h3" sx={{ 
                  color: '#FFD700', 
                  fontWeight: 700,
                  mb: 1
                }}>
                  50+
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Components
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Box>
                <Typography variant="h3" sx={{ 
                  color: '#2196F3', 
                  fontWeight: 700,
                  mb: 1
                }}>
                  100%
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  TypeScript
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};
