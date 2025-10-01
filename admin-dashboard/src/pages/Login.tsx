import React, { useState } from 'react';
import { Box, Container, Paper, TextField, Button, Typography, Link, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ParticleBackground } from '../components/ui';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => setShowPassword(!showPassword);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 50%, #190F32 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3 }, // Responsive padding
        position: 'relative',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
        maxWidth: '100vw',
        overflowX: 'hidden',
      }}
    >
      <ParticleBackground />
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 1, sm: 3 },
        px: { xs: 2, sm: 4 },
        maxHeight: 'calc(100vh - 100px)',
        overflow: 'hidden',
        width: '100%',
      }}>
      
        <Container 
          maxWidth="sm" 
          sx={{ 
            position: 'relative', 
            zIndex: 2,
            width: '100%',
            px: { xs: 1, sm: 2 },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              maxWidth: 400,
              mx: 'auto',
              background: 'rgba(255, 255, 255, 0.03)',
              backgroundColor: 'rgba(255, 255, 255, 0.03) !important',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              textAlign: 'center',
              width: '100%',
            }}
          >
            {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Box
                component="img"
                src="/lemotech-logo.png"
                alt="LemoTech"
                sx={{ height: '80px', width: 'auto', display: 'block', margin: '0 auto' }}
              />
              </Box>

            {/* Title */}
              <Typography
                variant="h4"
                sx={{
                fontSize: { xs: '1.8rem', md: '1.9rem' },
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 2,
                background: 'linear-gradient(135deg, #ffffff 0%, #FF6B35 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 1,
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                }}
              >
              Welcome Back
              </Typography>
            
            {/* Subtitle */}
              <Typography
                variant="body1"
                sx={{
                fontSize: '0.95rem',
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 3,
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                fontWeight: 400
              }}
            >
              Sign in to your account
              </Typography>
          
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Email sx={{ color: '#FF6B35', fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500, fontSize: '0.85rem' }}>
                      Email
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    type="email"
                    placeholder="admin@lemotech.com"
                    defaultValue="admin@lemotech.com"
                    aria-label="Email address"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,107,53,0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                      },
                      '& .MuiInputBase-input': {
                        color: 'white',
                        py: 1.2,
                        fontSize: '0.9rem',
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                      }
                    }}
                  />
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Lock sx={{ color: '#FF6B35', fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500, fontSize: '0.85rem' }}>
                      Password
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    defaultValue="••••••••"
                    aria-label="Password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                        <IconButton 
                          onClick={handleTogglePassword} 
                          edge="end" 
                          sx={{ color: 'rgba(255,107,53,1)' }}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          aria-pressed={showPassword}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                    )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,107,53,0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                    },
                    '& .MuiInputBase-input': { 
                        color: 'white', 
                        py: 1.2, 
                        fontSize: '0.9rem',
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
                    }
                    }}
                  />
                </Box>

                <Button
                  fullWidth
                  onClick={onLogin}
                  sx={{
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    color: 'white',
                    fontWeight: 600,
                    px: 2.5,
                    py: 1.25,
                    borderRadius: 2.5,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    boxShadow: '0 4px 14px 0 rgba(255, 107, 53, 0.4)',
                    mt: 1,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #FF5722 0%, #FF6B35 100%)',
                      boxShadow: '0 6px 20px 0 rgba(255, 107, 53, 0.6)',
                      transform: 'scale(1.03)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Sign In
                </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Link href="#" sx={{ color: '#FF6B35', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>
                  Forgot password?
                </Link>
              </Box>
            </Box>
          </Paper>
            </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;
