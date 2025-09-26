import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Grid,
  Tabs,
  Tab,
  Paper,
  Alert,
  CircularProgress,
  Avatar
} from '@mui/material';
import {
  Store,
  CleaningServices,
  Inventory,
  Assessment} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { ParticleBackground } from '../../components/Common/ParticleBackground';
import { 
  OrderList, 
  InventoryManager, 
  ShopAnalytics 
} from '../../components/Shop';
import { 
  CleaningOrder, 
  ShopInventory, 
  shopOrderService 
} from '../../services/shopOrderService';

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
      id={`shop-tabpanel-${index}`}
      aria-labelledby={`shop-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const ShopDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState<CleaningOrder[]>([]);
  const [inventory, setInventory] = useState<ShopInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadShopData();
  }, []);

  const loadShopData = async () => {
    setLoading(true);
    try {
      const [ordersData, inventoryData] = await Promise.all([
        shopOrderService.getCleaningOrders(),
        shopOrderService.getInventory()
      ]);
      setOrders(ordersData);
      setInventory(inventoryData);
    } catch (err) {
      setError('Failed to load shop data');
      console.error('Error loading shop data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderUpdate = (orderId: string, status: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: status as any } : order
    ));
  };

  const handleInventoryUpdate = (itemId: string, quantity: number) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const handleInventoryDelete = (itemId: string) => {
    setInventory(prev => prev.filter(item => item.id !== itemId));
  };

  const handleMessageDriver = (orderId: string) => {
    // This would open a message dialog or redirect to messaging
    console.log('Messaging driver for order:', orderId);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <ParticleBackground />
      
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
          color: 'white',
          py: 4,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 60, height: 60 }}>
                <Store sx={{ fontSize: 30 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  🏪 Shop Dashboard
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Welcome back, {user?.name || 'Shop Manager'}!
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 600 }}>
              Manage your cleaning operations, track inventory, and monitor performance.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Quick Stats */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="primary">
                  {orders.filter(o => o.status === 'in_progress').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Orders
                </Typography>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="success.main">
                  {orders.filter(o => o.status === 'ready_for_pickup').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ready for Pickup
                </Typography>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="warning.main">
                  {inventory.filter(i => i.quantity <= i.minQuantity).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Low Stock Items
                </Typography>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="info.main">
                  {orders.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Orders
                </Typography>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Main Content Tabs */}
        <Paper sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="shop dashboard tabs">
              <Tab 
                icon={<CleaningServices />} 
                label="Orders" 
                iconPosition="start"
              />
              <Tab 
                icon={<Inventory />} 
                label="Inventory" 
                iconPosition="start"
              />
              <Tab 
                icon={<Assessment />} 
                label="Analytics" 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <TabPanel value={activeTab} index={0}>
            <OrderList
              orders={orders}
              onOrderUpdate={handleOrderUpdate}
              onMessageDriver={handleMessageDriver}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <InventoryManager
              inventory={inventory}
              onInventoryUpdate={handleInventoryUpdate}
              onInventoryDelete={handleInventoryDelete}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <ShopAnalytics shopId={user?.id || 'default'} />
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};