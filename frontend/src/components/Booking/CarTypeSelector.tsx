import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import { motion } from 'framer-motion';
import { CarType } from '../../types/booking';
import { CAR_TYPES } from '../../constants/carTypes';

interface CarTypeSelectorProps {
  selectedCarType: string | null;
  onCarTypeSelect: (carTypeId: string) => void;
  basePrice?: number;
}

export const CarTypeSelector: React.FC<CarTypeSelectorProps> = ({
  selectedCarType,
  onCarTypeSelect,
  basePrice = 0
}) => {
  const theme = useTheme();

  const calculatePrice = (carType: CarType) => {
    return Math.round(basePrice * carType.priceMultiplier);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h6"
        sx={{
          color: 'white',
          fontWeight: 600,
          mb: 2,
          fontFamily: '"Plus Jakarta Sans", sans-serif'
        }}
      >
        Choose Your Service Type
      </Typography>
      
      <Typography
        variant="body2"
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          mb: 3,
          fontFamily: '"Plus Jakarta Sans", sans-serif'
        }}
      >
        Select a service type to see available drivers
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {CAR_TYPES.map((carType, index) => {
          const isSelected = selectedCarType === carType.id;
          const price = calculatePrice(carType);
          
          return (
            <motion.div
              key={carType.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                onClick={() => onCarTypeSelect(carType.id)}
                sx={{
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(255, 107, 53, 0.15) 0%, rgba(247, 147, 30, 0.1) 100%)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: isSelected
                    ? '2px solid #FF6B35'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(247, 147, 30, 0.15) 100%)'
                      : 'rgba(255, 255, 255, 0.08)',
                    borderColor: isSelected ? '#FF6B35' : 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: isSelected
                      ? '0 8px 25px rgba(255, 107, 53, 0.3)'
                      : '0 4px 15px rgba(0, 0, 0, 0.1)'
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: isSelected
                      ? 'linear-gradient(90deg, #FF6B35 0%, #F7931E 100%)'
                      : 'transparent',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Left side - Icon and details */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <Box
                        sx={{
                          fontSize: '2rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '50px',
                          height: '50px',
                          borderRadius: '12px',
                          background: isSelected
                            ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
                            : 'rgba(255, 255, 255, 0.1)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {carType.icon}
                      </Box>
                      
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: 'white',
                              fontWeight: 600,
                              fontFamily: '"Plus Jakarta Sans", sans-serif',
                              fontSize: '1.1rem'
                            }}
                          >
                            {carType.name}
                          </Typography>
                          
                          {carType.popular && (
                            <Chip
                              label="Popular"
                              size="small"
                              sx={{
                                height: '20px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                                color: 'white',
                                '& .MuiChip-label': { px: 1 }
                              }}
                            />
                          )}
                        </Box>
                        
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            fontSize: '0.85rem',
                            mb: 1
                          }}
                        >
                          {carType.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontFamily: '"Plus Jakarta Sans", sans-serif',
                              fontSize: '0.75rem'
                            }}
                          >
                            ⏱️ {carType.estimatedTime}
                          </Typography>
                          
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontFamily: '"Plus Jakarta Sans", sans-serif',
                              fontSize: '0.75rem'
                            }}
                          >
                            👥 Up to {carType.capacity} items
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    {/* Right side - Price */}
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: isSelected ? '#FF6B35' : 'white',
                          fontWeight: 700,
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontSize: '1.2rem'
                        }}
                      >
                        R{price}
                      </Typography>
                      {basePrice > 0 && carType.priceMultiplier !== 1 && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            fontSize: '0.7rem'
                          }}
                        >
                          {carType.priceMultiplier > 1 ? '+' : ''}{Math.round((carType.priceMultiplier - 1) * 100)}%
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  
                  {/* Features */}
                  <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {carType.features.slice(0, 3).map((feature, featureIndex) => (
                      <Chip
                        key={featureIndex}
                        label={feature}
                        size="small"
                        sx={{
                          height: '22px',
                          fontSize: '0.7rem',
                          background: alpha(theme.palette.primary.main, 0.1),
                          color: 'rgba(255, 255, 255, 0.8)',
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                          '& .MuiChip-label': { px: 1 }
                        }}
                      />
                    ))}
                    {carType.features.length > 3 && (
                      <Chip
                        label={`+${carType.features.length - 3} more`}
                        size="small"
                        sx={{
                          height: '22px',
                          fontSize: '0.7rem',
                          background: alpha('#ffffff', 0.1),
                          color: 'rgba(255, 255, 255, 0.6)',
                          '& .MuiChip-label': { px: 1 }
                        }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </Box>
    </Box>
  );
};
