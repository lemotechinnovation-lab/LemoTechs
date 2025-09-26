// React and React-related imports
import React, { useState } from 'react';

// Third-party libraries
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Business,
  TrendingUp,
  LocationOn,
  People,
  AttachMoney,
  Add,
  Visibility
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Absolute imports (from src/)
import { ParticleBackground } from '../../components/Common/ParticleBackground';
import { FRANCHISE_PACKAGES } from '../../services/revenueService';
import { EXPANSION_TARGETS } from '../../services/cityService';

interface FranchiseLocation {
  id: string;
  name: string;
  city: string;
  franchisee: string;
  status: 'active' | 'pending' | 'training' | 'suspended';
  revenue: number;
  growth: number;
  satisfaction: number;
  launchDate: Date;
  territory: string;
  metrics: {
    totalBookings: number;
    activeDrivers: number;
    customerRating: number;
    marketShare: number;
  };
}

const MOCK_FRANCHISES: FranchiseLocation[] = [
  {
    id: 'jhb_sandton',
    name: 'LemoTech Sandton',
    city: 'Johannesburg',
    franchisee: 'Sarah Mitchell',
    status: 'active',
    revenue: 450000,
    growth: 0.18,
    satisfaction: 4.8,
    launchDate: new Date('2024-01-15'),
    territory: 'Sandton, Rosebank, Hyde Park',
    metrics: {
      totalBookings: 1250,
      activeDrivers: 28,
      customerRating: 4.7,
      marketShare: 0.22
    }
  },
  {
    id: 'cpt_city',
    name: 'LemoTech Cape Town Central',
    city: 'Cape Town',
    franchisee: 'Michael Chen',
    status: 'active',
    revenue: 380000,
    growth: 0.25,
    satisfaction: 4.6,
    launchDate: new Date('2024-03-01'),
    territory: 'City Bowl, Sea Point, Green Point',
    metrics: {
      totalBookings: 980,
      activeDrivers: 22,
      customerRating: 4.5,
      marketShare: 0.18
    }
  },
  {
    id: 'durban_north',
    name: 'LemoTech Durban North',
    city: 'Durban',
    franchisee: 'Priya Patel',
    status: 'training',
    revenue: 0,
    growth: 0,
    satisfaction: 0,
    launchDate: new Date('2024-06-15'),
    territory: 'Umhlanga, Ballito, La Lucia',
    metrics: {
      totalBookings: 0,
      activeDrivers: 0,
      customerRating: 0,
      marketShare: 0
    }
  }
];

