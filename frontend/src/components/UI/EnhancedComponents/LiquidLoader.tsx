import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface LiquidLoaderProps {
  size?: number;
  color?: string;
  text?: string;
  progress?: number; // 0-100
  variant?: 'wave' | 'bubble' | 'pulse' | 'morph';
}

export const LiquidLoader: React.FC<LiquidLoaderProps> = ({
  size = 120,
  color,
  text = 'Loading...',
  progress = 0,
  variant = 'wave'
}) => {
  const theme = useTheme();
  const primaryColor = color || theme.palette.primary.main;

  const WaveLoader = () => (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${primaryColor}20 0%, ${primaryColor}10 100%)`,
        border: `2px solid ${primaryColor}30`
      }}
    >
      {/* Liquid fill */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: `${100 - progress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}CC 100%)`,
          borderRadius: '0 0 50% 50%'
        }}
      />
      
      {/* Animated waves */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            x: ['-100%', '100%'],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3
          }}
          style={{
            position: 'absolute',
            bottom: `${progress}%`,
            width: '200%',
            height: '20px',
            background: `linear-gradient(90deg, transparent, ${primaryColor}40, transparent)`,
            transform: 'translateX(-50%)'
          }}
        />
      ))}

      {/* Percentage text */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: progress > 50 ? 'white' : primaryColor,
          fontWeight: 'bold',
          fontSize: size * 0.15,
          fontFamily: '"Inter", sans-serif'
        }}
      >
        {Math.round(progress)}%
      </Box>
    </Box>
  );

  const BubbleLoader = () => (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: size * 0.15,
            height: size * 0.15,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}80 100%)`,
            transform: `rotate(${i * 45}deg) translateY(${-size * 0.3}px)`
          }}
        />
      ))}
      
      {/* Center circle */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        style={{
          width: size * 0.3,
          height: size * 0.3,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}CC 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: size * 0.08,
          fontWeight: 'bold'
        }}
      >
        {Math.round(progress)}%
      </motion.div>
    </Box>
  );

  const PulseLoader = () => (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.8, 0, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: size * (0.3 + i * 0.15),
            height: size * (0.3 + i * 0.15),
            borderRadius: '50%',
            border: `3px solid ${primaryColor}`,
            borderColor: `${primaryColor}${Math.floor(255 * (0.8 - i * 0.15)).toString(16).padStart(2, '0')}`
          }}
        />
      ))}
      
      <Box
        sx={{
          color: primaryColor,
          fontSize: size * 0.12,
          fontWeight: 'bold',
          fontFamily: '"Inter", sans-serif'
        }}
      >
        {Math.round(progress)}%
      </Box>
    </Box>
  );

  const MorphLoader = () => (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <motion.div
        animate={{
          borderRadius: ['50%', '20%', '50%', '30%', '50%'],
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.1, 1, 1.1, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          width: size * 0.8,
          height: size * 0.8,
          background: `conic-gradient(from 0deg, ${primaryColor}, ${primaryColor}80, ${primaryColor}40, ${primaryColor})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Progress fill */}
        <motion.div
          initial={{ height: '0%' }}
          animate={{ height: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: `linear-gradient(180deg, ${primaryColor}FF 0%, ${primaryColor}CC 100%)`,
            borderRadius: 'inherit'
          }}
        />
        
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            color: progress > 50 ? 'white' : primaryColor,
            fontSize: size * 0.12,
            fontWeight: 'bold',
            fontFamily: '"Inter", sans-serif'
          }}
        >
          {Math.round(progress)}%
        </Box>
      </motion.div>
    </Box>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'wave': return <WaveLoader />;
      case 'bubble': return <BubbleLoader />;
      case 'pulse': return <PulseLoader />;
      case 'morph': return <MorphLoader />;
      default: return <WaveLoader />;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}
    >
      {renderLoader()}
      
      {text && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Typography
            variant="body1"
            sx={{
              color: primaryColor,
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
              textAlign: 'center'
            }}
          >
            {text}
          </Typography>
        </motion.div>
      )}
    </Box>
  );
};
