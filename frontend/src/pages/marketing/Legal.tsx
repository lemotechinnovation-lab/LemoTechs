import React, { useEffect, type ReactNode } from 'react';
import { Typography, Container, Box, Card, Button, IconButton } from '@mui/material';
import type { AlertColor } from '@mui/material';
import { motion } from 'framer-motion';
import { ParticleBackground } from '../../components/Common';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateLegalDocs } from '../../services';
import { 
  PrivacyTip, 
  Gavel, 
  Security, 
  Cookie,
  Description,
  DownloadForOffline,
  Print,
  Share,
  ContentCopy,
  CheckCircle
} from '@mui/icons-material';
import { Snackbar, Alert, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';

export interface ContentItem {
  subtitle: string;
  text: string;
  bullets?: string[];
}

export interface Section {
  id: string;
  icon: ReactNode;
  title: string;
  lastUpdated: string;
  content: ContentItem[];
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export const Legal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = React.useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    // Scroll to anchor if present
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const handleCopyContent = async (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      try {
        await navigator.clipboard.writeText(section.textContent || '');
        setSnackbar({ open: true, message: 'Content copied to clipboard', severity: 'success' });
      } catch {
        setSnackbar({ open: true, message: 'Failed to copy content', severity: 'error' });
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Lemotech Legal Documents',
          text: 'View our legal documents and policies',
          url: window.location.href
        });
      } catch {
        setSnackbar({ open: true, message: 'Failed to share content', severity: 'error' });
      }
    } else {
      setSnackbar({ open: true, message: 'Sharing not supported on this device', severity: 'info' });
    }
  };

  const handleDownload = async (format: 'pdf' | 'docx') => {
    try {
      setSnackbar({ 
        open: true, 
        message: `Generating ${format.toUpperCase()} document...`, 
        severity: 'info' 
      });

      // Simulate document generation
      const legalDoc = format === 'pdf' ? generateLegalDocs.getTermsOfService() : generateLegalDocs.getPrivacyPolicy();
      const blob = new Blob([legalDoc.content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `lemotech-legal-documents.${format}`;
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(a);

      setSnackbar({ 
        open: true, 
        message: `${format.toUpperCase()} document downloaded successfully`, 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Download error:', error);
      setSnackbar({ 
        open: true, 
        message: `Failed to generate ${format.toUpperCase()} document`, 
        severity: 'error' 
      });
    }
  };

  const sections: Section[] = [
    {
      id: 'privacy',
      icon: <PrivacyTip sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Privacy Policy',
      lastUpdated: '2025-05-01',
      content: [
        {
          subtitle: 'Information Collection',
          text: 'We collect information that you provide directly to us when using our services, including:',
          bullets: [
            'Personal information (name, email, phone)',
            'Usage data and analytics',
            'Device and connection information',
            'Cookies and tracking technologies'
          ]
        },
        {
          subtitle: 'Use of Information',
          text: 'Your information helps us:',
          bullets: [
            'Provide and improve our services',
            'Communicate with you about updates',
            'Process transactions and requests',
            'Comply with legal obligations',
            'Protect against fraudulent activities'
          ]
        },
        {
          subtitle: 'Data Security',
          text: 'We implement industry-standard security measures including:',
          bullets: [
            'Encryption of data in transit and at rest',
            'Regular security assessments',
            'Access controls and authentication',
            'Continuous monitoring and logging'
          ]
        }
      ]
    },
    {
      id: 'terms',
      icon: <Gavel sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Terms of Service',
      lastUpdated: '2025-05-01',
      content: [
        {
          subtitle: 'Service Usage',
          text: 'By accessing our services, you agree to these terms and all applicable laws and regulations.'
        },
        {
          subtitle: 'Intellectual Property',
          text: 'All content and materials available through our services are protected by intellectual property rights.'
        }
      ]
    },
    {
      id: 'popia',
      icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'POPIA Compliance',
      lastUpdated: '2025-05-01',
      content: [
        {
          subtitle: 'Data Protection',
          text: 'We comply with the Protection of Personal Information Act (POPIA) of South Africa in collecting, processing, and storing personal information.'
        },
        {
          subtitle: 'Your Rights',
          text: 'You have the right to access, correct, and request deletion of your personal information under POPIA.'
        }
      ]
    },
    {
      id: 'cookies',
      icon: <Cookie sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Cookie Policy',
      lastUpdated: '2025-05-01',
      content: [
        {
          subtitle: 'Cookie Usage',
          text: 'We use cookies and similar technologies to enhance your experience and analyze usage patterns.'
        },
        {
          subtitle: 'Cookie Control',
          text: 'You can control cookie settings through your browser preferences.'
        }
      ]
    }
  ];

  const speedDialActions = [
    { icon: <Print />, name: 'Print', action: handlePrint },
    { icon: <Share />, name: 'Share', action: handleShare },
    { icon: <DownloadForOffline />, name: 'Download PDF', action: () => handleDownload('pdf') },
    { icon: <Description />, name: 'Download Word', action: () => handleDownload('docx') }
  ];

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
      <ParticleBackground />
      
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          color: 'white',
          py: { xs: 10, md: 15 },
          mb: 8,
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
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, px: { xs: 2, sm: 3, md: 4 } }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Typography
              variant="h1"
              sx={{
                textAlign: 'center',
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 500, // Reduced from 700 for softer appearance
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #40A9FF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Legal & Compliance
            </Typography>
            <Typography
              variant="h5"
              sx={{
                textAlign: 'center',
                maxWidth: 800,
                mx: 'auto',
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              Our commitment to transparency and compliance
            </Typography>

            {/* Quick Navigation */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'center', 
              mt: 4,
              flexWrap: 'wrap'
            }}>
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant="outlined"
                  onClick={() => {
                    navigate(`/legal#${section.id}`);
                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  {section.title}
                </Button>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            id={section.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card
              sx={{
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
                mb: 4,
                p: 4,
                background: 'linear-gradient(135deg, rgba(0, 136, 255, 0.1) 0%, rgba(64, 169, 255, 0.05) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                scrollMarginTop: '100px',
                position: 'relative',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(0, 136, 255, 0.15) 0%, rgba(64, 169, 255, 0.1) 100%)',
                  '& .section-actions': {
                    opacity: 1
                  }
                }
              }}
            >
              <Box 
                className="section-actions"
                sx={{ 
                  position: 'absolute', 
                  top: 16, 
                  right: 16,
                  display: 'flex',
                  gap: 1,
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => handleCopyContent(section.id)}
                  sx={{ 
                    color: 'primary.main',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                {section.icon}
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #40A9FF 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    Last updated: {section.lastUpdated}
                  </Typography>
                </Box>
              </Box>
              
              {section.content.map((item, i) => (
                <Box key={i} sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 1,
                      color: 'primary.main',
                      fontWeight: 600,
                    }}
                  >
                    {item.subtitle}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.7,
                      fontSize: '1.1rem',
                      mb: item.bullets ? 2 : 0
                    }}
                  >
                    {item.text}
                  </Typography>
                  {item.bullets && (
                    <Box sx={{ pl: 2 }}>
                      {item.bullets.map((bullet, index) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            mb: 1
                          }}
                        >
                          <CheckCircle 
                            sx={{ 
                              fontSize: 16, 
                              color: 'primary.main' 
                            }} 
                          />
                          <Typography
                            variant="body1"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '1rem',
                            }}
                          >
                            {bullet}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Card>
          </motion.div>
        ))}

        {/* Download Section */}
        <Box sx={{ textAlign: 'center', mt: 6, mb: 12 }}>
          <Button
            variant="contained"
            startIcon={<Description />}
            sx={{
              py: 2,
              px: 4,
              background: 'linear-gradient(135deg, #0088FF 0%, #0066CC 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0099FF 0%, #0077DD 100%)',
              }
            }}
          >
            Download All Policies (PDF)
          </Button>
        </Box>
      </Container>

      {/* SpeedDial for actions */}
      <SpeedDial
        ariaLabel="Legal Document Actions"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action}
          />
        ))}
      </SpeedDial>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 