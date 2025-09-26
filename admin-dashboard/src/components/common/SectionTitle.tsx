import React, { type ReactNode } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface SectionTitleProps {
  children: ReactNode;
  showDivider?: boolean;
  dividerColor?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ 
  children, 
  showDivider = true, 
  dividerColor = 'rgba(255, 255, 255, 0.3)' 
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="subtitle2"
        sx={{
          color: 'rgba(255, 255, 255, 0.9)', // slightly brighter white
          fontWeight: 600,
          mb: 1.5,
          fontSize: '0.875rem', // 14px
          letterSpacing: '0.05em',
          userSelect: 'none',
          fontFamily: '"Inter", sans-serif',
          textTransform: 'uppercase', // <- all uppercase letters
          lineHeight: 1.4,
        }}
      >
        {children}
      </Typography>
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

export default SectionTitle;
