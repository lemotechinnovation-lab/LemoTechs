import React, { useState } from 'react';
import { Box, Typography, Button, Card, Grid, Chip, Avatar } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowBack, ArrowForward, CheckCircle } from '@mui/icons-material';
import { BookingStepper } from './BookingStepper';
import { PlacesAutocomplete } from '../Forms/PlacesAutocomplete';
import { Driver, LocationCoordinates, ItemOption } from '../../types/booking';

interface SimpleBookingFormProps {
  onBackToHome: () => void;
  onShowMapView: (show: boolean) => void;
  onLocationChange: (location: string, coords: LocationCoordinates | null) => void;
  onItemsChange: (items: string[]) => void;
  onDriverSelect: (driverId: string) => void;
  showMapView: boolean;
}

const itemOptions: ItemOption[] = [
  { name: 'Sneakers', price: 25, icon: '👟' },
  { name: 'Casual Shoes', price: 20, icon: '👞' },
  { name: 'Suits', price: 35, icon: '🤵' },
  { name: 'Shirts', price: 15, icon: '👔' },
  { name: 'Dresses', price: 30, icon: '👗' },
  { name: 'Jeans', price: 18, icon: '👖' },
  { name: 'Bedding', price: 45, icon: '🛏️' },
  { name: 'Curtains', price: 40, icon: '🪟' },
  { name: 'Other', price: 25, icon: '📦' },
];

const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'Express Service',
    avatar: '⚡',
    rating: 4.9,
    location: 'Fast Pickup',
    estimatedTime: '2-3 hours',
    priceMultiplier: 1.5,
    carModel: 'Same Day Service',
    carType: 'express',
    available: true,
    distance: 'Premium'
  },
  {
    id: '2',
    name: 'Standard Service',
    avatar: '🧽',
    rating: 4.8,
    location: 'Regular Pickup',
    estimatedTime: '4-6 hours',
    priceMultiplier: 1.0,
    carModel: 'Next Day Service',
    carType: 'standard',
    available: true,
    distance: 'Popular'
  },
  {
    id: '3',
    name: 'Premium Service',
    avatar: '✨',
    rating: 4.95,
    location: 'Luxury Care',
    estimatedTime: '6-8 hours',
    priceMultiplier: 2.0,
    carModel: 'Deep Clean + Extras',
    carType: 'luxury',
    available: true,
    distance: 'Best Value'
  }
];

