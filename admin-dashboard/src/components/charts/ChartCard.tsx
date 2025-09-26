import React, { type ReactNode } from 'react';
import { GlassCard } from '../common';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { PlayArrow, Pause } from '@mui/icons-material';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  height?: number | string;
  hoverColor?: string;
  showControls?: boolean;
  timeFilter?: string;
  onTimeFilterChange?: (filter: string) => void;
  autoRefresh?: boolean;
  onAutoRefreshToggle?: () => void;
  showLiveIndicator?: boolean;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  height = 400,
  hoverColor = '#FF6B35',
  showControls = false,
  timeFilter = '6M',
  onTimeFilterChange,
  autoRefresh = true,
  onAutoRefreshToggle,
  showLiveIndicator = false,
}) => {
  const handleTimeFilterClick = () => {
    if (onTimeFilterChange) {
      const filters = ['6M', '1Y', '3M'];
      const currentIndex = filters.indexOf(timeFilter);
      const nextIndex = (currentIndex + 1) % filters.length;
      onTimeFilterChange(filters[nextIndex]);
    }
  };

  return (
    <GlassCard title={title} height={height} hoverColor={hoverColor}>
      {showControls && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ flex: 1 }} />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip
              label={timeFilter}
              size="small"
              onClick={handleTimeFilterClick}
              sx={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
            />
            <Chip
              label={autoRefresh ? "Live" : "Paused"}
              size="small"
              onClick={onAutoRefreshToggle}
              icon={autoRefresh ? <PlayArrow sx={{ fontSize: '0.75rem' }} /> : <Pause sx={{ fontSize: '0.75rem' }} />}
              sx={{
                background: autoRefresh ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                color: autoRefresh ? '#4caf50' : '#ff9800',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: `1px solid ${autoRefresh ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 152, 0, 0.3)'}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
            />
          </Box>
        </Box>
      )}
      
      {showLiveIndicator && (
        <Box sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5,
          zIndex: 10
        }}>
          <Box sx={{ 
            width: 6, 
            height: 6, 
            borderRadius: '50%', 
            background: '#FF6B35',
            animation: 'pulse 2s infinite'
          }} />
          <Box sx={{ 
            fontSize: '0.625rem', 
            color: '#FF6B35', 
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Live
          </Box>
        </Box>
      )}
      
      {children}
    </GlassCard>
  );
};

export default ChartCard;
