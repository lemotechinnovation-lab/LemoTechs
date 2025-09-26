import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { 
  LocationOn, 
  Inventory, 
  LocalShipping, 
  Payment, 
  CheckCircle 
} from '@mui/icons-material';

// Icon-based step component
const StepIcon = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ ownerState }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
  display: 'flex',
  height: 40,
  width: 40,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  border: '2px solid rgba(255, 255, 255, 0.5)',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'default',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: ownerState.active 
      ? 'linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(247, 147, 30, 0.2) 100%)'
      : ownerState.completed
      ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(102, 187, 106, 0.2) 100%)'
      : 'transparent',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
  },

  ...(ownerState.active && {
    color: '#FF6B35',
    borderColor: '#FF6B35',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    transform: 'scale(1.1)',
  }),
  
  ...(ownerState.completed && {
    color: '#4CAF50',
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
  }),
}));

// Connector line between steps
const ConnectorLine = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ ownerState }) => ({
  height: 3,
  flex: 1,
  backgroundColor: ownerState.completed ? '#4CAF50' : ownerState.active ? '#FF6B35' : 'rgba(255, 255, 255, 0.4)',
  borderRadius: 1,
  transition: 'all 0.3s ease',
  margin: '0 8px',
}));

interface BookingStepperProps {
  currentStep: 'location' | 'items' | 'driver' | 'payment' | 'confirmation';
  completedSteps?: string[];
}

const steps = [
  {
    id: 'location',
    label: 'Pickup Location',
    icon: LocationOn,
    tooltip: 'Where should we collect your items?'
  },
  {
    id: 'items',
    label: 'Select Items',
    icon: Inventory,
    tooltip: 'What would you like us to clean?'
  },
  {
    id: 'driver',
    label: 'Choose Service',
    icon: LocalShipping,
    tooltip: 'Pick your preferred cleaning service'
  },
  {
    id: 'payment',
    label: 'Payment',
    icon: Payment,
    tooltip: 'Secure payment processing'
  },
  {
    id: 'confirmation',
    label: 'Confirm',
    icon: CheckCircle,
    tooltip: 'Review and confirm your booking'
  }
];

export const BookingStepper: React.FC<BookingStepperProps> = ({ 
  currentStep, 
  completedSteps = []
}) => {
  const getStepIndex = (step: string) => {
    return steps.findIndex(s => s.id === step);
  };

  const activeStep = getStepIndex(currentStep);

  return (
    <Box sx={{ 
      width: '100%', 
      py: 2,
      px: 3,
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(20px)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      mb: 2,
      mt: 3, // Add space above
      minHeight: '70px'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: '#fff',
            fontWeight: 600,
            fontFamily: '"Inter", sans-serif',
            textAlign: 'center',
            mb: 2,
            fontSize: '0.9rem'
          }}
        >
          Booking Progress
        </Typography>

        {/* Icon-only stepper */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 1
        }}>
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = completedSteps.includes(step.id);
            const IconComponent = isCompleted ? CheckCircle : step.icon;
            
            return (
              <React.Fragment key={step.id}>
                <Tooltip
                  title={step.tooltip}
                  placement="top"
                  arrow
                  sx={{
                    '& .MuiTooltip-tooltip': {
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontFamily: '"Inter", sans-serif'
                    }
                  }}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <StepIcon ownerState={{ completed: isCompleted, active: isActive }}>
                      <IconComponent sx={{ fontSize: 20 }} />
                    </StepIcon>
                  </motion.div>
                </Tooltip>
                
                {/* Connector line - don't show after last step */}
                {index < steps.length - 1 && (
                  <ConnectorLine 
                    ownerState={{ 
                      completed: isCompleted || index < activeStep,
                      active: index === activeStep - 1
                    }} 
                  />
                )}
              </React.Fragment>
            );
          })}
        </Box>
      </motion.div>
    </Box>
  );
};