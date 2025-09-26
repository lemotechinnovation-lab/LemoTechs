import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Tab,
  Tabs,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  AttachMoney,
  People,
  Analytics,
  Download,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ParticleBackground } from '../../components/Common/ParticleBackground';
import { revenueService } from '../../services/revenueService';
import { RevenueAnalytics as RevenueAnalyticsType } from '../../types/revenue';

const COLORS = ['#FF6B35', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#00BCD4'];

// Mock data for charts
const revenueGrowthData = [
  { month: 'Jan', core: 2200000, subscription: 320000, marketplace: 180000, franchise: 120000 },
  { month: 'Feb', core: 2350000, subscription: 380000, marketplace: 220000, franchise: 140000 },
  { month: 'Mar', core: 2580000, subscription: 420000, marketplace: 280000, franchise: 160000 },
  { month: 'Apr', core: 2720000, subscription: 465000, marketplace: 310000, franchise: 175000 },
  { month: 'May', core: 2850000, subscription: 485000, marketplace: 320000, franchise: 180000 }
];

const cityRevenueData = [
  { city: 'Johannesburg', revenue: 1850000, growth: 18, marketShare: 22 },
  { city: 'Cape Town', revenue: 1420000, growth: 25, marketShare: 18 },
  { city: 'Durban', revenue: 680000, growth: 35, marketShare: 12 },
  { city: 'Pretoria', revenue: 520000, growth: 15, marketShare: 8 }
];

const subscriptionConversionData = [
  { tier: 'Free to Basic', rate: 12, count: 2400 },
  { tier: 'Basic to Premium', rate: 28, count: 1680 },
  { tier: 'Premium to Enterprise', rate: 15, count: 450 }
];

const productCategoryData = [
  { name: 'Detergents', value: 45, revenue: 144000 },
  { name: 'Stain Removal', value: 25, revenue: 80000 },
  { name: 'Fabric Care', value: 18, revenue: 57600 },
  { name: 'Accessories', value: 12, revenue: 38400 }
];

export const RevenueAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [analytics, setAnalytics] = useState<RevenueAnalyticsType | null>(null);
  const [timeRange, setTimeRange] = useState('6months');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await revenueService.getRevenueAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const formatCurrency = (value: number) => {
    return `R${(value / 1000000).toFixed(1)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (!analytics) {
    return <div>Loading...</div>;
  }

  const OverviewTab = () => (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card sx={{
              height: '260px',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoney sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Revenue</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(analytics.totalRevenue)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  +{formatPercentage(analytics.monthOverMonthGrowth)} MoM
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card sx={{
              height: '260px',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <People sx={{ mr: 1 }} />
                  <Typography variant="h6">ARPU</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  R{analytics.averageRevenuePerUser}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Average Revenue Per User
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card sx={{
              height: '260px',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp sx={{ mr: 1 }} />
                  <Typography variant="h6">CLV</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  R{(analytics.customerLifetimeValue / 1000).toFixed(1)}K
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Customer Lifetime Value
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card sx={{
              height: '260px',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Analytics sx={{ mr: 1 }} />
                  <Typography variant="h6">Churn Rate</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {formatPercentage(analytics.churnRate)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Monthly churn rate
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ 
            height: '450px',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(10px)' 
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                Revenue Growth by Stream
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={revenueGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" tickFormatter={(value) => `R${(value/1000000).toFixed(1)}M`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`R${(value as number/1000000).toFixed(1)}M`, '']}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="core" stackId="1" stroke="#FF6B35" fill="#FF6B35" fillOpacity={0.7} name="Core Services" />
                  <Area type="monotone" dataKey="subscription" stackId="1" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.7} name="Subscriptions" />
                  <Area type="monotone" dataKey="marketplace" stackId="1" stroke="#2196F3" fill="#2196F3" fillOpacity={0.7} name="Marketplace" />
                  <Area type="monotone" dataKey="franchise" stackId="1" stroke="#9C27B0" fill="#9C27B0" fillOpacity={0.7} name="Franchise" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ 
            height: '450px',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(10px)' 
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                Revenue by Stream
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={Object.entries(analytics.revenueByStream).map(([name, value], index) => ({
                      name: name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                      value,
                      color: COLORS[index % COLORS.length]
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {Object.entries(analytics.revenueByStream).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`R${(value as number/1000000).toFixed(1)}M`, '']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const CityAnalyticsTab = () => (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ 
            height: '450px',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(10px)' 
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                City Performance Comparison
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={cityRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="city" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" tickFormatter={(value) => `R${(value/1000000).toFixed(1)}M`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`R${(value as number/1000000).toFixed(1)}M`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#FF6B35" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ 
            height: '450px',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(10px)' 
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                City Growth & Market Share
              </Typography>
              <Grid container spacing={2}>
                {cityRevenueData.map((city) => (
                  <Grid item xs={12} sm={6} md={3} key={city.city}>
                    <Box sx={{
                      p: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: 2,
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                        {city.city}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Revenue:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                          {formatCurrency(city.revenue)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Growth:
                        </Typography>
                        <Chip
                          label={`+${city.growth}%`}
                          size="small"
                          sx={{
                            backgroundColor: city.growth > 20 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 193, 7, 0.2)',
                            color: city.growth > 20 ? '#4CAF50' : '#FFC107'
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Market Share:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#2196F3', fontWeight: 'bold' }}>
                          {city.marketShare}%
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const SubscriptionAnalyticsTab = () => (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '450px',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(10px)' 
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                Conversion Rates
              </Typography>
              <Box sx={{ mb: 3 }}>
                {Object.entries(analytics.conversionRates).map(([key, rate]) => (
                  <Box key={key} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace('To', ' → ')}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                        {formatPercentage(rate)}
                      </Typography>
                    </Box>
                    <Box sx={{
                      height: 8,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}>
                      <Box sx={{
                        height: '100%',
                        width: `${rate * 100}%`,
                        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                        borderRadius: 4
                      }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '450px',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(10px)' 
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                Subscription Conversion Funnel
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subscriptionConversionData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="rgba(255,255,255,0.7)" />
                  <YAxis dataKey="tier" type="category" stroke="rgba(255,255,255,0.7)" width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name) => [
                      name === 'rate' ? `${value}%` : `${value} users`,
                      name === 'rate' ? 'Conversion Rate' : 'Total Conversions'
                    ]}
                  />
                  <Bar dataKey="rate" fill="#FF6B35" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const MarketplaceAnalyticsTab = () => (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '450px',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(10px)' 
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                Product Category Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={productCategoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {productCategoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`${value}%`, 'Market Share']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '450px',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(10px)' 
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                Top Performing Products
              </Typography>
              <Box>
                {analytics.topPerformingProducts.slice(0, 5).map((product) => (
                  <Box key={product.id} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    mb: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <Box>
                      <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {product.brand} • {product.reviews} reviews
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body1" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                        R{product.price.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {product.rating}⭐
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 50%, #190F32 100%)',
      position: 'relative',
      pt: 10
    }}>
      <ParticleBackground />
      
      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' },
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
              Revenue Analytics
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
              Comprehensive business intelligence & insights
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  label="Time Range"
                  onChange={(e) => setTimeRange(e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FF6B35' }
                  }}
                >
                  <MenuItem value="1month">1 Month</MenuItem>
                  <MenuItem value="3months">3 Months</MenuItem>
                  <MenuItem value="6months">6 Months</MenuItem>
                  <MenuItem value="1year">1 Year</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                startIcon={<Download />}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'rgba(255,255,255,0.7)',
                  '&:hover': {
                    borderColor: '#FF6B35',
                    color: '#FF6B35'
                  }
                }}
              >
                Export
              </Button>
            </Box>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)', mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.7)',
                  '&.Mui-selected': {
                    color: '#FF6B35'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#FF6B35'
                }
              }}
            >
              <Tab label="Overview" />
              <Tab label="City Analytics" />
              <Tab label="Subscriptions" />
              <Tab label="Marketplace" />
            </Tabs>
          </Box>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 0 && <OverviewTab />}
              {activeTab === 1 && <CityAnalyticsTab />}
              {activeTab === 2 && <SubscriptionAnalyticsTab />}
              {activeTab === 3 && <MarketplaceAnalyticsTab />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </Container>
    </Box>
  );
};

