import React, { useState, useRef } from 'react';
import {
  Fab,
  Box,
  Typography,
  useTheme,
  alpha,
  Backdrop
} from '@mui/material';
import {
  Add,
  Close,
  CleaningServices,
  ShoppingCart,
  Analytics,
  Business,
  Phone,
  Chat
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalytics } from '../../../hooks/useAnalytics';
import { useNavigate } from 'react-router-dom';

interface FABAction {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
  trackingName?: string;
}

interface SmartFABProps {
  actions?: FABAction[];
  size?: 'small' | 'medium' | 'large';
  position?: {
    bottom: number;
    right: number;
  };
  hideOnScroll?: boolean;
}

export const SmartFAB: React.FC<SmartFABProps> = ({
  actions,
  size = 'large',
  position = { bottom: 24, right: 24 },
  hideOnScroll = true
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { trackClick } = useAnalytics();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  React.useEffect(() => {
    if (!hideOnScroll) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hideOnScroll]);

  const defaultActions: FABAction[] = [
    {
      id: 'book-service',
      label: 'Book Service',
      icon: CleaningServices,
      color: theme.palette.primary.main,
      onClick: () => navigate('/'),
      trackingName: 'fab_book_service'
    },
    {
      id: 'marketplace',
      label: 'Shop Products',
      icon: ShoppingCart,
      color: '#4CAF50',
      onClick: () => navigate('/marketplace'),
      trackingName: 'fab_marketplace'
    },
    {
      id: 'analytics',
      label: 'View Analytics',
      icon: Analytics,
      color: '#2196F3',
      onClick: () => navigate('/analytics'),
      trackingName: 'fab_analytics'
    },
    {
      id: 'business',
      label: 'Business Portal',
      icon: Business,
      color: '#9C27B0',
      onClick: () => navigate('/business'),
      trackingName: 'fab_business'
    },
    {
      id: 'support',
      label: 'Get Help',
      icon: Phone,
      color: '#FF9800',
      onClick: () => navigate('/contact'),
      trackingName: 'fab_support'
    },
    {
      id: 'chat',
      label: 'Live Chat',
      icon: Chat,
      color: '#00BCD4',
      onClick: () => {
        // Open chat widget
        console.log('Opening chat...');
      },
      trackingName: 'fab_chat'
    }
  ];

  const fabActions = actions || defaultActions;

  const handleMainClick = () => {
    setIsOpen(!isOpen);
    trackClick('fab_main_toggle', { isOpen: !isOpen });
  };

  const handleActionClick = (action: FABAction) => {
    if (action.trackingName) {
      trackClick(action.trackingName);
    }
    action.onClick();
    setIsOpen(false);
  };

  const getFABSize = () => {
    const sizes = {
      small: 40,
      medium: 56,
      large: 64
    };
    return sizes[size];
  };

  const fabSize = getFABSize();

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <Backdrop
            open={isOpen}
            onClick={() => setIsOpen(false)}
            sx={{
              zIndex: 1200,
              background: alpha('#000', 0.3),
              backdropFilter: 'blur(4px)'
            }}
          />
        )}
      </AnimatePresence>

      {/* FAB Container */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            style={{
              position: 'fixed',
              bottom: position.bottom,
              right: position.right,
              zIndex: 1300,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 12
            }}
          >
            {/* Action Buttons */}
            <AnimatePresence>
              {isOpen && fabActions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ 
                    scale: 0, 
                    opacity: 0,
                    y: 20
                  }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    y: 0
                  }}
                  exit={{ 
                    scale: 0, 
                    opacity: 0,
                    y: 20
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: index * 0.05
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}
                >
                  {/* Action Label */}
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                  >
                    <Box
                      sx={{
                        background: alpha('#000', 0.8),
                        color: 'white',
                        px: 2,
                        py: 1,
                        borderRadius: '8px',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: '"Inter", sans-serif',
                          fontWeight: 500
                        }}
                      >
                        {action.label}
                      </Typography>
                    </Box>
                  </motion.div>

                  {/* Action FAB */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Fab
                      size="medium"
                      onClick={() => handleActionClick(action)}
                      sx={{
                        background: `linear-gradient(135deg, ${action.color} 0%, ${alpha(action.color, 0.8)} 100%)`,
                        color: 'white',
                        boxShadow: `0 4px 12px ${alpha(action.color, 0.4)}`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${alpha(action.color, 0.9)} 0%, ${alpha(action.color, 0.7)} 100%)`,
                          boxShadow: `0 6px 20px ${alpha(action.color, 0.6)}`,
                        }
                      }}
                    >
                      <action.icon />
                    </Fab>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Main FAB */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Fab
                size={size}
                onClick={handleMainClick}
                sx={{
                  width: fabSize,
                  height: fabSize,
                  background: isOpen 
                    ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'
                    : 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                  color: 'white',
                  boxShadow: isOpen
                    ? '0 8px 25px rgba(244, 67, 54, 0.4)'
                    : '0 8px 25px rgba(255, 107, 53, 0.4)',
                  '&:hover': {
                    background: isOpen
                      ? 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)'
                      : 'linear-gradient(135deg, #E55A2B 0%, #E8851A 100%)',
                    boxShadow: isOpen
                      ? '0 12px 35px rgba(244, 67, 54, 0.6)'
                      : '0 12px 35px rgba(255, 107, 53, 0.6)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'visible',
                  // Pulse animation when closed
                  ...(!isOpen && {
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: '50%',
                      background: 'inherit',
                      animation: 'pulse 2s infinite',
                      zIndex: -1,
                      '@keyframes pulse': {
                        '0%': {
                          transform: 'scale(1)',
                          opacity: 1
                        },
                        '50%': {
                          transform: 'scale(1.2)',
                          opacity: 0.5
                        },
                        '100%': {
                          transform: 'scale(1.4)',
                          opacity: 0
                        }
                      }
                    }
                  })
                }}
              >
                <motion.div
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {isOpen ? <Close /> : <Add />}
                </motion.div>
              </Fab>
            </motion.div>

            {/* Smart tooltip when closed */}
            {!isOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                style={{
                  position: 'absolute',
                  right: fabSize + 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}
              >
                <Box
                  sx={{
                    background: alpha('#000', 0.8),
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: '8px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    whiteSpace: 'nowrap',
                    opacity: 0,
                    animation: 'fadeInOut 3s ease-in-out 2s',
                    '@keyframes fadeInOut': {
                      '0%, 80%, 100%': { opacity: 0 },
                      '10%, 70%': { opacity: 1 }
                    }
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 500
                    }}
                  >
                    Quick Actions
                  </Typography>
                </Box>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
