// React and React-related imports
import { useState, useEffect } from 'react';

// Third-party libraries
import { Box, Typography, Container, Button, TextField, Divider, IconButton, Alert, Paper, useTheme } from '@mui/material';
import { Google, Microsoft, ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// Absolute imports (from src/)
import { ParticleBackground } from '../../components/Common/ParticleBackground';
import { useAuth } from '../../hooks/useAuth';

export const Login = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [usePhone, setUsePhone] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'microsoft' | null>(null);
  
  // SMS Verification states
  const [currentStep, setCurrentStep] = useState<'input' | 'verify'>('input');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  
  const { signInWithGoogle, signInWithMicrosoft, signInWithPhoneNumber, verifyPhoneNumber } = useAuth();
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!email && !phone) {
      setError('Please enter your email or phone number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      if (usePhone && phone) {
        // Send SMS verification for phone number
        const id = await signInWithPhoneNumber(phone);
        setVerificationId(id);
        setCurrentStep('verify');
      } else if (email && email.includes('@')) {
        // For email, navigate to register for now
        navigate('/register', { state: { contact: email } });
      } else {
        setError('Please enter a valid email or phone number');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const success = await verifyPhoneNumber(verificationId, verificationCode);
      if (success) {
        navigate('/', { state: { message: 'Welcome to LemoTech!' } });
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    try {
      const id = await signInWithPhoneNumber(phone);
      setVerificationId(id);
      setVerificationCode('');
      setResendCooldown(60);
      setError('');
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    }
  };

  const handleCodeChange = (value: string) => {
    const maxLength = 6;
    const numericValue = value.replace(/\D/g, '').slice(0, maxLength);
    setVerificationCode(numericValue);
    setError('');
  };

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSocialLogin = async (provider: 'google' | 'microsoft') => {
    console.log('🔥 Login: Social login clicked for provider:', provider);
    setSocialLoading(provider);
    setError('');
    
    try {
      let success = false;
      
      switch (provider) {
        case 'google':
          console.log('🔥 Login: Calling signInWithGoogle...');
          success = await signInWithGoogle();
          break;
        case 'microsoft':
          console.log('🔥 Login: Calling signInWithMicrosoft...');
          success = await signInWithMicrosoft();
          break;
        default:
          throw new Error('Unsupported provider');
      }
      
      if (success) {
        navigate('/');
      } else {
        setError(`Failed to sign in with ${provider}. Please try again.`);
      }
    } catch (err) {
      setError(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setSocialLoading(null);
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
          component={RouterLink}
          to="/"
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
        
        <Box sx={{ width: 48 }} /> {/* Spacer for balance */}
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 1,
        px: 2,
        maxHeight: 'calc(100vh - 120px)', // Ensure it doesn't exceed viewport
        overflow: 'hidden'
      }}>
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              textAlign: 'center'
            }}
          >
            {/* Logo */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Box
                component="img"
                src="/assets/lemotech-logo.png"
                alt="LemoTech"
                sx={{ height: '48px', width: 'auto' }}
              />
            </Box>

            {/* Title - Dynamic based on step */}
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
                letterSpacing: '-0.02em'
              }}
            >
              {currentStep === 'input' 
                ? "What's your phone number or email?"
                : "Enter verification code"
              }
            </Typography>

            {/* Subtitle for verification step */}
            {currentStep === 'verify' && (
              <Typography 
                sx={{ 
                  fontSize: '0.95rem', 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  mb: 3,
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                }}
              >
                We sent a 6-digit code to {phone}
              </Typography>
            )}

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  border: '1px solid rgba(244, 67, 54, 0.3)',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}
              >
                {error}
              </Alert>
            )}

            {/* Input Field - Dynamic based on step */}
            {currentStep === 'input' ? (
              <TextField
                fullWidth
                placeholder="Enter phone number or email"
                value={usePhone ? phone : email}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.includes('@')) {
                    setUsePhone(false);
                    setEmail(value);
                    setPhone('');
                  } else if (/^\d/.test(value) || value.startsWith('+')) {
                    // Format phone number for SA
                    const digits = value.replace(/\D/g, '');
                    
                    if (digits.startsWith('27')) {
                      const formatted = `+${digits}`;
                      setUsePhone(true);
                      setPhone(formatted);
                      setEmail('');
                    } else if (digits.startsWith('0')) {
                      const formatted = `+27${digits.substring(1)}`;
                      setUsePhone(true);
                      setPhone(formatted);
                      setEmail('');
                    } else if (digits.length > 0) {
                      const formatted = `+27${digits}`;
                      setUsePhone(true);
                      setPhone(formatted);
                      setEmail('');
                    }
                  } else {
                    setUsePhone(false);
                    setEmail(value);
                    setPhone('');
                  }
                }}
                sx={{
                  mb: 2,
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
                      color: 'rgba(255, 255, 255, 0.7)'
                    }
                  }
                }}
              />
            ) : (
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  inputProps={{
                    maxLength: 6,
                    style: {
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  letterSpacing: '0.5rem',
                  fontWeight: 600
                }
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
                      color: 'white',
                      '&::placeholder': {
                        color: 'rgba(255, 255, 255, 0.5)'
                      }
                    }
                  }}
                />
                
                {/* Resend Code Button */}
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button
                    onClick={handleResend}
                    disabled={resendCooldown > 0}
                    sx={{
                      color: resendCooldown > 0 ? 'rgba(255, 255, 255, 0.5)' : theme.palette.primary.main,
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 107, 53, 0.1)'
                      }
                    }}
                  >
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
                  </Button>
                </Box>
              </Box>
            )}

            {/* Main Action Button - Dynamic based on step */}
            <Button
              fullWidth
              onClick={currentStep === 'input' ? handleContinue : handleVerify}
              disabled={
                loading || 
                (currentStep === 'input' && (!email && !phone) || (usePhone && phone.length < 10)) ||
                (currentStep === 'verify' && (!verificationCode || verificationCode.length !== 6))
              }
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                py: 2,
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                mb: 2,
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
              {loading 
                ? 'Please wait...' 
                : currentStep === 'input' 
                  ? 'Continue' 
                  : 'Verify'
              }
            </Button>

            {/* Back button for verification step */}
            {currentStep === 'verify' && (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Button
                  onClick={() => {
                    setCurrentStep('input');
                    setVerificationCode('');
                    setError('');
                  }}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  ← Change phone number
                </Button>
              </Box>
            )}

            {/* Social Login Options - Only show in input step */}
            {currentStep === 'input' && (
              <>
                {/* Divider */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Divider sx={{ flex: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <Typography sx={{ 
                    mx: 2, 
                    color: 'rgba(255, 255, 255, 0.6)', 
                    fontSize: '0.9rem',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}>
                    or
                  </Typography>
                  <Divider sx={{ flex: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                </Box>

                {/* Social Login Buttons - Uber-style */}
            <Button
              fullWidth
              onClick={() => handleSocialLogin('google')}
              disabled={loading || socialLoading === 'google'}
              startIcon={<Google />}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                color: 'rgba(255, 255, 255, 0.9)',
                py: 2,
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                mb: 1.5,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  borderColor: 'rgba(255, 107, 53, 0.5)'
                },
                '&:disabled': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.5)'
                }
              }}
            >
              {socialLoading === 'google' ? 'Signing in...' : 'Continue with Google'}
            </Button>

            <Button
              fullWidth
              onClick={() => handleSocialLogin('microsoft')}
              disabled={loading || socialLoading === 'microsoft'}
              startIcon={<Microsoft />}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                color: 'rgba(255, 255, 255, 0.9)',
                py: 2,
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                mb: 1.5,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 120, 212, 0.1)',
                  borderColor: 'rgba(0, 120, 212, 0.5)'
                },
                '&:disabled': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.5)'
                }
              }}
            >
              {socialLoading === 'microsoft' ? 'Signing in...' : 'Continue with Microsoft'}
            </Button>


            {/* Divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Divider sx={{ flex: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              <Typography sx={{ 
                mx: 2, 
                color: 'rgba(255, 255, 255, 0.6)', 
                fontSize: '0.9rem',
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}>
                or
              </Typography>
              <Divider sx={{ flex: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            </Box>

            {/* QR Code Option */}
            <Button
              fullWidth
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                color: 'rgba(255, 255, 255, 0.9)',
                py: 2,
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                mb: 2,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  borderColor: 'rgba(255, 107, 53, 0.5)'
                }
              }}
            >
              📱 Log in with QR code
            </Button>

            {/* Consent Text - Uber Style */}
            <Typography 
              sx={{ 
                fontSize: '0.75rem', 
                color: 'rgba(255, 255, 255, 0.6)', 
                textAlign: 'center',
                lineHeight: 1.4,
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}
            >
              By proceeding, you consent to get calls, WhatsApp or SMS/RCS messages, 
              including by automated means, from LemoTech and its affiliates to the number provided.
            </Typography>
              </>
            )}
          </Paper>
        </motion.div>
        </Container>
      </Box>
    </Box>
  );
};