export const FranchiseDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [franchises] = useState<FranchiseLocation[]>(MOCK_FRANCHISES);
  const [showNewFranchiseDialog, setShowNewFranchiseDialog] = useState(false);
  const [, setSelectedFranchise] = useState<FranchiseLocation | null>(null);

  const totalRevenue = franchises.reduce((sum, f) => sum + f.revenue, 0);
  const averageGrowth = franchises.filter(f => f.status === 'active').reduce((sum, f) => sum + f.growth, 0) / franchises.filter(f => f.status === 'active').length;
  const activeFranchises = franchises.filter(f => f.status === 'active').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'training': return 'warning';
      case 'pending': return 'info';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const FranchiseOverview = () => (
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
                  <Business sx={{ mr: 1 }} />
                  <Typography variant="h6">Active Franchises</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {activeFranchises}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  +2 this quarter
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
                  <AttachMoney sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Revenue</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  R{(totalRevenue / 1000).toFixed(0)}K
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  +{(averageGrowth * 100).toFixed(1)}% growth
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
                  <People sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Drivers</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {franchises.reduce((sum, f) => sum + f.metrics.activeDrivers, 0)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Across all locations
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
                  <TrendingUp sx={{ mr: 1 }} />
                  <Typography variant="h6">Avg Satisfaction</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {(franchises.filter(f => f.status === 'active').reduce((sum, f) => sum + f.satisfaction, 0) / activeFranchises).toFixed(1)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Franchisee rating
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      <Card sx={{ 
        height: '450px',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.05)', 
        backdropFilter: 'blur(10px)' 
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: 'white' }}>
              Franchise Locations
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowNewFranchiseDialog(true)}
              sx={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #E55A2B 0%, #E8851A 100%)',
                }
              }}
            >
              New Franchise
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>Location</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>Franchisee</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>Status</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>Revenue</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>Growth</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>Rating</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {franchises.map((franchise) => (
                  <TableRow key={franchise.id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' } }}>
                    <TableCell sx={{ color: 'white' }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {franchise.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {franchise.territory}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'white' }}>{franchise.franchisee}</TableCell>
                    <TableCell>
                      <Chip
                        label={franchise.status.toUpperCase()}
                        color={getStatusColor(franchise.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'white' }}>
                      R{(franchise.revenue / 1000).toFixed(0)}K
                    </TableCell>
                    <TableCell sx={{ color: franchise.growth > 0 ? '#4CAF50' : '#f44336' }}>
                      {franchise.growth > 0 ? '+' : ''}{(franchise.growth * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell sx={{ color: 'white' }}>
                      {franchise.satisfaction > 0 ? franchise.satisfaction.toFixed(1) : '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => setSelectedFranchise(franchise)}
                        sx={{ color: '#FF6B35' }}
                      >
                        View
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

  const ExpansionPlanning = () => (
    <Box>
      <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
        Expansion Opportunities
      </Typography>

      <Grid container spacing={3}>
        {EXPANSION_TARGETS.map((plan) => (
          <Grid item xs={12} md={6} key={plan.id}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card sx={{ 
                height: '350px',
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(255, 255, 255, 0.05)', 
                backdropFilter: 'blur(10px)'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={{ color: '#FF6B35', mr: 1 }} />
                    <Typography variant="h6" sx={{ color: 'white' }}>
                      {plan.targetCity}
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                    Launch Date: {plan.launchDate.toLocaleDateString()}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Investment Required
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#4CAF50' }}>
                      R{(plan.investmentRequired / 1000000).toFixed(1)}M
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Expected Revenue (Year 1)
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#2196F3' }}>
                      R{(plan.expectedRevenue / 1000000).toFixed(1)}M
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                      Progress
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={plan.milestones.filter(m => m.status === 'completed').length / plan.milestones.length * 100}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
                        }
                      }}
                    />
                  </Box>

                  <Button
                    fullWidth
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
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const FranchisePackages = () => (
    <Box>
      <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
        Franchise Packages
      </Typography>

      <Grid container spacing={3}>
        {FRANCHISE_PACKAGES.map((pkg) => (
          <Grid item xs={12} md={6} key={pkg.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card sx={{ 
                height: '350px',
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(255, 255, 255, 0.05)', 
                backdropFilter: 'blur(10px)',
                border: pkg.id === 'city_franchise' ? '2px solid #FF6B35' : 'none'
              }}>
                <CardContent>
                  <Typography variant="h5" sx={{ color: 'white', mb: 1 }}>
                    {pkg.name}
                  </Typography>
                  
                  {pkg.id === 'city_franchise' && (
                    <Chip
                      label="POPULAR"
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                        color: 'white',
                        mb: 2
                      }}
                    />
                  )}

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                      R{(pkg.investmentRequired / 1000).toFixed(0)}K
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Total Investment
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Territory Type: <strong style={{ color: 'white' }}>{pkg.territory.type}</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Population: <strong style={{ color: 'white' }}>{pkg.territory.population.toLocaleString()}</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Royalty: <strong style={{ color: 'white' }}>{pkg.royaltyPercentage}%</strong>
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                      Projected Revenue
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      Year 1: R{(pkg.projectedRevenue.year1 / 1000000).toFixed(1)}M
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      Year 3: R{(pkg.projectedRevenue.year3 / 1000000).toFixed(1)}M
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #E55A2B 0%, #E8851A 100%)',
                      }
                    }}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
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
              textAlign: 'center',
              mb: 3,
              letterSpacing: '-0.02em'
            }}
          >
            Franchise Management
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              fontWeight: 400,
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              textAlign: 'center',
              maxWidth: '600px',
              mx: 'auto',
              mb: 4,
              lineHeight: 1.6
            }}
          >
            Scale your business across multiple cities
          </Typography>
        </motion.div>

        <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)', mb: 3 }}>
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
            <Tab label="Expansion Planning" />
            <Tab label="Franchise Packages" />
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
            {activeTab === 0 && <FranchiseOverview />}
            {activeTab === 1 && <ExpansionPlanning />}
            {activeTab === 2 && <FranchisePackages />}
          </motion.div>
        </AnimatePresence>
      </Container>

      {/* New Franchise Dialog */}
      <Dialog
        open={showNewFranchiseDialog}
        onClose={() => setShowNewFranchiseDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(20, 20, 20, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>
          New Franchise Application
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Franchisee Name"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Target City</InputLabel>
                <Select
                  label="Target City"
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FF6B35' }
                  }}
                >
                  <MenuItem value="durban">Durban</MenuItem>
                  <MenuItem value="pretoria">Pretoria</MenuItem>
                  <MenuItem value="port_elizabeth">Port Elizabeth</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNewFranchiseDialog(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #E55A2B 0%, #E8851A 100%)',
              }
            }}
          >
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

