import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  useTheme,
  alpha} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LocationOn, 
  Add, 
  AccessTime} from '@mui/icons-material';
import { PlacesAutocomplete } from '../Forms/PlacesAutocomplete';

interface QuickBookingProps {
  onStartBooking: (data: {
    location: string;
    coordinates: { lat: number; lng: number };
    preselectedItems?: string[];
  }) => void;
}

const quickServices = [
  {
    id: 'business-rush',
    name: 'Business Rush',
    description: 'Suit + Shirt + Shoes',
    icon: '💼',
    items: ['suit', 'shirt', 'dress-shoes'],
    price: 95,
    time: '4-6 hours',
    popular: true
  },
  {
    id: 'sneaker-clean',
    name: 'Sneaker Refresh',
    description: 'Deep clean your kicks',
    icon: '👟',
    items: ['sneakers'],
    price: 25,
    time: '2-3 hours',
    trending: true
  },
  {
    id: 'weekend-ready',
    name: 'Weekend Ready',
    description: 'Casual wear bundle',
    icon: '👕',
    items: ['shirt', 'jacket'],
    price: 60,
    time: '3-4 hours'
  },
  {
    id: 'date-night',
    name: 'Date Night',
    description: 'Look your best',
    icon: '🌟',
    items: ['dress', 'jacket', 'bag'],
    price: 120,
    time: '4-5 hours'
  }
];

const recentLocations = [
  { name: 'Home • Sandton', address: '123 Main St, Sandton', coords: { lat: -26.1076, lng: 28.0567 } },
  { name: 'Office • Rosebank', address: '456 Jan Smuts Ave, Rosebank', coords: { lat: -26.1435, lng: 28.0436 } },
  { name: 'Gym • Hyde Park', address: '789 William Nicol Dr, Hyde Park', coords: { lat: -26.1186, lng: 28.0317 } }
];

export const QuickBooking: React.FC<QuickBookingProps> = ({ onStartBooking }) => {
  const theme = useTheme();
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [location, setLocation] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleServiceSelect = (service: typeof quickServices[0]) => {
    setSelectedService(service.id);
    setShowLocationInput(true);
  };

  const handleLocationSelect = (address: string, coords: { lat: number; lng: number }) => {
    const service = quickServices.find(s => s.id === selectedService);
    onStartBooking({
      location: address,
      coordinates: coords,
      preselectedItems: service?.items
    });
  };

  const handleRecentLocationSelect = (recentLocation: typeof recentLocations[0]) => {
    const service = quickServices.find(s => s.id === selectedService);
    onStartBooking({
      location: recentLocation.address,
      coordinates: recentLocation.coords,
      preselectedItems: service?.items
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
          What needs cleaning?
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Choose a service or create custom
        </Typography>
      </Box>

      {/* Quick Services Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
        gap: 2, 
        mb: 4 
      }}>
        {quickServices.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: selectedService === service.id ? 2 : 1,
                borderColor: selectedService === service.id 
                  ? theme.palette.primary.main 
                  : 'rgba(255,255,255,0.1)',
                bgcolor: selectedService === service.id 
                  ? alpha(theme.palette.primary.main, 0.1)
                  : 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(255,107,53,0.3)'
                }
              }}
              onClick={() => handleServiceSelect(service)}
            >
              {service.popular && (
                <Chip
                  label="Popular"
                  size="small"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    fontSize: '0.7rem'
                  }}
                />
              )}
              {service.trending && (
                <Chip
                  label="Trending"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    fontSize: '0.7rem',
                    bgcolor: '#4CAF50',
                    color: 'white'
                  }}
                />
              )}
              
              <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ mb: 1.5 }}>
                  {service.icon}
                </Typography>
                <Typography variant="h6" sx={{ color: 'white', mb: 0.5 }}>
                  {service.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                  {service.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                    R{service.price}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    <AccessTime sx={{ fontSize: 12, mr: 0.5 }} />
                    {service.time}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* Custom Booking Option */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card
          sx={{
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            bgcolor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '2px dashed rgba(255,255,255,0.3)',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.05)
            }
          }}
          onClick={() => setShowLocationInput(true)}
        >
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Add sx={{ fontSize: 40, color: 'rgba(255,255,255,0.5)', mb: 1 }} />
            <Typography variant="h6" sx={{ color: 'white', mb: 0.5 }}>
              Custom Service
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Choose your own items
            </Typography>
          </CardContent>
        </Card>
      </motion.div>

      {/* Location Input Overlay */}
      <AnimatePresence>
        {showLocationInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.8)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              style={{ width: '100%', maxWidth: 400 }}
            >
              <Card sx={{ 
                bgcolor: 'rgba(255,255,255,0.95)', 
                backdropFilter: 'blur(20px)' 
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Where should we collect?
                  </Typography>
                  
                  {/* Recent Locations */}
                  {recentLocations.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Recent locations
                      </Typography>
                      {recentLocations.map((loc, index) => (
                        <Button
                          key={index}
                          variant="outlined"
                          fullWidth
                          sx={{ 
                            mb: 1, 
                            justifyContent: 'flex-start',
                            textAlign: 'left'
                          }}
                          startIcon={<LocationOn />}
                          onClick={() => handleRecentLocationSelect(loc)}
                        >
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {loc.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {loc.address}
                            </Typography>
                          </Box>
                        </Button>
                      ))}
                    </Box>
                  )}

                  <PlacesAutocomplete
                    value={location}
                    onChange={setLocation}
                    onLocationSelect={(locationData) => {
                      handleLocationSelect(locationData.address, {
                        lat: locationData.lat,
                        lng: locationData.lng
                      });
                    }}
                    placeholder="Enter new address"
                  />

                  <Button
                    variant="text"
                    fullWidth
                    onClick={() => setShowLocationInput(false)}
                    sx={{ mt: 2 }}
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};
