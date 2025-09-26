import { createTheme } from '@mui/material/styles';

const primaryMain = '#FF6B35';
const secondaryMain = '#33FFE0';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: primaryMain,
    },
    secondary: {
      main: secondaryMain,
    },
    background: {
      default: 'linear-gradient(135deg, #1A1040 0%, #251454 50%, #1A1040 100%)',
      paper: 'linear-gradient(135deg, rgba(28, 27, 58, 0.9) 0%, rgba(40, 38, 85, 0.85) 100%)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#F7931E',
    },
    error: {
      main: '#f44336',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    // Page Header - Orange accent from logo
    h4: {
      fontWeight: 700,
      fontSize: '32px',
      lineHeight: 1.2,
      color: '#FF6B35', // Logo orange
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    h5: {
      fontWeight: 700,
      fontSize: '24px',
      lineHeight: 1.3,
      color: '#FF6B35', // Logo orange
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    // Section Headers - Lighter orange from logo, smaller font
    h6: {
      fontWeight: 700,
      fontSize: '18px',
      lineHeight: 1.3,
      color: '#FFFFFF',
    },
    // Section Titles - Reduced font size with logo colors
    subtitle1: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#F7931E', // Light orange from logo
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      lineHeight: 1.4,
    },
    subtitle2: {
      fontSize: '12px',
      fontWeight: 600,
      color: '#F7931E', // Light orange from logo
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#FFFFFF', // Clean white for readability
    },
    body2: {
      fontSize: '12px',
      fontWeight: 500,
      color: '#FFFFFF',
      lineHeight: 1.4,
    },
    caption: {
      fontSize: '10px',
      color: 'rgba(255, 255, 255, 0.6)',
      lineHeight: 1.4,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'linear-gradient(135deg, rgba(28, 27, 58, 0.9) 0%, rgba(40, 38, 85, 0.85) 100%)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          fontWeight: 600,
          '&.MuiChip-sizeSmall': {
            fontSize: '0.625rem',
            height: 20,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 600,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
        },
      },
    },
  },
});

export default theme;
