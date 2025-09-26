import React from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface FloatingTrackingButtonProps {
  bookingId: string;
  driverName: string;
  eta: string;
  onRestore: () => void;
  visible: boolean;
  hideOnHome?: boolean;
}

export const FloatingTrackingButton: React.FC<FloatingTrackingButtonProps> = ({
  bookingId,
  driverName,
  eta,
  onRestore,
  visible,
  hideOnHome = false
}) => {
  const navigate = useNavigate();
  
  if (!visible || hideOnHome) {
    return null;
  }

  const handleClick = () => {
    onRestore();
    navigate(`/track/booking/${bookingId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 100 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0, y: 100 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999
      }}
    >
      <Paper
        elevation={8}
        sx={{
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
          p: 2,
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(255, 107, 53, 0.4)',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 12px 40px rgba(255, 107, 53, 0.6)'
          },
          transition: 'all 0.3s ease'
        }}
        onClick={handleClick}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem'
          }}>
            🚗
          </Box>
          <Box>
            <Typography variant="body2" sx={{
              color: 'white',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 600,
              fontSize: '0.9rem',
              lineHeight: 1.2
            }}>
              Order #{bookingId}
            </Typography>
            <Typography variant="caption" sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}>
              <Box sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#4CAF50',
                animation: 'pulse 2s infinite'
              }} />
              {driverName} • {eta}
            </Typography>
          </Box>
          <IconButton
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            <ExpandMore />
          </IconButton>
        </Box>
      </Paper>
    </motion.div>
  );
};
