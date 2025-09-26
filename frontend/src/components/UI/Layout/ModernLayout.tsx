import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  Chip,
  Divider,
  useTheme,
  alpha,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  DriveEta,
  Business,
  Dashboard,
  StoreMallDirectory,
  AccountTree,
  Info,
  Support,
  Star,
  Settings,
  ExitToApp,
  Language,
  DarkMode,
  LightMode,
  LocationOn,
  ExpandMore,
  CleaningServices,
  Article,
  HelpOutline,
  Assessment,
  WorkOutline,
  CompareArrows,
  Gavel
} from '@mui/icons-material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Footer } from '../Footer/Footer';
import { RealTimeNotifications } from '../../Common/RealTimeNotifications';
import { useBooking } from '../../../context/BookingContext';
import { useAuth, useNavigationAnalytics } from '../../../hooks';
import { SmartFAB } from '../EnhancedComponents/SmartFAB';
import { FloatingTrackingButton } from '../../Common/FloatingTrackingButton';
import { useTracking } from '../../../context/TrackingContext';

interface ModernLayoutProps {
  children: ReactNode;
}

// LemoTech Navigation Structure with Dropdowns
interface NavItem {
  id: string;
  title: string;
  path: string;
  description: string;
  icon: React.ElementType;
  badge?: {
    text: string;
    color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  };
  isNew?: boolean;
  isPremium?: boolean;
  requiresAuth?: boolean;
}

interface DropdownGroup {
  id: string;
  title: string;
  icon: React.ElementType;
  items: NavItem[];
}

// Complete navigation structure based on App.tsx routes
const NAVIGATION_DROPDOWNS: DropdownGroup[] = [
  {
    id: 'services',
    title: 'Services',
    icon: CleaningServices,
    items: [
      {
        id: 'services',
        title: 'All Services',
        path: '/services',
        description: 'View our service catalog',
        icon: CleaningServices
      },
      {
        id: 'how-it-works',
        title: 'How It Works',
        path: '/how-it-works',
        description: 'Learn about our process',
        icon: HelpOutline
      },
      {
        id: 'portfolio',
        title: 'Our Work',
        path: '/portfolio',
        description: 'See our completed projects',
        icon: WorkOutline
      }
    ]
  },
  {
    id: 'business',
    title: 'Business',
    icon: Business,
    items: [
      {
        id: 'business',
        title: 'For Business',
        path: '/business',
        description: 'Corporate cleaning solutions',
        icon: Business,
        isPremium: true
      },
      {
        id: 'business-dashboard',
        title: 'Business Dashboard',
        path: '/business-dashboard',
        description: 'Manage your business account',
        icon: Dashboard,
        requiresAuth: true
      },
      {
        id: 'franchise',
        title: 'Franchise',
        path: '/franchise',
        description: 'Partner with us',
        icon: AccountTree,
        isPremium: true,
        isNew: true
      },
      {
        id: 'marketplace',
        title: 'Marketplace',
        path: '/marketplace',
        description: 'Premium cleaning products',
        icon: StoreMallDirectory,
        isNew: true,
        badge: { text: 'New', color: 'primary' }
      },
      {
        id: 'analytics',
        title: 'Analytics',
        path: '/analytics',
        description: 'Business insights',
        icon: Assessment,
        requiresAuth: true,
        isPremium: true
      }
    ]
  },
  {
    id: 'more',
    title: 'More',
    icon: Info,
    items: [
      {
        id: 'about',
        title: 'About Us',
        path: '/about',
        description: 'Our story and mission',
        icon: Info
      },
      {
        id: 'blog',
        title: 'Blog',
        path: '/blog',
        description: 'Latest news and tips',
        icon: Article
      },
      {
        id: 'competitors',
        title: 'Compare',
        path: '/competitors',
        description: 'Why choose LemoTech',
        icon: CompareArrows
      },
      {
        id: 'legal',
        title: 'Legal',
        path: '/legal',
        description: 'Terms and privacy',
        icon: Gavel
      },
      {
        id: 'contact',
        title: 'Contact',
        path: '/contact',
        description: 'Get in touch',
        icon: Support
      }
    ]
  }
];

