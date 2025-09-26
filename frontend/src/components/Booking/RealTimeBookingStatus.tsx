import { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Chip, Card } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  LocalShipping, 
  Person, 
  Schedule,
  Navigation,
  CleaningServices
} from '@mui/icons-material';

interface BookingStatusProps {
  bookingId: string;
  onStatusUpdate?: (status: BookingStatus) => void;
}

export type BookingStatus = 
  | 'confirmed' 
  | 'driver_assigned' 
  | 'driver_en_route' 
  | 'pickup_arrived' 
  | 'items_collected' 
  | 'in_cleaning' 
  | 'ready_for_delivery' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'completed';

interface StatusStep {
  id: BookingStatus;
  label: string;
  description: string;
  icon: React.ReactNode;
  estimatedTime?: string;
  color: string;
}

const statusSteps: StatusStep[] = [
  {
    id: 'confirmed',
    label: 'Booking Confirmed',
    description: 'Your booking has been confirmed and is being processed',
    icon: <CheckCircle />,
    estimatedTime: 'Immediate',
    color: '#4CAF50'
  },
  {
    id: 'driver_assigned',
    label: 'Driver Assigned',
    description: 'A driver has been assigned to your pickup',
    icon: <Person />,
    estimatedTime: '5-10 min',
    color: '#FF9800'
  },
  {
    id: 'driver_en_route',
    label: 'Driver En Route',
    description: 'Driver is on the way to your location',
    icon: <Navigation />,
    estimatedTime: '15-25 min',
    color: '#2196F3'
  },
  {
    id: 'pickup_arrived',
    label: 'Driver Arrived',
    description: 'Driver has arrived at your pickup location',
    icon: <LocalShipping />,
    estimatedTime: 'Now',
    color: '#FF6B35'
  },
  {
    id: 'items_collected',
    label: 'Items Collected',
    description: 'Your items have been collected and are being transported',
    icon: <Schedule />,
    estimatedTime: '30 min',
    color: '#9C27B0'
  },
  {
    id: 'in_cleaning',
    label: 'Being Cleaned',
    description: 'Your items are currently being cleaned',
    icon: <CleaningServices />,
    estimatedTime: '2-4 hours',
    color: '#FF6B35'
  },
  {
    id: 'ready_for_delivery',
    label: 'Ready for Delivery',
    description: 'Cleaning completed, preparing for delivery',
    icon: <CheckCircle />,
    estimatedTime: '1 hour',
    color: '#4CAF50'
  },
  {
    id: 'out_for_delivery',
    label: 'Out for Delivery',
    description: 'Your items are on the way back to you',
    icon: <LocalShipping />,
    estimatedTime: '20-30 min',
    color: '#2196F3'
  },
  {
    id: 'delivered',
    label: 'Delivered',
    description: 'Your items have been delivered successfully',
    icon: <CheckCircle />,
    estimatedTime: 'Complete',
    color: '#4CAF50'
  },
  {
    id: 'completed',
    label: 'Service Complete',
    description: 'Thank you for using LemoTech services!',
    icon: <CheckCircle />,
    estimatedTime: 'Final',
    color: '#FFD700'
  }
];

export const RealTimeBookingStatus = ({ bookingId, onStatusUpdate }: BookingStatusProps) => {
  const [currentStatus, setCurrentStatus] = useState<BookingStatus>('confirmed');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [driverInfo, _setDriverInfo] = useState({
    name: 'John Doe',
    phone: '+27 123 456 789',
    vehicle: 'Toyota Corolla - ABC 123 GP',
    rating: 4.8,
    eta: '15 minutes'
  });

  // Simulate real-time status updates
  useEffect(() => {
    const statusProgression: BookingStatus[] = [
      'confirmed', 'driver_assigned', 'driver_en_route', 'pickup_arrived', 
      'items_collected', 'in_cleaning', 'ready_for_delivery', 'out_for_delivery', 
      'delivered', 'completed'
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < statusProgression.length - 1) {
        currentIndex++;
        const newStatus = statusProgression[currentIndex];
        setCurrentStatus(newStatus);
        setLastUpdated(new Date());
        onStatusUpdate?.(newStatus);
      }
    }, 8000); // Update every 8 seconds for demo

    return () => clearInterval(interval);
  }, [onStatusUpdate]);

  const currentStepIndex = statusSteps.findIndex(step => step.id === currentStatus);
  const progress = ((currentStepIndex + 1) / statusSteps.length) * 100;
  const currentStep = statusSteps[currentStepIndex];

  return (
    <Card sx={{
      p: 3,
      background: 'linear-gradient(135deg, rgba(26, 16, 64, 0.95) 0%, rgba(37, 20, 84, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,107,53,0.2)',
      borderRadius: '16px',
      maxWidth: '600px',
      mx: 'auto'
    }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ 
          color: 'white', 
          fontWeight: 600, 
          mb: 1,
          background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD700 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Live Booking Status
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Booking ID: {bookingId}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
          Last updated: {lastUpdated.toLocaleTimeString()}
        </Typography>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Progress
          </Typography>
          <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 600 }}>
            {Math.round(progress)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.1)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #FF6B35, #F7931E, #FFD700)',
              borderRadius: 4,
            }
          }}
        />
      </Box>

      {/* Current Status */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStatus}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{
            p: 3,
            background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(247,147,30,0.05) 100%)',
            border: '1px solid rgba(255,107,53,0.3)',
            borderRadius: '12px',
            mb: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ 
                mr: 2, 
                color: currentStep.color,
                display: 'flex',
                alignItems: 'center'
              }}>
                {currentStep.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                  {currentStep.label}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {currentStep.description}
                </Typography>
              </Box>
              <Chip
                label={currentStep.estimatedTime}
                size="small"
                sx={{
                  background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
                  color: 'white',
                  fontWeight: 600
                }}
              />
            </Box>
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Driver Info (when applicable) */}
      {['driver_assigned', 'driver_en_route', 'pickup_arrived'].includes(currentStatus) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Box sx={{
            p: 2,
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, fontWeight: 600 }}>
              Driver Information
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'white' }}>
                {driverInfo.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#4CAF50' }}>
                ⭐ {driverInfo.rating}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
              {driverInfo.vehicle}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              📞 {driverInfo.phone}
            </Typography>
            {currentStatus === 'driver_en_route' && (
              <Typography variant="body2" sx={{ color: '#FF6B35', mt: 1, fontWeight: 600 }}>
                🚗 ETA: {driverInfo.eta}
              </Typography>
            )}
          </Box>
        </motion.div>
      )}

      {/* Status Timeline (compact) */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
          Timeline
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {statusSteps.map((step, index) => (
            <Box
              key={step.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                opacity: index <= currentStepIndex ? 1 : 0.3,
                transition: 'opacity 0.3s ease'
              }}
            >
              <Box sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: index <= currentStepIndex 
                  ? 'linear-gradient(135deg, #FF6B35, #F7931E)' 
                  : 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                fontSize: '12px',
                color: 'white'
              }}>
                {index <= currentStepIndex ? '✓' : index + 1}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: index <= currentStepIndex ? 'white' : 'rgba(255,255,255,0.5)',
                  fontWeight: index === currentStepIndex ? 600 : 400
                }}
              >
                {step.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  );
};
