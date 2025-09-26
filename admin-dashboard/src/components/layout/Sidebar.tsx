import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Dashboard,
  Analytics,
  People,
  LocalShipping,
  Store,
  TrendingUp,
  Assessment,
  Star,
  FlashOn,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: Dashboard,
    color: '#FF6B35',
    badge: null,
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: Analytics,
    color: '#F7931E',
    badge: 'Live',
  },
  {
    id: 'operations',
    title: 'Operations',
    icon: LocalShipping,
    color: '#FF6B35',
    badge: '47',
  },
  {
    id: 'users',
    title: 'Users',
    icon: People,
    color: '#F7931E',
    badge: null,
  },
  {
    id: 'drivers',
    title: 'Drivers',
    icon: LocalShipping,
    color: '#FF6B35',
    badge: '89',
  },
  {
    id: 'shops',
    title: 'Shops',
    icon: Store,
    color: '#F7931E',
    badge: null,
  },
  {
    id: 'revenue',
    title: 'Revenue',
    icon: TrendingUp,
    color: '#FF6B35',
    badge: null,
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: Assessment,
    color: '#F7931E',
    badge: null,
  },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        width: 280,
        height: '100vh',
        background: 'linear-gradient(180deg, rgba(26, 16, 64, 0.95) 0%, rgba(37, 20, 84, 0.95) 50%, rgba(26, 16, 64, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
       <Box sx={{ 
         p: 3, 
         pt: 0, 
         pb: 2, 
         borderBottom: '1px solid rgba(255,255,255,0.06)',
         background: 'rgba(255,255,255,0.02)',
         backdropFilter: 'blur(10px)',
       }}>
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, width: '100%' }}>
           <Box
             component="img"
             src="/lemotech-logo.png"
             alt="LemoTech Logo"
             sx={{
               height: { xs: '60px', sm: '70px', md: '80px' },
               width: '100%',
               maxWidth: '100%',
               borderRadius: '12px',
               objectFit: 'contain',
               background: 'inherit',
               padding: '8px',
               filter: 'brightness(1.1)',
             }}
           />
         </Box>
         
       </Box>

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List sx={{ px: 2, py: 2 }}>
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => onPageChange(item.id)}
                  sx={{
                    // LemoTech dark theme colors
                    color: currentPage === item.id ? '#ffffff' : 'rgba(255,255,255,0.87)',
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    fontWeight: currentPage === item.id ? 600 : 500,
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                    px: 2.5,
                    py: 1.25,
                    borderRadius: '10px',
                    position: 'relative',
                    background: currentPage === item.id
                      ? alpha(theme.palette.primary.main, 0.15)
                      : 'transparent',
                    border: 'none',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    minWidth: 'auto',
                    justifyContent: 'flex-start',
                    gap: 1.25,
                    '&:hover': {
                      color: '#ffffff',
                      background: currentPage === item.id
                        ? alpha(theme.palette.primary.main, 0.25)
                        : alpha('#ffffff', 0.08),
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    },
                    // LemoTech active indicator (bottom line)
                    '&::after': currentPage === item.id ? {
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
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: currentPage === item.id 
                        ? theme.palette.primary.main 
                        : 'rgba(255,255,255,0.7)',
                      minWidth: 40,
                    }}
                  >
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontWeight: currentPage === item.id ? 600 : 500,
                      color: 'inherit',
                      fontSize: '14px',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                      lineHeight: 1.4,
                    }}
                  />
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        background: item.color,
                        color: 'white',
                        fontSize: '0.7rem',
                        height: 20,
                        fontWeight: 600,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </motion.div>
          ))}
        </List>

        <Box sx={{ 
          mx: 2, 
          height: '1px', 
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
          my: 1,
        }} />

        {/* Quick Actions */}
        <Box sx={{ p: 2 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'rgba(255,255,255,0.6)', 
              mb: 2, 
              display: 'block',
              fontSize: '12px',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              lineHeight: 1.4,
            }}
          >
            Quick Actions
          </Typography>
          <List sx={{ py: 0 }}>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                sx={{
                  borderRadius: '12px',
                  color: 'rgba(255,255,255,0.87)',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { 
                    background: alpha('#ffffff', 0.08),
                    color: '#ffffff',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#FFD700', minWidth: 32 }}>
                  <Star />
                </ListItemIcon>
                <ListItemText
                  primary="Premium Features"
                  primaryTypographyProps={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'inherit',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                    lineHeight: 1.4,
                  }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  borderRadius: '12px',
                  color: 'rgba(255,255,255,0.87)',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { 
                    background: alpha('#ffffff', 0.08),
                    color: '#ffffff',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#FF6B35', minWidth: 32 }}>
                  <FlashOn />
                </ListItemIcon>
                <ListItemText
                  primary="System Status"
                  primaryTypographyProps={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'inherit',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                    lineHeight: 1.4,
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(10px)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              fontSize: '0.875rem',
              fontWeight: 'bold',
            }}
          >
            A
          </Avatar>
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'white', 
                fontWeight: 600,
                fontSize: '14px',
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                lineHeight: 1.4,
              }}
            >
              Admin User
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255,255,255,0.6)',
                fontSize: '12px',
                fontWeight: 400,
                      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                lineHeight: 1.4,
              }}
            >
              Super Admin
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
