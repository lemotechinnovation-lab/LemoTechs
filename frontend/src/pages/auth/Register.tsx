// React and React-related imports
import { useState } from 'react';

// Third-party libraries
import { Box, Typography, Container, Button, TextField, IconButton, Paper, useTheme, FormControl, Select, MenuItem } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

// Absolute imports (from src/)
import { ParticleBackground } from '../../components/Common/ParticleBackground';
import { useAuth } from '../../hooks/useAuth';

export const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('ZA');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'name' | 'phone' | 'terms'>('name');
  
  const contact = location.state?.contact || '';

  const handleNext = async () => {
    setError('');

    if (currentStep === 'name') {
      if (!firstName.trim() || !lastName.trim()) {
        setError('Please enter your first and last name');
        return;
      }
      setCurrentStep('phone');
    } else if (currentStep === 'phone') {
      if (!phone.trim()) {
        setError('Please enter your mobile number');
        return;
      }
      setCurrentStep('terms');
    } else if (currentStep === 'terms') {
      await handleRegister();
    }
  };

  const handlePrevious = () => {
    if (currentStep === 'phone') {
      setCurrentStep('name');
    } else if (currentStep === 'terms') {
      setCurrentStep('phone');
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      const fullPhone = `+27 ${phone}`;
      
      const success = await register({
        name: fullName,
        email: contact.includes('@') ? contact : `${firstName.toLowerCase()}@example.com`,
        phone: fullPhone,
        password: 'temp123', // In production, this would be handled differently
        confirmPassword: 'temp123',
        address: 'Johannesburg, South Africa', // Default address
        acceptTerms: true
      });
      
      if (success) {
        navigate('/', { state: { message: `Welcome to LemoTech, ${firstName}!` } });
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'name':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                fontSize: { xs: '1.3rem', md: '1.5rem' },
                fontWeight: 500,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                background: 'linear-gradient(135deg, #ffffff 0%, #FF6B35 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 1,
                letterSpacing: '-0.02em',
                textAlign: 'center'
              }}
            >
              What's your name?
            </Typography>

            <Typography 
              sx={{ 
                fontSize: '0.95rem', 
                color: 'rgba(255, 255, 255, 0.7)', 
                mb: 4,
                textAlign: 'center',
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}
            >
              Let us know how to properly address you
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                mb: 1,
                fontSize: '0.9rem',
                fontWeight: 500
              }}>
                First name
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)'
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 107, 53, 0.5)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main
                    }
                  },
                  '& .MuiInputBase-input': {
                    py: 2,
                    fontSize: '1rem',
                    color: 'white',
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.5)'
                    }
                  }
                }}
              />

              <Typography sx={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                mb: 1,
                fontSize: '0.9rem',
                fontWeight: 500
              }}>
                Last name
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)'
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 107, 53, 0.5)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main
                    }
                  },
                  '& .MuiInputBase-input': {
                    py: 2,
                    fontSize: '1rem',
                    color: 'white',
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.5)'
                    }
                  }
                }}
              />
            </Box>
          </motion.div>
        );

      case 'phone':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                fontSize: { xs: '1.3rem', md: '1.5rem' },
                fontWeight: 500,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                background: 'linear-gradient(135deg, #ffffff 0%, #FF6B35 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 1,
                letterSpacing: '-0.02em',
                textAlign: 'center'
              }}
            >
              Enter your mobile number
            </Typography>

            <Typography 
              sx={{ 
                fontSize: '0.95rem', 
                color: 'rgba(255, 255, 255, 0.7)', 
                mb: 4,
                textAlign: 'center',
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}
            >
              (Optional)
              <br />
              Add your mobile to aid in account recovery
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                mb: 1,
                fontSize: '0.9rem',
                fontWeight: 500
              }}>
                Mobile
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <FormControl sx={{ minWidth: 100 }}>
                  <Select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 107, 53, 0.5)'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main
                      },
                      '& .MuiSelect-icon': {
                        color: 'rgba(255, 255, 255, 0.7)'
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: 'rgba(26, 16, 64, 0.98)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          '& .MuiMenuItem-root': {
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 107, 53, 0.1)'
                            }
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value="ZA">ZA</MenuItem>
                    <MenuItem value="US">US</MenuItem>
                    <MenuItem value="UK">UK</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  placeholder="82 123 4567"
                  value={phone}
                  onChange={(e) => {
                    // Format SA phone number as user types
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 9) {
                      const formatted = value.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3').trim();
                      setPhone(formatted);
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }}>
                        +27
                      </Typography>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 107, 53, 0.5)'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main
                      }
                    },
                    '& .MuiInputBase-input': {
                      py: 2,
                      fontSize: '1rem',
                      color: 'white',
                      '&::placeholder': {
                        color: 'rgba(255, 255, 255, 0.5)'
                      }
                    }
                  }}
                />
              </Box>
              
              <Button
                onClick={() => setCurrentStep('terms')}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  mt: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                  }
                }}
              >
                Skip
              </Button>
            </Box>
          </motion.div>
        );

      case 'terms':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                fontSize: { xs: '1.3rem', md: '1.5rem' },
                fontWeight: 500,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                background: 'linear-gradient(135deg, #ffffff 0%, #FF6B35 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 3,
                letterSpacing: '-0.02em',
                textAlign: 'center'
              }}
            >
              Accept LemoTech's Terms &<br />
              Review Privacy Notice
            </Typography>

            <Box sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              p: 3,
              mb: 3,
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Typography 
                sx={{ 
                  fontSize: '0.9rem', 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  lineHeight: 1.6,
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                }}
              >
                By selecting "I Agree" below, I have reviewed and agree to the{' '}
                <Button
                  component="a"
                  href="/legal"
                  target="_blank"
                  sx={{
                    color: theme.palette.primary.main,
                    textTransform: 'none',
                    p: 0,
                    minWidth: 'auto',
                    fontSize: 'inherit',
                    textDecoration: 'underline',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Terms of Use
                </Button>
                {' '}and acknowledge the{' '}
                <Button
                  component="a"
                  href="/legal"
                  target="_blank"
                  sx={{
                    color: theme.palette.primary.main,
                    textTransform: 'none',
                    p: 0,
                    minWidth: 'auto',
                    fontSize: 'inherit',
                    textDecoration: 'underline',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Privacy Notice
                </Button>
                . I am at least 18 years of age.
              </Typography>
            </Box>

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 3
            }}>
              <input
                type="checkbox"
                id="agree-terms"
                style={{
                  width: '20px',
                  height: '20px',
                  accentColor: theme.palette.primary.main
                }}
              />
              <Typography 
                component="label"
                htmlFor="agree-terms"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '1rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                I Agree
              </Typography>
            </Box>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 50%, #190F32 100%)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <ParticleBackground />
      
      {/* Header with Back Button */}
      <Box sx={{ 
        position: 'relative', 
        zIndex: 2, 
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <IconButton
          onClick={currentStep === 'name' ? () => navigate('/verify') : handlePrevious}
          sx={{
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            }
          }}
        >
          <ArrowBack />
        </IconButton>
        
        <Box sx={{ width: 48 }} />
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 1,
        px: 2
      }}>
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px'
            }}
          >
            {/* Logo */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                component="img"
                src="/assets/lemotech-logo.png"
                alt="LemoTech"
                sx={{ height: '48px', width: 'auto' }}
              />
            </Box>

            {renderStep()}

            {error && (
              <Typography 
                sx={{ 
                  color: '#ff6b6b',
                  mb: 2,
                  fontSize: '0.9rem',
                  textAlign: 'center'
                }}
              >
                {error}
              </Typography>
            )}

            {/* Navigation Buttons */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 4
            }}>
              {currentStep !== 'name' && (
                <IconButton
                  onClick={handlePrevious}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <ArrowBack />
                </IconButton>
              )}

              {currentStep === 'name' && <Box />}

              <Button
                onClick={handleNext}
                disabled={loading || (currentStep === 'name' && (!firstName || !lastName))}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#E55A2B',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)'
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }
                }}
              >
                {loading ? 'Creating Account...' : 
                 currentStep === 'terms' ? 'I Agree' : 'Next →'}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};
