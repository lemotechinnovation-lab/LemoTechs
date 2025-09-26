import React, { type ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

interface SectionHeaderProps {
  title: string;
  icon?: ReactNode;
  showDivider?: boolean;
  dividerColor?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  icon,
  showDivider = true, 
  dividerColor = 'rgba(255, 107, 53, 0.4)' 
}) => {
  const accentColor = '#F7931E'; // Light orange from logo

  return (
    <Box sx={{ mb: 1.5 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 1.5, 
          gap: 1, 
        }}
      >
        {icon && (
          <Box sx={{ 
            color: accentColor, 
            fontSize: '15px', 
            lineHeight: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {icon}
          </Box>
        )}
        <Typography
          variant="subtitle1"
          sx={{
            color: accentColor,
            fontWeight: 600,
            textTransform: 'uppercase',
            fontSize: '13px',
            letterSpacing: '0.08em',
            userSelect: 'none',
            fontFamily: '"Inter", sans-serif',
            lineHeight: 1.4,
          }}
        >
          {title}
        </Typography>
      </Box>
      {showDivider && (
        <Box sx={{ 
          width: 40, 
          height: 2, 
          background: dividerColor, 
          borderRadius: '1px',
        }} />
      )}
    </Box>
  );
};

export default SectionHeader;
