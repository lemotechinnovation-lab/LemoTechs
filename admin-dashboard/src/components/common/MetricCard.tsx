import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Timeline,
} from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  delay?: number;
  trend?: 'up' | 'down' | 'stable';
  height?: number | string;
  threshold?: { value: number; type: 'minimum' | 'maximum' | 'target' };
  subtitle?: string;
  trendPeriod?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color, 
  delay = 0, 
  trend = 'up',
  height = 140,
  threshold,
  subtitle,
  trendPeriod = 'Since last month'
}) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Timeline;
  
  // Threshold logic
  const getThresholdStatus = () => {
    if (!threshold) return null;
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
    
    switch (threshold.type) {
      case 'minimum':
        return numericValue >= threshold.value ? 'good' : 'warning';
      case 'maximum':
        return numericValue <= threshold.value ? 'good' : 'warning';
      case 'target': {
        const targetRange = threshold.value * 0.1; // 10% tolerance
        return Math.abs(numericValue - threshold.value) <= targetRange ? 'good' : 'warning';
      }
      default:
        return null;
    }
  };

  const thresholdStatus = getThresholdStatus();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <Box
        sx={{
          height,
          background: 'linear-gradient(135deg, rgba(28, 27, 58, 0.9) 0%, rgba(40, 38, 85, 0.85) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          p: 3,
          '&:hover': {
            transform: 'translateY(-2px)',
            border: `1px solid ${alpha(color, 0.5)}`,
            boxShadow: `0 8px 32px ${alpha(color, 0.2)}, 0 0 0 1px ${alpha(color, 0.3)}`,
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  fontWeight: 600,
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                  lineHeight: 1.4,
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '20px', sm: '22px', md: '24px' },
                  lineHeight: 1.2,
                  color: 'white',
                  mt: 0.5,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                }}
              >
                {value}
              </Typography>
              {subtitle && (
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '11px',
                    fontWeight: 400,
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                    lineHeight: 1.3,
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '16px',
                  background: alpha(color, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(color, 0.2)}`,
                  transition: 'all 0.3s ease',
                }}
              >
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { sx: { fontSize: '1.25rem' } }) : icon}
              </Box>
              {/* Threshold indicator */}
              {thresholdStatus && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: thresholdStatus === 'good' ? '#4CAF50' : '#FF9800',
                    border: '2px solid rgba(255,255,255,0.1)',
                    animation: thresholdStatus === 'warning' ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': { opacity: 1, transform: 'scale(1)' },
                      '50%': { opacity: 0.7, transform: 'scale(1.1)' },
                      '100%': { opacity: 1, transform: 'scale(1)' },
                    },
                  }}
                />
              )}
            </Box>
          </Box>
          
          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendIcon sx={{ fontSize: '0.875rem', color: color }} />
              <Typography
                variant="body2"
                sx={{
                  color: trend === 'up' ? '#4caf50' : trend === 'down' ? '#f44336' : '#ff9800',
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                  lineHeight: 1.4,
                }}
              >
                {change > 0 ? '+' : ''}{change}%
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '12px',
                  fontWeight: 400,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                  lineHeight: 1.4,
                }}
              >
                {trendPeriod}
              </Typography>
            </Box>
          </Box>
          
          {/* Animated background elements */}
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: `${color}15`,
              animation: 'float 6s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                '50%': { transform: 'translateY(-20px) rotate(180deg)' },
              },
            }}
          />
        </Box>
      </Box>
    </motion.div>
  );
};

export default MetricCard;