export const SimpleBookingForm: React.FC<SimpleBookingFormProps> = ({
  onBackToHome,
  onShowMapView,
  onLocationChange,
  onItemsChange,
  onDriverSelect,
  showMapView
}) => {
  // State management
  const [currentStep, setCurrentStep] = useState<'location' | 'items' | 'driver' | 'payment' | 'confirmation'>('location');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [pickupLocation, setPickupLocation] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'mobile'>('card');

  // Calculate total price
  const calculateTotal = () => {
    const itemsTotal = selectedItems.reduce((sum, itemName) => {
      const item = itemOptions.find(opt => opt.name === itemName);
      return sum + (item?.price || 0);
    }, 0);

    const driver = mockDrivers.find(d => d.id === selectedDriver);
    const multiplier = driver?.priceMultiplier || 1;
    
    return Math.round(itemsTotal * multiplier);
  };

  // Step navigation
  const handleNext = () => {
    const steps: Array<'location' | 'items' | 'driver' | 'payment' | 'confirmation'> = 
      ['location', 'items', 'driver', 'payment', 'confirmation'];
    
    const currentIndex = steps.indexOf(currentStep);
    const nextStep = steps[currentIndex + 1];
    
    if (nextStep) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(nextStep);
    }
  };

  const handlePrevious = () => {
    const steps: Array<'location' | 'items' | 'driver' | 'payment' | 'confirmation'> = 
      ['location', 'items', 'driver', 'payment', 'confirmation'];
    
    const currentIndex = steps.indexOf(currentStep);
    const prevStep = steps[currentIndex - 1];
    
    if (prevStep) {
      setCompletedSteps(prev => prev.filter(step => step !== currentStep));
      setCurrentStep(prevStep);
    }
  };

  // Step validation
  const canProceed = () => {
    switch (currentStep) {
      case 'location':
        return pickupLocation.length > 0;
      case 'items':
        return selectedItems.length > 0;
      case 'driver':
        return selectedDriver !== null;
      case 'payment':
        return paymentMethod !== null;
      default:
        return true;
    }
  };

  // Handle location selection
  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setPickupLocation(location.address);
    onLocationChange(location.address, { lat: location.lat, lng: location.lng });
    if (!showMapView) {
      onShowMapView(true);
    }
  };

  // Handle item toggle
  const handleItemToggle = (itemName: string) => {
    setSelectedItems(prev => {
      const newItems = prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName];
      onItemsChange(newItems);
      return newItems;
    });
  };

  // Handle driver selection
  const handleDriverSelect = (driverId: string) => {
    setSelectedDriver(driverId);
    onDriverSelect(driverId);
  };

  // Step content render functions
  const renderLocationStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      style={{ 
        width: '100%', 
        maxWidth: '600px',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: '5px' // Move content to very top for maximum dropdown space
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 900,
          fontFamily: '"Inter", sans-serif',
          mb: 1.5,
          fontSize: { xs: '1.1rem', sm: '1.2rem' },
          position: 'relative',
          zIndex: 20,
          background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
          color: '#FFFFFF',
          borderRadius: '14px',
          padding: { xs: '14px 20px', sm: '16px 28px' },
          border: 'none',
          letterSpacing: '0.8px',
          maxWidth: '500px',
          textAlign: 'center',
          lineHeight: 1.4,
          boxShadow: '0 8px 32px rgba(255, 107, 53, 0.4)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, #F7931E 0%, #FF6B35 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px rgba(255, 107, 53, 0.6)'
          }
        }}
      >
        Where should we pick you up?
        <span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', fontWeight: 600, opacity: 0.95, display: 'block', marginTop: '4px' }}>
          Enter your address
        </span>
      </Typography>


      <Box sx={{ 
        position: 'relative', 
        zIndex: 30, // Highest z-index to ensure it's above everything
        width: '100%', 
        maxWidth: '600px',
        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
        borderRadius: '24px',
        padding: '28px',
        border: 'none',
        boxShadow: `
          0 15px 40px rgba(255, 107, 53, 0.4), 
          0 8px 25px rgba(247, 147, 30, 0.3),
          0 20px 60px rgba(0, 0, 0, 0.15)
        `,
        transform: 'scale(1.02)',
        transition: 'all 0.3s ease',
        '&:hover': {
          background: 'linear-gradient(135deg, #F7931E 0%, #FF6B35 100%)',
          transform: 'scale(1.03)',
          boxShadow: `
            0 20px 50px rgba(255, 107, 53, 0.5), 
            0 10px 30px rgba(247, 147, 30, 0.4),
            0 25px 70px rgba(0, 0, 0, 0.2)
          `
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.5) 100%)',
          borderRadius: '20px',
          zIndex: -1
        }
      }}>
        <PlacesAutocomplete
          value={pickupLocation}
          onChange={setPickupLocation}
          onLocationSelect={handleLocationSelect}
          placeholder=""
        />
      </Box>

      {pickupLocation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card sx={{
            background: 'rgba(76, 175, 80, 0.1)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: '12px',
            p: 2,
            mt: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ color: '#4CAF50', mr: 1 }} />
              <Typography sx={{ color: '#4CAF50', fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                Location Selected: {pickupLocation}
              </Typography>
            </Box>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );

  const renderItemsStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      style={{ 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: 0 // Allow shrinking
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: '#1A0B3D',
          fontWeight: 700,
          fontFamily: '"Inter", sans-serif',
          mb: 1,
          fontSize: '1.2rem',
          textAlign: 'center',
          textShadow: 'none'
        }}
      >
        What would you like us to clean?
      </Typography>
      
      <Typography
        sx={{
          color: 'rgba(26, 11, 61, 0.8)',
          fontSize: '0.9rem',
          fontFamily: '"Inter", sans-serif',
          mb: 3,
          textAlign: 'center',
          fontWeight: 400,
          lineHeight: 1.5
        }}
      >
        Select the items you'd like professionally cleaned
      </Typography>

      <Box sx={{ 
        maxHeight: '300px', 
        overflowY: 'auto',
        pr: 1,
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 107, 53, 0.5)',
          borderRadius: '2px',
        },
      }}>
        <Grid container spacing={1.5}>
          {itemOptions.map((item) => (
            <Grid item xs={6} sm={4} md={6} key={item.name}>
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card
                onClick={() => handleItemToggle(item.name)}
                sx={{
                  background: selectedItems.includes(item.name)
                    ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
                    : 'linear-gradient(135deg, rgba(26, 11, 61, 0.05) 0%, rgba(26, 11, 61, 0.02) 100%)',
                  border: selectedItems.includes(item.name)
                    ? '2px solid #FF6B35'
                    : '1px solid rgba(26, 11, 61, 0.15)',
                  borderRadius: '16px',
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: selectedItems.includes(item.name)
                    ? '0 8px 25px rgba(255, 107, 53, 0.3)'
                    : '0 4px 15px rgba(26, 11, 61, 0.08)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: selectedItems.includes(item.name)
                      ? 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(247, 147, 30, 0.05) 100%)'
                      : 'transparent',
                    borderRadius: '16px',
                    zIndex: 1,
                    transition: 'all 0.3s ease'
                  },
                  '&:hover': {
                    background: selectedItems.includes(item.name)
                      ? 'linear-gradient(135deg, #F7931E 0%, #FF6B35 100%)'
                      : 'linear-gradient(135deg, rgba(26, 11, 61, 0.08) 0%, rgba(26, 11, 61, 0.05) 100%)',
                    transform: 'translateY(-4px)',
                    boxShadow: selectedItems.includes(item.name)
                      ? '0 12px 35px rgba(255, 107, 53, 0.4)'
                      : '0 8px 25px rgba(26, 11, 61, 0.12)',
                    border: selectedItems.includes(item.name)
                      ? '2px solid #F7931E'
                      : '1px solid rgba(26, 11, 61, 0.25)'
                  }
                }}
              >
                <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                  <Typography sx={{ 
                    fontSize: '2rem', 
                    mb: 1,
                    filter: selectedItems.includes(item.name) ? 'drop-shadow(0 2px 4px rgba(255, 107, 53, 0.3))' : 'none'
                  }}>
                    {item.icon}
                  </Typography>
                  <Typography
                    sx={{
                      color: selectedItems.includes(item.name) ? '#FFFFFF' : '#1A0B3D',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      mb: 0.5,
                      fontFamily: '"Inter", sans-serif'
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: selectedItems.includes(item.name) ? '#FFD700' : '#FF6B35',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      fontFamily: '"Inter", sans-serif'
                    }}
                  >
                    R{item.price}
                  </Typography>
                </Box>
              </Card>
            </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {selectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Card sx={{
            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
            border: '2px solid #FF6B35',
            borderRadius: '12px',
            p: 1.5,
            mt: 2,
            position: 'relative',
            boxShadow: '0 6px 20px rgba(255, 107, 53, 0.3)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(247, 147, 30, 0.02) 100%)',
              borderRadius: '12px',
              zIndex: 1
            }
          }}>
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Typography sx={{ 
                color: '#FFD700', 
                fontWeight: 700, 
                mb: 1,
                fontSize: '0.95rem',
                fontFamily: '"Inter", sans-serif',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #FFD700 0%, #FF6B35 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                ✨ Selected Items ({selectedItems.length})
            </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1, 
                justifyContent: 'center',
                maxHeight: '120px', // Limit height for selected items
                overflowY: 'auto', // Add scroll when needed
                pr: 1,
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '2px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: '2px',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.8)',
                  }
                },
              }}>
              {selectedItems.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  onDelete={() => handleItemToggle(item)}
                  size="small"
                  sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#1A0B3D',
                      fontWeight: 600,
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.8rem',
                      borderRadius: '10px',
                      transition: 'all 0.2s ease',
                      height: '28px',
                    '& .MuiChip-deleteIcon': {
                        color: '#FF6B35',
                        fontSize: '16px',
                        '&:hover': {
                          color: '#FF5722'
                        }
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        transform: 'scale(1.05)'
                    }
                  }}
                />
              ))}
              </Box>
            </Box>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );

  const renderDriverStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Typography
        variant="h4"
        sx={{
          color: '#1A0B3D',
          fontWeight: 700,
          fontFamily: '"Inter", sans-serif',
          mb: 1,
          fontSize: '1.2rem',
          textAlign: 'center'
        }}
      >
        Choose your service level
      </Typography>
      
      <Typography
        sx={{
          color: 'rgba(26, 11, 61, 0.8)',
          fontSize: '0.9rem',
          fontFamily: '"Inter", sans-serif',
          mb: 4,
          textAlign: 'center',
          fontWeight: 400,
          lineHeight: 1.5
        }}
      >
        Select the cleaning service that best fits your needs
      </Typography>

      <Grid container spacing={3}>
        {mockDrivers.map((driver) => (
          <Grid item xs={12} key={driver.id}>
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card
                onClick={() => handleDriverSelect(driver.id)}
                sx={{
                  background: selectedDriver === driver.id
                    ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
                  border: selectedDriver === driver.id
                    ? '2px solid #FF6B35'
                    : '1px solid rgba(26, 11, 61, 0.15)',
                  borderRadius: '20px',
                  p: 3.5,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: selectedDriver === driver.id
                    ? '0 12px 35px rgba(255, 107, 53, 0.3)'
                    : '0 4px 15px rgba(26, 11, 61, 0.08)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: selectedDriver === driver.id
                      ? 'linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(247, 147, 30, 0.02) 100%)'
                      : 'transparent',
                    borderRadius: '20px',
                    zIndex: 1
                  },
                  '&:hover': {
                    background: selectedDriver === driver.id
                      ? 'linear-gradient(135deg, rgba(255, 107, 53, 0.25) 0%, rgba(247, 147, 30, 0.2) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.12) 100%)',
                    boxShadow: selectedDriver === driver.id
                      ? '0 12px 40px rgba(255, 107, 53, 0.3)'
                      : '0 12px 40px rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar sx={{ 
                      width: 70, 
                      height: 70, 
                      fontSize: '2rem',
                      background: selectedDriver === driver.id 
                        ? 'linear-gradient(135deg, #FF6B35 0%, #FFD700 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: selectedDriver === driver.id
                        ? '0 8px 25px rgba(255, 107, 53, 0.3)'
                        : 'none'
                    }}>
                      {driver.avatar}
                    </Avatar>
                    <Box>
                      <Typography
                        sx={{
                          color: selectedDriver === driver.id ? '#FFFFFF' : '#1A0B3D',
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          mb: 0.5,
                          fontFamily: '"Inter", sans-serif'
                        }}
                      >
                        {driver.name}
                      </Typography>
                      <Typography
                        sx={{
                          color: selectedDriver === driver.id ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 11, 61, 0.8)',
                          fontSize: '0.9rem',
                          mb: 0.5,
                          fontFamily: '"Inter", sans-serif',
                          fontWeight: 500
                        }}
                      >
                        {driver.carModel} • {driver.estimatedTime}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography
                        sx={{
                            color: '#FFD700',
                            fontSize: '0.9rem',
                            fontFamily: '"Inter", sans-serif',
                            fontWeight: 600
                          }}
                        >
                          ⭐ {driver.rating}
                        </Typography>
                        <Typography
                          sx={{
                            color: selectedDriver === driver.id ? '#FFD700' : '#FF6B35',
                            fontSize: '0.85rem',
                            fontFamily: '"Inter", sans-serif',
                            fontWeight: 600,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: '12px',
                            background: selectedDriver === driver.id 
                              ? 'rgba(255, 215, 0, 0.2)' 
                              : 'rgba(255, 107, 53, 0.2)'
                          }}
                        >
                          {driver.distance}
                      </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography
                      sx={{
                        color: selectedDriver === driver.id ? '#FFD700' : '#FF6B35',
                        fontWeight: 800,
                        fontSize: '1.5rem',
                        fontFamily: '"Inter", sans-serif',
                        mb: 0.5
                      }}
                    >
                      R{Math.round(calculateTotal() * driver.priceMultiplier / (selectedDriver ? mockDrivers.find(d => d.id === selectedDriver)?.priceMultiplier || 1 : 1))}
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.85rem',
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500
                      }}
                    >
                      Total estimated
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );

  const renderPaymentStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Typography
        variant="h4"
        sx={{
          color: '#1A0B3D',
          fontWeight: 700,
          fontFamily: '"Inter", sans-serif',
          mb: 1,
          fontSize: '1.2rem',
          textAlign: 'center'
        }}
      >
        Choose payment method
      </Typography>
      
      <Typography
        sx={{
          color: 'rgba(26, 11, 61, 0.8)',
          fontSize: '0.9rem',
          fontFamily: '"Inter", sans-serif',
          mb: 4,
          textAlign: 'center',
          fontWeight: 400,
          lineHeight: 1.5
        }}
      >
        Secure payment processing for your peace of mind
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { 
            id: 'card', 
            icons: ['💳', '💰'], 
            primaryIcon: '💳',
            label: 'Card',
            tooltip: 'Credit/Debit Card - Visa, Mastercard, American Express' 
          },
          { 
            id: 'mobile', 
            icons: ['📱', '💸'], 
            primaryIcon: '📱',
            label: 'Mobile',
            tooltip: 'Mobile Payment - Apple Pay, Google Pay, Samsung Pay' 
          },
          { 
            id: 'cash', 
            icons: ['💵', '🤝'], 
            primaryIcon: '💵',
            label: 'Cash',
            tooltip: 'Cash on Delivery - Pay when we collect your items' 
          }
        ].map((method) => (
          <Grid item xs={4} key={method.id}>
            <Card
              onClick={() => setPaymentMethod(method.id as any)}
              title={method.tooltip}
              sx={{
                background: paymentMethod === method.id
                  ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
                border: paymentMethod === method.id
                  ? '3px solid #FF6B35'
                  : '2px solid rgba(26, 11, 61, 0.15)',
                borderRadius: '16px',
                p: { xs: 2, sm: 3 },
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: paymentMethod === method.id
                  ? '0 12px 35px rgba(255, 107, 53, 0.4)'
                  : '0 6px 20px rgba(26, 11, 61, 0.1)',
                minHeight: { xs: '100px', sm: '120px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  background: paymentMethod === method.id
                    ? 'linear-gradient(135deg, #F7931E 0%, #FF6B35 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
                  transform: 'translateY(-4px) scale(1.02)',
                  boxShadow: paymentMethod === method.id
                    ? '0 16px 45px rgba(255, 107, 53, 0.5)'
                    : '0 12px 35px rgba(26, 11, 61, 0.15)',
                  border: paymentMethod === method.id
                    ? '3px solid #F7931E'
                    : '2px solid rgba(255, 107, 53, 0.3)'
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: paymentMethod === method.id
                    ? 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%)'
                    : 'radial-gradient(circle at center, rgba(255, 107, 53, 0.05) 0%, transparent 70%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  zIndex: 1
                },
                '&:hover::before': {
                  opacity: 1
                }
              }}
            >
              <Box sx={{ 
                textAlign: 'center', 
                position: 'relative', 
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1
              }}>
                {/* Primary Icon */}
                <Typography sx={{ 
                  fontSize: { xs: '2.5rem', sm: '3rem' }, 
                  filter: paymentMethod === method.id 
                    ? 'drop-shadow(0 6px 12px rgba(255, 255, 255, 0.4))' 
                    : 'drop-shadow(0 4px 8px rgba(26, 11, 61, 0.2))',
                  transition: 'all 0.3s ease',
                  transform: paymentMethod === method.id ? 'scale(1.1)' : 'scale(1)'
                }}>
                  {method.primaryIcon}
                </Typography>
                
                {/* Secondary Icons Row */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 0.5,
                  opacity: paymentMethod === method.id ? 1 : 0.6,
                  transition: 'opacity 0.3s ease'
                }}>
                  {method.icons.filter(icon => icon !== method.primaryIcon).map((icon, index) => (
                    <Typography key={index} sx={{ 
                      fontSize: { xs: '1rem', sm: '1.2rem' },
                      filter: 'drop-shadow(0 2px 4px rgba(26, 11, 61, 0.1))'
                    }}>
                      {icon}
                    </Typography>
                  ))}
                </Box>

                {/* One-word Label */}
                <Typography sx={{
                    color: paymentMethod === method.id ? '#FFFFFF' : '#1A0B3D',
                    fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                  fontFamily: '"Inter", sans-serif',
                  opacity: 0.9,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  {method.label}
                </Typography>

                {/* Selection Indicator */}
                {paymentMethod === method.id && (
                  <Box sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.5)',
                    animation: 'pulse 2s infinite'
                  }} />
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Enhanced Order Summary - Always Visible */}
      <Card sx={{
        background: 'linear-gradient(135deg, rgba(26, 11, 61, 0.08) 0%, rgba(26, 11, 61, 0.04) 100%)',
        border: '2px solid rgba(255, 107, 53, 0.15)',
        borderRadius: '20px',
        p: { xs: 2, sm: 3 },
        mt: 2,
        mb: 2,
        boxShadow: '0 8px 32px rgba(255, 107, 53, 0.1)',
        position: 'relative',
        maxHeight: '300px',
        overflow: 'visible',
        '@keyframes pulse': {
          '0%': {
            opacity: 1,
            transform: 'scale(1)'
          },
          '50%': {
            opacity: 0.7,
            transform: 'scale(1.1)'
          },
          '100%': {
            opacity: 1,
            transform: 'scale(1)'
          }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.02) 0%, rgba(247, 147, 30, 0.01) 100%)',
          borderRadius: '20px',
          zIndex: 1
        }
      }}>
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          {/* Compact Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontSize: '1.3rem', mr: 1 }}>📋</Typography>
            <Typography
              sx={{
                color: '#1A0B3D',
                fontWeight: 700,
                fontSize: '1.1rem',
                fontFamily: '"Inter", sans-serif',
                background: 'linear-gradient(135deg, #1A0B3D 0%, #FF6B35 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Order Summary
            </Typography>
          </Box>
          
          {/* Compact Summary Grid */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 1.5,
            mb: 2
          }}>
          {/* Items Row */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
              p: { xs: 1.5, sm: 2 },
            background: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '10px',
            border: '1px solid rgba(255, 107, 53, 0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '1rem', mr: 1 }}>🧺</Typography>
              <Typography sx={{ 
                color: '#1A0B3D', 
                fontWeight: 600,
                  fontSize: '0.9rem',
                fontFamily: '"Inter", sans-serif'
              }}>
                Items ({selectedItems.length})
              </Typography>
            </Box>
            <Typography sx={{ 
              color: '#1A0B3D', 
              fontWeight: 700,
                fontSize: '1rem',
              fontFamily: '"Inter", sans-serif'
            }}>
              R{selectedItems.reduce((sum, item) => {
                const itemData = itemOptions.find(opt => opt.name === item);
                return sum + (itemData?.price || 0);
              }, 0)}
            </Typography>
          </Box>
          
          {/* Service Level Row */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
              p: { xs: 1.5, sm: 2 },
            background: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '10px',
            border: '1px solid rgba(255, 107, 53, 0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '1rem', mr: 1 }}>
                {mockDrivers.find(d => d.id === selectedDriver)?.avatar || '⚡'}
              </Typography>
              <Typography sx={{ 
                color: '#1A0B3D', 
                fontWeight: 600,
                  fontSize: '0.9rem',
                fontFamily: '"Inter", sans-serif'
              }}>
                  Service
              </Typography>
            </Box>
            <Typography sx={{ 
              color: '#1A0B3D', 
              fontWeight: 600,
                fontSize: '0.85rem',
              fontFamily: '"Inter", sans-serif'
            }}>
              {mockDrivers.find(d => d.id === selectedDriver)?.name || 'Not selected'}
            </Typography>
            </Box>
          </Box>
          
          {/* Total Row */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.15) 0%, rgba(247, 147, 30, 0.08) 100%)',
            borderRadius: '12px',
            p: { xs: 1.5, sm: 2 },
            border: '2px solid rgba(255, 107, 53, 0.2)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '1.2rem', mr: 1 }}>💰</Typography>
              <Typography sx={{ 
                color: '#1A0B3D', 
                fontWeight: 700, 
                fontSize: '1.1rem',
                fontFamily: '"Inter", sans-serif'
              }}>
                Total
              </Typography>
            </Box>
            <Typography sx={{ 
              color: '#FF6B35', 
              fontWeight: 800, 
              fontSize: '1.3rem',
              fontFamily: '"Inter", sans-serif',
              textShadow: '0 2px 4px rgba(255, 107, 53, 0.2)'
            }}>
              R{calculateTotal()}
            </Typography>
          </Box>
        </Box>
      </Card>
    </motion.div>
  );

  return (
    <Box sx={{
      width: { xs: '100%', sm: '100%', md: showMapView ? '420px' : '100%', lg: showMapView ? '450px' : '100%' },
      background: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      pr: { xs: 3, sm: 4, md: 3 }, // Right padding only
      pb: { xs: 1, sm: 1 }, // Reduced bottom padding
      height: '100vh', // Full viewport height since header is hidden
      maxHeight: '100vh', // Constrain to full viewport
      overflow: 'hidden', // Prevent overflow
      // Ensure no debug borders
      '& *': {
        boxSizing: 'border-box',
      },
      '& *:not([data-debug])': {
        border: 'none !important',
        outline: 'none !important',
      }
    }}>
      {/* Stepper */}
      {/* Booking Stepper */}
      <Box sx={{ flexShrink: 0, mb: 1 }}>
        <BookingStepper 
          currentStep={currentStep} 
          completedSteps={completedSteps}

        />
      </Box>

      {/* Step Content */}
      <Card sx={{
        background: currentStep === 'location' ? `
          linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%),
          url('/assets/background-address.png')
        ` : `
          linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.92) 100%)
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: currentStep === 'location' ? 'soft-light' : 'normal',
        backdropFilter: currentStep === 'location' ? 'blur(15px) brightness(1.2)' : 'blur(10px)',
        border: currentStep === 'location' ? '1px solid rgba(139, 69, 255, 0.4)' : '1px solid rgba(255, 107, 53, 0.3)',
        borderRadius: '12px',
        p: { xs: 2, sm: 3 },
        flex: 1,
        overflow: 'auto', // Changed from 'hidden' to 'auto' to allow scrolling
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'relative',
        maxHeight: 'calc(100vh - 160px)',
        paddingTop: '10px',
        minHeight: 0,
        zIndex: 1,
        // Add brighter overlay for better visibility
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%),
            radial-gradient(circle at 20% 80%, rgba(139, 69, 255, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 107, 53, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 20px 20px',
          opacity: 0.9,
          pointerEvents: 'none',
          zIndex: 1,
          borderRadius: '12px'
        },
        // Lighter inner shadow for better visibility
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          pointerEvents: 'none',
          zIndex: 2
        },
        // Ensure content is above all overlays
        '& > *': {
          position: 'relative',
          zIndex: 10
        }
      }}>
        <AnimatePresence mode="wait">
          {currentStep === 'location' && renderLocationStep()}
          {currentStep === 'items' && renderItemsStep()}
          {currentStep === 'driver' && renderDriverStep()}
          {currentStep === 'payment' && renderPaymentStep()}
        </AnimatePresence>
      </Card>

      {/* Navigation Buttons - Always visible at bottom */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        gap: 2,
        pt: 1.5,
        pb: 1.5,
        px: 1,
        flexShrink: 0,
        position: 'sticky',
        bottom: 0,
        background: 'linear-gradient(to top, rgba(26, 16, 64, 0.95) 0%, rgba(37, 20, 84, 0.92) 80%, rgba(37, 20, 84, 0.85) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px 16px 0 0',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
        zIndex: 10 // Ensure buttons are always on top
      }}>
        {currentStep !== 'location' ? (
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handlePrevious}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: '#fff',
              '&:hover': {
                borderColor: '#fff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Previous
          </Button>
        ) : (
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={onBackToHome}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: '#fff',
              '&:hover': {
                borderColor: '#fff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Back to Home
          </Button>
        )}

        {/* Only show continue button when user can proceed or when not on location step */}
        {(currentStep !== 'location' || canProceed()) && (
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={handleNext}
            disabled={!canProceed()}
            sx={{
              background: canProceed() 
                ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
                : 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontWeight: 600,
              px: 4,
              '&:hover': {
                background: canProceed() 
                  ? 'linear-gradient(135deg, #F7931E 0%, #FF6B35 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                transform: canProceed() ? 'translateY(-2px)' : 'none',
                boxShadow: canProceed() ? '0 8px 25px rgba(255, 107, 53, 0.3)' : 'none'
              },
              '&:disabled': {
                color: 'rgba(255, 255, 255, 0.5)'
              }
            }}
          >
            {currentStep === 'payment' ? 'Complete Booking' : 'Continue'}
          </Button>
        )}
      </Box>
    </Box>
  );
};
