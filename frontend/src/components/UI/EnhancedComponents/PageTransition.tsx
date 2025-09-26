import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

interface PageTransitionProps {
  children: React.ReactNode;
  variant?: 'slide' | 'fade' | 'scale' | 'flip' | 'liquid' | 'curtain';
  duration?: number;
  delay?: number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  variant = 'slide',
  duration = 0.5,
  delay = 0
}) => {
  const location = useLocation();

  const getVariantConfig = () => {
    switch (variant) {
      case 'slide':
        return {
          initial: { x: '100%', opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '-100%', opacity: 0 }
        };
      
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
      
      case 'scale':
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 1.2, opacity: 0 }
        };
      
      case 'flip':
        return {
          initial: { rotateY: -90, opacity: 0 },
          animate: { rotateY: 0, opacity: 1 },
          exit: { rotateY: 90, opacity: 0 }
        };
      
      case 'liquid':
        return {
          initial: { 
            clipPath: 'circle(0% at 50% 50%)',
            opacity: 0
          },
          animate: { 
            clipPath: 'circle(150% at 50% 50%)',
            opacity: 1
          },
          exit: { 
            clipPath: 'circle(0% at 50% 50%)',
            opacity: 0
          }
        };
      
      case 'curtain':
        return {
          initial: { 
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)',
            opacity: 0
          },
          animate: { 
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
            opacity: 1
          },
          exit: { 
            clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
            opacity: 0
          }
        };
      
      default:
        return {
          initial: { x: '100%', opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '-100%', opacity: 0 }
        };
    }
  };

  const variantConfig = getVariantConfig();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={variantConfig.initial}
        animate={variantConfig.animate}
        exit={variantConfig.exit}
        transition={{
          duration,
          delay,
          ease: [0.4, 0, 0.2, 1],
          ...(variant === 'liquid' && {
            duration: duration * 1.2,
            ease: [0.76, 0, 0.24, 1]
          }),
          ...(variant === 'flip' && {
            duration: duration * 0.8,
            ease: "easeInOut"
          })
        }}
        style={{
          width: '100%',
          height: '100%',
          ...(variant === 'flip' && {
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          })
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Loading transition component
export const LoadingTransition: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
}> = ({ isLoading, children }) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}
          >
            {/* Animated loading circles */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
                  }}
                />
              ))}
            </Box>
          </Box>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Stagger children animation
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}> = ({ children, staggerDelay = 0.1, className }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Individual stagger item
export const StaggerItem: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      variants={{
        hidden: { 
          opacity: 0, 
          y: 20,
          scale: 0.95
        },
        visible: { 
          opacity: 1, 
          y: 0,
          scale: 1,
          transition: {
            duration: 0.5,
            delay,
            ease: [0.4, 0, 0.2, 1]
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// Scroll-triggered animations
export const ScrollReveal: React.FC<{
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  threshold?: number;
}> = ({ 
  children, 
  direction = 'up', 
  delay = 0,
  threshold = 0.1
}) => {
  const getDirectionVariants = () => {
    switch (direction) {
      case 'up':
        return { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1 } };
      case 'down':
        return { hidden: { y: -50, opacity: 0 }, visible: { y: 0, opacity: 1 } };
      case 'left':
        return { hidden: { x: 50, opacity: 0 }, visible: { x: 0, opacity: 1 } };
      case 'right':
        return { hidden: { x: -50, opacity: 0 }, visible: { x: 0, opacity: 1 } };
      default:
        return { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1 } };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: threshold }}
      variants={getDirectionVariants()}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {children}
    </motion.div>
  );
};

// Hover animations
export const HoverScale: React.FC<{
  children: React.ReactNode;
  scale?: number;
  duration?: number;
}> = ({ children, scale = 1.05, duration = 0.2 }) => {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: scale * 0.95 }}
      transition={{ duration, ease: "easeOut" }}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </motion.div>
  );
};

// Magnetic effect
export const MagneticHover: React.FC<{
  children: React.ReactNode;
  strength?: number;
}> = ({ children, strength = 0.3 }) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const ref = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    
    setMousePosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      {children}
    </motion.div>
  );
};
