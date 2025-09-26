import React, { useState, useRef } from 'react';
import { Button, ButtonProps, Box, useTheme, alpha } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalytics } from '../../../hooks';

interface SmartButtonProps extends Omit<ButtonProps, 'onClick' | 'variant'> {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'premium';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  success?: boolean;
  rippleEffect?: boolean;
  glowEffect?: boolean;
  trackingName?: string;
  trackingProperties?: Record<string, any>;
  magneticEffect?: boolean;
  particleEffect?: boolean;
  children: React.ReactNode;
}

export const SmartButton: React.FC<SmartButtonProps> = ({
  onClick,
  variant = 'primary',
  size = 'medium',
  loading = false,
  success = false,
  rippleEffect = true,
  glowEffect = false,
  trackingName,
  trackingProperties,
  magneticEffect = false,
  particleEffect = false,
  children,
  disabled,
  ...props
}) => {
  const theme = useTheme();
  const { trackClick } = useAnalytics();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  const getVariantStyles = () => {
    const variants = {
      primary: {
        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
        color: 'white',
        hover: 'linear-gradient(135deg, #E55A2B 0%, #E8851A 100%)',
        shadow: '0 4px 15px rgba(255, 107, 53, 0.4)',
        hoverShadow: '0 8px 25px rgba(255, 107, 53, 0.6)'
      },
      secondary: {
        background: alpha(theme.palette.secondary.main, 0.1),
        color: theme.palette.secondary.main,
        hover: alpha(theme.palette.secondary.main, 0.2),
        shadow: `0 4px 15px ${alpha(theme.palette.secondary.main, 0.3)}`,
        hoverShadow: `0 8px 25px ${alpha(theme.palette.secondary.main, 0.5)}`
      },
      ghost: {
        background: 'transparent',
        color: 'rgba(255, 255, 255, 0.8)',
        hover: alpha('#ffffff', 0.1),
        shadow: 'none',
        hoverShadow: '0 4px 15px rgba(255, 255, 255, 0.1)'
      },
      danger: {
        background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
        color: 'white',
        hover: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
        shadow: '0 4px 15px rgba(244, 67, 54, 0.4)',
        hoverShadow: '0 8px 25px rgba(244, 67, 54, 0.6)'
      },
      success: {
        background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
        color: 'white',
        hover: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
        shadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
        hoverShadow: '0 8px 25px rgba(76, 175, 80, 0.6)'
      },
      premium: {
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        color: '#000',
        hover: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
        shadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
        hoverShadow: '0 8px 25px rgba(255, 215, 0, 0.6)'
      }
    };
    return variants[variant];
  };

  const getSizeStyles = () => {
    const sizes = {
      small: { px: 3, py: 1.5, fontSize: '0.875rem', minHeight: '36px' },
      medium: { px: 4, py: 2, fontSize: '1rem', minHeight: '44px' },
      large: { px: 6, py: 2.5, fontSize: '1.125rem', minHeight: '52px' }
    };
    return sizes[size];
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Analytics tracking
    if (trackingName) {
      trackClick(trackingName, trackingProperties);
    }

    // Ripple effect
    if (rippleEffect && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };
      setRipples(prev => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    }

    // Particle effect
    if (particleEffect) {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: i * 0.1
      }));
      setParticles(prev => [...prev, ...newParticles]);
      
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
      }, 1000);
    }

    onClick?.(event);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (magneticEffect && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (event.clientX - centerX) * 0.1;
      const deltaY = (event.clientY - centerY) * 0.1;
      setMousePosition({ x: deltaX, y: deltaY });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (magneticEffect) {
      setMousePosition({ x: 0, y: 0 });
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <motion.div
      animate={{
        x: mousePosition.x,
        y: mousePosition.y
      }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 300
      }}
    >
      <Button
        ref={buttonRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        disabled={disabled || loading}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: variantStyles.background,
          color: variantStyles.color,
          border: 'none',
          borderRadius: '12px',
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isHovered ? variantStyles.hoverShadow : variantStyles.shadow,
          transform: isHovered && !magneticEffect ? 'translateY(-2px)' : 'none',
          '&:hover': {
            background: variantStyles.hover,
          },
          '&:disabled': {
            background: alpha('#000', 0.1),
            color: alpha('#000', 0.3),
            boxShadow: 'none',
            transform: 'none'
          },
          // Glow effect
          ...(glowEffect && {
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: variantStyles.background,
              filter: 'blur(8px)',
              opacity: isHovered ? 0.6 : 0,
              transition: 'opacity 0.3s ease',
              zIndex: -1
            }
          }),
          ...sizeStyles
        }}
        {...props}
      >
        {/* Loading state */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  border: '2px solid currentColor',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }}
              />
              Loading...
            </motion.div>
          ) : success ? (
            <motion.div
              key="success"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              ✓ Success
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ripple effects */}
        <AnimatePresence>
          {ripples.map(ripple => (
            <motion.div
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                position: 'absolute',
                left: ripple.x,
                top: ripple.y,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: alpha('#ffffff', 0.3),
                pointerEvents: 'none',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </AnimatePresence>

        {/* Particle effects */}
        <AnimatePresence>
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              initial={{ 
                scale: 0,
                x: '50%',
                y: '50%',
                opacity: 1
              }}
              animate={{ 
                scale: 1,
                x: `${particle.x}%`,
                y: `${particle.y}%`,
                opacity: 0
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.8,
                delay: particle.delay,
                ease: "easeOut"
              }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: variantStyles.color,
                pointerEvents: 'none'
              }}
            />
          ))}
        </AnimatePresence>

        {/* Shine effect on hover */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '100%' : '-100%' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            pointerEvents: 'none'
          }}
        />
      </Button>
    </motion.div>
  );
};
