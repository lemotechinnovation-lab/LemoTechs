import React, { useState } from 'react';
import {
  Typography,
  Paper,
  TextField,
  Button,
  Container,
  Box,
  Grid,
  useTheme,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Email,
  Phone,
  LocationOn,
  Send,
  Check
} from '@mui/icons-material';
import { ParticleBackground } from '../../components/Common/ParticleBackground';

export const Contact = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Form submitted:', formData);
    setIsSubmitting(false);
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const contactInfo = [
    {
      icon: <Email sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />,
      title: 'Email Us',
      details: 'hello@lemotech.co.za',
      description: 'Send us an email anytime'
    },
    {
      icon: <Phone sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />,
      title: 'Call Us',
      details: '+27 11 123 4567',
      description: 'Mon-Fri 8AM-6PM, Sat 9AM-3PM'
    },
    {
      icon: <LocationOn sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />,
      title: 'Visit Us',
      details: 'Johannesburg, South Africa',
      description: 'Serving major cities nationwide'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 50%, #190F32 100%)',
      position: 'relative',
      pt: 10
    }}>
      <ParticleBackground />
      
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', md: '3.5rem', lg: '4.5rem' },
                fontWeight: 500,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                background: 'linear-gradient(135deg, #ffffff 0%, #FF6B35 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 3,
                letterSpacing: '-0.02em'
              }}
            >
              Contact Us
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                fontWeight: 400,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Get in touch with us for any questions or to book your cleaning service
            </Typography>
          </motion.div>
        </Box>

        {/* Contact Info Cards */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {contactInfo.map((info, index) => (
            <Grid item xs={12} md={4} key={info.title}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    height: '280px',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 4,
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 107, 53, 0.3)',
                      boxShadow: '0 20px 40px rgba(255, 107, 53, 0.1)'
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    },
                    '&:hover::before': {
                      opacity: 1
                    }
                  }}
                >
                  {/* Icon */}
                  <Box sx={{ mb: 3 }}>
                    {info.icon}
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: '1.3rem',
                      fontWeight: 600,
                      color: 'white',
                      mb: 2,
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}
                  >
                    {info.title}
                  </Typography>

                  {/* Details */}
                  <Typography
                    sx={{
                      color: theme.palette.primary.main,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      mb: 1,
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}
                  >
                    {info.details}
                  </Typography>

                  {/* Description */}
                  <Typography
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}
                  >
                    {info.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Paper
            elevation={0}
            sx={{
              minHeight: '600px',
              display: 'flex',
              flexDirection: 'column',
              p: 6,
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              maxWidth: '800px',
              mx: 'auto',
              mb: 8
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 600,
                color: 'white',
                mb: 4,
                textAlign: 'center',
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}
            >
              Send us a Message
            </Typography>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3
                }}>
                  <Box sx={{ 
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'rgba(76, 175, 80, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check sx={{ fontSize: '2rem', color: '#4CAF50' }} />
                  </Box>
                  <Typography sx={{ 
                    color: 'white', 
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}>
                    Message Sent Successfully!
                  </Typography>
                  <Typography sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }}>
                    We'll get back to you within 24 hours.
                  </Typography>
                </Box>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          '& fieldset': { border: 'none' },
                          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                          '&.Mui-focused': { 
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            border: `1px solid ${theme.palette.primary.main}`
                          }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                        '& .MuiOutlinedInput-input': { color: 'white' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          '& fieldset': { border: 'none' },
                          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                          '&.Mui-focused': { 
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            border: `1px solid ${theme.palette.primary.main}`
                          }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                        '& .MuiOutlinedInput-input': { color: 'white' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          '& fieldset': { border: 'none' },
                          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                          '&.Mui-focused': { 
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            border: `1px solid ${theme.palette.primary.main}`
                          }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                        '& .MuiOutlinedInput-input': { color: 'white' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      multiline
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          '& fieldset': { border: 'none' },
                          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                          '&.Mui-focused': { 
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            border: `1px solid ${theme.palette.primary.main}`
                          }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                        '& .MuiOutlinedInput-input': { color: 'white' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      size="large"
                      disabled={isSubmitting}
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
                      sx={{
                        py: 2,
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                        '&:hover': {
                          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                          boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
                          transform: 'translateY(-2px)'
                        },
                        '&:disabled': {
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.5)'
                        }
                      }}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Contact;