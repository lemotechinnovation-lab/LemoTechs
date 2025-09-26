import { Typography, Container, Box, Paper, Grid, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Group, 
  Timeline, 
  EmojiEvents, 
  Rocket,
  Security,
  Speed,
  TrendingUp
} from '@mui/icons-material';
import { ParticleBackground } from '../../components/Common/ParticleBackground';

export const About = () => {
  const theme = useTheme();

  const values = [
    {
      icon: <Lightbulb sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Innovation Driven',
      description: 'We leverage cutting-edge technology to make cleaning and logistics services more convenient and accessible.'
    },
    {
      icon: <Group sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Customer Focused',
      description: 'Every decision we make prioritizes our customers convenience, satisfaction, and trust.'
    },
    {
      icon: <Timeline sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Reliable Service',
      description: 'We deliver consistent, on-time service that you can depend on, every single time.'
    },
    {
      icon: <EmojiEvents sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />,
      title: 'Quality Excellence',
      description: 'We are committed to delivering premium results that preserve and enhance your items.'
    }
  ];

  const achievements = [
    {
      icon: <Rocket sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />,
      number: '1000+',
      label: 'Items Restored',
      description: 'Successfully cleaned and delivered'
    },
    {
      icon: <Security sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />,
      number: '5.0★',
      label: 'Customer Rating',
      description: 'Consistently excellent satisfaction'
    },
    {
      icon: <Speed sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />,
      number: '24hr',
      label: 'Turnaround Time',
      description: 'Fast pickup and delivery'
    },
    {
      icon: <TrendingUp sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />,
      number: '95%',
      label: 'Return Rate',
      description: 'Customer retention rate'
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
              About LemoTech
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
              Revolutionizing cleaning services with innovation and care
            </Typography>
          </motion.div>
        </Box>

        {/* Values Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {values.map((value, index) => (
            <Grid item xs={12} md={6} lg={3} key={value.title}>
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
                    {value.icon}
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
                    {value.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}
                  >
                    {value.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Achievements Section */}
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
                mb: 4,
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}
            >
              Our Impact
            </Typography>
            
            <Grid container spacing={4}>
              {achievements.map((achievement) => (
                <Grid item xs={12} sm={6} md={3} key={achievement.label}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {achievement.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        mb: 1,
                        fontFamily: '"Plus Jakarta Sans", sans-serif'
                      }}
                    >
                      {achievement.number}
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        mb: 0.5,
                        fontFamily: '"Plus Jakarta Sans", sans-serif'
                      }}
                    >
                      {achievement.label}
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.9rem',
                        fontFamily: '"Plus Jakarta Sans", sans-serif'
                      }}
                    >
                      {achievement.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
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
              Our Mission
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: { xs: '1rem', md: '1.2rem' },
                lineHeight: 1.8,
                maxWidth: '800px',
                mx: 'auto',
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}
            >
              At LemoTech, we're transforming the cleaning industry by combining professional expertise 
              with cutting-edge technology. Our mission is to provide convenient, reliable, and 
              high-quality cleaning services that save you time while extending the life of your 
              valuable items. We believe everyone deserves access to premium cleaning services 
              without the hassle of traditional dry cleaning.
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default About;