// Main navigation items (always visible)
const MAIN_NAV_ITEMS: NavItem[] = [
  {
    id: 'drive',
    title: 'Drive ',
    path: '/drive',
    description: 'Earn money with LemoTech',
    icon: DriveEta,
    badge: { text: 'Earn R5K+', color: 'warning' }
  }
];

export const ModernLayout = ({ children }: ModernLayoutProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { isBookingActive } = useBooking();
  const { user, isAuthenticated, logout } = useAuth();
  const { trackingState, restoreTracking } = useTracking();
  const { trackNavClick, trackMobileMenuToggle } = useNavigationAnalytics();

  // State management
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true); // Keep our dark theme
  const [currentCity, setCurrentCity] = useState('Johannesburg');

  // Dropdown menu anchors
  const [dropdownAnchors, setDropdownAnchors] = useState<{ [key: string]: HTMLElement | null }>({
    services: null,
    business: null,
    more: null
  });

  // Scroll-based header transformation (Uber-style)
  const { scrollY } = useScroll();
  const headerBlur = useTransform(scrollY, [0, 100], [20, 30]);

  // Hide header and footer on booking pages
  const hideHeaderFooter = location.pathname.includes('/book') || 
                           location.pathname.includes('/booking') || 
                           location.pathname.includes('/ride-booking') ||
                           location.pathname === '/booking-confirmation' ||
    isBookingActive;

  // Optimized scroll detection
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
      setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dropdown handlers
  const handleDropdownOpen = (dropdownId: string, event: React.MouseEvent<HTMLElement>) => {
    setDropdownAnchors(prev => ({
      ...prev,
      [dropdownId]: event.currentTarget
    }));
  };

  const handleDropdownClose = (dropdownId: string) => {
    setDropdownAnchors(prev => ({
      ...prev,
      [dropdownId]: null
    }));
  };

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  // Helper functions - Fixed to prevent false matches
  const isActivePath = useCallback((path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    // Exact match first
    if (location.pathname === path) {
      return true;
    }

    // Only allow startsWith for paths that end with a slash or are followed by a slash
    // This prevents /business from matching /business-dashboard
    return location.pathname.startsWith(path + '/');
  }, [location.pathname]);

  // Check if any item in dropdown is active
  const isDropdownActive = useCallback((dropdownId: string) => {
    const dropdown = NAVIGATION_DROPDOWNS.find(d => d.id === dropdownId);
    return dropdown?.items.some(item => isActivePath(item.path)) || false;
  }, [isActivePath]);

  // User menu handlers
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  // City selector (Uber-style location picker)
  const handleCityChange = (city: string) => {
    setCurrentCity(city);
    trackNavClick(`/city/${city}`, `city_${city}`);
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Navigation Button Component (LemoTech Dark Theme)
  const NavButton = ({ item, variant = 'desktop' }: { item: NavItem; variant?: 'desktop' | 'mobile' }) => {
    const isActive = isActivePath(item.path);

  return (
      <Button
        component={RouterLink}
        to={item.path}
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
        onClick={() => {
          if (variant === 'mobile') {
            setMobileOpen(false);
            trackMobileMenuToggle(false);
          }
          trackNavClick(item.path, item.title);
          scrollToTop();
        }}
        sx={{
          // LemoTech dark theme colors
          color: isActive ? '#ffffff' : 'rgba(255,255,255,0.87)',
          textTransform: 'none',
          fontSize: variant === 'desktop' ? '0.8rem' : '0.9rem',
          fontWeight: isActive ? 600 : 500,
          fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
          px: variant === 'desktop' ? 2.5 : 2,
          py: variant === 'desktop' ? 1.25 : 1.5,
          borderRadius: '10px',
          position: 'relative',
          background: isActive
            ? alpha(theme.palette.primary.main, 0.15)
            : 'transparent',
          border: item.isPremium ? `1px solid ${alpha('#FFD700', 0.3)}` : 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          minWidth: variant === 'desktop' ? 'auto' : '100%',
          justifyContent: variant === 'desktop' ? 'center' : 'flex-start',
          gap: 1.25,
          '&:hover': {
            color: '#ffffff',
            background: isActive
              ? alpha(theme.palette.primary.main, 0.25)
              : alpha('#ffffff', 0.08),
            transform: variant === 'desktop' ? 'translateY(-1px)' : 'none',
            boxShadow: variant === 'desktop'
              ? '0 4px 12px rgba(0, 0, 0, 0.15)'
              : 'none',
          },
          // LemoTech active indicator (bottom line)
          '&::after': isActive && variant === 'desktop' ? {
            content: '""',
            position: 'absolute',
            bottom: '-2px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '24px',
            height: '2px',
            borderRadius: '1px',
            background: theme.palette.primary.main,
            boxShadow: `0 0 8px ${theme.palette.primary.main}`,
          } : {},
          // Premium effects
          ...(item.isPremium && hoveredItem === item.id && {
            background: `linear-gradient(45deg, ${alpha('#FFD700', 0.1)}, ${alpha('#FFA500', 0.1)})`,
            boxShadow: `0 0 20px ${alpha('#FFD700', 0.2)}`,
          })
        }}
      >
        {variant === 'mobile' && (
          <item.icon sx={{
            fontSize: '1.25rem',
            color: isActive ? theme.palette.primary.main : 'inherit'
          }} />
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {item.title}

          {/* Badges and indicators */}
          {item.isNew && (
            <Chip
              label="NEW"
              size="small"
              sx={{
                height: '18px',
                fontSize: '0.625rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                color: 'white',
                '& .MuiChip-label': { px: 0.75 }
              }}
            />
          )}

          {item.isPremium && (
            <Star sx={{
              fontSize: '0.875rem',
              color: '#FFD700',
              filter: 'drop-shadow(0 0 2px rgba(255, 215, 0, 0.5))'
            }} />
          )}

          {item.badge && (
            <Chip
              label={item.badge.text}
              size="small"
              color={item.badge.color}
              sx={{
                height: '18px',
                fontSize: '0.625rem',
                fontWeight: 600,
                '& .MuiChip-label': { px: 0.75 }
              }}
            />
          )}
        </Box>
      </Button>
    );
  };

  // City Selector Component (LemoTech dark theme)
  const CitySelector = () => (
    <Button
      onClick={() => handleCityChange(currentCity === 'Johannesburg' ? 'Cape Town' : 'Johannesburg')}
      sx={{
        color: 'rgba(255,255,255,0.8)',
        textTransform: 'none',
        fontSize: '0.875rem',
        fontWeight: 500,
        fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
        px: 2,
        py: 1,
        borderRadius: '8px',
        background: alpha('#ffffff', 0.05),
        border: '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.2s ease',
        '&:hover': {
          background: alpha('#ffffff', 0.1),
          color: '#ffffff',
          transform: 'translateY(-1px)'
        }
      }}
      startIcon={<LocationOn sx={{ fontSize: '1rem' }} />}
    >
      {currentCity}
    </Button>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header - LemoTech Dark Theme with Dropdowns */}
      {!hideHeaderFooter && (
        <motion.div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1100
          }}
        >
          <AppBar
            position="static"
            elevation={0}
            sx={{
            background: isScrolled
                ? 'linear-gradient(135deg, rgba(15, 10, 40, 0.98) 0%, rgba(30, 20, 64, 0.98) 50%, rgba(25, 15, 50, 0.98) 100%)'
                : 'linear-gradient(135deg, rgba(15, 10, 40, 0.95) 0%, rgba(30, 20, 64, 0.95) 50%, rgba(25, 15, 50, 0.95) 100%)',
              backdropFilter: `blur(${headerBlur.get()}px) saturate(180%)`,
              borderBottom: isScrolled
                ? `1px solid ${alpha('#ffffff', 0.1)}`
                : 'none',
              transition: 'border-bottom 0.3s ease',
              boxShadow: isScrolled
                ? '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)'
                : 'none',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar 
            disableGutters 
            sx={{ 
                  minHeight: { xs: '56px', sm: '64px' },
                  px: { xs: 1.5, sm: 2 },
              display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr auto',
                    lg: 'auto 1fr auto auto'
                  },
              alignItems: 'center',
                  gap: { xs: 1.5, lg: 3 }
                }}
              >
                {/* Logo - Clean and Simple */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
            <Box 
              component={RouterLink} 
              to="/" 
                    onClick={scrollToTop}
              sx={{ 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                      py: 1,
                      px: 1.5,
                borderRadius: '12px',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                        background: alpha('#ffffff', 0.08),
                },
              }}
            >
              <Box
                component="img"
                src="/assets/lemotech-logo.png"
                alt="LemoTech"
                sx={{
                        height: { xs: '45px', sm: '55px', md: '60px', lg: '65px' },
                  width: 'auto',
                        maxWidth: '220px',
                  objectFit: 'contain',
                        filter: 'brightness(1.1)',
                      }}
                    />
                  </Box>
                </motion.div>

                {/* City Selector */}
                <Box sx={{
                  display: { xs: 'none', lg: 'flex' },
                  justifyContent: 'flex-start'
                }}>
                  <CitySelector />
            </Box>
            
                {/* Dropdown Navigation */}
            <Box sx={{ 
              display: { xs: 'none', lg: 'flex' }, 
              justifyContent: 'center',
              alignItems: 'center',
                  gap: 2
                }}>
                  {/* Main Nav Items (always visible) - MOVED TO FIRST POSITION */}
                  {MAIN_NAV_ITEMS.map((item) => (
                    <NavButton key={item.id} item={item} />
                  ))}
                  
                  {/* Dropdown Menus */}
                  {NAVIGATION_DROPDOWNS.map((dropdown) => (
                <Button 
                      key={dropdown.id}
                      onClick={(e) => handleDropdownOpen(dropdown.id, e)}
                      endIcon={<ExpandMore sx={{ 
                        fontSize: '0.875rem',
                        transition: 'transform 0.2s ease',
                        transform: dropdownAnchors[dropdown.id] ? 'rotate(180deg)' : 'rotate(0deg)'
                      }} />}
                  sx={{ 
                        color: isDropdownActive(dropdown.id) ? '#ffffff' : 'rgba(255,255,255,0.87)',
                    textTransform: 'none',
                        fontSize: '0.75rem',
                        fontWeight: isDropdownActive(dropdown.id) ? 600 : 500,
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        px: 1.5,
                        py: 1,
                        borderRadius: '6px',
                    position: 'relative',
                        background: isDropdownActive(dropdown.id) 
                          ? alpha(theme.palette.primary.main, 0.15)
                          : 'transparent',
                        transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#ffffff',
                          background: isDropdownActive(dropdown.id) 
                            ? alpha(theme.palette.primary.main, 0.25)
                            : alpha('#ffffff', 0.08),
                        },
                      }}
                    >
                      {dropdown.title}
                </Button>
              ))}
            </Box>

                {/* User Actions - Uber-style clean buttons */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1.25,
                  justifyContent: 'flex-end'
                }}>
                  {/* Book Now Button - Prominent CTA */}
                  <Button
                    variant="contained"
                    size="large"
                    component={RouterLink}
                    to="/book"
                    sx={{
                      background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                      color: 'white',
                      fontWeight: 600,
                      px: 2.5,
                      py: 1.25,
                      borderRadius: 2.5,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      boxShadow: '0 4px 14px 0 rgba(255, 107, 53, 0.4)',
                      display: { xs: 'none', md: 'flex' },
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FF5722 0%, #FF6B35 100%)',
                        boxShadow: '0 6px 20px 0 rgba(255, 107, 53, 0.6)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Book Now
                  </Button>
                  
                  {/* Theme & Language toggles - LemoTech Dark */}
                  <IconButton
                    onClick={handleThemeToggle}
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      color: 'rgba(255,255,255,0.7)',
                      background: alpha('#ffffff', 0.05),
                      '&:hover': {
                        background: alpha('#ffffff', 0.1),
                        color: '#ffffff'
                      }
                    }}
                  >
                    {isDarkMode ? <LightMode /> : <DarkMode />}
                  </IconButton>

                  <Button
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      color: 'rgba(255,255,255,0.7)',
                      textTransform: 'none',
                      minWidth: 'auto',
                      px: 1.5,
                      py: 0.75,
                      borderRadius: '6px',
                      background: alpha('#ffffff', 0.05),
                      '&:hover': {
                        background: alpha('#ffffff', 0.1),
                        color: '#ffffff'
                      }
                    }}
                    startIcon={<Language sx={{ fontSize: '0.875rem' }} />}
                  >
                    EN
                  </Button>

                  {/* Authentication - Uber-style */}
                  {isAuthenticated ? (
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>

                      {/* User Menu Button */}
                      <Button
                        onClick={handleUserMenuOpen}
                        sx={{
                          color: 'rgba(255,255,255,0.9)',
                          textTransform: 'none',
                          fontWeight: 500,
                          px: 2,
                          py: 1,
                          borderRadius: '12px',
                          background: alpha(theme.palette.primary.main, 0.1),
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                          '&:hover': {
                            background: alpha(theme.palette.primary.main, 0.2),
                            borderColor: alpha(theme.palette.primary.main, 0.3)
                          }
                        }}
                        startIcon={
                          <Avatar
                            sx={{ width: 20, height: 20 }}
                            src={user?.avatar}
                          >
                            {user?.name?.charAt(0)}
                          </Avatar>
                        }
                      >
                        {user?.name?.split(' ')[0] || 'User'}
                      </Button>
                    </Box>
                  ) : (
                    <>
                      {/* Login Button - LemoTech style */}
               <Button
                 component={RouterLink}
                 to="/login"
                        onClick={scrollToTop}
                 sx={{
                   display: { xs: 'none', md: 'flex' },
                          color: 'rgba(255,255,255,0.87)',
                          px: 2.5,
                          py: 1.25,
                          borderRadius: '10px',
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                   fontWeight: 500,
                   fontSize: '0.8rem',
                   textTransform: 'none',
                          transition: 'all 0.2s ease',
                   '&:hover': {
                            background: alpha('#ffffff', 0.08),
                            color: '#ffffff',
                   }
                 }}
               >
                        Log in
               </Button>

                      {/* Sign Up Button - LemoTech style */}
               <Button
                 component={RouterLink}
                        to="/register"
                 variant="contained"
                        onClick={scrollToTop}
                 sx={{
                   display: { xs: 'none', md: 'flex' },
                          background: '#ffffff',
                          color: '#000000',
                          px: 2.5,
                          py: 1.25,
                          borderRadius: '10px',
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                   textTransform: 'none',
                   border: 'none',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
                          transition: 'all 0.2s ease',
                   '&:hover': {
                            background: '#f5f5f5',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                   }
                 }}
               >
                 Sign up
               </Button>
                    </>
                  )}

              {/* Mobile Menu Button */}
              <IconButton
                    onClick={() => {
                      setMobileOpen(true);
                      trackMobileMenuToggle(true);
                    }}
                sx={{ 
                  display: { xs: 'flex', lg: 'none' },
                  color: 'rgba(255,255,255,0.9)',
                      background: alpha('#ffffff', 0.08),
                  border: '1px solid rgba(255,255,255,0.12)',
                  '&:hover': {
                        background: alpha('#ffffff', 0.12),
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
        </motion.div>
      )}

      {/* Dropdown Menus */}
      {NAVIGATION_DROPDOWNS.map((dropdown) => (
        <Menu
          key={`${dropdown.id}-menu`}
          anchorEl={dropdownAnchors[dropdown.id]}
          open={Boolean(dropdownAnchors[dropdown.id])}
          onClose={() => handleDropdownClose(dropdown.id)}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 280,
              maxWidth: 320,
              background: 'linear-gradient(135deg, rgba(15, 10, 40, 0.98) 0%, rgba(30, 20, 64, 0.98) 50%, rgba(25, 15, 50, 0.98) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              '& .MuiList-root': {
                padding: '8px'
              }
            }
          }}
          transformOrigin={{ horizontal: 'center', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        >
          {dropdown.items
            .filter(item => !item.requiresAuth || isAuthenticated)
            .map((item) => (
              <MenuItem
                key={item.id}
                component={RouterLink}
                to={item.path}
                onClick={() => {
                  handleDropdownClose(dropdown.id);
                  trackNavClick(item.path, item.title);
                  scrollToTop();
                }}
                sx={{
                  color: 'white',
                  py: 1.5,
                  px: 2,
                  borderRadius: '8px',
                  margin: '2px 0',
                  background: isActivePath(item.path)
                    ? alpha(theme.palette.primary.main, 0.15)
                    : 'transparent',
                  '&:hover': {
                    background: isActivePath(item.path)
                      ? alpha(theme.palette.primary.main, 0.25)
                      : alpha('#ffffff', 0.08)
                  }
                }}
              >
                <ListItemIcon>
                  <item.icon sx={{
                    color: isActivePath(item.path)
                      ? theme.palette.primary.main
                      : 'rgba(255,255,255,0.7)',
                    fontSize: '1.25rem'
                  }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{item.title}</span>
                      {item.isNew && (
                        <Chip
                          label="NEW"
                          size="small"
                          sx={{
                            height: '18px',
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                            color: 'white',
                            '& .MuiChip-label': { px: 0.75 }
                          }}
                        />
                      )}
                      {item.isPremium && (
                        <Star sx={{
                          fontSize: '0.875rem',
                          color: '#FFD700',
                          filter: 'drop-shadow(0 0 2px rgba(255, 215, 0, 0.5))'
                        }} />
                      )}
                      {item.badge && (
                        <Chip
                          label={item.badge.text}
                          size="small"
                          color={item.badge.color}
                          sx={{
                            height: '18px',
                            fontSize: '0.625rem',
                            fontWeight: 600,
                            '& .MuiChip-label': { px: 0.75 }
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={item.description}
                  secondaryTypographyProps={{
                    sx: {
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '0.75rem',
                      mt: 0.5
                    }
                  }}
                />
              </MenuItem>
            ))}
        </Menu>
      ))}

      {/* User Menu Dropdown */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            background: 'rgba(20, 20, 20, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }
        }}
      >
        <MenuItem
          component={RouterLink}
          to="/dashboard"
          onClick={handleUserMenuClose}
          sx={{ color: 'white', py: 1.5 }}
        >
          <ListItemIcon>
            <Dashboard sx={{ color: 'rgba(255,255,255,0.7)' }} />
          </ListItemIcon>
          <ListItemText>Dashboard</ListItemText>
        </MenuItem>

        <MenuItem
          component={RouterLink}
          to="/settings"
          onClick={handleUserMenuClose}
          sx={{ color: 'white', py: 1.5 }}
        >
          <ListItemIcon>
            <Settings sx={{ color: 'rgba(255,255,255,0.7)' }} />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>

        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />

        <MenuItem
          onClick={handleLogout}
          sx={{ color: '#ff6b6b', py: 1.5 }}
        >
          <ListItemIcon>
            <ExitToApp sx={{ color: '#ff6b6b' }} />
          </ListItemIcon>
          <ListItemText>Sign out</ListItemText>
        </MenuItem>
      </Menu>

      {/* Mobile Drawer - Clean Organization */}
        <Drawer
          variant="temporary"
          anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            width: { xs: '100vw', sm: 400 },
            background: 'linear-gradient(135deg, rgba(15, 10, 40, 0.98) 0%, rgba(30, 20, 64, 0.98) 50%, rgba(25, 15, 50, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: 'none',
          },
        }}
      >
        {/* Mobile Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 3,
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
            <Box
              component="img"
              src="/assets/lemotech-logo.png"
              alt="LemoTech"
              sx={{
              height: '40px',
                width: 'auto',
              maxWidth: '160px',
                objectFit: 'contain',
              }}
            />
          <IconButton 
            onClick={() => setMobileOpen(false)}
            sx={{ 
              color: 'rgba(255,255,255,0.8)',
              background: alpha('#ffffff', 0.08),
              '&:hover': {
                background: alpha('#ffffff', 0.12),
                color: 'white'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Mobile City Selector */}
        <Box sx={{ px: 3, py: 2 }}>
          <CitySelector />
        </Box>

        {/* Mobile Book Now Button */}
        <Box sx={{ px: 3, py: 2 }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            component={RouterLink}
            to="/book"
            onClick={() => setMobileOpen(false)}
            sx={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              color: 'white',
              fontWeight: 600,
              py: 2,
              borderRadius: 3,
              textTransform: 'none',
              fontSize: '1.1rem',
              boxShadow: '0 4px 14px 0 rgba(255, 107, 53, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #FF5722 0%, #FF6B35 100%)',
                boxShadow: '0 6px 20px 0 rgba(255, 107, 53, 0.6)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Book Cleaning Service
          </Button>
        </Box>

        {/* Mobile Navigation - Organized by Category */}
        <Box sx={{ px: 3, py: 2, flexGrow: 1 }}>
          {/* Mobile Navigation - Organized by Dropdown */}
          {NAVIGATION_DROPDOWNS.map((dropdown) => (
            <Box key={dropdown.id} sx={{ mb: 3 }}>
              <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
              {dropdown.items
                .filter(item => !item.requiresAuth || isAuthenticated)
                .map((item) => (
                  <Box key={item.id} sx={{ mb: 1 }}>
                    <NavButton item={item} variant="mobile" />
                  </Box>
                ))}
            </Box>
          ))}

          {/* Main Nav Items */}
          <Box sx={{ mb: 3 }}>
            <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
            {MAIN_NAV_ITEMS.map((item) => (
              <Box key={item.id} sx={{ mb: 1 }}>
                <NavButton item={item} variant="mobile" />
              </Box>
            ))}
          </Box>

          {/* Mobile Authentication Buttons */}
          {!isAuthenticated ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                fullWidth
                onClick={() => {
                  setMobileOpen(false);
                  scrollToTop();
                }}
                sx={{
                  background: '#ffffff',
                  color: '#000000',
                  py: 2,
                  borderRadius: '12px',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    background: '#f5f5f5',
                    boxShadow: '0 6px 20px rgba(255, 255, 255, 0.3)',
                  }
                }}
              >
                Sign up
              </Button>

              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                fullWidth
                onClick={() => {
                  setMobileOpen(false);
                  scrollToTop();
                }}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'rgba(255,255,255,0.9)',
                  py: 1.5,
                  borderRadius: '12px',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#ffffff',
                    background: alpha('#ffffff', 0.1)
                  }
                }}
              >
                Log in
              </Button>
            </Box>
          ) : (
            <Button
              component={RouterLink}
              to="/dashboard"
              variant="contained"
              fullWidth
              startIcon={<Dashboard />}
              onClick={() => setMobileOpen(false)}
              sx={{
                background: alpha(theme.palette.primary.main, 0.2),
                color: 'white',
                py: 2,
                borderRadius: '12px',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.3),
                }
              }}
                          >
              Go to Dashboard
              </Button>
          )}
          </Box>
      </Drawer>

      {/* Real-time Notifications */}
      <RealTimeNotifications />

      {/* Main Content */}
      <Box component="main" sx={{ 
        flexGrow: 1,
        pt: hideHeaderFooter ? 0 : { xs: '64px', sm: '72px' }
      }}>
        {children}
      </Box>

      {/* Smart Floating Action Button */}
      {!hideHeaderFooter && <SmartFAB />}

      {/* Global Floating Tracking Button */}
      <FloatingTrackingButton
        bookingId={trackingState.bookingId || ''}
        driverName={trackingState.driverName}
        eta={trackingState.eta}
        onRestore={restoreTracking}
        visible={trackingState.showFloatingButton}
        hideOnHome={trackingState.hideOnHome}
      />

      {/* Footer */}
      {!hideHeaderFooter && <Footer />}
    </Box>
  );
};