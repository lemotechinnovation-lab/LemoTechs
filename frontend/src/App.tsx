import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
// Import environment checker for development (disabled)
// import './utils/envChecker';
// Import environment test for debugging
import { ModernLayout } from './components/UI';
import { AuthProvider } from './components/Auth';
import { BookingProvider } from './context/BookingContext';
import { TrackingProvider } from './context/TrackingContext';
import { RoleProvider } from './context/RoleContext';
import { SplashScreen } from './components/Common';
import { 
  ProtectedRoute, 
  DriverRoute, 
  ShopRoute, 
  BusinessRoute 
} from './components/Auth';
import {
  Home,
  NotFound
} from './pages';
// Auth pages
import { Login, Register, CleanerSignup } from './pages/auth';
// Booking pages
import { BookingFlow, SmartBookingFlow, LiveTrackingPage } from './pages/booking';
// Booking components
import { CarTypeBookingDemo, UberStyleTracker } from './components/Booking';
// Business pages
import { Business, BusinessDashboard, FranchiseDashboard, Marketplace, Drive } from './pages/business';
// Dashboard pages
import { Dashboard, RevenueAnalytics } from './pages/dashboard';
// Admin pages
import { AdminDashboard } from './pages/admin';
// Role-based pages
import { DriverDashboard } from './pages/driver';
import { ShopDashboard } from './pages/shop';
// Marketing pages
import { About, Services, Portfolio, Contact, Legal, Competitors, Blog, HowItWorks } from './pages/marketing';
import { GoogleMapsProvider } from './components/Maps/GoogleMap';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B35', // LemoTech orange
      dark: '#FF5722',
      light: '#F7931E',
    },
    secondary: {
      main: '#FFD700', // LemoTech gold
      dark: '#F7931E',
      light: '#FFEB3B',
    },
    background: {
      default: '#1A1040', // Dark purple background
      paper: '#251454',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    // Primary font family: Inter (geometric sans-serif similar to Uber Move)
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    
    // Display Headlines (Uber's proportional specs: 48px/3rem, medium weight)
    h1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500, // Reduced from 700 - Uber uses medium weight
      fontSize: '3rem', // 48px - More proportional for web
      lineHeight: 1.1, // Tight line height like Uber (110%)
      letterSpacing: '-0.02em', // Tight tracking like Uber
      '@media (max-width:600px)': {
        fontSize: '2.5rem' // 40px on mobile
      }
    },
    
    // Section Headlines (Uber's proportional specs: 32px/2rem)
    h2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500, // Reduced from 600 - consistent medium weight
      fontSize: '2rem', // 32px - More proportional section headlines
      lineHeight: 1.15, // Slightly more open than h1
      letterSpacing: '-0.015em',
      '@media (max-width:600px)': {
        fontSize: '1.75rem' // 28px on mobile
      }
    },
    
    // Subsection Headlines (Uber's proportional specs: 24px/1.5rem)
    h3: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500, // Reduced from 600
      fontSize: '1.5rem', // 24px - More proportional subsection size
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      '@media (max-width:600px)': {
        fontSize: '1.375rem' // 22px on mobile
      }
    },
    
    // Card Headlines, Component Titles (Uber's proportional specs: 20px/1.25rem)
    h4: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500, // Reduced from 600
      fontSize: '1.25rem', // 20px - More proportional card title size
      lineHeight: 1.25,
      letterSpacing: '-0.005em',
      '@media (max-width:600px)': {
        fontSize: '1.125rem' // 18px on mobile
      }
    },
    
    // Small Headlines, Form Sections (Uber's proportional specs: 18px/1.125rem)
    h5: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      fontSize: '1.125rem', // 18px - More proportional small headline size
      lineHeight: 1.3,
      letterSpacing: '0em',
      '@media (max-width:600px)': {
        fontSize: '1rem' // 16px on mobile
      }
    },
    
    // Label Headlines (Uber's proportional specs: 16px/1rem)
    h6: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      fontSize: '1rem', // 16px - More proportional label size
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    
    // Main Body Text (Uber's proportional Body: 16px/1rem)
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1rem', // 16px - More proportional body size
      lineHeight: 1.5, // 150% - Uber's comfortable reading line height
      fontWeight: 400,
      letterSpacing: '0.005em', // Slight spacing for clarity
    },
    
    // Secondary Body Text (Uber's proportional Body Small: 14px/0.875rem)
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.875rem', // 14px - More proportional secondary body size
      lineHeight: 1.4,
      fontWeight: 400,
      letterSpacing: '0.01em',
    },
    
    // Button Text (Uber-inspired: clear, readable button text)
    button: {
      fontFamily: '"Inter", sans-serif',
      textTransform: 'none', // Uber doesn't use uppercase
      fontWeight: 500, // Medium weight for buttons
      fontSize: '1rem', // 16px - same as body for accessibility
      letterSpacing: '0.025em',
      lineHeight: 1.2,
    },
    
    // Small Text, Captions
    caption: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.75rem', // 12px
      lineHeight: 1.3,
      fontWeight: 400,
      letterSpacing: '0.025em',
    },
    
    // Overline, Tags, Labels
    overline: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.75rem', // 12px
      lineHeight: 1.2,
      fontWeight: 500,
      letterSpacing: '0.1em', // More space for uppercase
      textTransform: 'uppercase',
    },
    
    // Hero Subtitles (Uber-style supporting text)
    subtitle1: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1.25rem', // 20px - larger supporting text
      lineHeight: 1.4,
      fontWeight: 400,
      letterSpacing: '0.005em',
    },
    
    // Section Subtitles
    subtitle2: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1.125rem', // 18px
      lineHeight: 1.4,
      fontWeight: 400,
      letterSpacing: '0.0075em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '1rem',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #0088FF 0%, #0066CC 100%)',
          boxShadow: '0 4px 14px 0 rgba(0, 136, 255, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0099FF 0%, #0077DD 100%)',
            boxShadow: '0 6px 20px 0 rgba(0, 136, 255, 0.4)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'transparent',
          boxShadow: 'none',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#1A1040',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #1A1040 0%, #251454 100%)',
          minHeight: '100vh',
          width: '100vw',
          margin: 0,
          padding: 0,
          overflowX: 'hidden',
          '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'url(/assets/tech-pattern.jpg) repeat',
            backgroundSize: 'cover',
            opacity: 0.1,
            zIndex: -1,
          },
        },
        '#root': {
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

// Animated Routes Component
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Home />
          </motion.div>
        } />
        <Route path="/about" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <About />
          </motion.div>
        } />
        <Route path="/services" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Services />
          </motion.div>
        } />
        <Route path="/how-it-works" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <HowItWorks />
          </motion.div>
        } />
        <Route path="/portfolio" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Portfolio />
          </motion.div>
        } />
        <Route path="/contact" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Contact />
          </motion.div>
        } />
        <Route path="/legal" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Legal />
          </motion.div>
        } />
        <Route path="/competitors" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Competitors />
          </motion.div>
        } />
        <Route path="/blog" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Blog />
          </motion.div>
        } />
        
        
        {/* Business Routes */}
        <Route path="/business" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Business />
          </motion.div>
        } />
        <Route path="/dashboard" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Dashboard />
          </motion.div>
        } />
        <Route path="/business-dashboard" element={
          <BusinessRoute>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <BusinessDashboard />
            </motion.div>
          </BusinessRoute>
        } />
        <Route path="/drive" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Drive />
          </motion.div>
        } />
        <Route path="/cleaner-signup" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <CleanerSignup />
          </motion.div>
        } />
        <Route path="/franchise" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <FranchiseDashboard />
          </motion.div>
        } />
        <Route path="/marketplace" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Marketplace />
          </motion.div>
        } />
        <Route path="/analytics" element={
          <BusinessRoute>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <RevenueAnalytics />
            </motion.div>
          </BusinessRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <AdminDashboard />
          </motion.div>
        } />
        
        {/* Booking Flow Routes - User Only */}
        <Route path="/book" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <SmartBookingFlow />
            </motion.div>
          </ProtectedRoute>
        } />
        
        {/* Role-based Routes */}
        <Route path="/driver" element={
          <DriverRoute>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <DriverDashboard />
            </motion.div>
          </DriverRoute>
        } />
        
        <Route path="/shop" element={
          <ShopRoute>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <ShopDashboard />
            </motion.div>
          </ShopRoute>
        } />
        <Route path="/book/classic" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <BookingFlow />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/track/booking/:bookingId" element={
          <ProtectedRoute>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <LiveTrackingPage />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/car-types" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <CarTypeBookingDemo onBackToHome={() => window.history.back()} />
          </motion.div>
        } />
        <Route path="/uber-tracker" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <UberStyleTracker onBack={() => window.history.back()} />
          </motion.div>
        } />
        
        <Route path="/404" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <NotFound />
          </motion.div>
        } />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  // Check if user has seen splash recently (within 24 hours)
  const shouldShowSplash = () => {
    const lastSplashTime = localStorage.getItem('lemotech_last_splash');
    if (!lastSplashTime) return true;
    
    const timeDiff = Date.now() - parseInt(lastSplashTime);
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return timeDiff > twentyFourHours;
  };

  const [showSplash, setShowSplash] = useState(shouldShowSplash());

  const handleSplashComplete = () => {
    localStorage.setItem('lemotech_last_splash', Date.now().toString());
    setShowSplash(false);
  };

  return (
    <GoogleMapsProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <RoleProvider>
            <BookingProvider>
              <TrackingProvider>
              <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              {showSplash ? (
                <SplashScreen onComplete={handleSplashComplete} />
              ) : (
                <Routes>
                  {/* Auth routes without layout */}
                  <Route path="/login" element={
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <Login />
                    </motion.div>
                  } />


                  <Route path="/register" element={
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <Register />
                    </motion.div>
                  } />
                  
                  {/* All other routes with layout */}
                  <Route path="/*" element={
                    <ModernLayout>
                      <AnimatedRoutes />
                    </ModernLayout>
                  } />
                </Routes>
              )}
              </Router>
              </TrackingProvider>
            </BookingProvider>
          </RoleProvider>
        </AuthProvider>
      </ThemeProvider>
    </GoogleMapsProvider>
  );
}

export default App;
