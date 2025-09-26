import React, { useState } from 'react';
import { Typography, Container, Box, Paper, Grid, Button, Chip, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { ParticleBackground } from '../../components/Common/ParticleBackground';
import { useNavigate } from 'react-router-dom';
import {
  LocalLaundryService,
  DryCleaning,
  CleaningServices,
  Schedule
} from '@mui/icons-material';

interface Service {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  benefits: string[];
  technologies: string[];
  category: string;
  featured?: boolean;
  detailedDescription?: string;
  useCases?: string[];
  deliverables?: string[];
  timeline?: string;
  basePrice: number;
  priceRange?: { min: number; max: number };
}

type ServiceCategory = 'All' | 'Laundry' | 'Shoes' | 'Express' | 'Premium' | 'Specialty';

export const Services = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('All');

  const categories: ServiceCategory[] = ['All', 'Laundry', 'Shoes', 'Express', 'Premium', 'Specialty'];

  const services: Service[] = [
    {
      id: 'premium-laundry',
      icon: <LocalLaundryService sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Premium Laundry Service',
      description: 'Professional washing, drying, and folding of all your garments with premium care and eco-friendly detergents.',
      category: 'Laundry',
      features: [
        'Wash & Fold Service',
        'Delicate Fabric Care',
        'Eco-Friendly Detergents',
        'Stain Treatment',
        'Professional Pressing'
      ],
      benefits: [
        'Save 3-5 hours of your time weekly',
        'Professional-grade cleaning quality',
        'Eco-friendly and gentle on fabrics',
        'Pickup and delivery convenience'
      ],
      technologies: ['Commercial Washers', 'Eco Detergents', 'Steam Pressing', 'Fabric Softeners'],
      featured: true,
      detailedDescription: 'Our premium laundry service provides comprehensive care for all your garments. From everyday clothes to delicate fabrics, we ensure each item receives the appropriate treatment for optimal cleanliness and fabric preservation.',
      useCases: [
        'Busy professionals saving time on household chores',
        'Families with heavy laundry loads',
        'People with delicate or expensive clothing',
        'Those who want professional-quality results'
      ],
      deliverables: [
        'Thoroughly cleaned and fresh-smelling clothes',
        'Professional folding and packaging',
        'Stain removal treatment report',
        'Care instructions for maintaining garment quality'
      ],
      timeline: '24-48 hours standard turnaround',
      basePrice: 150,
      priceRange: { min: 120, max: 250 }
    },
    {
      id: 'sneaker-cleaning',
      icon: <DryCleaning sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Professional Shoe Cleaning',
      description: 'Specialized cleaning and restoration services for all types of footwear including sneakers, leather shoes, and boots.',
      category: 'Shoes',
      features: [
        'Deep Clean & Sanitization',
        'Stain & Scuff Removal',
        'Leather Conditioning',
        'Sole & Lace Cleaning',
        'Protective Treatment'
      ],
      benefits: [
        'Extend shoe lifespan by 2-3x',
        'Professional-grade cleaning products',
        'Restore original appearance and color',
        'Eliminate odors and bacteria'
      ],
      technologies: ['Ultrasonic Cleaners', 'Leather Conditioners', 'Specialized Brushes', 'Protective Sprays'],
      featured: true,
      detailedDescription: 'Our professional shoe cleaning service brings your footwear back to life. We use specialized techniques and premium products to clean, restore, and protect all types of shoes, from everyday sneakers to luxury leather goods.',
      useCases: [
        'Sneaker enthusiasts maintaining their collection',
        'Business professionals keeping dress shoes pristine',
        'Athletes needing sports shoe maintenance',
        'Fashion-conscious individuals preserving expensive footwear'
      ],
      deliverables: [
        'Deep cleaned and sanitized shoes',
        'Restored original color and appearance',
        'Conditioned leather (where applicable)',
        'Protective treatment application'
      ],
      timeline: '12-24 hours for standard cleaning',
      basePrice: 80,
      priceRange: { min: 60, max: 150 }
    },
    {
      id: 'express-service',
      icon: <Schedule sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Express Same-Day Service',
      description: 'Ultra-fast cleaning service for urgent needs with same-day pickup and delivery within 8 hours.',
      category: 'Express',
      features: [
        'Same-Day Pickup & Delivery',
        'Priority Processing',
        'Real-Time Tracking',
        'Emergency Stain Treatment',
        'Quality Guarantee'
      ],
      benefits: [
        'Get items back within 8 hours',
        'Perfect for urgent business needs',
        'No compromise on cleaning quality',
        'Real-time status updates'
      ],
      technologies: ['Express Machines', 'Rapid Drying', 'Priority Queue', 'Mobile Tracking'],
      detailedDescription: 'Our express service is designed for those urgent moments when you need your items cleaned quickly without compromising quality. Perfect for business emergencies, special events, or last-minute needs.',
      useCases: [
        'Business travelers needing quick turnaround',
        'Special event preparation',
        'Emergency stain removal',
        'Last-minute professional meetings'
      ],
      deliverables: [
        'Same-day cleaned items',
        'Priority customer support',
        'Real-time tracking updates',
        'Quality assurance guarantee'
      ],
      timeline: '4-8 hours express turnaround',
      basePrice: 250,
      priceRange: { min: 200, max: 350 }
    },
    {
      id: 'dry-cleaning',
      icon: <CleaningServices sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Professional Dry Cleaning',
      description: 'Expert dry cleaning services for delicate fabrics, suits, dresses, and specialty garments requiring professional care.',
      category: 'Premium',
      features: [
        'Delicate Fabric Cleaning',
        'Suit & Dress Care',
        'Stain Removal Expertise',
        'Professional Pressing',
        'Fabric Protection'
      ],
      benefits: [
        'Preserve expensive garments',
        'Professional finishing quality',
        'Specialized stain treatment',
        'Expert fabric knowledge'
      ],
      technologies: ['Eco-Friendly Solvents', 'Professional Presses', 'Stain Treatment', 'Fabric Analysis'],
      detailedDescription: 'Our professional dry cleaning service uses advanced eco-friendly methods to clean delicate fabrics that cannot be washed with water. We specialize in suits, dresses, and luxury garments.',
      useCases: [
        'Business professionals maintaining suits',
        'Special occasion dress care',
        'Luxury garment preservation',
        'Delicate fabric cleaning needs'
      ],
      deliverables: [
        'Professionally cleaned and pressed garments',
        'Stain removal treatment',
        'Protective packaging',
        'Care recommendations'
      ],
      timeline: '24-72 hours depending on garment type',
      basePrice: 180,
      priceRange: { min: 150, max: 300 }
    }
  ];

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(service => service.category === selectedCategory);

  const handleCategoryChange = (category: ServiceCategory) => {
    setSelectedCategory(category);
  };

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
              Our Services
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
              Professional cleaning services designed to save you time and keep you looking your best
            </Typography>
          </motion.div>
        </Box>

        {/* Category Filter */}
        <Box sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
          flexWrap: 'wrap',
          mb: 6
        }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => handleCategoryChange(category)}
              sx={{
                bgcolor: selectedCategory === category ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: `1px solid ${selectedCategory === category ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.2)'}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                '&:hover': {
                  bgcolor: selectedCategory === category ? theme.palette.primary.dark : 'rgba(255, 255, 255, 0.15)',
                  transform: 'translateY(-2px)',
                },
              }}
            />
          ))}
        </Box>

        {/* Services Grid */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {filteredServices.map((service, index) => (
            <Grid item xs={12} md={6} lg={6} key={service.id}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
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
                  {/* Icon and Title */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                    <Box sx={{ fontSize: 32, color: 'primary.main' }}>
                      {service.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: '1.3rem',
                        fontWeight: 600,
                        color: 'white',
                        fontFamily: '"Plus Jakarta Sans", sans-serif'
                      }}
                    >
                      {service.title}
                    </Typography>
                  </Box>

                  {/* Description */}
                  <Typography
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      mb: 3,
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}
                  >
                    {service.description}
                  </Typography>

                  {/* Pricing Section */}
                  <Box sx={{
                    mb: 3,
                    p: 2,
                    background: 'rgba(255, 107, 53, 0.1)',
                    borderRadius: 2,
                    border: '1px solid rgba(255, 107, 53, 0.2)'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                      <Typography variant="h6" sx={{
                        color: '#FF6B35',
                        fontWeight: 700,
                        fontSize: '1.5rem',
                        fontFamily: '"Plus Jakarta Sans", sans-serif'
                      }}>
                        From R{service.basePrice}
                      </Typography>
                      {service.priceRange && (
                        <Typography variant="body2" sx={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.85rem'
                        }}>
                          (R{service.priceRange.min} - R{service.priceRange.max})
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="caption" sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.75rem'
                    }}>
                      💡 Transparent pricing • No hidden fees
                    </Typography>
                  </Box>

                  {/* Features */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{
                      mb: 1,
                      color: theme.palette.primary.main,
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}>
                      Key Features:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {service.features.slice(0, 3).map((feature, i) => (
                        <Chip
                          key={i}
                          label={feature}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(255, 107, 53, 0.1)',
                            color: 'rgba(255, 255, 255, 0.8)',
                            border: '1px solid rgba(255, 107, 53, 0.2)',
                            fontSize: '0.75rem'
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Book Now Button */}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/')}
                    sx={{
                      color: theme.palette.primary.main,
                      borderColor: theme.palette.primary.main,
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      '&:hover': {
                        borderColor: theme.palette.primary.light,
                        backgroundColor: 'rgba(255, 107, 53, 0.1)',
                      }
                    }}
                  >
                    Book Now
                  </Button>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 6,
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              textAlign: 'center',
              mb: 8
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 600,
                color: 'white',
                mb: 3,
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}
            >
              Ready to Experience Professional Cleaning?
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.6,
                mb: 4,
                maxWidth: '600px',
                mx: 'auto',
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}
            >
              Join thousands of satisfied customers who trust LemoTech for their cleaning needs.
              Book your service today and experience the difference.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{
                py: 2,
                px: 4,
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
                }
              }}
            >
              Book Your Service Now
            </Button>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Services;
