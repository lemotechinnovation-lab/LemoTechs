import { Button as MuiButton, ButtonProps as MuiButtonProps, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

// Define button variants
export type ButtonVariant = 
  | 'primary'          // Main CTA buttons (orange gradient)
  | 'secondary'        // Secondary actions (white/transparent)
  | 'ghost'           // Minimal buttons (text only)
  | 'danger'          // Delete/cancel actions (red)
  | 'success'         // Confirm/complete actions (green)
  | 'icon'            // Icon-only buttons
  | 'tab'             // Navigation tab buttons
  | 'floating'        // Floating action buttons

// Define button sizes
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface LemoButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  animated?: boolean;
  children?: ReactNode;
}

// Size configurations
const sizeConfig = {
  xs: {
    fontSize: '0.75rem',
    padding: '6px 12px',
    height: '32px',
    iconSize: '16px',
    borderRadius: '8px'
  },
  sm: {
    fontSize: '0.875rem', 
    padding: '8px 16px',
    height: '36px',
    iconSize: '18px',
    borderRadius: '10px'
  },
  md: {
    fontSize: '1rem',
    padding: '12px 24px', 
    height: '44px',
    iconSize: '20px',
    borderRadius: '12px'
  },
  lg: {
    fontSize: '1.125rem',
    padding: '16px 32px',
    height: '52px', 
    iconSize: '24px',
    borderRadius: '14px'
  },
  xl: {
    fontSize: '1.25rem',
    padding: '20px 40px',
    height: '60px',
    iconSize: '28px',
    borderRadius: '16px'
  }
};

// Variant configurations
const getVariantStyles = (variant: ButtonVariant, size: ButtonSize) => {
  const config = sizeConfig[size];
  
  const baseStyles = {
    fontSize: config.fontSize,
    height: config.height,
    borderRadius: config.borderRadius,
    fontWeight: 600,
    textTransform: 'none' as const,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyles,
        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD700 100%)',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 16px rgba(255,107,53,0.3)',
        '&:hover': {
          background: 'linear-gradient(135deg, #FF5722 0%, #F7931E 50%, #FFD700 100%)',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(255,107,53,0.4)',
        },
        '&:active': {
          transform: 'translateY(0)',
          boxShadow: '0 2px 10px rgba(255,107,53,0.3)',
        }
      };

    case 'secondary':
      return {
        ...baseStyles,
        background: 'rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.9)',
        border: '1px solid rgba(255,255,255,0.2)',
        backdropFilter: 'blur(10px)',
        '&:hover': {
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.3)',
          transform: 'translateY(-1px)',
        }
      };

    case 'ghost':
      return {
        ...baseStyles,
        background: 'transparent',
        color: 'rgba(255,255,255,0.8)',
        border: 'none',
        '&:hover': {
          background: 'rgba(255,255,255,0.1)',
          color: 'white',
        }
      };

    case 'danger':
      return {
        ...baseStyles,
        background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 16px rgba(244,67,54,0.3)',
        '&:hover': {
          background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(244,67,54,0.4)',
        }
      };

    case 'success':
      return {
        ...baseStyles,
        background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 16px rgba(76,175,80,0.3)',
        '&:hover': {
          background: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(76,175,80,0.4)',
        }
      };

    case 'icon':
      return {
        ...baseStyles,
        background: 'rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.8)',
        border: '1px solid rgba(255,255,255,0.2)',
        padding: config.padding.split(' ')[0], // Square padding
        minWidth: config.height,
        width: config.height,
        '&:hover': {
          background: 'rgba(255,255,255,0.15)',
          color: 'white',
          transform: 'scale(1.05)',
        }
      };

    case 'tab':
      return {
        ...baseStyles,
        background: 'transparent',
        color: 'rgba(255,255,255,0.7)',
        border: 'none',
        borderRadius: '8px',
        '&:hover': {
          background: 'rgba(255,107,53,0.1)',
          color: 'rgba(255,255,255,0.9)',
        },
        '&.active': {
          background: 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(247,147,30,0.2))',
          color: 'white',
          border: '1px solid rgba(255,107,53,0.3)',
        }
      };

    case 'floating':
      return {
        ...baseStyles,
        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: config.height,
        height: config.height,
        minWidth: config.height,
        padding: 0,
        boxShadow: '0 8px 25px rgba(255,107,53,0.4)',
        '&:hover': {
          transform: 'scale(1.1) translateY(-2px)',
          boxShadow: '0 12px 35px rgba(255,107,53,0.5)',
        }
      };

    default:
      return baseStyles;
  }
};

export const LemoButton = ({ 
  variant = 'primary', 
  size = 'md', 
  icon, 
  isLoading = false,
  fullWidth = false,
  animated = true,
  children,
  ...props 
}: LemoButtonProps) => {
  const config = sizeConfig[size];
  const styles = getVariantStyles(variant, size);

  if (animated) {
    return (
      <motion.div
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        style={{ display: 'inline-block', width: fullWidth ? '100%' : 'auto' }}
      >
        <MuiButton
          sx={{
            ...styles,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: icon && children ? 1 : 0,
            ...(props.sx || {})
          }}
          disabled={isLoading}
          {...props}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: config.iconSize,
                height: config.iconSize,
                border: `2px solid currentColor`,
                borderTop: '2px solid transparent',
                borderRadius: '50%',
              }}
            />
          ) : (
            <>
              {icon && (
                <Box sx={{ 
                  fontSize: config.iconSize,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {icon}
                </Box>
              )}
              {children && (
                <Typography 
                  component="span" 
                  sx={{ 
                    fontSize: config.fontSize,
                    fontWeight: 'inherit',
                    lineHeight: 1
                  }}
                >
                  {children}
                </Typography>
              )}
            </>
          )}
        </MuiButton>
      </motion.div>
    );
  }

  return (
    <MuiButton
      sx={{
        ...styles,
        width: fullWidth ? '100%' : 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: icon && children ? 1 : 0,
        ...(props.sx || {})
      }}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: config.iconSize,
            height: config.iconSize,
            border: `2px solid currentColor`,
            borderTop: '2px solid transparent',
            borderRadius: '50%',
          }}
        />
      ) : (
        <>
          {icon && (
            <Box sx={{ 
              fontSize: config.iconSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {icon}
            </Box>
          )}
          {children && (
            <Typography 
              component="span" 
              sx={{ 
                fontSize: config.fontSize,
                fontWeight: 'inherit',
                lineHeight: 1
              }}
            >
              {children}
            </Typography>
          )}
        </>
      )}
    </MuiButton>
  );
};

// Preset button components for common use cases
export const PrimaryButton = (props: Omit<LemoButtonProps, 'variant'>) => (
  <LemoButton variant="primary" {...props} />
);

export const SecondaryButton = (props: Omit<LemoButtonProps, 'variant'>) => (
  <LemoButton variant="secondary" {...props} />
);

export const IconButton = (props: Omit<LemoButtonProps, 'variant'>) => (
  <LemoButton variant="icon" {...props} />
);

export const TabButton = (props: Omit<LemoButtonProps, 'variant'>) => (
  <LemoButton variant="tab" {...props} />
);

export const FloatingButton = (props: Omit<LemoButtonProps, 'variant'>) => (
  <LemoButton variant="floating" {...props} />
);
