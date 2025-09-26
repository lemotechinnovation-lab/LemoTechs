import { useState, createContext, useContext, useEffect } from 'react';
import { 
  Box, 
  Dialog, 
  DialogContent, 
  TextField, 
  Button, 
  Typography, 
  IconButton, 
  Tabs, 
  Tab,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Alert
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Dashboard as DashboardIcon,
  AccountCircle
} from '@mui/icons-material';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
  memberSince: Date;
  totalBookings: number;
  loyaltyPoints: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  showAuthDialog: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  openAuthDialog: () => void;
  closeAuthDialog: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Simulate authentication check on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('lemotech_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'demo@lemotech.co.za' && password === 'demo123') {
      const demoUser: User = {
        id: 'demo-user-123',
        name: 'John Doe',
        email: 'demo@lemotech.co.za',
        phone: '+27 82 123 4567',
        address: '123 Main St, Sandton, Johannesburg',
        memberSince: new Date(2023, 0, 1),
        totalBookings: 15,
        loyaltyPoints: 350
      };
      setUser(demoUser);
      localStorage.setItem('lemotech_user', JSON.stringify(demoUser));
      setShowAuthDialog(false);
      return true;
    }
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      memberSince: new Date(),
      totalBookings: 0,
      loyaltyPoints: 100 // Welcome bonus
    };
    
    setUser(newUser);
    localStorage.setItem('lemotech_user', JSON.stringify(newUser));
    setShowAuthDialog(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lemotech_user');
  };

  const openAuthDialog = () => setShowAuthDialog(true);
  const closeAuthDialog = () => setShowAuthDialog(false);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      showAuthDialog,
      login,
      register,
      logout,
      openAuthDialog,
      closeAuthDialog
    }}>
      {children}
      <AuthDialog />
    </AuthContext.Provider>
  );
};

const AuthDialog = () => {
  const { showAuthDialog, closeAuthDialog, login, register } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Login form
  const [loginData, setLoginData] = useState({
    email: 'demo@lemotech.co.za',
    password: 'demo123'
  });
  
  // Register form
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: ''
  });

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await login(loginData.email, loginData.password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await register({
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password,
        address: registerData.address
      });
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={showAuthDialog}
      onClose={closeAuthDialog}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, rgba(26, 16, 64, 0.98) 0%, rgba(37, 20, 84, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,107,53,0.2)',
          borderRadius: '16px',
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ position: 'relative', p: 4 }}>
          <IconButton
            onClick={closeAuthDialog}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                color: 'white',
                background: 'rgba(255,107,53,0.1)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              mb: 1,
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD700 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600, // Reduced from 700 for softer appearance
              fontFamily: '"Plus Jakarta Sans", sans-serif'
            }}
          >
            Welcome to LemoTech
          </Typography>

          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'rgba(255,255,255,0.7)',
              mb: 4
            }}
          >
            Sign in to track orders and manage your profile
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              mb: 3,
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(90deg, #FF6B35, #F7931E)',
              },
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 600,
                textTransform: 'none',
                '&.Mui-selected': {
                  color: 'white',
                },
              },
            }}
          >
            <Tab label="Sign In" />
            <Tab label="Create Account" />
          </Tabs>

          <AnimatePresence mode="wait">
            {activeTab === 0 ? (
              // Login Form
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    label="Email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: '#FF6B35' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255,107,53,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,107,53,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiInputBase-input': { color: 'rgba(255, 255, 255, 0.95)' },
                    }}
                  />
                  
                  <TextField
                    label="Password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255,107,53,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,107,53,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiInputBase-input': { color: 'rgba(255, 255, 255, 0.95)' },
                    }}
                  />

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleLogin}
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)',
                      },
                      '&:disabled': {
                        background: 'rgba(255,107,53,0.5)',
                      },
                      fontWeight: 600,
                      fontSize: '1rem',
                      textTransform: 'none',
                    }}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </Box>
              </motion.div>
            ) : (
              // Register Form
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    label="Full Name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: '#FF6B35' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255,107,53,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,107,53,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiInputBase-input': { color: 'rgba(255, 255, 255, 0.95)' },
                    }}
                  />

                  <TextField
                    label="Email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: '#FF6B35' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255,107,53,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,107,53,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiInputBase-input': { color: 'rgba(255, 255, 255, 0.95)' },
                    }}
                  />

                  <TextField
                    label="Phone"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: '#FF6B35' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255,107,53,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,107,53,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiInputBase-input': { color: 'rgba(255, 255, 255, 0.95)' },
                    }}
                  />

                  <TextField
                    label="Address"
                    value={registerData.address}
                    onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                    InputProps={{
                      startAdornment: <LocationIcon sx={{ mr: 1, color: '#FF6B35' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255,107,53,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,107,53,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiInputBase-input': { color: 'rgba(255, 255, 255, 0.95)' },
                    }}
                  />

                  <TextField
                    label="Password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255,107,53,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,107,53,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiInputBase-input': { color: 'rgba(255, 255, 255, 0.95)' },
                    }}
                  />

                  <TextField
                    label="Confirm Password"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255,107,53,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,107,53,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiInputBase-input': { color: 'rgba(255, 255, 255, 0.95)' },
                    }}
                  />

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleRegister}
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)',
                      },
                      '&:disabled': {
                        background: 'rgba(255,107,53,0.5)',
                      },
                      fontWeight: 600,
                      fontSize: '1rem',
                      textTransform: 'none',
                    }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export const UserMenu = () => {
  const { user, isAuthenticated, logout, openAuthDialog } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (!isAuthenticated) {
    return (
      <Button
        onClick={openAuthDialog}
        variant="outlined"
        sx={{
          color: 'white',
          borderColor: 'rgba(255,107,53,0.5)',
          '&:hover': {
            borderColor: '#FF6B35',
            background: 'rgba(255,107,53,0.1)',
          },
          textTransform: 'none',
          fontWeight: 600,
        }}
        startIcon={<AccountCircle />}
      >
        Sign In
      </Button>
    );
  }

  return (
    <>
      <IconButton
        onClick={handleMenuOpen}
        sx={{
          p: 0,
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
            fontWeight: 600,
          }}
        >
          {user?.name.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(26, 16, 64, 0.98) 0%, rgba(37, 20, 84, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,107,53,0.2)',
            borderRadius: '12px',
            mt: 1,
            minWidth: 250,
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            {user?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {user?.email}
          </Typography>
          <Typography variant="caption" sx={{ color: '#FFD700' }}>
            {user?.loyaltyPoints} points
          </Typography>
        </Box>

        <MenuItem onClick={handleMenuClose}>
          <DashboardIcon sx={{ mr: 2, color: '#FF6B35' }} />
          <Typography sx={{ color: 'white' }}>Dashboard</Typography>
        </MenuItem>

        <MenuItem onClick={handleMenuClose}>
          <SettingsIcon sx={{ mr: 2, color: '#FF6B35' }} />
          <Typography sx={{ color: 'white' }}>Settings</Typography>
        </MenuItem>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        <MenuItem onClick={() => { handleMenuClose(); logout(); }}>
          <LogoutIcon sx={{ mr: 2, color: '#FF6B35' }} />
          <Typography sx={{ color: 'white' }}>Sign Out</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
