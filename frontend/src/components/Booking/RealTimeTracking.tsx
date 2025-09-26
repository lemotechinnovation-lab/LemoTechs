import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  LocationOn,
  DirectionsCar,
  AccessTime,
  CheckCircle,
  Refresh
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRealTimeTracking } from '../../hooks/useSignalR';

interface RealTimeTrackingProps {
  bookingId: string;
  customerName: string;
  pickupLocation: string;
  estimatedArrival?: string;
  onRefresh?: () => void;
}

export const RealTimeTracking: React.FC<RealTimeTrackingProps> = ({
  bookingId,
  customerName,
  pickupLocation,
  estimatedArrival,
  onRefresh
}) => {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  // Get real-time tracking data
  const trackingData = useRealTimeTracking(bookingId);

  // Update last update time when tracking data changes
  useEffect(() => {
    if (trackingData.booking || trackingData.driverLocation) {
      setLastUpdate(new Date());
    }
  }, [trackingData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'primary';
      case 'pickup': return 'warning';
      case 'cleaning': return 'info';
      case 'delivery': return 'secondary';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return '📋';
      case 'pickup': return '🚗';
      case 'cleaning': return '🧽';
      case 'delivery': return '🚚';
      case 'completed': return '✅';
      default: return '📦';
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'confirmed': return 20;
      case 'pickup': return 40;
      case 'cleaning': return 70;
      case 'delivery': return 90;
      case 'completed': return 100;
      default: return 0;
    }
  };

  return (
    <Card elevation={0} sx={{
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      overflow: 'hidden'
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Box>
            <Typography variant="h6" sx={{
              color: 'white',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 700,
              mb: 0.5
            }}>
              📍 Live Tracking
            </Typography>
            <Typography sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.8rem',
              fontFamily: '"Plus Jakarta Sans", sans-serif'
            }}>
              {customerName}
            </Typography>
          </Box>
          
          <Tooltip title="Refresh tracking data">
            <IconButton 
              onClick={onRefresh}
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': { color: '#FF6B35' }
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Current Status */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.9rem',
              fontFamily: '"Plus Jakarta Sans", sans-serif'
            }}>
              Current Status:
            </Typography>
            <Chip
              icon={<CheckCircle sx={{ fontSize: 16 }} />}
              label={`${getStatusIcon(trackingData.booking?.status || 'confirmed')} ${trackingData.booking?.status || 'confirmed'}`}
              color={getStatusColor(trackingData.booking?.status || 'confirmed') as any}
              sx={{
                fontWeight: 600,
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}
            />
          </Box>

          {/* Progress Bar */}
          <Box sx={{ mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={getProgressValue(trackingData.booking?.status || 'confirmed')}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #FF6B35 0%, #4CAF50 100%)',
                  borderRadius: 4
                }
              }}
            />
          </Box>

          {/* Status Message */}
          {trackingData.booking?.message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Typography sx={{
                color: '#FF6B35',
                fontSize: '0.85rem',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 500,
                p: 2,
                borderRadius: 2,
                background: 'rgba(255, 107, 53, 0.1)',
                border: '1px solid rgba(255, 107, 53, 0.2)'
              }}>
                {trackingData.booking.message}
              </Typography>
            </motion.div>
          )}
        </Box>

        {/* Pickup Location */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: 2, 
          mb: 3,
          p: 2,
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <LocationOn sx={{ color: '#FF6B35', mt: 0.5 }} />
          <Box sx={{ flex: 1 }}>
            <Typography sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.8rem',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              mb: 0.5
            }}>
              Pickup Location
            </Typography>
            <Typography sx={{
              color: 'white',
              fontSize: '0.9rem',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 500
            }}>
              {pickupLocation}
            </Typography>
          </Box>
        </Box>

        {/* Driver Location (if available) */}
        {trackingData.driverLocation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 2, 
              mb: 3,
              p: 2,
              borderRadius: 2,
              background: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid rgba(76, 175, 80, 0.2)'
            }}>
              <DirectionsCar sx={{ color: '#4CAF50', mt: 0.5 }} />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{
                  color: 'rgba(76, 175, 80, 0.8)',
                  fontSize: '0.8rem',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  mb: 0.5
                }}>
                  Driver Location
                </Typography>
                <Typography sx={{
                  color: 'white',
                  fontSize: '0.9rem',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 500
                }}>
                  Driver is on the way
                </Typography>
                <Typography sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.75rem',
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                }}>
                  Last updated: {trackingData.driverLocation.timestamp ? 
                    new Date(trackingData.driverLocation.timestamp).toLocaleTimeString() : 
                    'Just now'
                  }
                </Typography>
              </Box>
            </Box>
          </motion.div>
        )}

        {/* Estimated Arrival */}
        {estimatedArrival && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            p: 2,
            borderRadius: 2,
            background: 'rgba(33, 150, 243, 0.1)',
            border: '1px solid rgba(33, 150, 243, 0.2)'
          }}>
            <AccessTime sx={{ color: '#2196F3' }} />
            <Box>
              <Typography sx={{
                color: 'rgba(33, 150, 243, 0.8)',
                fontSize: '0.8rem',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                mb: 0.5
              }}>
                Estimated Arrival
              </Typography>
              <Typography sx={{
                color: 'white',
                fontSize: '0.9rem',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 500
              }}>
                {estimatedArrival}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Last Update */}
        <Box sx={{ 
          mt: 3, 
          pt: 2, 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <Typography sx={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.7rem',
            fontFamily: '"Plus Jakarta Sans", sans-serif'
          }}>
            Last updated: {lastUpdate.toLocaleTimeString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
