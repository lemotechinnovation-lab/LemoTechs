import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Avatar,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
  Card,
  CardContent,
  Tab,
  Tabs,
  Divider,
  IconButton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  LocationOn,
  Lock,
  Notifications,
  Security,
  CreditCard,
  Home,
  Work,
  Settings,
  Delete,
  Add,
  Star,
  Verified
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleBackground } from '../../components/Common/ParticleBackground';
import { useAuth } from '../../hooks/useAuth';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  label: string;
  address: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  last4: string;
  expiryDate?: string;
  bankName?: string;
  isDefault: boolean;
}

interface Preferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
  service: {
    preferredTime: string;
    specialInstructions: string;
    allergyInfo: string;
    ecoFriendly: boolean;
  };
  privacy: {
    shareData: boolean;
    showInDirectory: boolean;
    allowReviews: boolean;
  };
}

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: user?.phone || '+27 123 456 789',
    dateOfBirth: '1990-05-15',
    bio: 'LemoTech customer since 2024. Love the convenience and quality!',
    avatar: user?.avatar || ''
  });

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      label: 'Home',
      address: '123 Main Street, Sandton, Johannesburg, 2196',
      isDefault: true
    },
    {
      id: '2',
      type: 'work',
      label: 'Office',
      address: '456 Business District, Rosebank, Johannesburg, 2196',
      isDefault: false
    }
  ]);

  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4532',
      expiryDate: '12/26',
      isDefault: true
    },
    {
      id: '2',
      type: 'bank',
      last4: '7890',
      bankName: 'Standard Bank',
      isDefault: false
    }
  ]);

  // Preferences
  const [preferences, setPreferences] = useState<Preferences>({
    notifications: {
      email: true,
      sms: true,
      push: true,
      marketing: false
    },
    service: {
      preferredTime: 'morning',
      specialInstructions: 'Please ring doorbell twice',
      allergyInfo: '',
      ecoFriendly: true
    },
    privacy: {
      shareData: false,
      showInDirectory: true,
      allowReviews: true
    }
  });

  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    type: 'home',
    label: '',
    address: ''
  });

  const [newPayment, setNewPayment] = useState<Partial<PaymentMethod>>({
    type: 'card',
    last4: '',
    expiryDate: ''
  });

  const handleSaveProfile = () => {
    // Simulate API call
    setTimeout(() => {
      setIsEditing(false);
      setSnackbarMessage('Profile updated successfully!');
      setShowSnackbar(true);
    }, 1000);
  };

  const handleAddAddress = () => {
    if (newAddress.label && newAddress.address) {
      const address: Address = {
        id: Date.now().toString(),
        type: newAddress.type as 'home' | 'work' | 'other',
        label: newAddress.label,
        address: newAddress.address,
        isDefault: addresses.length === 0
      };
      setAddresses([...addresses, address]);
      setNewAddress({ type: 'home', label: '', address: '' });
      setShowAddressDialog(false);
      setSnackbarMessage('Address added successfully!');
      setShowSnackbar(true);
    }
  };

  const handleAddPayment = () => {
    if (newPayment.last4) {
      const payment: PaymentMethod = {
        id: Date.now().toString(),
        type: newPayment.type as 'card' | 'bank' | 'wallet',
        last4: newPayment.last4,
        expiryDate: newPayment.expiryDate,
        bankName: newPayment.bankName,
        isDefault: paymentMethods.length === 0
      };
      setPaymentMethods([...paymentMethods, payment]);
      setNewPayment({ type: 'card', last4: '', expiryDate: '' });
      setShowPaymentDialog(false);
      setSnackbarMessage('Payment method added successfully!');
      setShowSnackbar(true);
    }
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const setDefaultPayment = (id: string) => {
    setPaymentMethods(paymentMethods.map(payment => ({
      ...payment,
      isDefault: payment.id === id
    })));
  };

  const deleteAddress = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const deletePayment = (id: string) => {
    setPaymentMethods(paymentMethods.filter(payment => payment.id !== id));
  };

  const TabPanel = ({ children, value, index }: any) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  const renderPersonalInfo = () => (
    <Grid container spacing={3}>
      {/* Profile Card */}
      <Grid item xs={12} md={4}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Paper sx={{
            p: 3,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px'
          }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
                  fontSize: '3rem',
                  border: '4px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {profileData.name.charAt(0)}
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
                  color: 'white',
                  width: 40,
                  height: 40,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #E55A2B, #E8851A)',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <PhotoCamera fontSize="small" />
              </IconButton>
            </Box>
            
            <Typography variant="h5" sx={{ 
              color: 'white',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 700,
              mb: 1
            }}>
              {profileData.name}
              <Verified sx={{ color: '#4CAF50', ml: 1, fontSize: '1.2rem' }} />
            </Typography>
            
            <Typography sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              mb: 2
            }}>
              Member since January 2024
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
              <Star sx={{ color: '#FFD700', fontSize: '1.2rem', mr: 0.5 }} />
              <Typography sx={{ 
                color: '#FFD700',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 600
              }}>
                4.9 Customer Rating
              </Typography>
            </Box>
            
            <Button
              variant={isEditing ? 'outlined' : 'contained'}
              startIcon={isEditing ? <Cancel /> : <Edit />}
              onClick={() => setIsEditing(!isEditing)}
              sx={{
                background: isEditing ? 'transparent' : 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                borderColor: isEditing ? '#FF6B35' : 'transparent',
                color: 'white',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: isEditing ? 'rgba(255, 107, 53, 0.1)' : 'linear-gradient(135deg, #E55A2B 0%, #E8851A 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)'
                }
              }}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </Paper>
        </motion.div>
      </Grid>
      
      {/* Personal Details */}
      <Grid item xs={12} md={8}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Paper sx={{
            p: 4,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{
                color: 'white',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 700
              }}>
                👤 Personal Information
              </Typography>
              
              {isEditing && (
                <Button
                  startIcon={<Save />}
                  onClick={handleSaveProfile}
                  sx={{
                    background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
                    color: 'white',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 600,
                    textTransform: 'none'
                  }}
                >
                  Save Changes
                </Button>
              )}
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  disabled={!isEditing}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 107, 53, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF6B35',
                      },
                      '&.Mui-disabled fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!isEditing}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 107, 53, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF6B35',
                      },
                      '&.Mui-disabled fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  disabled={!isEditing}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 107, 53, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF6B35',
                      },
                      '&.Mui-disabled fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 107, 53, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF6B35',
                      },
                      '&.Mui-disabled fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  multiline
                  rows={3}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  disabled={!isEditing}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 107, 53, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF6B35',
                      },
                      '&.Mui-disabled fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Grid>
    </Grid>
  );

  const renderAddresses = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Paper sx={{
            p: 4,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            mb: 3
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{
                color: 'white',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 700
              }}>
                📍 Saved Addresses
              </Typography>
              
              <Button
                startIcon={<Add />}
                onClick={() => setShowAddressDialog(true)}
                sx={{
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                  color: 'white',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                Add Address
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              {addresses.map((address) => (
                <Grid item xs={12} md={6} key={address.id}>
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: address.isDefault ? '2px solid #FF6B35' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(255, 107, 53, 0.2)'
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {address.type === 'home' && <Home sx={{ color: '#4CAF50' }} />}
                          {address.type === 'work' && <Work sx={{ color: '#2196F3' }} />}
                          {address.type === 'other' && <LocationOn sx={{ color: '#FF6B35' }} />}
                          
                          <Typography variant="h6" sx={{
                            color: 'white',
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            fontWeight: 600
                          }}>
                            {address.label}
                          </Typography>
                          
                          {address.isDefault && (
                            <Chip 
                              label="Default" 
                              size="small" 
                              sx={{
                                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          )}
                        </Box>
                        
                        <IconButton
                          size="small"
                          onClick={() => deleteAddress(address.id)}
                          sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            '&:hover': {
                              color: '#f44336',
                              background: 'rgba(244, 67, 54, 0.1)'
                            }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                      
                      <Typography sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        mb: 2,
                        lineHeight: 1.5
                      }}>
                        {address.address}
                      </Typography>
                      
                      {!address.isDefault && (
                        <Button
                          size="small"
                          onClick={() => setDefaultAddress(address.id)}
                          sx={{
                            color: '#FF6B35',
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': {
                              background: 'rgba(255, 107, 53, 0.1)'
                            }
                          }}
                        >
                          Set as Default
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </motion.div>
      </Grid>
    </Grid>
  );

  const renderPaymentMethods = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Paper sx={{
            p: 4,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            mb: 3
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{
                color: 'white',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 700
              }}>
                💳 Payment Methods
              </Typography>
              
              <Button
                startIcon={<Add />}
                onClick={() => setShowPaymentDialog(true)}
                sx={{
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                  color: 'white',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                Add Payment Method
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              {paymentMethods.map((payment) => (
                <Grid item xs={12} md={6} key={payment.id}>
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: payment.isDefault ? '2px solid #FF6B35' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(255, 107, 53, 0.2)'
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CreditCard sx={{ color: '#4CAF50' }} />
                          
                          <Typography variant="h6" sx={{
                            color: 'white',
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            fontWeight: 600
                          }}>
                            {payment.type === 'card' ? 'Card' : payment.type === 'bank' ? 'Bank Account' : 'Wallet'}
                          </Typography>
                          
                          {payment.isDefault && (
                            <Chip 
                              label="Default" 
                              size="small" 
                              sx={{
                                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          )}
                        </Box>
                        
                        <IconButton
                          size="small"
                          onClick={() => deletePayment(payment.id)}
                          sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            '&:hover': {
                              color: '#f44336',
                              background: 'rgba(244, 67, 54, 0.1)'
                            }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                      
                      <Typography sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        mb: 1
                      }}>
                        {payment.type === 'card' ? `•••• •••• •••• ${payment.last4}` : 
                         payment.type === 'bank' ? `${payment.bankName} •••• ${payment.last4}` :
                         `Wallet •••• ${payment.last4}`}
                      </Typography>
                      
                      {payment.expiryDate && (
                        <Typography sx={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontSize: '0.8rem',
                          mb: 2
                        }}>
                          Expires {payment.expiryDate}
                        </Typography>
                      )}
                      
                      {!payment.isDefault && (
                        <Button
                          size="small"
                          onClick={() => setDefaultPayment(payment.id)}
                          sx={{
                            color: '#FF6B35',
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': {
                              background: 'rgba(255, 107, 53, 0.1)'
                            }
                          }}
                        >
                          Set as Default
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </motion.div>
      </Grid>
    </Grid>
  );

  const renderPreferences = () => (
    <Grid container spacing={3}>
      {/* Notification Preferences */}
      <Grid item xs={12} md={6}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Paper sx={{
            p: 4,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px'
          }}>
            <Typography variant="h6" sx={{
              color: 'white',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 700,
              mb: 3
            }}>
              🔔 Notifications
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.notifications.email}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      notifications: { ...preferences.notifications, email: e.target.checked }
                    })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#FF6B35',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#FF6B35',
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: 'white', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    Email Notifications
                  </Typography>
                }
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.notifications.sms}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      notifications: { ...preferences.notifications, sms: e.target.checked }
                    })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#FF6B35',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#FF6B35',
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: 'white', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    SMS Notifications
                  </Typography>
                }
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.notifications.push}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      notifications: { ...preferences.notifications, push: e.target.checked }
                    })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#FF6B35',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#FF6B35',
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: 'white', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    Push Notifications
                  </Typography>
                }
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.notifications.marketing}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      notifications: { ...preferences.notifications, marketing: e.target.checked }
                    })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#FF6B35',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#FF6B35',
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: 'white', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    Marketing Emails
                  </Typography>
                }
              />
            </Box>
          </Paper>
        </motion.div>
      </Grid>
      
      {/* Service Preferences */}
      <Grid item xs={12} md={6}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Paper sx={{
            p: 4,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px'
          }}>
            <Typography variant="h6" sx={{
              color: 'white',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 700,
              mb: 3
            }}>
              ⚙️ Service Preferences
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Preferred Time
                </InputLabel>
                <Select
                  value={preferences.service.preferredTime}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    service: { ...preferences.service, preferredTime: e.target.value }
                  })}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 107, 53, 0.4)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FF6B35',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                    },
                  }}
                >
                  <MenuItem value="morning">Morning (8AM - 12PM)</MenuItem>
                  <MenuItem value="afternoon">Afternoon (12PM - 5PM)</MenuItem>
                  <MenuItem value="evening">Evening (5PM - 8PM)</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Special Instructions"
                multiline
                rows={2}
                value={preferences.service.specialInstructions}
                onChange={(e) => setPreferences({
                  ...preferences,
                  service: { ...preferences.service, specialInstructions: e.target.value }
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 107, 53, 0.4)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF6B35',
                    }
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }
                }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.service.ecoFriendly}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      service: { ...preferences.service, ecoFriendly: e.target.checked }
                    })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#4CAF50',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#4CAF50',
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: 'white', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    Eco-Friendly Products Only
                  </Typography>
                }
              />
            </Box>
          </Paper>
        </motion.div>
      </Grid>
      
      {/* Privacy Settings */}
      <Grid item xs={12}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Paper sx={{
            p: 4,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px'
          }}>
            <Typography variant="h6" sx={{
              color: 'white',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 700,
              mb: 3
            }}>
              🔒 Privacy & Security
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.privacy.shareData}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        privacy: { ...preferences.privacy, shareData: e.target.checked }
                      })}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#FF6B35',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#FF6B35',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: 'white', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                      Share Usage Analytics
                    </Typography>
                  }
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.privacy.showInDirectory}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        privacy: { ...preferences.privacy, showInDirectory: e.target.checked }
                      })}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#FF6B35',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#FF6B35',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: 'white', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                      Show in Public Directory
                    </Typography>
                  }
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.privacy.allowReviews}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        privacy: { ...preferences.privacy, allowReviews: e.target.checked }
                      })}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#FF6B35',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#FF6B35',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: 'white', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                      Allow Service Reviews
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                startIcon={<Lock />}
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255, 107, 53, 0.5)',
                  color: '#FF6B35',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#FF6B35',
                    background: 'rgba(255, 107, 53, 0.1)'
                  }
                }}
              >
                Change Password
              </Button>
              
              <Button
                startIcon={<Security />}
                variant="outlined"
                sx={{
                  borderColor: 'rgba(33, 150, 243, 0.5)',
                  color: '#2196F3',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#2196F3',
                    background: 'rgba(33, 150, 243, 0.1)'
                  }
                }}
              >
                Two-Factor Auth
              </Button>
              
              <Button
                startIcon={<Delete />}
                variant="outlined"
                sx={{
                  borderColor: 'rgba(244, 67, 54, 0.5)',
                  color: '#f44336',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#f44336',
                    background: 'rgba(244, 67, 54, 0.1)'
                  }
                }}
              >
                Delete Account
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 50%, #190F32 100%)',
      position: 'relative'
    }}>
      <ParticleBackground />
      
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4, position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ 
              color: 'white', 
              fontWeight: 800,
              mb: 1,
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              background: 'linear-gradient(135deg, #ffffff 0%, #FF6B35 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              👤 Profile Settings
            </Typography>
            <Typography sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '1rem'
            }}>
              Manage your personal information, addresses, and preferences
            </Typography>
          </Box>
        </motion.div>

        {/* Tabs */}
        <Paper sx={{
          mb: 3,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px'
        }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(90deg, #FF6B35, #F7931E)',
              },
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 600,
                textTransform: 'none',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                '&.Mui-selected': {
                  color: 'white',
                },
              },
            }}
          >
            <Tab icon={<Settings />} label="Personal Info" />
            <Tab icon={<LocationOn />} label="Addresses" />
            <Tab icon={<CreditCard />} label="Payment Methods" />
            <Tab icon={<Notifications />} label="Preferences" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabPanel value={activeTab} index={0}>
              {renderPersonalInfo()}
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              {renderAddresses()}
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              {renderPaymentMethods()}
            </TabPanel>
            <TabPanel value={activeTab} index={3}>
              {renderPreferences()}
            </TabPanel>
          </motion.div>
        </AnimatePresence>
      </Container>

      {/* Add Address Dialog */}
      <Dialog open={showAddressDialog} onClose={() => setShowAddressDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'white', background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 100%)' }}>
          Add New Address
        </DialogTitle>
        <DialogContent sx={{ background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 100%)' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Type</InputLabel>
              <Select
                value={newAddress.type}
                onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value as 'home' | 'work' | 'other' })}
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 107, 53, 0.4)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FF6B35',
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'white',
                  },
                }}
              >
                <MenuItem value="home">Home</MenuItem>
                <MenuItem value="work">Work</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Label"
              value={newAddress.label}
              onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 107, 53, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF6B35',
                  }
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                }
              }}
            />
            
            <TextField
              fullWidth
              label="Full Address"
              multiline
              rows={3}
              value={newAddress.address}
              onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 107, 53, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF6B35',
                  }
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 100%)', p: 3 }}>
          <Button onClick={() => setShowAddressDialog(false)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddAddress}
            disabled={!newAddress.label || !newAddress.address}
            sx={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              color: 'white',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 600,
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Add Address
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Payment Method Dialog */}
      <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'white', background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 100%)' }}>
          Add Payment Method
        </DialogTitle>
        <DialogContent sx={{ background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 100%)' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Type</InputLabel>
              <Select
                value={newPayment.type}
                onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value as 'card' | 'bank' | 'wallet' })}
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 107, 53, 0.4)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FF6B35',
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'white',
                  },
                }}
              >
                <MenuItem value="card">Credit/Debit Card</MenuItem>
                <MenuItem value="bank">Bank Account</MenuItem>
                <MenuItem value="wallet">Digital Wallet</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Last 4 Digits"
              value={newPayment.last4}
              onChange={(e) => setNewPayment({ ...newPayment, last4: e.target.value })}
              inputProps={{ maxLength: 4 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 107, 53, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF6B35',
                  }
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                }
              }}
            />
            
            {newPayment.type === 'card' && (
              <TextField
                fullWidth
                label="Expiry Date (MM/YY)"
                value={newPayment.expiryDate}
                onChange={(e) => setNewPayment({ ...newPayment, expiryDate: e.target.value })}
                placeholder="12/26"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 107, 53, 0.4)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF6B35',
                    }
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }
                }}
              />
            )}
            
            {newPayment.type === 'bank' && (
              <TextField
                fullWidth
                label="Bank Name"
                value={newPayment.bankName}
                onChange={(e) => setNewPayment({ ...newPayment, bankName: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 107, 53, 0.4)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF6B35',
                    }
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }
                }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 100%)', p: 3 }}>
          <Button onClick={() => setShowPaymentDialog(false)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddPayment}
            disabled={!newPayment.last4}
            sx={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              color: 'white',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 600,
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Add Payment Method
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity="success"
          sx={{
            background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
            color: 'white',
            fontFamily: '"Plus Jakarta Sans", sans-serif'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
