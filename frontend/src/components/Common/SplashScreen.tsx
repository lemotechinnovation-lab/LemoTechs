import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export const SplashScreen = ({ onComplete, duration: _duration = 3000 }: SplashScreenProps) => {
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing Platform...');

  useEffect(() => {
    // Animation sequence
    const sequence = async () => {
      // Step 1: Show logo after brief delay
      setTimeout(() => setShowLogo(true), 200);
      
      // Step 2: Show text after logo appears
      setTimeout(() => setShowText(true), 800);
      
      // Step 3: Show progress bar
      setTimeout(() => setShowProgress(true), 1200);
      
      // Step 4: Animate progress bar with contextual messages
      const loadingMessages = [
        'Initializing Platform...',
        'Preparing Booking System...',
        'Loading Service Options...',
        'Connecting to Location Services...',
        'Setting up Real-time Tracking...',
        'Optimizing User Experience...',
        'Finalizing Your Dashboard...',
        'Almost Ready...'
      ];

      let messageIndex = 0;
      const progressTimer = setInterval(() => {
        setProgress(prev => {
          // Update loading message based on progress
          const newMessageIndex = Math.floor((prev / 100) * (loadingMessages.length - 1));
          if (newMessageIndex !== messageIndex && newMessageIndex < loadingMessages.length) {
            messageIndex = newMessageIndex;
            setLoadingMessage(loadingMessages[messageIndex]);
          }

          if (prev >= 100) {
            clearInterval(progressTimer);
            setLoadingMessage('Welcome to LemoTech!');
            setTimeout(onComplete, 500); // Small delay before completing
            return 100;
          }
          return prev + 1.5; // Slightly slower for better message reading
        });
      }, 40);
    };

    sequence();
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, rgba(26, 16, 64, 0.98) 0%, rgba(37, 20, 84, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Animated Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/assets/tech-pattern.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
            zIndex: -1,
          }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: Math.random() * 200 - 100,
              y: Math.random() * 200 - 100,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              background: i % 2 === 0 ? '#FF6B35' : '#4A90E2',
              borderRadius: '50%',
              filter: 'blur(1px)',
            }}
          />
        ))}

        {/* Main Logo Container */}
        <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Logo Image */}
          <AnimatePresence>
            {showLogo && (
              <motion.div
                initial={{ scale: 0, opacity: 0, rotateY: 180 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ 
                  duration: 1.2, 
                  type: "spring", 
                  stiffness: 100,
                  ease: "easeOut"
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    display: 'inline-block',
                    mb: 4,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -20,
                      left: -20,
                      right: -20,
                      bottom: -20,
                      background: 'linear-gradient(45deg, rgba(255,107,53,0.3), rgba(74,144,226,0.3), rgba(255,107,53,0.3))',
                      borderRadius: '50%',
                      filter: 'blur(20px)',
                      animation: 'pulse 2s ease-in-out infinite',
                      zIndex: -1,
                    },
                    '@keyframes pulse': {
                      '0%, 100%': { 
                        opacity: 0.5,
                        transform: 'scale(1)'
                      },
                      '50%': { 
                        opacity: 0.8,
                        transform: 'scale(1.1)'
                      }
                    }
                  }}
                >
                  <motion.img
                    src="/assets/splash.png"
                    alt="LemoTech Innovations"
                    style={{
                      width: '300px',
                      height: 'auto',
                      maxWidth: '80vw',
                      filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))',
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Welcome Text */}
          <AnimatePresence>
            {showText && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: 'white',
                    fontWeight: 300,
                    fontFamily: '"Inter", sans-serif',
                    letterSpacing: '0.05em', // Reduced letter spacing for better readability
                    mb: 1,
                    textAlign: 'center',
                    fontSize: { xs: '1.5rem', md: '2rem' }
                  }}
                >
                  Welcome to
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    background: 'linear-gradient(135deg, #4A90E2 0%, #FF6B35 50%, #4A90E2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 600, // Reduced from 900 for softer brand appearance
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    letterSpacing: '-0.01em', // Reduced letter spacing
                    fontSize: { xs: '2rem', md: '3rem' },
                    mb: 2,
                    textAlign: 'center',
                  }}
                >
                  LemoTech Platform
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    textAlign: 'center',
                    maxWidth: '400px',
                    mx: 'auto',
                    lineHeight: 1.6,
                  }}
                >
                  Innovative cleaning and logistics solutions at your fingertips
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Bar */}
          <AnimatePresence>
            {showProgress && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ marginTop: '3rem' }}
              >
                <Box sx={{ width: '300px', maxWidth: '80vw', mx: 'auto' }}>
                  <motion.div
                    key={loadingMessage} // This will trigger animation on message change
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'rgba(255,255,255,0.9)',
                        display: 'block',
                        textAlign: 'center',
                        mb: 1,
                        fontSize: '1rem',
                        letterSpacing: '0.05em',
                        fontWeight: 500,
                        minHeight: '24px', // Prevent layout shift
                      }}
                    >
                      {loadingMessage}
                    </Typography>
                  </motion.div>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255,255,255,0.6)',
                      display: 'block',
                      textAlign: 'center',
                      mb: 2,
                      fontSize: '0.8rem',
                      letterSpacing: '0.1em'
                    }}
                  >
                    {Math.round(progress)}%
                  </Typography>
                  
                  {/* Custom Progress Bar */}
                  <Box
                    sx={{
                      width: '100%',
                      height: '4px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                      style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #4A90E2, #FF6B35)',
                        borderRadius: '2px',
                        position: 'relative',
                      }}
                    >
                      {/* Shimmer Effect */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                          animation: 'shimmer 1.5s ease-in-out infinite',
                          '@keyframes shimmer': {
                            '0%': { left: '-100%' },
                            '100%': { left: '100%' }
                          }
                        }}
                      />
                    </motion.div>
                  </Box>
                  
                  {/* Loading Dots */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                        style={{
                          width: '8px',
                          height: '8px',
                          background: i === 0 ? '#4A90E2' : i === 1 ? '#FF6B35' : '#4A90E2',
                          borderRadius: '50%',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};
