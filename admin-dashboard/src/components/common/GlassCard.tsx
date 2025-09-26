import { type ReactNode } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';

interface GlassCardProps {
  title?: string;
  children: ReactNode;
  height?: number | string;
  hoverColor?: string;
  padding?: number;
  className?: string;
}

const GlassCard = ({ 
  title, 
  children, 
  height = 300, 
  hoverColor = '#FF6B35',
  padding = 2,
  className
}: GlassCardProps) => {
  return (
    <Paper
      elevation={0}
      className={className}
      sx={{
        p: padding,
        height,
        background: 'linear-gradient(135deg, rgba(28, 27, 58, 0.9) 0%, rgba(40, 38, 85, 0.85) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          border: `1px solid ${alpha(hoverColor, 0.3)}`,
          boxShadow: `0 8px 32px ${alpha(hoverColor, 0.1)}, inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
        },
      }}
    >
      {title && (
        <>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: 600,
              mb: 2,
              fontSize: '15px',
              letterSpacing: '0.05em',
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
              lineHeight: 1.4,
              textTransform: 'uppercase',
            }}
          >
            {title}
          </Typography>
          <Box sx={{ 
            height: '1px', 
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 80%, transparent 100%)',
            mb: 2,
          }} />
        </>
      )}
      {children}
    </Paper>
  );
};

export default GlassCard;
