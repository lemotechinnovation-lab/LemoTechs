// React and React-related imports
import React, { useState } from 'react';

// Third-party libraries
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  Avatar, 
  Button,
  Card,
  CardContent,
  CardMedia,
  LinearProgress,
  Chip,
  useTheme,
  Tab,
  Tabs,
  TextField,
  MenuItem,
  IconButton,
  Divider
} from '@mui/material';
import { 
  Star,
  History,
  Assessment,
  AccountCircle,
  Phone,
  Email,
  LocationOn,
  Edit,
  FilterList,
  Search,
  TrendingUp,
  Nature,
  Schedule,
  LocalOffer,
  Settings,
  Add,
  MoreVert
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Absolute imports (from src/)
import { ParticleBackground } from '../../components/Common/ParticleBackground';
import { BookingTracker } from '../../components/Tracking/BookingTracker';
import { NotificationSystem, useNotifications } from '../../components/Common/NotificationSystem';
import { useAuth } from '../../hooks/useAuth';
import { notificationService } from '../../services/notificationService';

interface BookingHistory {
  id: string;
  date: Date;
  items: string[];
  service: string;
  amount: number;
  status: 'completed' | 'cancelled' | 'in_progress' | 'in_cleaning';
  rating?: number;
  photos?: string[];
}

interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: 'discount' | 'free_service' | 'upgrade';
  icon: string;
}

