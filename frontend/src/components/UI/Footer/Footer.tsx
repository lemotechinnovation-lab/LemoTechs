import { Box, Container, Typography, Link as MuiLink, IconButton, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  Email,
  Phone,
  LocationOn,
  LinkedIn,
  Twitter,
  GitHub,
  Facebook,
} from '@mui/icons-material';

export const Footer = () => {
  const companyInfo = {
    name: 'CleanCourier',
    parentCompany: 'Lemotech Innovations Pty Ltd',
    email: 'info@lemotechinnovations.co.za',
    phone: '+27 12 345 6789',
    address: 'Johannesburg, South Africa'
  };

  const socialLinks = [
    { icon: <LinkedIn />, name: 'LinkedIn', url: 'https://www.linkedin.com/company/lemotechinnovations' },
    { icon: <Twitter />, name: 'Twitter', url: 'https://twitter.com/lemotechinnovations' },
    { icon: <GitHub />, name: 'GitHub', url: 'https://github.com/lemotechinnovations' },
    { icon: <Facebook />, name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61576770723480&sk=about' },
  ];

  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Legal', path: '/legal' }
  ];

  const services = [
    'Shoe Cleaning',
    'Furniture Cleaning',
    'Mattress Sanitization',
    'Textile Restoration',
    'Luxury Item Care',
    'Pickup & Delivery',
  ];

  const legalLinks = [
    { name: 'Privacy Policy', path: '/legal#privacy' },
    { name: 'Terms of Service', path: '/legal#terms' },
    { name: 'POPIA Compliance', path: '/legal#popia' },
    { name: 'Cookie Policy', path: '/legal#cookies' }
  ];

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        py: 6,
        px: 2,
        mt: 8,
        background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 50%, #190F32 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
          gap: 4,
          mb: 6
        }}>
          {/* Company Info */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: '#fff',
                fontWeight: 600,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                mb: 3,
                fontSize: { xs: '1.1rem', md: '1.2rem' },
              }}
            >
              {companyInfo.name}
            </Typography>
            
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                mb: 2,
                fontSize: '0.9rem',
                lineHeight: 1.6,
              }}
            >
              Professional cleaning services delivered to your door. Experience premium quality with every pickup.
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: '0.8rem',
                fontStyle: 'italic'
              }}
            >
              A subsidiary of {companyInfo.parentCompany}
            </Typography>
          </Box>

          {/* Services */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: '#fff',
                fontWeight: 600,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                mb: 3,
                fontSize: { xs: '1.1rem', md: '1.2rem' },
              }}
            >
              Our Services
            </Typography>
            
            {services.map((service, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  mb: 1,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: '#FF6B35',
                  },
                }}
              >
                {service}
              </Typography>
            ))}
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: '#fff',
                fontWeight: 600,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                mb: 3,
                fontSize: { xs: '1.1rem', md: '1.2rem' },
              }}
            >
              Quick Links
            </Typography>
            
            {footerLinks.map((link, index) => (
              <MuiLink
                key={index}
                component={RouterLink}
                to={link.path}
                sx={{
                  display: 'block',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  textDecoration: 'none',
                  mb: 1,
                  fontSize: '0.9rem',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: '#FF6B35',
                  },
                }}
              >
                {link.name}
              </MuiLink>
            ))}

            <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

            {legalLinks.map((link, index) => (
              <MuiLink
                key={index}
                component={RouterLink}
                to={link.path}
                sx={{
                  display: 'block',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  textDecoration: 'none',
                  mb: 1,
                  fontSize: '0.8rem',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: '#FF6B35',
                  },
                }}
              >
                {link.name}
              </MuiLink>
            ))}
          </Box>

          {/* Contact Info */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: '#fff',
                fontWeight: 600,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                mb: 3,
                fontSize: { xs: '1.1rem', md: '1.2rem' },
              }}
            >
              Contact Us
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Email sx={{ color: '#FF6B35', mr: 1, fontSize: '1.2rem' }} />
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: '0.9rem',
                }}
              >
                {companyInfo.email}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Phone sx={{ color: '#FF6B35', mr: 1, fontSize: '1.2rem' }} />
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: '0.9rem',
                }}
              >
                {companyInfo.phone}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <LocationOn sx={{ color: '#FF6B35', mr: 1, fontSize: '1.2rem' }} />
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: '0.9rem',
                }}
              >
                {companyInfo.address}
              </Typography>
            </Box>

            {/* Social Links */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#FF6B35',
                      transform: 'translateY(-2px)',
                    },
                  }}
                  aria-label={social.name}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Bottom Section */}
        <Divider sx={{ mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '0.85rem',
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            © {new Date().getFullYear()} {companyInfo.name}. All rights reserved.
          </Typography>
          
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '0.85rem',
              textAlign: { xs: 'center', md: 'right' }
            }}
          >
            Made with ❤️ in South Africa
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};