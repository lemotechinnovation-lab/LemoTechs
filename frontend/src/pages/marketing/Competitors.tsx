import { Typography, Container, Box, Card, Link, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { ParticleBackground } from '../../components/Common';
import { 
  Language, 
  TrendingUp, 
  Analytics
} from '@mui/icons-material';

export const Competitors = () => {
  const competitors = [
    {
      name: "Uber",
      website: "https://www.uber.com/",
      strengths: ["Real-time Tracking", "Seamless Payments", "Global Network", "User Experience"],
      focus: "On-demand Transportation",
      description: "World's leading ride-hailing platform with exceptional user experience, real-time tracking, and seamless payment integration.",
      inspiration: "Real-time tracking, intuitive booking flow, driver ratings system"
    },
    {
      name: "Bolt",
      website: "https://bolt.eu/",
      strengths: ["Fast Booking", "Competitive Pricing", "Driver Network", "Multi-service Platform"],
      focus: "Multi-modal Transportation",
      description: "European ride-hailing leader known for quick booking, competitive rates, and expanding into food delivery and micro-mobility.",
      inspiration: "Quick booking interface, price transparency, multi-service integration"
    },
    {
      name: "Mulberrys Cleaners",
      website: "https://www.mulberryscleaners.com/",
      strengths: ["Eco-friendly", "Pickup & Delivery", "Specialty Services", "Premium Quality"],
      focus: "On-demand Dry Cleaning",
      description: "Premium eco-friendly dry cleaning service with convenient pickup and delivery, specializing in garments and household items.",
      inspiration: "Eco-friendly messaging, service specialization, premium positioning"
    },
    {
      name: "Hamper",
      website: "https://www.usehamper.com/",
      strengths: ["Mobile App", "Subscription Model", "Real-time Updates", "Quality Control"],
      focus: "Laundry & Dry Cleaning",
      description: "On-demand laundry and dry cleaning service with dedicated mobile app, subscription plans, and quality guarantees.",
      inspiration: "Mobile-first approach, subscription options, quality guarantees"
    },
    {
      name: "Tumbl",
      website: "https://www.tumbl.com/",
      strengths: ["24-hour Service", "Simple Booking", "Transparent Pricing", "Contactless Delivery"],
      focus: "Express Laundry Service",
      description: "Express laundry service offering 24-hour turnaround with simple three-step booking process and contactless delivery.",
      inspiration: "Express service model, simple booking flow, contactless options"
    },
    {
      name: "Drop & Dash",
      website: "https://dropanddash.com/",
      strengths: ["Order Tracking", "Flexible Scheduling", "Multiple Locations", "Customer Communication"],
      focus: "Laundry & Cleaning Services",
      description: "Full-service laundry provider with real-time order tracking, flexible pickup scheduling, and comprehensive cleaning options.",
      inspiration: "Order tracking system, flexible scheduling, customer communication"
    }
  ];

  const competitorMetrics = [
    {
      icon: <Language />,
      title: "User Experience Design",
      description: "Analyzing intuitive interfaces, booking flows, and customer journey optimization from market leaders"
    },
    {
      icon: <TrendingUp />,
      title: "Service Innovation",
      description: "Learning from real-time tracking, instant booking, and seamless payment integration features"
    },
    {
      icon: <Analytics />,
      title: "Customer Engagement",
      description: "Studying rating systems, communication patterns, and loyalty programs that drive retention"
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
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                fontWeight: 700,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                background: 'linear-gradient(135deg, #ffffff 0%, #FF6B35 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 3,
                letterSpacing: '-0.02em'
              }}
            >
              Market Leaders & Inspiration
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
              Learning from the best in on-demand services and cleaning industries
            </Typography>
          </motion.div>
        </Box>
        {/* Competitor Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4, mb: 8 }}>
          {competitors.map((competitor, index) => (
            <Box key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '350px',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 3,
                    background: 'linear-gradient(135deg, rgba(0, 136, 255, 0.1) 0%, rgba(64, 169, 255, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      background: 'linear-gradient(135deg, rgba(0, 136, 255, 0.15) 0%, rgba(64, 169, 255, 0.1) 100%)',
                    }
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    {competitor.name}
                  </Typography>
                  <Link 
                    href={competitor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      color: 'primary.main',
                      mb: 2,
                      display: 'block',
                      '&:hover': {
                        color: 'primary.light'
                      }
                    }}
                  >
                    {competitor.website}
                  </Link>
                  <Typography variant="body1" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
                    {competitor.description}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
                      Focus Area:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {competitor.focus}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'secondary.main' }}>
                      What We Can Learn:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontStyle: 'italic' }}>
                      {competitor.inspiration}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
                      Key Strengths:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {competitor.strengths.map((strength, i) => (
                        <Chip
                          key={i}
                          label={strength}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(64, 169, 255, 0.1)',
                            color: 'primary.light',
                            '&:hover': {
                              bgcolor: 'rgba(64, 169, 255, 0.2)',
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            </Box>
          ))}
        </Box>

        {/* Metrics Section */}
        <Box sx={{ mb: 12 }}>
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #40A9FF 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            CleanCourier Innovation Strategy
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {competitorMetrics.map((metric, index) => (
              <Box key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      p: 3,
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, rgba(0, 136, 255, 0.1) 0%, rgba(64, 169, 255, 0.05) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        background: 'linear-gradient(135deg, rgba(0, 136, 255, 0.15) 0%, rgba(64, 169, 255, 0.1) 100%)',
                      }
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 2,
                        '& .MuiSvgIcon-root': {
                          fontSize: 40,
                          color: 'primary.main'
                        }
                      }}
                    >
                      {metric.icon}
                    </Box>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                      {metric.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {metric.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}; 