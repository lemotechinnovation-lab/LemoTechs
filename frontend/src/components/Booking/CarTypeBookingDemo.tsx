import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { CarTypeSelector } from './CarTypeSelector';
import { Driver } from '../../types/booking';
import { getCarTypeById } from '../../constants/carTypes';

// Mock drivers with different car types
const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'James M.',
    avatar: '👨‍💼',
    rating: 4.9,
    location: 'Sandton',
    estimatedTime: '8 min',
    priceMultiplier: 1.0,
    carModel: 'Toyota Camry',
    carType: 'standard',
    available: true,
    distance: '2.1 km'
  },
  {
    id: '2',
    name: 'Sarah K.',
    avatar: '👩‍💼',
    rating: 4.8,
    location: 'Rosebank',
    estimatedTime: '12 min',
    priceMultiplier: 1.1,
    carModel: 'Honda Civic',
    carType: 'premium',
    available: true,
    distance: '3.5 km'
  },
  {
    id: '3',
    name: 'Mike T.',
    avatar: '👨‍🚗',
    rating: 4.95,
    location: 'Hyde Park',
    estimatedTime: '5 min',
    priceMultiplier: 1.2,
    carModel: 'BMW 3 Series',
    carType: 'luxury',
    available: true,
    distance: '1.2 km'
  },
  {
    id: '4',
    name: 'Lisa W.',
    avatar: '👩‍🚗',
    rating: 4.7,
    location: 'Midrand',
    estimatedTime: '3 min',
    priceMultiplier: 1.5,
    carModel: 'Tesla Model 3',
    carType: 'express',
    available: true,
    distance: '0.8 km'
  },
  {
    id: '5',
    name: 'David L.',
    avatar: '👨‍💼',
    rating: 4.6,
    location: 'Fourways',
    estimatedTime: '15 min',
    priceMultiplier: 1.2,
    carModel: 'Ford Transit',
    carType: 'family',
    available: true,
    distance: '4.2 km'
  }
];

interface CarTypeBookingDemoProps {
  onBackToHome: () => void;
}

export const CarTypeBookingDemo: React.FC<CarTypeBookingDemoProps> = ({ onBackToHome }) => {
  const [currentStep, setCurrentStep] = useState<'carType' | 'drivers'>('carType');
  const [selectedCarType, setSelectedCarType] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [basePrice] = useState(30); // Base price for cleaning service

  const handleCarTypeSelect = (carTypeId: string) => {
    setSelectedCarType(carTypeId);
    setTimeout(() => {
      setCurrentStep('drivers');
    }, 300);
  };

  const handleDriverSelect = (driverId: string) => {
    setSelectedDriver(driverId);
  };

  const handleBack = () => {
    if (currentStep === 'drivers') {
      setCurrentStep('carType');
      setSelectedDriver(null);
    } else {
      onBackToHome();
    }
  };

  const filteredDrivers = selectedCarType 
    ? mockDrivers.filter(driver => driver.carType === selectedCarType)
    : [];

  const selectedCarTypeData = selectedCarType ? getCarTypeById(selectedCarType) : null;

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 50%, #190F32 100%)',
      position: 'relative',
      pt: 10
    }}>
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 600,
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              mb: 1
            }}
          >
            {currentStep === 'carType' ? 'Choose Your Service Type' : 'Available Drivers'}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: '"Plus Jakarta Sans", sans-serif'
            }}
          >
            {currentStep === 'carType' 
              ? 'Select a service type to see available drivers'
              : `${filteredDrivers.length} drivers available for ${selectedCarTypeData?.name}`
            }
          </Typography>
        </Box>

        {/* Content */}
        <AnimatePresence mode="wait">
          {currentStep === 'carType' && (
            <motion.div
              key="carType"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CarTypeSelector
                selectedCarType={selectedCarType}
                onCarTypeSelect={handleCarTypeSelect}
                basePrice={basePrice}
              />
            </motion.div>
          )}

          {currentStep === 'drivers' && (
            <motion.div
              key="drivers"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filteredDrivers.map((driver, index) => (
                  <motion.div
                    key={driver.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Paper
                      onClick={() => handleDriverSelect(driver.id)}
                      sx={{
                        p: 3,
                        background: selectedDriver === driver.id
                          ? 'linear-gradient(135deg, rgba(255, 107, 53, 0.15) 0%, rgba(247, 147, 30, 0.1) 100%)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: selectedDriver === driver.id
                          ? '2px solid #FF6B35'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.08)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ fontSize: '2rem' }}>{driver.avatar}</Box>
                          <Box>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                              {driver.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              {driver.carModel} • {driver.distance}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                              ⭐ {driver.rating} • {driver.estimatedTime}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="h6" sx={{ color: '#FF6B35', fontWeight: 700 }}>
                          R{Math.round(basePrice * driver.priceMultiplier)}
                        </Typography>
                      </Box>
                    </Paper>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={handleBack}
            startIcon={<ArrowBack />}
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              textTransform: 'none',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            {currentStep === 'carType' ? 'Back to Home' : 'Back to Service Types'}
          </Button>

          {currentStep === 'drivers' && selectedDriver && (
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              sx={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                color: 'white',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF5722 0%, #FF6B35 100%)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Continue to Payment
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
};
