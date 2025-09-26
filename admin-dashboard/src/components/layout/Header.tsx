import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Chip,
  Tooltip,
  InputBase,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search,
  Notifications,
  Settings,
  AccountCircle,
  Logout,
  DarkMode,
  Speed,
  Refresh,
} from '@mui/icons-material';

interface HeaderProps {
  onToggleSidebar: () => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, currentPage }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const pageTitles: { [key: string]: string } = {
    dashboard: 'DASHBOARD OVERVIEW',
    analytics: 'ANALYTICS & INSIGHTS',
    operations: 'OPERATIONS CENTER',
    users: 'USER MANAGEMENT',
    drivers: 'DRIVER MANAGEMENT',
    shops: 'SHOP MANAGEMENT',
    revenue: 'REVENUE ANALYTICS',
    reports: 'REPORTS & EXPORT',
  };

  const notifications = [
    { id: 1, title: 'New booking request', time: '2 min ago', type: 'info' },
    { id: 2, title: 'Driver completed delivery', time: '5 min ago', type: 'success' },
    { id: 3, title: 'Payment processed', time: '10 min ago', type: 'success' },
    { id: 4, title: 'System maintenance scheduled', time: '1 hour ago', type: 'warning' },
  ];

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #1A1040 0%, #251454 50%, #1A1040 100%)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 0,
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 2, minHeight: '90px !important' }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={onToggleSidebar}
            sx={{
              color: 'white',
              background: 'rgba(255,255,255,0.12)',
              '&:hover': { 
                background: 'rgba(255,255,255,0.22)',
                color: 'white',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: '#FFFFFF',
                fontSize: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                lineHeight: 1.3,
                textShadow: '0 0 5px rgba(255,255,255,0.2)',
              }}
            >
              {pageTitles[currentPage] || 'DASHBOARD'}
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
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
          </Box>
        </Box>

        {/* Center Section - Search */}
        <Box
          sx={{
            position: 'relative',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.1)',
            '&:hover': {
              background: 'rgba(255,255,255,0.15)',
            },
            marginLeft: 1,
            marginRight: 1,
            width: '100%',
            maxWidth: 400,
          }}
        >
          <Box
            sx={{
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Search sx={{ color: 'rgba(255,255,255,0.6)', mr: 1 }} />
            <InputBase
              placeholder="Search anything..."
              sx={{
                color: 'white',
                width: '100%',
                fontSize: '14px',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                '& input::placeholder': {
                  color: 'rgba(255,255,255,0.6)',
                  opacity: 1,
                  fontSize: '14px',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                },
              }}
            />
          </Box>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* System Status */}
          <Chip
            icon={<Speed />}
            label="All Systems Operational"
            size="small"
            sx={{
              background: 'rgba(76, 175, 80, 0.2)',
              color: '#4CAF50',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              fontWeight: 500,
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
            }}
          />

          {/* Refresh Button */}
          <Tooltip title="Refresh Data">
            <IconButton
              sx={{
                color: 'rgba(255,255,255,0.8)',
                '&:hover': { 
                  color: 'white', 
                  background: 'rgba(255,255,255,0.22)' 
                },
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              onClick={handleNotificationOpen}
              sx={{
                color: 'rgba(255,255,255,0.8)',
                '&:hover': { 
                  color: 'white', 
                  background: 'rgba(255,255,255,0.22)' 
                },
              }}
            >
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Settings */}
          <Tooltip title="Settings">
            <IconButton
              sx={{
                color: 'rgba(255,255,255,0.8)',
                '&:hover': { 
                  color: 'white', 
                  background: 'rgba(255,255,255,0.22)' 
                },
              }}
            >
              <Settings />
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Tooltip title="Account">
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                color: 'rgba(255,255,255,0.8)',
                '&:hover': { 
                  color: 'white', 
                  background: 'rgba(255,255,255,0.22)' 
                },
              }}
            >
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
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(28, 27, 58, 0.95) 0%, rgba(40, 38, 85, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            mt: 1,
            minWidth: 320,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white', 
              fontWeight: 700,
              fontSize: '16px',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
              lineHeight: 1.3,
            }}
          >
            Notifications
          </Typography>
        </Box>
        {notifications.map((notification) => (
          <MenuItem
            key={notification.id}
            onClick={handleNotificationClose}
            sx={{
              py: 2,
              px: 2,
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              '&:hover': { background: 'rgba(255,255,255,0.05)' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: notification.type === 'success' ? '#4CAF50' : 
                             notification.type === 'warning' ? '#FF9800' : '#2196F3',
                }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 500,
                    fontSize: '14px',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                    lineHeight: 1.4,
                  }}
                >
                  {notification.title}
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
                  {notification.time}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(28, 27, 58, 0.95) 0%, rgba(40, 38, 85, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            mt: 1,
            minWidth: 200,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <AccountCircle sx={{ color: 'rgba(255,255,255,0.7)' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Profile" 
            primaryTypographyProps={{
              fontSize: '14px',
              fontWeight: 500,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
              lineHeight: 1.4,
            }}
            sx={{ color: 'white' }} 
          />
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Settings sx={{ color: 'rgba(255,255,255,0.7)' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Settings" 
            primaryTypographyProps={{
              fontSize: '14px',
              fontWeight: 500,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
              lineHeight: 1.4,
            }}
            sx={{ color: 'white' }} 
          />
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <DarkMode sx={{ color: 'rgba(255,255,255,0.7)' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Theme" 
            primaryTypographyProps={{
              fontSize: '14px',
              fontWeight: 500,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
              lineHeight: 1.4,
            }}
            sx={{ color: 'white' }} 
          />
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Logout sx={{ color: '#f44336' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{
              fontSize: '14px',
              fontWeight: 500,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
              lineHeight: 1.4,
            }}
            sx={{ color: '#f44336' }} 
          />
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
