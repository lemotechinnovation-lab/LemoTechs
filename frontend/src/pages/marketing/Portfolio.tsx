
import { Typography, Container, Box, Paper, Grid, Button, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { ParticleBackground } from '../../components/Common/ParticleBackground';
import { useNavigate } from 'react-router-dom';
import { 
  LocalLaundryService,
  CleaningServices,
  CheckCircle
} from '@mui/icons-material';

export const Portfolio = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const projects = [
    {
      id: 'luxury-couch-restoration',
      title: 'Designer Leather Sofa Restoration',
      client: 'Jennifer Martinez',
      description: 'Complete restoration of a premium Italian leather sofa with multiple stains, scratches, and fading from years of use.',
      results: [
        'Restored original rich brown color',
        'Eliminated all stains and odors',
        'Repaired scratches and surface damage',
        'Extended furniture lifespan by 10+ years'
      ],
      icon: <CleaningServices sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />
    },
    {
      id: 'premium-sneaker-collection',
      title: 'Limited Edition Sneaker Collection Cleaning',
      client: 'Marcus Thompson',
      description: 'Professional cleaning and restoration of a valuable sneaker collection including rare Jordan 1s, Yeezys, and vintage Nike Air Max.',
      results: [
        'Restored original colorways on all pairs',
        'Eliminated yellowing and discoloration',
        'Removed all stains and scuff marks',
        'Restored original appearance and condition'
      ],
      icon: <LocalLaundryService sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />
    },
    {
      id: 'king-size-mattress-deep-clean',
      title: 'King Size Mattress Deep Sanitization',
      client: 'The Williams Family',
      description: 'Complete deep cleaning and sanitization of a luxury king-size mattress with allergen removal and stain treatment.',
      results: [
        'Eliminated 99.9% of dust mites and allergens',
        'Removed all visible stains and odors',
        'Improved family sleep quality',
        'Extended mattress lifespan by 5+ years'
      ],
      icon: <CleaningServices sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />
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
              Our Portfolio
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
              Real results from our professional cleaning services across diverse items and materials
            </Typography>
          </motion.div>
              </Box>

        {/* Projects Grid */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {projects.map((project, index) => (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
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
                      {project.icon}
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
                      {project.title}
            </Typography>
      </Box>

                  {/* Client */}
            <Typography
              sx={{
                      color: theme.palette.primary.main,
                      fontSize: '1rem',
                fontWeight: 600,
                      mb: 2,
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}
                  >
                    {project.client}
            </Typography>

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
                      {project.description}
                    </Typography>

                  {/* Results */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      sx={{
                        color: theme.palette.primary.main,
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        mb: 2,
                        fontFamily: '"Plus Jakarta Sans", sans-serif'
                      }}
                    >
                      Key Results:
                          </Typography>
                    {project.results.slice(0, 3).map((result, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                        <CheckCircle sx={{ color: '#4CAF50', fontSize: 16, mt: 0.2 }} />
                        <Typography
                          sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.85rem',
                            lineHeight: 1.4,
                            fontFamily: '"Plus Jakarta Sans", sans-serif'
                          }}
                        >
                          {result}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                  {/* View Details Button */}
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
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
                      View Details
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
              Ready to Transform Your Items?
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
              Join our growing list of satisfied customers who have restored and preserved their valuable items with our expertise.
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
              Schedule Your Service
              </Button>
          </Paper>
        </motion.div>
      </Container>
        </Box>
  );
}; 

export default Portfolio;
