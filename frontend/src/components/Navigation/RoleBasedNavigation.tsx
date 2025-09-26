import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  AddCircle,
  List as ListIcon,
  Dashboard,
  Work,
  AttachMoney,
  Inventory,
  Analytics,
  AdminPanelSettings,
  People,
  DriveEta,
  Store,
  Business,
  Storefront,
  AccountCircle,
  Logout,
  Settings,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Auth/UserAuth';
import { useRole, useRoleNavigation, PERMISSIONS } from '../../context/RoleContext';
import { RoleBasedComponent } from '../Auth/RoleBasedComponent';

const drawerWidth = 240;


const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { role } = useRole();
  const { navigationItems } = useRoleNavigation();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    await logout();
    navigate('/');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      home: <Home />,
      add_circle: <AddCircle />,
      list: <ListIcon />,
      dashboard: <Dashboard />,
      work: <Work />,
      attach_money: <AttachMoney />,
      inventory: <Inventory />,
      analytics: <Analytics />,
      admin_panel_settings: <AdminPanelSettings />,
      people: <People />,
      drive_eta: <DriveEta />,
      store: <Store />,
      business: <Business />,
      storefront: <Storefront />,
    };
    return iconMap[iconName] || <Home />;
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main' }}>
          LemoTech
        </Typography>
      </Toolbar>
      <Divider />
      
      {/* Role indicator */}
      <Box p={2}>
        <Chip
          label={role ? role.toUpperCase() : 'GUEST'}
          color="primary"
          variant="outlined"
          size="small"
          sx={{ width: '100%' }}
        />
      </Box>
      
      <Divider />
      
      <List>
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={isActive}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'white' : 'inherit' }}>
                  {getIcon(item.icon)}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      <Divider />
      
      {/* User profile section */}
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigate('/profile')}>
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
        
        <RoleBasedComponent allowedRoles={['admin']}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigate('/admin/settings')}>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </RoleBasedComponent>
        
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LemoTech Innovations
          </Typography>
          
          {/* Role-based action buttons */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mr: 2 }}>
            <RoleBasedComponent requiredPermissions={PERMISSIONS.USER_CREATE_BOOKING}>
              <Button
                color="inherit"
                startIcon={<AddCircle />}
                onClick={() => navigate('/book')}
              >
                Book Service
              </Button>
            </RoleBasedComponent>
            
            <RoleBasedComponent requiredPermissions={PERMISSIONS.DRIVER_VIEW_JOBS}>
              <Button
                color="inherit"
                startIcon={<Work />}
                onClick={() => navigate('/driver')}
              >
                Driver Dashboard
              </Button>
            </RoleBasedComponent>
            
            <RoleBasedComponent requiredPermissions={PERMISSIONS.SHOP_VIEW_ORDERS}>
              <Button
                color="inherit"
                startIcon={<Store />}
                onClick={() => navigate('/shop')}
              >
                Shop Dashboard
              </Button>
            </RoleBasedComponent>
            
            <RoleBasedComponent requiredPermissions={PERMISSIONS.ADMIN_VIEW_ALL_USERS}>
              <Button
                color="inherit"
                startIcon={<AdminPanelSettings />}
                onClick={() => navigate('/admin')}
              >
                Admin Panel
              </Button>
            </RoleBasedComponent>
          </Box>
          
          {/* User profile menu */}
          {user && (
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            </IconButton>
          )}
          
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={() => { handleNavigate('/profile'); handleProfileMenuClose(); }}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            
            <RoleBasedComponent requiredPermissions={PERMISSIONS.ADMIN_MANAGE_SYSTEM}>
              <MenuItem onClick={() => { handleNavigate('/admin/settings'); handleProfileMenuClose(); }}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
            </RoleBasedComponent>
            
            <Divider />
            
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Navigation;
