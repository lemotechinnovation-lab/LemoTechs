import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Container,
} from '@mui/material';
import {
  AttachMoney,
  LocalShipping,
  People,
  Star,
  Dashboard as DashboardIcon,
  Analytics,
  ShoppingCart,
  Schedule,
} from '@mui/icons-material';
import {
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
} from 'recharts';
import { motion } from 'framer-motion';

// Import reusable components

// Import data and utilities
import { revenueData, serviceCategories, driverPerformance, hourlyBookings, weeklyTrends } from '../../features/analytics/data/mockData';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/formatters';
import { ParticleBackground } from '../../components/ui';
import { SectionHeader, MetricCard, ChartCard, GlassCard, TransactionRow } from '../../components';

interface DashboardProps {
  currentPage: string;
}

const Dashboard: React.FC<DashboardProps> = ({ currentPage }) => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [timeFilter, setTimeFilter] = useState('6M');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
      }, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  if (currentPage !== 'dashboard') {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
          {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} Page
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          This page is under development
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1A1040 0%, #251454 50%, #1A1040 100%)',
      position: 'relative',
      p: 0,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <ParticleBackground />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="xl" sx={{ 
          position: 'relative', 
          zIndex: 2, 
          p: 3, 
          pb: 10, 
          flex: 1,
          background: 'rgba(255,255,255,0.01)',
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderTop: 'none',
        }}>
        

        {/* Key Metrics Section */}
        <SectionHeader 
          title="Key Performance Metrics" 
          icon={<DashboardIcon />}
          dividerColor="rgba(255, 107, 53, 0.4)"
        />
        
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 2, 
          mb: 8, // Increased to mb: 6 (48px) for better section separation
          px: 2, // Added horizontal padding
      }}>
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(3120000)}
          change={35}
          icon={<AttachMoney sx={{ fontSize: '1.25rem', color: '#FF6B35' }} />}
          color="#FF6B35"
          delay={0.1}
          trend="up"
          threshold={{ value: 2500000, type: 'minimum' }}
          subtitle="This month"
          trendPeriod="vs last month"
        />
        
        <MetricCard
          title="Active Bookings"
          value={47}
          change={12}
          icon={<LocalShipping sx={{ fontSize: '1.25rem', color: '#F7931E' }} />}
          color="#F7931E"
          delay={0.2}
          trend="up"
          threshold={{ value: 60, type: 'maximum' }}
          subtitle="In progress"
          trendPeriod="vs yesterday"
        />
        
        <MetricCard
          title="Online Drivers"
          value={89}
          change={8}
          icon={<People sx={{ fontSize: '1.25rem', color: '#FF6B35' }} />}
          color="#FF6B35"
          delay={0.3}
          trend="up"
          threshold={{ value: 100, type: 'target' }}
          subtitle="Currently available"
          trendPeriod="vs last week"
        />
        
        <MetricCard
          title="Customer Rating"
          value={4.7}
          change={5}
          icon={<Star sx={{ fontSize: '1.25rem', color: '#F7931E' }} />}
          color="#F7931E"
          delay={0.4}
          trend="up"
          threshold={{ value: 4.5, type: 'minimum' }}
          subtitle="Out of 5.0"
          trendPeriod="vs last month"
        />
      </Box>

        {/* Section Divider */}
        <Box sx={{ 
          height: '1px', 
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 80%, transparent 100%)',
          my: 3,
        }} />

        {/* Analytics Section */}
        <SectionHeader 
          title="Analytics & Insight(s)" 
          icon={<Analytics />}
          dividerColor="rgba(51, 255, 224, 0.4)"
        />

        {/* Main Content Grid - Monthly Earnings and Service Categories */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
        gap: 2, 
          mb: 8, // Consistent 48px spacing for better section separation
          px: 2, // Added horizontal padding
      }}>
          {/* Monthly Earnings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
            <ChartCard
              title="Monthly Earnings"
              height={400}
              hoverColor="#FF6B35"
              showControls={true}
              timeFilter={timeFilter}
              onTimeFilterChange={setTimeFilter}
              autoRefresh={autoRefresh}
              onAutoRefreshToggle={() => setAutoRefresh(!autoRefresh)}
            >
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={revenueData}>
                  <defs>
                    <linearGradient id="shoeCleaningGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FF6B35" stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="laundryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00B8D9" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#00B8D9" stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="dryCleaningGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9C27B0" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#9C27B0" stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="totalEarningsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} tickFormatter={(value) => `R${(value / 1000000).toFixed(1)}M`} />
                  <RechartsTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const totalEarnings = payload.find(p => p.dataKey === 'totalEarnings')?.value as number;
                        const shoeCleaning = payload.find(p => p.dataKey === 'shoeCleaning')?.value as number;
                        const laundry = payload.find(p => p.dataKey === 'laundry')?.value as number;
                        const dryCleaning = payload.find(p => p.dataKey === 'dryCleaning')?.value as number;
                        
                        return (
                          <Box sx={{
                            background: 'linear-gradient(135deg, rgba(28, 27, 58, 0.95) 0%, rgba(40, 38, 85, 0.9) 100%)',
                            border: '1px solid rgba(51, 255, 224, 0.4)',
                      borderRadius: '12px',
                            p: 2,
                            backdropFilter: 'blur(15px)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                            minWidth: 220
                          }}>
                            <Typography sx={{ color: '#33FFE0', fontWeight: 600, mb: 2, fontSize: '0.9rem' }}>
                              {label} - Service Breakdown
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              {/* Total Earnings */}
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                p: 1,
                                background: 'rgba(76, 175, 80, 0.1)',
                                borderRadius: '6px'
                              }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Box sx={{ width: 10, height: 2, background: '#4CAF50', borderRadius: '1px' }} />
                                  <Typography sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>Total</Typography>
                                </Box>
                                <Typography sx={{ color: '#4CAF50', fontWeight: 700, fontSize: '0.85rem' }}>
                                  R{(totalEarnings / 1000000).toFixed(1)}M
                                </Typography>
                              </Box>
                              
                              {/* Service Categories */}
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 8, height: 8, background: '#FF6B35', borderRadius: '50%' }} />
                                    <Typography sx={{ color: 'white', fontSize: '0.75rem' }}>Shoe Cleaning</Typography>
                                  </Box>
                                  <Typography sx={{ color: '#FF6B35', fontWPredictedeight: 600, fontSize: '0.8rem' }}>
                                    R{(shoeCleaning / 1000000).toFixed(1)}M
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 8, height: 8, background: '#00B8D9', borderRadius: '50%' }} />
                                    <Typography sx={{ color: 'white', fontSize: '0.75rem' }}>Laundry</Typography>
                                  </Box>
                                  <Typography sx={{ color: '#00B8D9', fontWeight: 600, fontSize: '0.8rem' }}>
                                    R{(laundry / 1000000).toFixed(1)}M
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 8, height: 8, background: '#9C27B0', borderRadius: '50%' }} />
                                    <Typography sx={{ color: 'white', fontSize: '0.75rem' }}>Dry Cleaning</Typography>
                                  </Box>
                                  <Typography sx={{ color: '#9C27B0', fontWeight: 600, fontSize: '0.8rem' }}>
                                    R{(dryCleaning / 1000000).toFixed(1)}M
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* Service Category Bars */}
                  <Bar dataKey="shoeCleaning" fill="url(#shoeCleaningGradient)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="laundry" fill="url(#laundryGradient)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="dryCleaning" fill="url(#dryCleaningGradient)" radius={[2, 2, 0, 0]} />
                  
                  {/* Total Earnings Line */}
                  <Line
                    type="monotone"
                    dataKey="totalEarnings"
                    stroke="#4CAF50"
                    strokeWidth={4}
                    dot={{ fill: '#4CAF50', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: '#4CAF50', strokeWidth: 3, fill: 'white' }}
                  />
                  
                  {/* Predicted Earnings Area */}
                  <Area
                    type="monotone"
                    dataKey="predicted"
                    stroke="#90A4AE"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="rgba(144, 164, 174, 0.1)"
                    dot={{ fill: '#90A4AE', strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 5, stroke: '#90A4AE', strokeWidth: 2, fill: 'white' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
              
              {/* Legend */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mt: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 8, background: '#FF6B35', borderRadius: '2px' }} />
                  <Typography variant="caption" sx={{ color: '#FF6B35', fontSize: '0.7rem', fontWeight: 600 }}>
                    Shoe Cleaning
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 8, background: '#00B8D9', borderRadius: '2px' }} />
                  <Typography variant="caption" sx={{ color: '#00B8D9', fontSize: '0.7rem', fontWeight: 600 }}>
                    Laundry
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 8, background: '#9C27B0', borderRadius: '2px' }} />
                  <Typography variant="caption" sx={{ color: '#9C27B0', fontSize: '0.7rem', fontWeight: 600 }}>
                    Dry Cleaning
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 3, background: '#4CAF50', borderRadius: '1px' }} />
                  <Typography variant="caption" sx={{ color: '#4CAF50', fontSize: '0.7rem', fontWeight: 600 }}>
                    Total Earning(s)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ 
                    width: 12, 
                    height: 2, 
                    background: '#90A4AE', 
                    borderRadius: '1px',
                    backgroundImage: 'repeating-linear-gradient(90deg, #90A4AE 0px, #90A4AE 3px, transparent 3px, transparent 6px)'
                  }} />
                  <Typography variant="caption" sx={{ color: '#90A4AE', fontSize: '0.7rem', fontWeight: 600 }}>
                    Predicted
                  </Typography>
                </Box>
              </Box>
            </ChartCard>
            </motion.div>

          {/* Service Categories */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
            <ChartCard
              title="Service Categories"
              height={400}
              hoverColor="#33FFE0"
            >
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={serviceCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={2}
                  >
                    {serviceCategories.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke={entry.color}
                        strokeWidth={2}
                        style={{
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const percent = data.value;
                        const name = data.name;
                        
                        // Calculate growth rate (mock data - in real app this would come from your data)
                        const growthRate = Math.random() * 20 - 10; // Random between -10% and +10%
                        
                        return (
                          <Box sx={{
                            background: 'linear-gradient(135deg, rgba(28, 27, 58, 0.95) 0%, rgba(40, 38, 85, 0.9) 100%)',
                            border: `1px solid ${data.color}40`,
                      borderRadius: '12px',
                            p: 2,
                            backdropFilter: 'blur(15px)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                            minWidth: 180
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Box sx={{ 
                                width: 12, 
                                height: 12, 
                                background: data.color, 
                                borderRadius: '50%',
                                boxShadow: `0 0 8px ${data.color}60`
                              }} />
                              <Typography sx={{ 
                                color: data.color, 
                                fontWeight: 600, 
                                fontSize: '0.9rem' 
                              }}>
                                {name}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>
                                  Share
                                </Typography>
                                <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>
                                  {percent}%
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>
                                  Growth
                                </Typography>
                                <Typography sx={{ 
                                  color: growthRate >= 0 ? '#4CAF50' : '#F44336', 
                                  fontWeight: 600, 
                                  fontSize: '0.8rem' 
                                }}>
                                  {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
                
                {/* Legend */}
                <Box sx={{ mt: 2 }}>
                  {serviceCategories.map((category, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ width: 12, height: 12, backgroundColor: category.color, borderRadius: '50%', mr: 1 }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>
                        {category.name} {category.value}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
            </ChartCard>
        </motion.div>
        </Box>

        {/* Section Divider */}
        <Box sx={{ 
          height: '1px', 
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 80%, transparent 100%)',
          my: 3,
        }} />

        {/* Operations Section */}
        <SectionHeader 
          title="Operations Overview" 
          icon={<Schedule />}
          dividerColor="rgba(247, 147, 30, 0.4)"
        />

        {/* Second Row - Three Charts */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, 
          gap: 2, 
          mb: 8, // Consistent 48px spacing for better section separation
          px: 2, // Added horizontal padding
        }}>
          {/* Hourly Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <ChartCard
              title="Hourly Bookings"
              height={300}
              hoverColor="#FF6B35"
            >
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={hourlyBookings}>
                  <defs>
                    <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#F7931E" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="rgba(255,255,255,0.7)" 
                    fontSize={10}
                    tickFormatter={(value) => `${value}:00`}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.7)" 
                    fontSize={10}
                    label={{ value: 'Bookings', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'rgba(255,255,255,0.7)' } }}
                  />
                  <RechartsTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const bookings = payload[0].value as number;
                        const hour = label as string;
                        
                        // Determine peak hours (mock logic - in real app this would be calculated)
                        const isPeakHour = parseInt(hour) >= 8 && parseInt(hour) <= 18;
                        const isRushHour = parseInt(hour) >= 17 && parseInt(hour) <= 19;
                        
                        return (
                          <Box sx={{
                            background: 'linear-gradient(135deg, rgba(28, 27, 58, 0.95) 0%, rgba(40, 38, 85, 0.9) 100%)',
                            border: '1px solid rgba(255, 107, 53, 0.4)',
                      borderRadius: '12px',
                            p: 2,
                            backdropFilter: 'blur(15px)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                            minWidth: 160
                          }}>
                            <Typography sx={{ color: '#FF6B35', fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>
                              {hour}:00 - {parseInt(hour) + 1}:00
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>
                                  Bookings
                                </Typography>
                                <Typography sx={{ color: '#FF6B35', fontWeight: 600, fontSize: '0.85rem' }}>
                                  {bookings}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>
                                  Status
                                </Typography>
                                <Typography sx={{ 
                                  color: isRushHour ? '#F44336' : isPeakHour ? '#FF9800' : '#4CAF50', 
                                  fontWeight: 600, 
                                  fontSize: '0.8rem' 
                                }}>
                                  {isRushHour ? 'Rush Hour' : isPeakHour ? 'Peak Hours' : 'Off Peak'}
                                </Typography>
                              </Box>
                              {isPeakHour && (
                                <Box sx={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center',
                                  pt: 1,
                                  borderTop: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>
                                    Avg. Wait Time
                                  </Typography>
                                  <Typography sx={{ color: '#FF9800', fontWeight: 600, fontSize: '0.8rem' }}>
                                    {Math.round(Math.random() * 15 + 5)} min
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="bookings" 
                    fill="url(#bookingGradient)" 
                    radius={[4, 4, 0, 0]}
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(255, 107, 53, 0.3))'
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>

          {/* Weekly Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <ChartCard
              title="Weekly Trends"
              height={300}
              hoverColor="#3DF2C0"
            >
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weeklyTrends}>
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3DF2C0" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3DF2C0" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="day" 
                    stroke="rgba(255,255,255,0.7)" 
                    fontSize={10}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.7)" 
                    fontSize={10}
                    label={{ value: 'Bookings', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'rgba(255,255,255,0.7)' } }}
                  />
                  <RechartsTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const bookings = payload[0]?.value as number;
                        const movingAvg = payload[1]?.value as number;
                        const day = label as string;
                        
                        // Calculate trend direction
                        const trend = movingAvg && bookings ? 
                          ((bookings - movingAvg) / movingAvg * 100) : 0;
                        
                        return (
                          <Box sx={{
                            background: 'linear-gradient(135deg, rgba(28, 27, 58, 0.95) 0%, rgba(40, 38, 85, 0.9) 100%)',
                            border: '1px solid rgba(61, 242, 192, 0.4)',
                      borderRadius: '12px',
                            p: 2,
                            backdropFilter: 'blur(15px)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                            minWidth: 180
                          }}>
                            <Typography sx={{ color: '#3DF2C0', fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>
                              {day}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Box sx={{ width: 8, height: 8, background: '#3DF2C0', borderRadius: '50%' }} />
                                  <Typography sx={{ color: 'white', fontSize: '0.8rem' }}>Bookings</Typography>
                                </Box>
                                <Typography sx={{ color: '#3DF2C0', fontWeight: 600, fontSize: '0.85rem' }}>
                                  {bookings}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Box sx={{ 
                                    width: 8, 
                                    height: 8, 
                                    background: '#FF6B35', 
                                    borderRadius: '50%',
                                    opacity: 0.7
                                  }} />
                                  <Typography sx={{ color: 'white', fontSize: '0.8rem' }}>7-Day Avg</Typography>
                                </Box>
                                <Typography sx={{ color: '#FF6B35', fontWeight: 600, fontSize: '0.85rem' }}>
                                  {movingAvg?.toFixed(0)}
                                </Typography>
                              </Box>
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                pt: 1,
                                borderTop: '1px solid rgba(255,255,255,0.1)'
                              }}>
                                <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>
                                  Trend
                                </Typography>
                                <Typography sx={{ 
                                  color: trend >= 0 ? '#4CAF50' : '#F44336', 
                                  fontWeight: 600, 
                                  fontSize: '0.8rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5
                                }}>
                                  {trend >= 0 ? '↗' : '↘'} {Math.abs(trend).toFixed(1)}%
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* Main Bookings Line */}
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#3DF2C0"
                    strokeWidth={3}
                    dot={{ fill: '#3DF2C0', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3DF2C0', strokeWidth: 2, fill: 'white' }}
                  />
                  {/* Moving Average Line */}
                  <Line
                    type="monotone"
                    dataKey="movingAverage"
                    stroke="#FF6B35"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={{ r: 4, stroke: '#FF6B35', strokeWidth: 2, fill: 'white' }}
                  />
                  {/* Area under the curve for visual appeal */}
                  <Area
                    type="monotone"
                    dataKey="bookings"
                    fill="url(#trendGradient)"
                    stroke="none"
                    opacity={0.3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>

          {/* Driver Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <ChartCard
              title="Top Drivers"
              height={300}
              hoverColor="#33FFE0"
            >
              {/* Sort Controls */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2, justifyContent: 'center' }}>
                {['rating', 'jobs', 'revenue'].map((sortBy) => (
                  <Chip
                    key={sortBy}
                    label={sortBy === 'rating' ? 'Rating' : sortBy === 'jobs' ? 'Jobs' : 'Revenue'}
                    size="small"
                    onClick={() => {
                      // In a real app, this would trigger sorting
                      console.log(`Sort by ${sortBy}`);
                    }}
                sx={{
                      background: 'rgba(51, 255, 224, 0.1)',
                      color: '#33FFE0',
                      border: '1px solid rgba(51, 255, 224, 0.3)',
                      fontSize: '0.65rem',
                      height: '20px',
                      cursor: 'pointer',
                      '&:hover': {
                        background: 'rgba(51, 255, 224, 0.2)',
                        border: '1px solid rgba(51, 255, 224, 0.5)',
                      }
                    }}
                  />
                ))}
              </Box>

              <Box sx={{ height: 180, overflowY: 'auto' }}>
                {driverPerformance.slice(0, 4).map((driver, index) => {
                  // Calculate additional metrics (mock data)
                  const revenue = Math.round(driver.completed * (Math.random() * 200 + 150));
                  const efficiency = Math.round((driver.rating / 5) * 100);
                  
                  return (
                    <Box 
                      key={driver.name} 
                      sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    mb: 1,
                    borderRadius: '8px',
                        background: index === 0 ? 'rgba(51, 255, 224, 0.1)' : 'rgba(255,255,255,0.05)',
                        border: index === 0 ? '1px solid rgba(51, 255, 224, 0.3)' : '1px solid rgba(255,255,255,0.1)',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(51, 255, 224, 0.15)',
                          border: '1px solid rgba(51, 255, 224, 0.4)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(51, 255, 224, 0.2)'
                        }
                      }}
                    >
                      {/* Rank Badge */}
                      <Box sx={{
                        position: 'absolute',
                        top: -6,
                        left: -6,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: index < 3 ? '#000' : '#fff',
                        border: '2px solid rgba(255,255,255,0.1)'
                      }}>
                        {index + 1}
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ 
                          width: 36, 
                          height: 36, 
                          fontSize: '0.8rem', 
                          background: index === 0 ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' : 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                          border: index === 0 ? '2px solid #FFD700' : '2px solid rgba(255,255,255,0.1)'
                        }}>
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box>
                          <Typography variant="body2" sx={{ 
                            color: 'white', 
                            fontSize: '0.8rem', 
                            fontWeight: index === 0 ? 700 : 600 
                          }}>
                          {driver.name}
                            {index === 0 && <Box component="span" sx={{ ml: 1, fontSize: '0.7rem', color: '#FFD700' }}>👑</Box>}
                        </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem' }}>
                            {driver.completed} jobs • R{revenue.toLocaleString()}
                        </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Box sx={{
                              width: 40,
                              height: 4,
                              background: 'rgba(255,255,255,0.2)',
                              borderRadius: '2px',
                              overflow: 'hidden'
                            }}>
                              <Box sx={{
                                width: `${efficiency}%`,
                                height: '100%',
                                background: efficiency >= 80 ? '#4CAF50' : efficiency >= 60 ? '#FF9800' : '#F44336',
                                borderRadius: '2px'
                              }} />
                      </Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem' }}>
                              {efficiency}%
                            </Typography>
                    </Box>
                        </Box>
                      </Box>

                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" sx={{ 
                          color: index === 0 ? '#FFD700' : '#FF6B35', 
                          fontSize: '0.8rem', 
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}>
                        {driver.rating}★
                      </Typography>
                      <Chip
                        label={driver.status}
                        size="small"
                        sx={{
                          background: getStatusColor(driver.status) + '20',
                          color: getStatusColor(driver.status),
                            fontSize: '0.6rem',
                            height: '18px',
                            textTransform: 'capitalize',
                            border: `1px solid ${getStatusColor(driver.status)}30`
                        }}
                      />
                    </Box>
                  </Box>
                  );
                })}
              </Box>
            </ChartCard>
          </motion.div>
      </Box>

        {/* Section Divider */}
        <Box sx={{ 
          height: '1px', 
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 80%, transparent 100%)',
          my: 3,
        }} />

        {/* Transactions Section */}
        <SectionHeader 
          title="Recent Transactions" 
          icon={<ShoppingCart />}
          dividerColor="rgba(255, 107, 53, 0.4)"
        />

        {/* Latest Transactions Table - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <Box sx={{ px: 2, mb: 8 }}> {/* Added consistent spacing wrapper */}
            <GlassCard
              title="Latest Transactions"
              height="auto"
              hoverColor="#33FFE0"
            >
              {/* Transaction Summary */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3,
                p: 2,
                background: 'rgba(51, 255, 224, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(51, 255, 224, 0.1)'
              }}>
                <Box sx={{ display: 'flex', gap: 4 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ color: '#33FFE0', fontSize: '1.5rem', fontWeight: 700 }}>
                      R{driverPerformance.reduce((sum, driver) => sum + driver.earnings, 0).toLocaleString()}
              </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                      Total Today
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ color: '#4CAF50', fontSize: '1.5rem', fontWeight: 700 }}>
                      {driverPerformance.filter(d => d.status === 'completed').length}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                      Successful
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ color: '#FF9800', fontSize: '1.5rem', fontWeight: 700 }}>
                      {driverPerformance.filter(d => d.status === 'pending').length}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                      Pending
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 }
                }}>
                  <Typography sx={{ color: '#33FFE0', fontSize: '0.8rem', fontWeight: 600 }}>
                    See All
                  </Typography>
                  <Typography sx={{ color: '#33FFE0', fontSize: '0.8rem' }}>
                    →
                  </Typography>
                </Box>
              </Box>
              
              {/* Transaction Table */}
              <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ minWidth: 800 }}>
                  {/* Table Header */}
                  <Box sx={{ 
                    display: 'grid', 
                  gridTemplateColumns: '100px 1fr 120px 120px 120px 100px',
                    gap: 2,
                    p: 1.5,
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    mb: 1
                  }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.75rem' }}>ID</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.75rem' }}>Name</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.75rem' }}>Date</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.75rem' }}>Amount</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.75rem' }}>Status</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.75rem' }}>Action</Typography>
                  </Box>
                  
                  {/* Table Rows */}
                  {driverPerformance.map((driver, index) => (
                  <TransactionRow
                      key={driver.name}
                    id={14256 + index}
                    name={driver.name}
                    date="2024-01-15"
                    amount={driver.earnings}
                    status={driver.status}
                    getStatusColor={getStatusColor}
                    formatDate={formatDate}
                    index={index}
                  />
                  ))}
                    </Box>
                  </Box>
            </GlassCard>
          </Box>
        </motion.div>
        </Container>
      </Box>

      {/* Dashboard Footer - Fixed at Bottom (Main Content Area Only) */}
      <Box sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: { xs: 0, md: '280px' }, // Account for sidebar width on desktop
        right: 0, 
        zIndex: 10,
        background: 'linear-gradient(180deg, rgba(26, 16, 64, 0.95) 0%, rgba(37, 20, 84, 0.95) 50%, rgba(26, 16, 64, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderTop: 'none',
        boxShadow: 'none',
      }}>
        <Container maxWidth="xl" sx={{ p: 2, minHeight: '80px' }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
          }}>
            {/* Left Section - Version Info */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '12px',
                  fontWeight: 400,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                  lineHeight: 1.4,
                }}
              >
                LemoTech Admin Dashboard v2.1.0
              </Typography>
                  <Box sx={{
                display: 'flex', 
                alignItems: 'center', 
                gap: 1 
              }}>
                <Box sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  background: '#4caf50',
                  animation: 'pulse 2s infinite'
                }} />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#4caf50',
                    fontSize: '12px',
                    fontWeight: 500,
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                    lineHeight: 1.4,
                  }}
                >
                  System Online
                      </Typography>
                    </Box>
                  </Box>

            {/* Center Section - Quick Stats */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center', 
              gap: 3 
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '12px',
                    fontWeight: 400,
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                    lineHeight: 1.4,
                    display: 'block'
                  }}
                >
                  Active Users
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                    lineHeight: 1.4,
                  }}
                >
                  1,247
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '12px',
                    fontWeight: 400,
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                    lineHeight: 1.4,
                    display: 'block'
                  }}
                >
                  Uptime
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                    lineHeight: 1.4,
                  }}
                >
                  93.9%
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '12px',
                    fontWeight: 400,
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                    lineHeight: 1.4,
                    display: 'block'
                  }}
                >
                  Response Time
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                    lineHeight: 1.4,
                  }}
                >
                  45ms
                </Typography>
              </Box>
            </Box>

            {/* Right Section - Last Updated */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '12px',
                  fontWeight: 400,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                  lineHeight: 1.4,
                }}
              >
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1 
              }}>
                <Box sx={{ 
                  width: 6, 
                  height: 6, 
                  borderRadius: '50%', 
                  background: '#FF6B35' 
                }} />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#FF6B35',
                    fontSize: '12px',
                    fontWeight: 500,
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                    lineHeight: 1.4,
                  }}
                >
                  Live Data
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
