import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
// Card sizing utilities (standardized card heights)
import {
  LocationOn,
  Business,
  AttachMoney,
  Launch,
  Timeline
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cityService } from '../../services/cityService';
import { revenueService } from '../../services/revenueService';
import { City, ExpansionPlan } from '../../types/cities';
import { RevenueStream } from '../../types/revenue';

// Mock scaling metrics data
const scalingMetrics = {
  totalCities: 3,
  activeFranchises: 12,
  totalRevenue: 4995000,
  monthlyGrowthRate: 0.22,
  marketPenetration: 0.15,
  expansionROI: 2.8,
  averageTimeToBreakeven: 8.5, // months
  customerAcquisitionCost: 125,
  lifetimeValue: 2850
};

const growthProjection = [
  { month: 'Current', cities: 3, revenue: 4.99, users: 25000 },
  { month: 'Month 3', cities: 5, revenue: 7.2, users: 38000 },
  { month: 'Month 6', cities: 8, revenue: 12.5, users: 65000 },
  { month: 'Month 12', cities: 15, revenue: 28.8, users: 145000 },
  { month: 'Month 18', cities: 25, revenue: 52.5, users: 280000 },
  { month: 'Month 24', cities: 40, revenue: 95.2, users: 485000 }
];

const expansionOpportunities = [
  { 
    city: 'Pretoria', 
    population: 2900000, 
    marketSize: 'R8.5M', 
    competition: 'Medium', 
    investmentRequired: 1200000,
    projectedROI: 3.2,
    timeToLaunch: '4 months',
    riskLevel: 'Low'
  },
  { 
    city: 'Port Elizabeth', 
    population: 1200000, 
    marketSize: 'R4.2M', 
    competition: 'Low', 
    investmentRequired: 800000,
    projectedROI: 4.1,
    timeToLaunch: '3 months',
    riskLevel: 'Low'
  },
  { 
    city: 'Bloemfontein', 
    population: 750000, 
    marketSize: 'R2.8M', 
    competition: 'Low', 
    investmentRequired: 600000,
    projectedROI: 3.8,
    timeToLaunch: '2.5 months',
    riskLevel: 'Medium'
  }
];

export const ScalingMetrics: React.FC = () => {
  const [, setCities] = useState<City[]>([]);
  const [, setExpansionPlans] = useState<ExpansionPlan[]>([]);
  const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [citiesData, expansionData, revenueData] = await Promise.all([
        cityService.getCities(),
        cityService.getExpansionPlans(),
        revenueService.getRevenueStreams()
      ]);
      
      setCities(citiesData);
      setExpansionPlans(expansionData);
      setRevenueStreams(revenueData);
    } catch (error) {
      console.error('Failed to load scaling data:', error);
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `R${(value / 1000000).toFixed(1)}M`;
    }
    return `R${(value / 1000).toFixed(0)}K`;
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#f44336';
      default: return '#757575';
    }
  };

  return (
    <Box>
      {/* Key Scaling Metrics */}
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
                  <LocationOn sx={{ mr: 1 }} />
                  <Typography variant="h6">Active Cities</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {scalingMetrics.totalCities}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  +5 planned for 2024
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
                  <Business sx={{ mr: 1 }} />
                  <Typography variant="h6">Franchises</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {scalingMetrics.activeFranchises}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Avg ROI: {scalingMetrics.expansionROI}x
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
                  <AttachMoney sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Revenue</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(scalingMetrics.totalRevenue)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  +{(scalingMetrics.monthlyGrowthRate * 100).toFixed(0)}% MoM
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
                  <Timeline sx={{ mr: 1 }} />
                  <Typography variant="h6">Avg Breakeven</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {scalingMetrics.averageTimeToBreakeven}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  months
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Growth Projection Chart */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                24-Month Growth Projection
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={growthProjection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#FF6B35" fill="#FF6B35" fillOpacity={0.3} name="Revenue (M)" />
                  <Area type="monotone" dataKey="cities" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.3} name="Cities" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                Revenue Stream Growth
              </Typography>
              <Box>
                {revenueStreams.slice(0, 4).map((stream, index) => (
                  <Box key={stream.id} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {stream.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                        +{(stream.growthRate * 100).toFixed(0)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={stream.growthRate * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: `linear-gradient(135deg, ${['#FF6B35', '#4CAF50', '#2196F3', '#9C27B0'][index]} 0%, ${['#F7931E', '#45a049', '#1976D2', '#7B1FA2'][index]} 100%)`
                        }
                      }}
                    />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
                      {formatCurrency(stream.monthlyRevenue)}/month
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Expansion Opportunities */}
      <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: 'white' }}>
              Top Expansion Opportunities
            </Typography>
            <Button
              variant="contained"
              startIcon={<Launch />}
              sx={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #E55A2B 0%, #E8851A 100%)',
                }
              }}
            >
              Launch Analysis
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>City</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>Population</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>Market Size</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>Investment</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>ROI</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>Timeline</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>Risk</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expansionOpportunities.map((opportunity) => (
                  <TableRow key={opportunity.city} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' } }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                      {opportunity.city}
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {opportunity.population.toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {opportunity.marketSize}
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {formatCurrency(opportunity.investmentRequired)}
                    </TableCell>
                    <TableCell sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                      {opportunity.projectedROI}x
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {opportunity.timeToLaunch}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={opportunity.riskLevel}
                        size="small"
                        sx={{
                          backgroundColor: `${getRiskColor(opportunity.riskLevel)}20`,
                          color: getRiskColor(opportunity.riskLevel),
                          border: `1px solid ${getRiskColor(opportunity.riskLevel)}`
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: '#FF6B35',
                          color: '#FF6B35',
                          '&:hover': {
                            borderColor: '#F7931E',
                            backgroundColor: 'rgba(255, 107, 53, 0.1)'
                          }
                        }}
                      >
                        Analyze
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};