export const Dashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [trackingBookingId, setTrackingBookingId] = useState<string | null>(null);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Notification system
  const {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  // Initialize notification service
  React.useEffect(() => {
    if (user?.id) {
      notificationService.initialize(user.id);
      notificationService.requestPermission();

      // Subscribe to real-time notifications
      const unsubscribe = notificationService.subscribe(addNotification);

      return () => {
        unsubscribe();
        notificationService.disconnect();
      };
    }
  }, [user?.id, addNotification]);
  
  // Mock data - in production, fetch from API
  const [bookingHistory] = useState<BookingHistory[]>([
    {
      id: 'BK-001',
      date: new Date('2024-01-15'),
      items: ['Leather Shoes', 'Business Suit'],
      service: 'Premium Clean',
      amount: 85,
      status: 'completed',
      rating: 5,
      photos: ['/api/placeholder/300/200', '/api/placeholder/300/200']
    },
    {
      id: 'BK-002',
      date: new Date('2024-01-10'),
      items: ['Cotton Shirts (3)', 'Trousers (2)'],
      service: 'Standard Clean',
      amount: 120,
      status: 'completed',
      rating: 4,
      photos: ['/api/placeholder/300/200']
    },
    {
      id: 'BK-003',
      date: new Date('2024-01-08'),
      items: ['Sneakers', 'Casual Wear'],
      service: 'Express Clean',
      amount: 65,
      status: 'in_progress'
    },
    {
      id: 'LT-123456',
      date: new Date(),
      items: ['Business Suit', 'Dress Shoes', 'Leather Bag'],
      service: 'Premium Clean',
      amount: 185,
      status: 'in_cleaning'
    }
  ]);

  const [loyaltyRewards] = useState<LoyaltyReward[]>([
    {
      id: 'R001',
      title: '10% Off Next Order',
      description: 'Get 10% discount on your next cleaning service',
      pointsCost: 100,
      category: 'discount',
      icon: '🎫'
    },
    {
      id: 'R002',
      title: 'Free Shoe Clean',
      description: 'Complimentary shoe cleaning service',
      pointsCost: 200,
      category: 'free_service',
      icon: '👟'
    },
    {
      id: 'R003',
      title: 'Premium Upgrade',
      description: 'Upgrade any service to Premium for free',
      pointsCost: 300,
      category: 'upgrade',
      icon: '⭐'
    }
  ]);

  const [stats] = useState({
    totalBookings: bookingHistory.length,
    totalSpent: bookingHistory.reduce((sum, booking) => sum + booking.amount, 0),
    averageRating: 4.8,
    itemsCleaned: 15,
    co2Saved: 2.4, // kg of CO2 saved through eco-friendly cleaning
    nextReward: 50, // points until next reward
    monthlySpending: [65, 85, 120, 185], // Last 4 months
    favoriteService: 'Premium Clean',
    avgOrderValue: 93.75,
    completionRate: 95,
    timesSaved: 24, // hours saved
    carbonFootprint: -15.2, // negative means carbon negative
    upcomingBookings: 1,
    notifications: 3
  });

  if (trackingBookingId) {
    return (
      <BookingTracker
        bookingId={trackingBookingId}
        onClose={() => setTrackingBookingId(null)}
      />
    );
  }

  const TabPanel = ({ children, value, index }: any) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  const renderOverview = () => (
    <Grid container spacing={3}>
      {/* Enhanced User Stats */}
      <Grid item xs={12}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
        <Paper sx={{
            p: 4,
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
              height: '3px',
              background: 'linear-gradient(90deg, #FF6B35 0%, #F7931E 50%, #4CAF50 100%)'
            }
          }}>
            <Typography variant="h5" sx={{ 
              color: 'white', 
              mb: 4,
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 700
            }}>
              📊 Your LemoTech Journey
          </Typography>
          
          <Grid container spacing={3}>
              <Grid item xs={6} sm={4} md={2}>
              <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)'
                  }}>
                    <Assessment sx={{ color: 'white', fontSize: 28 }} />
                  </Box>
                  <Typography variant="h4" sx={{ 
                    color: '#FF6B35', 
                    fontWeight: 800,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    mb: 0.5
                  }}>
                  {stats.totalBookings}
                </Typography>
                  <Typography sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '0.8rem',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}>
                  Total Bookings
                </Typography>
              </Box>
            </Grid>
            
              <Grid item xs={6} sm={4} md={2}>
              <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)'
                  }}>
                    <TrendingUp sx={{ color: 'white', fontSize: 28 }} />
                  </Box>
                  <Typography variant="h4" sx={{ 
                    color: '#4CAF50', 
                    fontWeight: 800,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    mb: 0.5
                  }}>
                  R{stats.totalSpent}
                </Typography>
                  <Typography sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '0.8rem',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}>
                  Total Spent
                </Typography>
              </Box>
            </Grid>
            
              <Grid item xs={6} sm={4} md={2}>
              <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)'
                  }}>
                    <Star sx={{ color: 'white', fontSize: 28 }} />
                  </Box>
                  <Typography variant="h4" sx={{ 
                    color: '#FFD700', 
                    fontWeight: 800,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    mb: 0.5
                  }}>
                  {stats.averageRating}
                </Typography>
                  <Typography sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '0.8rem',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}>
                  Avg Rating
                </Typography>
              </Box>
            </Grid>
            
              <Grid item xs={6} sm={4} md={2}>
              <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00C853 0%, #1B5E20 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    boxShadow: '0 8px 25px rgba(0, 200, 83, 0.3)'
                  }}>
                    <Nature sx={{ color: 'white', fontSize: 28 }} />
                  </Box>
                  <Typography variant="h4" sx={{ 
                    color: '#00C853', 
                    fontWeight: 800,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    mb: 0.5
                  }}>
                  {stats.co2Saved}kg
                </Typography>
                  <Typography sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '0.8rem',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}>
                  CO₂ Saved
                </Typography>
              </Box>
            </Grid>
              
              <Grid item xs={6} sm={4} md={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    boxShadow: '0 8px 25px rgba(156, 39, 176, 0.3)'
                  }}>
                    <Schedule sx={{ color: 'white', fontSize: 28 }} />
                  </Box>
                  <Typography variant="h4" sx={{ 
                    color: '#9C27B0', 
                    fontWeight: 800,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    mb: 0.5
                  }}>
                    {stats.timesSaved}h
                  </Typography>
                  <Typography sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '0.8rem',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}>
                    Time Saved
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} sm={4} md={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)'
                  }}>
                    <LocalOffer sx={{ color: 'white', fontSize: 28 }} />
                  </Box>
                  <Typography variant="h4" sx={{ 
                    color: '#2196F3', 
                    fontWeight: 800,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    mb: 0.5
                  }}>
                    {stats.completionRate}%
                  </Typography>
                  <Typography sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '0.8rem',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}>
                    Success Rate
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        </motion.div>
      </Grid>

      {/* Loyalty Points */}
      <Grid item xs={12} md={4}>
        <Paper sx={{
          p: 3,
          background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
          borderRadius: '16px',
          color: 'white'
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Loyalty Points
          </Typography>
          
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {user?.loyaltyPoints || 0}
            </Typography>
            <Typography sx={{ opacity: 0.9 }}>
              {stats.nextReward} points until next reward
            </Typography>
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={(stats.nextReward / 100) * 100}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'white'
              }
            }}
          />
        </Paper>
      </Grid>

      {/* Recent Bookings */}
      <Grid item xs={12}>
        <Paper sx={{
          p: 3,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: 'white' }}>
              Recent Bookings
            </Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{ 
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main
              }}
            >
              View All
            </Button>
          </Box>
          
          {bookingHistory.slice(0, 3).map((booking) => (
            <Card key={booking.id} sx={{
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              mb: 2,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              '&:last-child': { mb: 0 }
            }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                      {booking.items.join(', ')}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', mb: 1 }}>
                      {booking.service} • {booking.date.toLocaleDateString()}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        label={booking.status === 'completed' ? 'Completed' : 'In Progress'}
                        size="small"
                        sx={{
                          backgroundColor: booking.status === 'completed' ? '#4CAF50' : theme.palette.primary.main,
                          color: 'white'
                        }}
                      />
                      
                      {booking.rating && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Star sx={{ color: '#FFD700', fontSize: '1rem', mr: 0.5 }} />
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                            {booking.rating}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                      R{booking.amount}
                    </Typography>
                    {booking.status === 'in_progress' && (
                      <Button
                        size="small"
                        onClick={() => setTrackingBookingId(booking.id)}
                        sx={{ 
                          mt: 1,
                          color: theme.palette.primary.main,
                          fontSize: '0.8rem'
                        }}
                      >
                        Track Order
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );

  // Filter bookings based on status and search
  const filteredBookings = bookingHistory.filter(booking => {
    const matchesFilter = historyFilter === 'all' || booking.status === historyFilter;
    const matchesSearch = searchQuery === '' || 
      booking.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase())) ||
      booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const renderBookingHistory = () => (
    <Grid container spacing={3}>
      {/* Enhanced Filters and Search */}
      <Grid item xs={12}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Paper sx={{
            p: 3,
            mb: 3,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ 
                color: 'white',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 700
              }}>
                📋 Booking History ({filteredBookings.length})
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: 'rgba(255,255,255,0.5)', mr: 1 }} />,
                }}
                sx={{
                  minWidth: 250,
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 107, 53, 0.4)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF6B35',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }
                }}
              />
              
              <TextField
                select
                size="small"
                value={historyFilter}
                onChange={(e) => setHistoryFilter(e.target.value)}
                sx={{
                  minWidth: 150,
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 107, 53, 0.4)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF6B35',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }
                }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="in_cleaning">In Cleaning</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
              
              <IconButton
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <FilterList />
              </IconButton>
            </Box>
          </Paper>
        </motion.div>
      </Grid>

      {/* Enhanced Booking Cards */}
      {filteredBookings.map((booking, index) => (
        <Grid item xs={12} md={6} lg={4} key={booking.id}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
          <Card sx={{
              height: '380px',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
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
                height: '3px',
                background: booking.status === 'completed' 
                  ? 'linear-gradient(90deg, #4CAF50 0%, #45A049 100%)'
                  : booking.status === 'in_progress' || booking.status === 'in_cleaning'
                    ? 'linear-gradient(90deg, #FF6B35 0%, #F7931E 100%)'
                    : 'linear-gradient(90deg, #f44336 0%, #d32f2f 100%)'
              }
          }}>
            {booking.photos && booking.photos.length > 0 && (
              <CardMedia
                component="img"
                  height="160"
                image={booking.photos[0]}
                alt="Booking result"
                  sx={{ 
                    borderRadius: '20px 20px 0 0',
                    objectFit: 'cover'
                  }}
              />
            )}
            
              <CardContent sx={{ flex: 1, p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'white',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: 700,
                        mb: 0.5,
                        fontSize: '1rem'
                      }}
                    >
                      {booking.items.slice(0, 2).join(', ')}
                      {booking.items.length > 2 && ` +${booking.items.length - 2} more`}
                </Typography>
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      fontSize: '0.8rem',
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}>
                      #{booking.id} • {booking.date.toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  <IconButton
                    size="small"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      '&:hover': {
                        color: 'white',
                        background: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip
                    label={booking.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  size="small"
                  sx={{
                      background: booking.status === 'completed' 
                        ? 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)'
                        : booking.status === 'in_progress' || booking.status === 'in_cleaning'
                          ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
                          : 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                    color: 'white',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}
                  />
                  
                  <Typography sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    fontSize: '0.8rem',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}>
                    {booking.service}
              </Typography>
                  
                  {booking.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                      <Star sx={{ color: '#FFD700', fontSize: '1rem', mr: 0.3 }} />
                      <Typography sx={{ 
                        color: '#FFD700', 
                        fontSize: '0.8rem', 
                        fontWeight: 600,
                        fontFamily: '"Plus Jakarta Sans", sans-serif'
                      }}>
                        {booking.rating}
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                <Divider sx={{ 
                  my: 2, 
                  borderColor: 'rgba(255, 255, 255, 0.1)' 
                }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h5" sx={{ 
                    color: '#FFD700',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 800
                  }}>
                  R{booking.amount}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {(booking.status === 'in_progress' || booking.status === 'in_cleaning') && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setTrackingBookingId(booking.id)}
                      sx={{ 
                          color: '#2196F3',
                          borderColor: 'rgba(33, 150, 243, 0.5)',
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontWeight: 600,
                          textTransform: 'none',
                          '&:hover': {
                            borderColor: '#2196F3',
                            background: 'rgba(33, 150, 243, 0.1)',
                            transform: 'translateY(-1px)'
                          }
                      }}
                    >
                      Track
                    </Button>
                  )}
                  
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ 
                        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #E55A2B 0%, #E8851A 100%)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)'
                        }
                    }}
                  >
                    Rebook
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
          </motion.div>
        </Grid>
      ))}
      
      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Paper sx={{
              p: 6,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px'
            }}>
              <Typography variant="h6" sx={{ 
                color: 'white',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 600,
                mb: 2
              }}>
                📭 No bookings found
              </Typography>
              <Typography sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                mb: 3
              }}>
                {searchQuery || historyFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start your first booking to see your history here'
                }
              </Typography>
              {!searchQuery && historyFilter === 'all' && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  sx={{
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 700,
                    textTransform: 'none'
                  }}
                >
                  Create First Booking
                </Button>
              )}
            </Paper>
          </motion.div>
        </Grid>
      )}
    </Grid>
  );

  const renderLoyaltyRewards = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
          borderRadius: '16px',
          color: 'white'
        }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            {user?.loyaltyPoints || 0} Points Available
          </Typography>
          <Typography sx={{ opacity: 0.9 }}>
            Redeem your points for exclusive rewards and discounts
          </Typography>
        </Paper>
      </Grid>
      
      {loyaltyRewards.map((reward) => (
        <Grid item xs={12} md={4} key={reward.id}>
          <Card sx={{
            height: '350px',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px'
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h2" sx={{ mb: 2 }}>
                {reward.icon}
              </Typography>
              
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                {reward.title}
              </Typography>
              
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                {reward.description}
              </Typography>
              
              <Chip
                label={`${reward.pointsCost} points`}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  mb: 2
                }}
              />
              
              <Button
                fullWidth
                variant="contained"
                disabled={(user?.loyaltyPoints || 0) < reward.pointsCost}
                sx={{
                  background: (user?.loyaltyPoints || 0) >= reward.pointsCost 
                    ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  '&:disabled': {
                    color: 'rgba(255, 255, 255, 0.5)'
                  }
                }}
              >
                {(user?.loyaltyPoints || 0) >= reward.pointsCost ? 'Redeem' : 'Not Enough Points'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderProfile = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper sx={{
          p: 3,
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px'
        }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              mx: 'auto',
              mb: 2,
              background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
              fontSize: '2rem'
            }}
          >
            {user?.name?.charAt(0)}
          </Avatar>
          
          <Typography variant="h5" sx={{ color: 'white', mb: 1 }}>
            {user?.name}
          </Typography>
          
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
            Member since {user?.memberSince?.toLocaleDateString()}
          </Typography>
          
          <Button
            startIcon={<Edit />}
            variant="outlined"
            sx={{
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main
            }}
          >
            Edit Profile
          </Button>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={8}>
        <Paper sx={{
          p: 3,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px'
        }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
            Personal Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ color: theme.palette.primary.main, mr: 2 }} />
                <Box>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                    Email
                  </Typography>
                  <Typography sx={{ color: 'white' }}>
                    {user?.email}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone sx={{ color: theme.palette.primary.main, mr: 2 }} />
                <Box>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                    Phone
                  </Typography>
                  <Typography sx={{ color: 'white' }}>
                    {user?.phone}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ color: theme.palette.primary.main, mr: 2 }} />
                <Box>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                    Address
                  </Typography>
                  <Typography sx={{ color: 'white' }}>
                    {user?.address}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 50%, #190F32 100%)',
      position: 'relative'
    }}>
      <ParticleBackground />
      
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4, position: 'relative', zIndex: 2 }}>
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ 
            mb: 4, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box>
          <Typography variant="h4" sx={{ 
            color: 'white', 
                fontWeight: 800,
                mb: 1,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                background: 'linear-gradient(135deg, #ffffff 0%, #FF6B35 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Welcome back, {user?.name?.split(' ')[0]}! 👋
          </Typography>
              <Typography sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: '1rem'
              }}>
            Manage your bookings, track orders, and redeem rewards
          </Typography>
        </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationSystem
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onDeleteNotification={deleteNotification}
                onNotificationClick={(notification) => {
                  if (notification.actionUrl) {
                    // Navigate to the action URL
                    window.location.href = notification.actionUrl;
                  }
                }}
              />
              
              <IconButton
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Settings />
              </IconButton>
              
              <Button
                variant="contained"
                startIcon={<Add />}
                sx={{
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #E55A2B 0%, #E8851A 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                New Booking
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Tabs */}
        <Paper sx={{
          mb: 3,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px'
        }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(90deg, #FF6B35, #F7931E)',
              },
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 600,
                textTransform: 'none',
                '&.Mui-selected': {
                  color: 'white',
                },
              },
            }}
          >
            <Tab icon={<Assessment />} label="Overview" />
            <Tab icon={<History />} label="Booking History" />
            <Tab icon={<Star />} label="Loyalty Rewards" />
            <Tab icon={<AccountCircle />} label="Profile" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabPanel value={activeTab} index={0}>
              {renderOverview()}
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              {renderBookingHistory()}
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              {renderLoyaltyRewards()}
            </TabPanel>
            <TabPanel value={activeTab} index={3}>
              {renderProfile()}
            </TabPanel>
          </motion.div>
        </AnimatePresence>
      </Container>
    </Box>
  );
};
