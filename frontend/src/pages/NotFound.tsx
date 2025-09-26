// React and React-related imports

// Third-party libraries
import { Typography, Container, Box, Button } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Absolute imports (from src/)
import { ParticleBackground } from '../components/Common';

function NotFound() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
      <ParticleBackground />
      
      <Box
        sx={{
          position: 'relative',
          color: 'white',
          py: { xs: 10, md: 15 },
          width: '100%',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(26, 16, 64, 0.85) 0%, rgba(37, 20, 84, 0.90) 100%)',
            zIndex: 1,
          }
        }}
      >
        <Container 
          maxWidth="lg" 
          sx={{ 
            position: 'relative', 
            zIndex: 2,
            textAlign: 'center',
            px: { xs: 2, sm: 3, md: 4 }
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ErrorIcon 
              sx={{ 
                fontSize: { xs: 100, md: 150 }, 
                color: 'primary.main',
                mb: 3
              }} 
            />
            
            <Typography
              variant="h1"
                          sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 500, // Reduced from 700 for softer appearance
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              mb: 2,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #40A9FF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              404 - Page Not Found
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mb: 4,
                color: 'rgba(255, 255, 255, 0.8)',
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              The page you're looking for doesn't exist or has been moved.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #0088FF 0%, #0066CC 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0099FF 0%, #0077DD 100%)',
                }
              }}
            >
              Back to Home
            </Button>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}

export { NotFound }; 