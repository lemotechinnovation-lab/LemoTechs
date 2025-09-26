// React and React-related imports
import React, { useState, useEffect, useCallback } from 'react';

// Third-party libraries
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid
} from '@mui/material';
import {
  Add,
  Remove,
  DirectionsCar,
  AccessTime,
  CheckCircle,
  Close,
  LocationOn,
  ArrowForward,
  ArrowBack
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Absolute imports (from src/)
import { PlacesInput } from '../../components/Forms/PlacesInput';
import { ParticleBackground } from '../../components/Common/ParticleBackground';
import GoogleMap from '../../components/Maps/GoogleMap';
import { CarTypeSelector } from '../../components/Booking';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../hooks/useAuth';
import bookingStateService from '../../services/bookingStateService';
import { isValidPhoneNumber } from '../../utils/validation';

// Uber-style booking states
type BookingState = 'location' | 'items' | 'carType' | 'confirming' | 'processing' | 'confirmed';

interface SmartBookingData {
  location: string;
  coordinates: { lat: number; lng: number } | null;
  items: { [key: string]: number }; // item id -> quantity
  scheduledFor: 'now' | 'later';
  scheduledDate?: Date;
  scheduledTime?: string;
  selectedCarType?: string | null;
  paymentMethod: 'card' | 'cash' | 'mobile';
  specialInstructions: string;
  contactPhone: string;
  bookingId?: string;
}


interface CleaningItem {
  id: string;
  name: string;
  category: string;
  price: number;
  icon: string;
  popular?: boolean;
}

// Smart defaults and popular items
const popularItems: CleaningItem[] = [
  { id: 'sneakers', name: 'Sneakers', category: 'Footwear', price: 25, icon: '👟', popular: true },
  { id: 'casual-shoes', name: 'Casual Shoes', category: 'Footwear', price: 20, icon: '👞', popular: true },
  { id: 'suits', name: 'Suits', category: 'Clothing', price: 35, icon: '🤵', popular: true },
  { id: 'shirts', name: 'Shirts', category: 'Clothing', price: 15, icon: '👔' },
  { id: 'dresses', name: 'Dresses', category: 'Clothing', price: 30, icon: '👗' },
  { id: 'jeans', name: 'Jeans', category: 'Clothing', price: 18, icon: '👖' },
  { id: 'bedding', name: 'Bedding', category: 'Home', price: 45, icon: '🛏️' },
  { id: 'curtains', name: 'Curtains', category: 'Home', price: 40, icon: '🪟' },
  { id: 'other', name: 'Other', category: 'Miscellaneous', price: 25, icon: '📦' }
];


export const SmartBookingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Main booking state - Uber style single state machine
  const [currentState, setCurrentState] = useState<BookingState>('location');
  
  const [bookingData, setBookingData] = useState<SmartBookingData>({
    location: '',
    coordinates: null,
    items: {},
    scheduledFor: 'now',
    paymentMethod: 'card',
    specialInstructions: '',
    contactPhone: '',
    selectedCarType: null
  });

  // Booking state persistence
  const [isLoadingState, setIsLoadingState] = useState(false);
  
  // Phone validation state
  const [phoneValidationError, setPhoneValidationError] = useState<string>('');
  const [hasLoadedState, setHasLoadedState] = useState(false);

  // Phone validation function
  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone.trim()) {
      setPhoneValidationError('Phone number is required');
      return false;
    }
    
    if (!isValidPhoneNumber(phone)) {
      setPhoneValidationError('Please enter a valid South African phone number (e.g., 082 123 4567)');
      return false;
    }
    
    setPhoneValidationError('');
    return true;
  };

  // Load saved booking state on component mount
  useEffect(() => {
    const loadBookingState = async () => {
      if (hasLoadedState) return;
      
      console.log('📝 Starting booking state load...', { isAuthenticated, hasLoadedState });
      
      setIsLoadingState(true);
      try {
        const savedState = await bookingStateService.loadBookingState();
        console.log('📝 Raw saved state from API:', savedState);
        
        if (savedState) {
          console.log('📝 Loading saved booking state:', savedState);
          
          // Restore booking data
          setBookingData(prev => {
            console.log('📝 Restoring booking data:', {
              current: prev,
              saved: savedState.bookingData,
              contactPhone: savedState.bookingData.contactPhone,
              items: savedState.bookingData.items,
              hasItems: Object.values(savedState.bookingData.items || {}).some(q => q > 0)
            });
            
            // Merge saved data with current data, prioritizing saved data
            const restoredData = {
              ...prev,
              ...savedState.bookingData,
              paymentMethod: (savedState.bookingData.paymentMethod as 'card' | 'cash' | 'mobile') || 'card',
              // Only use saved contact phone if it's not empty
              contactPhone: savedState.bookingData.contactPhone || prev.contactPhone,
              // Use saved items if they exist and have values, otherwise keep current
              items: savedState.bookingData.items && Object.values(savedState.bookingData.items).some(q => q > 0) 
                ? savedState.bookingData.items 
                : prev.items
            };
            
            console.log('📝 Final restored data:', {
              contactPhone: restoredData.contactPhone,
              items: restoredData.items,
              hasItems: Object.values(restoredData.items).some(q => q > 0),
              location: restoredData.location
            });
            
            return restoredData;
          });
          
          // Restore current step
          setCurrentState(savedState.currentStep as BookingState);
          
          // If location is set, show map
          if (savedState.bookingData.location) {
            setShowMap(true);
          }
          
          // If user just logged in and we have a session, transfer it
          if (isAuthenticated && savedState.sessionId && !savedState.userId) {
            console.log('📝 Transferring session to user...');
            await bookingStateService.transferSessionToUser();
          }
          
          console.log(`📝 Restored booking from step: ${savedState.currentStep}`);
        } else {
          console.log('📝 No saved state found, checking for quick booking data...');
          // Check for quick booking data if no saved state
          const quickBookingData = sessionStorage.getItem('quickBookingData');
          if (quickBookingData) {
            console.log('📝 Found quick booking data:', quickBookingData);
            const data = JSON.parse(quickBookingData);
            setBookingData(prev => ({
              ...prev,
              location: data.location,
              coordinates: data.coordinates,
              items: data.preselectedItems?.reduce((acc: { [key: string]: number }, itemId: string) => {
                acc[itemId] = 1;
                return acc;
              }, {}) || {}
            }));
            setShowMap(true);
            setCurrentState('items');
            sessionStorage.removeItem('quickBookingData');
          } else {
            console.log('📝 No booking data found, starting fresh');
          }
        }
      } catch (error) {
        console.error('❌ Failed to load booking state:', error);
      } finally {
        setIsLoadingState(false);
        setHasLoadedState(true);
      }
    };

    loadBookingState();
  }, [hasLoadedState, isAuthenticated]);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [hasAttemptedBooking, setHasAttemptedBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Recent locations data
  const recentLocations = [
    { 
      name: 'Home', 
      address: 'Sandton City, Johannesburg', 
      coords: { lat: -26.1076, lng: 28.0567 } 
    },
    { 
      name: 'Office', 
      address: 'Rosebank, Johannesburg', 
      coords: { lat: -26.1435, lng: 28.0436 } 
    },
    { 
      name: 'Gym', 
      address: 'Hyde Park Corner, Johannesburg', 
      coords: { lat: -26.1186, lng: 28.0317 } 
    }
  ];

  // Smart price calculation
  const calculatePrice = useCallback(() => {
    const itemsTotal = Object.entries(bookingData.items).reduce((sum, [itemId, quantity]) => {
      const item = popularItems.find(i => i.id === itemId);
      return sum + (item?.price || 0) * quantity;
    }, 0);
    
    return Math.round(itemsTotal);
  }, [bookingData.items]);

  // Auto-update price when items change
  useEffect(() => {
    setEstimatedPrice(calculatePrice());
  }, [calculatePrice]);

  // Save booking state whenever it changes (debounced)
  useEffect(() => {
    if (!hasLoadedState) return; // Don't save until we've loaded initial state
    
    const saveState = async () => {
      try {
        await bookingStateService.saveBookingState(currentState, {
          ...bookingData,
          estimatedPrice
        });
      } catch (error) {
        console.error('❌ Failed to save booking state:', error);
      }
    };

    // Debounce the save operation
    const timeoutId = setTimeout(saveState, 1000);
    return () => clearTimeout(timeoutId);
  }, [currentState, bookingData, estimatedPrice, hasLoadedState]);

  // Handle authentication state changes and redirect after login
  useEffect(() => {
    console.log('🔥 Authentication effect triggered:', {
      isAuthenticated,
      currentState,
      hasItems: Object.values(bookingData.items).some(q => q > 0),
      hasContactPhone: !!bookingData.contactPhone
    });
    
    // If user just logged in and we're in confirming state, proceed to create booking
    // BUT only if we have valid booking data (items and contact phone) AND haven't already attempted
    if (isAuthenticated && currentState === 'confirming' && !hasAttemptedBooking) {
      const hasItems = Object.values(bookingData.items).some(q => q > 0);
      const hasContactPhone = !!bookingData.contactPhone;
      
      if (hasItems && hasContactPhone) {
        console.log('🔥 User logged in with valid booking data, proceeding to create booking');
        setHasAttemptedBooking(true); // Prevent retry loops
        setTimeout(() => {
          setCurrentState('processing');
        }, 500);
      } else {
        console.log('🔥 User logged in but missing booking data:', { hasItems, hasContactPhone });
        // Don't clear state immediately - let user continue from where they are
        // Only clear if we're in confirming state with no data at all
        if (currentState === 'confirming' && !hasItems && !hasContactPhone) {
          console.log('🗑️ No booking data in confirming state, clearing and starting fresh');
          try {
            bookingStateService.deleteBookingState();
            setCurrentState('location');
          } catch (error) {
            console.error('❌ Failed to clear invalid booking state:', error);
          }
        } else {
          console.log('🔥 Keeping current state, user can continue booking flow');
        }
      }
    }
  }, [isAuthenticated, currentState]); // Removed bookingData.items from dependencies

  // Handle location selection - Uber style immediate progression
  const handleLocationSelect = (location: string, coords: { lat: number; lng: number }) => {
    setBookingData(prev => ({
      ...prev,
      location,
      coordinates: coords
    }));
    setShowMap(true);
    
    // Don't change state if we're already past the location step
    if (currentState !== 'location') {
      return;
    }
    
    // Proceed directly to items step after location selection
      setTimeout(() => {
        setCurrentState('items');
      }, 800);
  };

  // Handle current location detection
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode to get address
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();
          
          if (data.results && data.results[0]) {
            const address = data.results[0].formatted_address;
            handleLocationSelect(address, { lat: latitude, lng: longitude });
          } else {
            // Fallback to coordinates
            const address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            handleLocationSelect(address, { lat: latitude, lng: longitude });
          }
        } catch (error) {
          console.error('Reverse geocoding failed:', error);
          const address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          handleLocationSelect(address, { lat: latitude, lng: longitude });
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);
        let errorMessage = 'Unable to get your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        setError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Handle recent location selection
  const handleRecentLocationSelect = (location: typeof recentLocations[0]) => {
    handleLocationSelect(location.address, location.coords);
  };

  // Smart item quantity management
  const updateItemQuantity = (itemId: string, delta: number) => {
    setBookingData(prev => ({
      ...prev,
      items: {
        ...prev.items,
        [itemId]: Math.max(0, (prev.items[itemId] || 0) + delta)
      }
    }));
  };

  // Date/Time handling functions
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getAvailableTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const handleScheduleLater = () => {
    setShowScheduleDialog(true);
  };

  const handleScheduleConfirm = () => {
    if (selectedDate && selectedTime) {
      const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);
      setBookingData(prev => ({
        ...prev,
        scheduledFor: 'later',
        scheduledDate: scheduledDateTime,
        scheduledTime: selectedTime
      }));
      setShowScheduleDialog(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 50%, #190F32 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <ParticleBackground />
      {/* Background Map - Always visible when location is set */}
      <AnimatePresence>
        {showMap && bookingData.coordinates && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1
            }}
          >
            <GoogleMap
              center={bookingData.coordinates}
              zoom={14}
              pickupLocation={bookingData.location}
              drivers={[]}
            />
            {/* Overlay gradient */}
            <Box sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60%',
              background: 'linear-gradient(transparent, rgba(26, 16, 64, 0.95))',
              pointerEvents: 'none'
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ 
        position: 'relative', 
        zIndex: 2, 
        pt: 2,
        pb: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
      }}>
        {/* Compact Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 1, 
          flexShrink: 0,
          px: 1,
          py: 0.5
        }}>
          <Typography variant="h6" sx={{ 
            color: 'white', 
            fontWeight: 600,
            fontSize: '1.1rem',
            fontFamily: '"Plus Jakarta Sans", sans-serif'
          }}>
            Book Cleaning Service
          </Typography>
          <IconButton 
            onClick={() => navigate('/')} 
            sx={{ 
              color: 'white', 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              p: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease'
              },
              '&:active': {
                transform: 'scale(0.95)'
              }
            }}
            size="large"
            aria-label="Close booking"
          >
            <Close sx={{ fontSize: '1.5rem' }} />
          </IconButton>
        </Box>

        {/* Error Display */}
        {error && (
          <Card sx={{ mb: 2, bgcolor: 'error.dark', color: 'white' }}>
            <CardContent>
              <Typography>{error}</Typography>
              <Button 
                size="small" 
                sx={{ color: 'white', mt: 1 }}
                onClick={() => setError(null)}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading State Indicator */}
        {isLoadingState && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flex: 1,
            flexDirection: 'column',
            gap: 2
          }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <DirectionsCar sx={{ fontSize: 60, color: '#FF6B35' }} />
            </motion.div>
            <Typography sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '1rem'
            }}>
              Loading your booking...
            </Typography>
          </Box>
        )}

        {/* Dynamic Content Based on State */}
        {!isLoadingState && (
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            py: 1
          }}>
            <AnimatePresence mode="wait">
          {/* Location Input - Enhanced Uber Style */}
          {currentState === 'location' && (
            <motion.div
              key="location"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ width: '100%', maxWidth: '480px' }}
            >
              {/* Compact Header */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Typography variant="h4" sx={{
                    color: 'white',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 700,
                    mb: 1,
                    fontSize: { xs: '1.75rem', md: '2rem' },
                    background: 'linear-gradient(135deg, #ffffff 0%, #FF6B35 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Where should we collect?
                  </Typography>
                  <Typography variant="body2" sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontSize: '16px',
                    lineHeight: 1.4
                  }}>
                    Enter your pickup location to get started
                  </Typography>
                </motion.div>
              </Box>

              {/* Current Location Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <Button
                  variant="outlined"
                  startIcon={<LocationOn />}
                  onClick={handleUseCurrentLocation}
                  disabled={isLoading}
                  sx={{
                    width: '100%',
                    mb: 2,
                    py: 1.5,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 600,
                    fontSize: '16px',
                    borderRadius: '12px',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: 'rgba(255, 107, 53, 0.6)',
                      backgroundColor: 'rgba(255, 107, 53, 0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(255, 107, 53, 0.2)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isLoading ? 'Getting your location...' : 'Use current location'}
                </Button>
              </motion.div>

              {/* Divider */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                '&::before, &::after': {
                  content: '""',
                  flex: 1,
                  height: '1px',
                  background: 'rgba(255, 255, 255, 0.2)'
                }
              }}>
                <Typography sx={{ 
                  mx: 2, 
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '14px',
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                }}>
                  OR
                </Typography>
              </Box>
              
              {/* Enhanced Address Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <PlacesInput
                  value={bookingData.location}
                  onChange={(value) => setBookingData(prev => ({ ...prev, location: value }))}
                  onLocationSelect={(locationData) => {
                    handleLocationSelect(locationData.address, {
                      lat: locationData.lat,
                      lng: locationData.lng
                    });
                  }}
                  onLocationSelected={() => {
                    // Location selected, proceed to next step
                    console.log('Location selected, proceeding to items step');
                  }}
                  placeholder="Enter pickup address"
                  dropdownMaxHeight="min(300px, 40vh)"
                />
              </motion.div>

              {/* Recent Locations - Compact */}
              {recentLocations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <Box sx={{ mt: 2 }}>
                    <Typography sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      fontWeight: 600,
                      mb: 2,
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Recent Locations
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {recentLocations.slice(0, 2).map((location, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                        >
                          <Button
                            variant="text"
                            startIcon={<LocationOn sx={{ fontSize: 18 }} />}
                            onClick={() => handleRecentLocationSelect(location)}
                            sx={{
                              width: '100%',
                              justifyContent: 'flex-start',
                              py: 1.5,
                              px: 2,
                              borderRadius: '12px',
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontFamily: '"Plus Jakarta Sans", sans-serif',
                              textTransform: 'none',
                              fontSize: '15px',
                              fontWeight: 500,
                              background: 'rgba(255, 255, 255, 0.05)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 107, 53, 0.3)',
                                transform: 'translateX(8px)',
                                boxShadow: '0 4px 20px rgba(255, 107, 53, 0.1)'
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <Box sx={{ textAlign: 'left', flex: 1 }}>
                              <Typography sx={{
                                fontSize: '15px',
                                fontWeight: 600,
                                color: 'white',
                                fontFamily: '"Plus Jakarta Sans", sans-serif'
                              }}>
                                {location.name}
                              </Typography>
                              <Typography sx={{
                                fontSize: '13px',
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontFamily: '"Plus Jakarta Sans", sans-serif'
                              }}>
                                {location.address}
                              </Typography>
                            </Box>
                          </Button>
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Car Type Selection */}
          {currentState === 'carType' && (
            <motion.div
              key="carType"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <Card elevation={0} sx={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                boxShadow: 'none',
                p: { xs: 1.5, md: 2 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 107, 53, 0.3)',
                  boxShadow: '0 20px 40px rgba(255, 107, 53, 0.1)'
                }
              }}>
                <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexShrink: 0 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'white', 
                        fontFamily: '"Plus Jakarta Sans", sans-serif', 
                        fontWeight: 700,
                        fontSize: { xs: '1.1rem', sm: '1.2rem' },
                        background: 'linear-gradient(135deg, #ffffff 0%, #FF6B35 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      🚗 Choose Your Service Type
                    </Typography>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Typography sx={{ fontSize: '1.5rem' }}>⚡</Typography>
                    </motion.div>
                  </Box>

                  {/* Car Type Selection - No login required */}

                  <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
                    <CarTypeSelector
                      selectedCarType={bookingData.selectedCarType || null}
                      onCarTypeSelect={(carTypeId) => {
                        setBookingData(prev => ({ ...prev, selectedCarType: carTypeId }));
                        
                        // After selecting a car type, proceed to confirmatione
                        setTimeout(() => {
                          setCurrentState('confirming');
                        }, 300);
                      }}
                      basePrice={estimatedPrice}
                    />
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 2, mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>
                    <Button
                      onClick={() => setCurrentState('items')}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        textTransform: 'none',
                        '&:hover': { color: 'white' }
                      }}
                      startIcon={<ArrowBack />}
                    >
                      ← Back to Items
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Items Selection - Smart Grid */}
          {currentState === 'items' && (
            <motion.div
              key="items"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <Card elevation={0} sx={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                boxShadow: 'none',
                p: { xs: 1.5, md: 2 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 107, 53, 0.3)',
                  boxShadow: '0 20px 40px rgba(255, 107, 53, 0.1)'
                }
              }}>
                <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexShrink: 0 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'white', 
                        fontFamily: '"Plus Jakarta Sans", sans-serif', 
                        fontWeight: 700,
                        fontSize: { xs: '1.1rem', sm: '1.2rem' },
                        background: 'linear-gradient(135deg, #ffffff 0%, #FF6B35 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      🧽 What needs cleaning?
                    </Typography>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                    <Chip 
                        label={
                          Object.values(bookingData.items).reduce((sum, quantity) => sum + quantity, 0) > 0
                            ? `${Object.values(bookingData.items).reduce((sum, quantity) => sum + quantity, 0)} items • R${estimatedPrice}`
                            : 'Select items'
                        }
                        sx={{ 
                          fontWeight: 700, 
                          fontSize: 14,
                          background: Object.values(bookingData.items).reduce((sum, quantity) => sum + quantity, 0) > 0
                            ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
                            : 'rgba(255,255,255,0.1)',
                          color: Object.values(bookingData.items).reduce((sum, quantity) => sum + quantity, 0) > 0
                            ? 'white'
                            : 'rgba(255,255,255,0.6)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          boxShadow: Object.values(bookingData.items).reduce((sum, quantity) => sum + quantity, 0) > 0
                            ? '0 4px 12px rgba(255, 107, 53, 0.3)'
                            : '0 2px 8px rgba(0,0,0,0.1)',
                          backdropFilter: 'blur(10px)',
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          px: 1.5,
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </motion.div>
                  </Box>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(3, 1fr)' }, 
                    gap: { xs: 1, sm: 1.2 },
                    flex: 1,
                    alignContent: 'start',
                    maxHeight: 'calc(100vh - 250px)',
                    overflowY: 'auto',
                    pr: 0.5
                  }}>
                    {popularItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: popularItems.indexOf(item) * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card 
                          elevation={0}
                        sx={{
                            border: bookingData.items[item.id] > 0 ? '2px solid rgba(255, 107, 53, 0.5)' : '1px solid rgba(255, 255, 255, 0.15)',
                            transition: 'all 0.3s ease',
                          position: 'relative',
                            background: bookingData.items[item.id] > 0 
                              ? 'linear-gradient(135deg, rgba(255, 107, 53, 0.15) 0%, rgba(247, 147, 30, 0.1) 100%)'
                              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: bookingData.items[item.id] > 0 
                              ? '0 8px 32px rgba(255, 107, 53, 0.2), 0 4px 16px rgba(0,0,0,0.1)' 
                              : '0 4px 16px rgba(0,0,0,0.1)',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            minHeight: { xs: 140, sm: 160 },
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              background: bookingData.items[item.id] > 0 
                                ? 'linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(247, 147, 30, 0.15) 100%)'
                                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 107, 53, 0.08) 100%)',
                              border: '2px solid rgba(255, 107, 53, 0.5)',
                              boxShadow: '0 12px 40px rgba(255, 107, 53, 0.25), 0 6px 20px rgba(0,0,0,0.15)',
                            },
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              height: '3px',
                              background: bookingData.items[item.id] > 0 
                                ? 'linear-gradient(90deg, #FF6B35 0%, #F7931E 100%)'
                                : 'transparent',
                              opacity: bookingData.items[item.id] > 0 ? 1 : 0,
                              transition: 'opacity 0.3s ease'
                            },
                            '&:hover::before': {
                              opacity: 1,
                              background: 'linear-gradient(90deg, #FF6B35 0%, #F7931E 100%)'
                            }
                        }}
                      >
                        {item.popular && (
                          <Chip
                            label="Popular"
                            size="small"
                              sx={{ 
                                position: 'absolute', 
                                top: -8, 
                                right: 12, 
                                fontSize: '0.7rem', 
                                zIndex: 2,
                                background: 'linear-gradient(135deg, #00D4AA 0%, #0096FF 100%)',
                                color: 'white',
                                fontWeight: 600,
                                px: 1,
                                boxShadow: '0 4px 12px rgba(0, 212, 170, 0.3)'
                              }}
                            />
                          )}
                          
                          {/* Selection indicator */}
                          {bookingData.items[item.id] > 0 && (
                            <Box sx={{
                              position: 'absolute',
                              top: 12,
                              left: 12,
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 2,
                              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)'
                            }}>
                              <CheckCircle sx={{ fontSize: 16, color: 'white' }} />
                            </Box>
                          )}
                          
                          <CardContent sx={{ p: { xs: 1.2, sm: 1.8 }, textAlign: 'center', position: 'relative' }}>
                            <Typography 
                              variant="h4" 
                              sx={{ 
                                mb: 1, 
                                fontSize: { xs: 28, sm: 32 },
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              {item.icon}
                            </Typography>
                            
                            <Typography 
                              variant="body2" 
                              fontWeight={700} 
                              sx={{ 
                                color: 'white', 
                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                mb: 0.5,
                                lineHeight: 1.3,
                                textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                              }}
                            >
                              {item.name}
                            </Typography>
                            
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: '#FFD700', 
                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                fontWeight: 800,
                                display: 'block',
                                mb: 1.5,
                                textShadow: '0 1px 3px rgba(0,0,0,0.7)'
                              }}
                            >
                              R{item.price}
                            </Typography>
                            
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              gap: 0.8,
                              position: 'relative'
                            }}>
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateItemQuantity(item.id, -1);
                                }} 
                                disabled={!bookingData.items[item.id]} 
                                sx={{ 
                                  bgcolor: bookingData.items[item.id] ? 'rgba(244, 67, 54, 0.9)' : 'rgba(255,255,255,0.15)',
                                  color: bookingData.items[item.id] ? 'white' : 'rgba(255,255,255,0.5)',
                                  width: 28,
                                  height: 28,
                                  border: '2px solid rgba(255,255,255,0.3)',
                                  transition: 'all 0.3s ease',
                                  '&:hover': { 
                                    bgcolor: bookingData.items[item.id] ? 'rgba(244, 67, 54, 1)' : 'rgba(255,255,255,0.2)',
                                    transform: 'scale(1.1)',
                                    boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)'
                                  },
                                  '&:disabled': { 
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    transform: 'none'
                                  }
                                }}
                              >
                                <Remove sx={{ fontSize: 16 }} />
                            </IconButton>
                              
                              <Box sx={{
                                minWidth: 32,
                                height: 28,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '6px',
                                background: bookingData.items[item.id] > 0 
                                  ? 'linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(247, 147, 30, 0.15) 100%)'
                                  : 'rgba(255,255,255,0.15)',
                                border: bookingData.items[item.id] > 0 
                                  ? '2px solid rgba(255, 107, 53, 0.5)'
                                  : '2px solid rgba(255,255,255,0.3)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: bookingData.items[item.id] > 0 
                                  ? '0 2px 8px rgba(255, 107, 53, 0.2)'
                                  : 'none'
                              }}>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: bookingData.items[item.id] > 0 ? '#FF6B35' : 'rgba(255,255,255,0.9)', 
                                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                                    fontWeight: 800,
                                    fontSize: '0.85rem',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                                  }}
                                >
                                  {bookingData.items[item.id] || 0}
                                </Typography>
                              </Box>
                              
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateItemQuantity(item.id, 1);
                                }} 
                                sx={{ 
                                  bgcolor: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                                  color: 'white',
                                  width: 28,
                                  height: 28,
                                  border: '2px solid rgba(255,255,255,0.3)',
                                  transition: 'all 0.3s ease',
                                  '&:hover': { 
                                    bgcolor: 'linear-gradient(135deg, #E55A2B 0%, #E8851A 100%)',
                                    transform: 'scale(1.1)',
                                    boxShadow: '0 4px 16px rgba(255, 107, 53, 0.5)'
                                  }
                                }}
                              >
                                <Add sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                      </motion.div>
                    ))}
                  </Box>
                  <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>
                    <Typography 
                      variant="body2" 
                      gutterBottom 
                      sx={{ 
                        color: 'rgba(255,255,255,0.9)', 
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        mb: 1.5,
                        textAlign: 'center'
                      }}
                    >
                      When do you need this?
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Button
                        variant={bookingData.scheduledFor === 'now' ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => setBookingData(prev => ({ ...prev, scheduledFor: 'now' }))}
                        sx={{ 
                          fontWeight: 700, 
                          borderRadius: 2,
                          px: 2.5,
                          py: 0.8,
                          fontSize: '0.75rem',
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          textTransform: 'none',
                          minWidth: 90,
                          background: bookingData.scheduledFor === 'now' 
                            ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
                            : 'transparent',
                          borderColor: bookingData.scheduledFor === 'now' 
                            ? 'transparent'
                            : 'rgba(255,255,255,0.3)',
                          color: bookingData.scheduledFor === 'now' 
                            ? 'white'
                            : 'rgba(255,255,255,0.8)',
                          boxShadow: bookingData.scheduledFor === 'now' 
                            ? '0 4px 16px rgba(255, 107, 53, 0.3)'
                            : 'none',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            background: bookingData.scheduledFor === 'now' 
                              ? 'linear-gradient(135deg, #E55A2B 0%, #E8851A 100%)'
                              : 'rgba(255, 107, 53, 0.1)',
                            borderColor: bookingData.scheduledFor === 'now' 
                              ? 'transparent'
                              : 'rgba(255, 107, 53, 0.4)',
                            transform: 'translateY(-2px)',
                            boxShadow: bookingData.scheduledFor === 'now' 
                              ? '0 6px 20px rgba(255, 107, 53, 0.4)'
                              : '0 4px 12px rgba(255, 107, 53, 0.2)'
                          }
                        }}
                      >
                        ⚡ ASAP
                      </Button>
                      <Button
                        variant={bookingData.scheduledFor === 'later' ? 'contained' : 'outlined'}
                        size="small"
                        onClick={handleScheduleLater}
                        sx={{ 
                          fontWeight: 700, 
                          borderRadius: 2,
                          px: 2.5,
                          py: 0.8,
                          fontSize: '0.75rem',
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          textTransform: 'none',
                          minWidth: 120,
                          background: bookingData.scheduledFor === 'later' 
                            ? 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)'
                            : 'transparent',
                          borderColor: bookingData.scheduledFor === 'later' 
                            ? 'transparent'
                            : 'rgba(255,255,255,0.3)',
                          color: bookingData.scheduledFor === 'later' 
                            ? 'white'
                            : 'rgba(255,255,255,0.8)',
                          boxShadow: bookingData.scheduledFor === 'later' 
                            ? '0 4px 16px rgba(33, 150, 243, 0.3)'
                            : 'none',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            background: bookingData.scheduledFor === 'later' 
                              ? 'linear-gradient(135deg, #1976D2 0%, #1EACDF 100%)'
                              : 'rgba(33, 150, 243, 0.1)',
                            borderColor: bookingData.scheduledFor === 'later' 
                              ? 'transparent'
                              : 'rgba(33, 150, 243, 0.4)',
                            transform: 'translateY(-2px)',
                            boxShadow: bookingData.scheduledFor === 'later' 
                              ? '0 6px 20px rgba(33, 150, 243, 0.4)'
                              : '0 4px 12px rgba(33, 150, 243, 0.2)'
                          }
                        }}
                      >
                        📅 {bookingData.scheduledFor === 'later' && bookingData.scheduledDate 
                          ? `${bookingData.scheduledDate.toLocaleDateString()} ${bookingData.scheduledTime}`
                          : 'Schedule Later'
                        }
                      </Button>
                    </Box>
                  </Box>
                  {/* Enhanced Floating Continue Button */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ 
                      scale: (Object.values(bookingData.items).some(q => q > 0) && (bookingData.scheduledFor === 'now' || bookingData.scheduledFor === 'later')) ? 1 : 0.8,
                      rotate: 0
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 260, 
                      damping: 20,
                      duration: 0.4
                    }}
                    style={{
                      position: 'fixed',
                      bottom: 24,
                      right: 24,
                      zIndex: 1201
                    }}
                  >
                  <IconButton
                    size="large"
                    sx={{
                        background: (Object.values(bookingData.items).some(q => q > 0) && (bookingData.scheduledFor === 'now' || bookingData.scheduledFor === 'later'))
                          ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
                          : 'rgba(255,255,255,0.1)',
                        color: (Object.values(bookingData.items).some(q => q > 0) && (bookingData.scheduledFor === 'now' || bookingData.scheduledFor === 'later'))
                          ? 'white'
                          : 'rgba(255,255,255,0.4)',
                        width: 60,
                        height: 60,
                      borderRadius: '50%',
                        border: '3px solid rgba(255,255,255,0.15)',
                        boxShadow: (Object.values(bookingData.items).some(q => q > 0) && (bookingData.scheduledFor === 'now' || bookingData.scheduledFor === 'later'))
                          ? '0 8px 32px rgba(255, 107, 53, 0.4), 0 4px 16px rgba(0,0,0,0.2)'
                          : '0 4px 16px rgba(0,0,0,0.1)',
                        backdropFilter: 'blur(20px)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        opacity: (Object.values(bookingData.items).some(q => q > 0) && (bookingData.scheduledFor === 'now' || bookingData.scheduledFor === 'later'))
                          ? 1 
                          : 0.6,
                        cursor: (Object.values(bookingData.items).some(q => q > 0) && (bookingData.scheduledFor === 'now' || bookingData.scheduledFor === 'later'))
                          ? 'pointer'
                          : 'not-allowed',
                        '&:hover': {
                          background: (Object.values(bookingData.items).some(q => q > 0) && (bookingData.scheduledFor === 'now' || bookingData.scheduledFor === 'later'))
                            ? 'linear-gradient(135deg, #E55A2B 0%, #E8851A 100%)'
                            : 'rgba(255,255,255,0.15)',
                          transform: (Object.values(bookingData.items).some(q => q > 0) && (bookingData.scheduledFor === 'now' || bookingData.scheduledFor === 'later'))
                            ? 'scale(1.05) translateY(-2px)'
                            : 'none',
                          boxShadow: (Object.values(bookingData.items).some(q => q > 0) && (bookingData.scheduledFor === 'now' || bookingData.scheduledFor === 'later'))
                            ? '0 12px 40px rgba(255, 107, 53, 0.5), 0 6px 20px rgba(0,0,0,0.25)'
                            : '0 4px 16px rgba(0,0,0,0.1)'
                        },
                        '&:active': {
                          transform: (Object.values(bookingData.items).some(q => q > 0) && (bookingData.scheduledFor === 'now' || bookingData.scheduledFor === 'later'))
                            ? 'scale(0.95)'
                            : 'none'
                        }
                      }}
                      disabled={!(Object.values(bookingData.items).some(q => q > 0) && (bookingData.scheduledFor === 'now' || bookingData.scheduledFor === 'later'))}
                      onClick={() => {
                        if (Object.values(bookingData.items).some(q => q > 0) && (bookingData.scheduledFor === 'now' || bookingData.scheduledFor === 'later')) {
                          // Always proceed to carType step, regardless of authentication status
                          // This ensures all users go through all steps
                          setCurrentState('carType');
                        }
                      }}
                    >
                      <ArrowForward sx={{ fontSize: 28 }} />
                  </IconButton>
                    
                    {/* Progress Indicator */}
                    {(Object.values(bookingData.items).some(q => q > 0) && (bookingData.scheduledFor === 'now' || bookingData.scheduledFor === 'later')) && (
                      <Box sx={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)',
                        zIndex: 1
                      }}>
                        <CheckCircle sx={{ fontSize: 14, color: 'white' }} />
                      </Box>
                    )}
                  </motion.div>
                  
                  {/* Booking Progress Bar */}
                  <Box sx={{ 
                    mt: 2, 
                    pt: 1.5, 
                    borderTop: '1px solid rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1.5,
                    flexShrink: 0
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.3,
                      px: 1.5,
                      py: 0.6,
                      borderRadius: 1.5,
                      background: Object.values(bookingData.items).some(q => q > 0)
                        ? 'rgba(76, 175, 80, 0.15)'
                        : 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.15)'
                    }}>
                      <CheckCircle sx={{ 
                        fontSize: 14, 
                        color: Object.values(bookingData.items).some(q => q > 0) ? '#4CAF50' : 'rgba(255,255,255,0.4)' 
                      }} />
                      <Typography sx={{ 
                        fontSize: '0.7rem', 
                        color: Object.values(bookingData.items).some(q => q > 0) ? '#4CAF50' : 'rgba(255,255,255,0.6)',
                        fontWeight: 600,
                        fontFamily: '"Plus Jakarta Sans", sans-serif'
                      }}>
                        Items
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      width: 16, 
                      height: 2, 
                      background: (Object.values(bookingData.items).some(q => q > 0) && (bookingData.scheduledFor === 'now' || bookingData.scheduledFor === 'later'))
                        ? 'linear-gradient(90deg, #4CAF50 0%, #FF6B35 100%)'
                        : 'rgba(255,255,255,0.2)',
                      borderRadius: 1,
                      transition: 'all 0.3s ease'
                    }} />
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.3,
                      px: 1.5,
                      py: 0.6,
                      borderRadius: 1.5,
                      background: (bookingData.scheduledFor === 'now' || bookingData.scheduledFor === 'later')
                        ? 'rgba(255, 107, 53, 0.15)'
                        : 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.15)'
                    }}>
                      <AccessTime sx={{ 
                        fontSize: 14, 
                        color: (bookingData.scheduledFor === 'now' || bookingData.scheduledFor === 'later') ? '#FF6B35' : 'rgba(255,255,255,0.4)' 
                      }} />
                      <Typography sx={{ 
                        fontSize: '0.7rem', 
                        color: (bookingData.scheduledFor === 'now' || bookingData.scheduledFor === 'later') ? '#FF6B35' : 'rgba(255,255,255,0.6)',
                        fontWeight: 600,
                        fontFamily: '"Plus Jakarta Sans", sans-serif'
                      }}>
                        Timing
                      </Typography>
                    </Box>
                  </Box>
                    </CardContent>
                  </Card>
            </motion.div>
          )}

          {/* Confirming Step - Payment & Final Details */}
          {currentState === 'confirming' && (
            <motion.div
              key="confirming"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <Card elevation={0} sx={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                p: { xs: 2, md: 3 },
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'visible'
              }}>
                <CardContent sx={{ 
                  p: 0, 
                  display: 'flex', 
                  flexDirection: 'column',
                  overflow: 'visible',
                  flex: 1,
                  maxHeight: '80vh'
                }}>
                  {/* Scrollable Content */}
                  <Box sx={{ 
                    flex: 1, 
                    overflowY: 'auto',
                    pr: 1,
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(255, 107, 53, 0.5)',
                      borderRadius: '3px',
                      '&:hover': {
                        background: 'rgba(255, 107, 53, 0.7)',
                      }
                    }
                  }}>
                    {/* Header */}
                    <Box sx={{ mb: 3, textAlign: 'center', position: 'relative' }}>
                      {/* Close Button */}
                      <IconButton 
                        onClick={() => navigate('/')} 
                        sx={{ 
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          color: 'white', 
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px',
                          p: 1,
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            transform: 'scale(1.05)',
                            transition: 'all 0.2s ease'
                          },
                          '&:active': {
                            transform: 'scale(0.95)'
                          }
                        }}
                        size="small"
                        aria-label="Close booking"
                      >
                        <Close sx={{ fontSize: '1.2rem' }} />
                      </IconButton>
                      
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: 'white', 
                        fontFamily: '"Plus Jakarta Sans", sans-serif', 
                        fontWeight: 700,
                        fontSize: { xs: '1.3rem', sm: '1.5rem' },
                        background: 'linear-gradient(135deg, #ffffff 0%, #FF6B35 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1
                      }}
                    >
                      💳 Confirm & Pay
                    </Typography>
                    <Typography sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}>
                      Review your booking and complete payment
                    </Typography>
                  </Box>


                  {/* Booking Summary */}
                  <Box sx={{ 
                    mb: 3, 
                    p: 2.5, 
                    borderRadius: 3, 
                    background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(247, 147, 30, 0.05) 100%)',
                    border: '1px solid rgba(255, 107, 53, 0.2)'
                  }}>
                    <Typography sx={{ 
                      color: '#FF6B35', 
                      fontSize: '0.9rem', 
                      fontWeight: 700,
                      mb: 2,
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}>
                      📋 Booking Summary
                    </Typography>

                    {/* Location */}
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', mb: 0.5 }}>
                        Pickup Location
                      </Typography>
                      <Typography sx={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>
                        📍 {bookingData.location}
                      </Typography>
                    </Box>

                    {/* Items */}
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', mb: 0.5 }}>
                        Items to Clean
                      </Typography>
                      {Object.entries(bookingData.items).filter(([_, quantity]) => quantity > 0).map(([itemId, quantity]) => {
                        const item = popularItems.find(i => i.id === itemId);
                        return (
                          <Box key={itemId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography sx={{ color: 'white', fontSize: '0.8rem' }}>
                              {item?.icon} {item?.name} x{quantity}
                            </Typography>
                            <Typography sx={{ color: '#FFD700', fontSize: '0.8rem', fontWeight: 600 }}>
                              R{(item?.price || 0) * quantity}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>

                    {/* Driver */}
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', mb: 0.5 }}>
                        Service Type
                      </Typography>
                      <Typography sx={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>
                        🚗 Cleaning Service
                      </Typography>
                    </Box>

                    {/* Total */}
                    <Box sx={{ pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ color: 'white', fontSize: '1rem', fontWeight: 700 }}>
                          Total Amount
                        </Typography>
                        <Typography sx={{ 
                          color: '#FFD700', 
                          fontSize: '1.2rem', 
                          fontWeight: 800,
                          fontFamily: '"Plus Jakarta Sans", sans-serif'
                        }}>
                          R{estimatedPrice}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Payment Methods */}
                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ 
                      color: 'white', 
                      fontSize: '0.9rem', 
                      fontWeight: 600, 
                      mb: 2,
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}>
                      💳 Payment Method
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                      {[
                        { id: 'card', label: 'Card', icon: '💳' },
                        { id: 'mobile', label: 'Mobile', icon: '📱' },
                        { id: 'cash', label: 'Cash', icon: '💵' }
                      ].map((method) => (
                        <Box
                          key={method.id}
                          onClick={() => setBookingData(prev => ({ ...prev, paymentMethod: method.id as any }))}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            border: bookingData.paymentMethod === method.id
                              ? '2px solid #FFD700'
                              : '1px solid rgba(255, 255, 255, 0.2)',
                            background: bookingData.paymentMethod === method.id
                              ? 'rgba(255, 215, 0, 0.15)'
                              : 'rgba(255, 255, 255, 0.05)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            textAlign: 'center',
                            '&:hover': {
                              background: 'rgba(255, 215, 0, 0.1)',
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          <Typography sx={{ fontSize: '1.5rem', mb: 0.5 }}>{method.icon}</Typography>
                          <Typography sx={{
                            color: bookingData.paymentMethod === method.id ? '#FFD700' : 'rgba(255,255,255,0.8)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            fontFamily: '"Plus Jakarta Sans", sans-serif'
                          }}>
                            {method.label}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Contact Info */}
                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ 
                      color: 'white', 
                      fontSize: '0.9rem', 
                      fontWeight: 600, 
                      mb: 1.5,
                      fontFamily: '"Plus Jakarta Sans", sans-serif'
                    }}>
                      📞 Contact Number <span style={{ color: '#FF6B35' }}>*</span>
                    </Typography>
                    <input
                      type="tel"
                      placeholder="Enter your phone number (e.g., 082 123 4567)"
                      value={bookingData.contactPhone}
                      onChange={(e) => {
                        const phone = e.target.value;
                        setBookingData(prev => ({ ...prev, contactPhone: phone }));
                        // Validate phone number on change
                        if (phone.trim()) {
                          validatePhoneNumber(phone);
                        } else {
                          setPhoneValidationError('');
                        }
                      }}
                      onBlur={() => {
                        if (bookingData.contactPhone.trim()) {
                          validatePhoneNumber(bookingData.contactPhone);
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: phoneValidationError 
                          ? '1px solid rgba(255, 107, 53, 0.8)' 
                          : bookingData.contactPhone && !phoneValidationError
                            ? '1px solid rgba(76, 175, 80, 0.8)' 
                            : '1px solid rgba(255, 107, 53, 0.5)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'white',
                        fontSize: '0.9rem',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        outline: 'none',
                        transition: 'border-color 0.3s ease',
                        boxShadow: phoneValidationError ? '0 0 0 2px rgba(255, 107, 53, 0.2)' : 'none'
                      }}
                    />
                    {phoneValidationError && (
                      <Typography sx={{
                        color: '#FF6B35',
                        fontSize: '0.75rem',
                        mt: 1,
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}>
                        ⚠️ {phoneValidationError}
                      </Typography>
                    )}
                    {!bookingData.contactPhone && !phoneValidationError && (
                      <Typography sx={{
                        color: '#FF6B35',
                        fontSize: '0.75rem',
                        mt: 1,
                        fontFamily: '"Plus Jakarta Sans", sans-serif'
                      }}>
                        ⚠️ Phone number is required to complete your booking
                      </Typography>
                    )}
                  </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    mt: 3, 
                    pt: 2, 
                    borderTop: '1px solid rgba(255,255,255,0.15)',
                    flexShrink: 0
                  }}>
                    <Button
                    onClick={() => setCurrentState('items')}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        textTransform: 'none',
                        '&:hover': { color: 'white' }
                      }}
                    >
                      ← Back to Items
                    </Button>
                    
                    <Button
                      onClick={() => {
                        console.log('🔥 Booking button clicked:', { isAuthenticated, contactPhone: bookingData.contactPhone });
                        // Always proceed to processing step - authentication will be handled there
                          setCurrentState('processing');
                      }}
                      disabled={!bookingData.contactPhone || !!phoneValidationError}
                      variant="contained"
                      size="large"
                      sx={{
                        flex: 1,
                        background: (bookingData.contactPhone && !phoneValidationError)
                          ? 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)'
                          : 'rgba(255, 255, 255, 0.1)',
                        color: (bookingData.contactPhone && !phoneValidationError) ? 'white' : 'rgba(255, 255, 255, 0.5)',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: 700,
                        textTransform: 'none',
                        '&:hover': {
                          background: (bookingData.contactPhone && !phoneValidationError)
                            ? 'linear-gradient(135deg, #45A049 0%, #4CAF50 100%)'
                            : 'rgba(255, 255, 255, 0.15)'
                        },
                        '&:disabled': {
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.5)'
                        }
                      }}
                    >
                      {phoneValidationError 
                        ? 'Please fix phone number to continue'
                        : !bookingData.contactPhone 
                          ? 'Enter phone number to continue'
                          : (isAuthenticated 
                              ? `Confirm & Book Now - R${estimatedPrice}`
                              : `Login & Book Now - R${estimatedPrice}`)
                      }
                    </Button>
                  </Box>
                    </CardContent>
                  </Card>
            </motion.div>
          )}

          {/* Processing State */}
          {currentState === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onAnimationComplete={async () => {
                console.log('🔥 Processing step started:', { isAuthenticated, contactPhone: bookingData.contactPhone });
                setHasAttemptedBooking(true); // Mark that we've attempted booking
                
                // Check if user is authenticated before creating booking
                if (!isAuthenticated) {
                  console.log('🔥 User not authenticated, redirecting to login page');
                  // Redirect to login page with return URL
                  navigate('/login', { 
                    state: { 
                      returnTo: '/book',
                      bookingData: bookingData 
                    } 
                  });
                  return;
                }

                // Create booking via backend API
                try {
                  // Convert items object to array format expected by backend
                  const itemsArray = Object.entries(bookingData.items)
                    .filter(([_, quantity]) => quantity > 0)
                    .map(([itemId, quantity]) => `${itemId}:${quantity}`);

                  const bookingRequest = {
                    pickupLocation: bookingData.location,
                    items: itemsArray,
                    contactPhone: bookingData.contactPhone,
                    specialInstructions: bookingData.specialInstructions,
                    paymentMethod: bookingData.paymentMethod,
                    amount: calculatePrice(),
                    serviceType: bookingData.selectedCarType || 'standard',
                    scheduledDate: bookingData.scheduledFor === 'later' ? bookingData.scheduledDate || null : null,
                    scheduledTime: bookingData.scheduledFor === 'later' && bookingData.scheduledTime ? new Date(bookingData.scheduledTime) : null,
                    coordinates: bookingData.coordinates
                  };
                  
                  console.log('🔥 Creating booking with request:', {
                    ...bookingRequest,
                    items: itemsArray,
                    hasItems: itemsArray.length > 0,
                    contactPhone: bookingData.contactPhone,
                    location: bookingData.location
                  });

                  const bookingResponse = await bookingService.createBooking(bookingRequest);
                  
                  console.log('🔥 Booking response received:', bookingResponse);
                  
                  // Store booking ID for future reference
                  setBookingData(prev => ({ ...prev, bookingId: bookingResponse.bookingId }));
                  
                  // Clear saved booking state since booking is completed
                  try {
                    await bookingStateService.deleteBookingState();
                    console.log('🗑️ Cleared booking state after successful booking');
                  } catch (error) {
                    console.error('❌ Failed to clear booking state:', error);
                  }
                  
                  // Redirect to live tracking page after successful booking
                  setTimeout(() => {
                    console.log('🔥 Booking created successfully, redirecting to tracking page');
                    navigate(`/track/booking/${bookingResponse.bookingId}`, { 
                      state: { 
                        bookingId: bookingResponse.bookingId,
                        bookingData: bookingData 
                      } 
                    });
                  }, 1000);
                  
                } catch (error) {
                  console.error('❌ Error creating booking:', error);
                  
                  // Extract more specific error message
                  let errorMessage = 'Failed to create booking. Please try again.';
                  if (error instanceof Error) {
                    if (error.message.includes('Validation failed')) {
                      errorMessage = 'Please check your booking details and try again.';
                    } else if (error.message.includes('401')) {
                      errorMessage = 'Authentication failed. Please log in again.';
                    } else if (error.message.includes('400')) {
                      errorMessage = 'Invalid booking data. Please check your details.';
                    } else if (error.message.includes('500')) {
                      errorMessage = 'Server error. Please try again later.';
                    }
                  }
                  
                  setError(errorMessage);
                  // Go back to confirming state on error and reset attempt flag
                  setCurrentState('confirming');
                  setHasAttemptedBooking(false);
                }
              }}
            >
              <Card elevation={0} sx={{ 
                background: 'rgba(255, 255, 255, 0.03)', 
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                textAlign: 'center',
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                {/* Close Button */}
                <IconButton 
                  onClick={() => navigate('/')} 
                  sx={{ 
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    color: 'white', 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    p: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'scale(1.05)',
                      transition: 'all 0.2s ease'
                    },
                    '&:active': {
                      transform: 'scale(0.95)'
                    }
                  }}
                  size="small"
                  aria-label="Close booking"
                >
                  <Close sx={{ fontSize: '1.2rem' }} />
                </IconButton>
                
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <DirectionsCar sx={{ fontSize: 80, color: '#FF6B35', mb: 3 }} />
                </motion.div>
                
                <Typography variant="h5" gutterBottom sx={{
                  color: 'white',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 700,
                  mb: 2
                }}>
                  🚀 Processing Your Booking
                </Typography>
                
                <Typography variant="body1" sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  mb: 3,
                  maxWidth: 300,
                  lineHeight: 1.5
                }}>
                  Confirming payment and processing your pickup request
                </Typography>

                {/* Progress indicators */}
                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.8, opacity: 0.3 }}
                      animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: index * 0.3
                      }}
                    >
                      <Box sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#FF6B35'
                      }} />
                    </motion.div>
                  ))}
                </Box>

                <Typography variant="caption" sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                }}>
                  This will only take a moment...
                </Typography>
              </Card>
            </motion.div>
          )}

          {/* Confirmation */}
          {currentState === 'confirmed' && (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card elevation={0} sx={{ 
                background: 'rgba(255, 255, 255, 0.03)', 
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                textAlign: 'center',
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle sx={{ fontSize: 100, color: '#4CAF50', mb: 3 }} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Typography variant="h4" gutterBottom sx={{
                  color: 'white',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 700,
                    mb: 2,
                    background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    🎉 Booking Confirmed!
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Box sx={{ 
                    mb: 4, 
                    p: 3, 
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(69, 160, 73, 0.05) 100%)',
                    border: '1px solid rgba(76, 175, 80, 0.2)'
                  }}>
                    <Typography variant="h6" sx={{ 
                      mb: 2,
                      color: '#4CAF50',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 600
                }}>
                      🚗 Your cleaning service is confirmed!
                </Typography>
                    
                <Typography variant="body1" sx={{ 
                      mb: 2,
                      color: 'rgba(255, 255, 255, 0.9)',
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                }}>
                      ⏰ Estimated arrival: <strong style={{ color: '#FFD700' }}>8 minutes</strong>
                </Typography>

                    <Typography variant="body2" sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      lineHeight: 1.5
                    }}>
                      📱 You'll receive SMS updates about your driver's location and pickup status
                    </Typography>
                  </Box>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  style={{ width: '100%' }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => navigate('/track/booking/demo')}
                      sx={{
                        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                        color: 'white',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: 700,
                        textTransform: 'none',
                        py: 1.5,
                        fontSize: '1rem',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #E55A2B 0%, #E8851A 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      📍 Track Your Pickup
                </Button>
                    
                <Button
                  variant="outlined"
                  fullWidth
                      size="large"
                  onClick={() => navigate('/dashboard')}
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: 600,
                        textTransform: 'none',
                        py: 1.2,
                        '&:hover': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                          color: 'white',
                          background: 'rgba(255, 255, 255, 0.05)'
                        }
                      }}
                    >
                      🏠 Go to Dashboard
                </Button>
                  </Box>
                </motion.div>

                {/* Booking Reference */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <Typography variant="caption" sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    mt: 3,
                    display: 'block'
                  }}>
                    Booking Reference: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </Typography>
                </motion.div>
              </Card>
            </motion.div>
          )}
          </AnimatePresence>
          </Box>
        )}
      </Container>

      {/* Smart Bottom Action Button - Uber Style */}
      {/* Removed the bottom Continue/Book Now button as per request */}

      {/* Schedule Later Dialog */}
      <Dialog
        open={showScheduleDialog}
        onClose={() => setShowScheduleDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(15, 10, 40, 0.95) 0%, rgba(30, 20, 64, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontWeight: 700,
          fontSize: '1.5rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #2196F3 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          pb: 1
        }}>
          📅 Schedule Your Pickup
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Typography sx={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            mb: 3, 
            textAlign: 'center',
            fontFamily: '"Plus Jakarta Sans", sans-serif'
          }}>
            Choose your preferred pickup date and time
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography sx={{ 
                color: 'white', 
                mb: 1.5, 
                fontWeight: 600,
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}>
                📅 Select Date
              </Typography>
              <TextField
                type="date"
                fullWidth
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                inputProps={{
                  min: getTomorrowDate(),
                  max: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(33, 150, 243, 0.4)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2196F3',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography sx={{ 
                color: 'white', 
                mb: 1.5, 
                fontWeight: 600,
                fontFamily: '"Plus Jakarta Sans", sans-serif'
              }}>
                ⏰ Select Time
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
                gap: 1,
                maxHeight: 200,
                overflowY: 'auto',
                p: 1,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.02)'
              }}>
                {getAvailableTimeSlots().map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setSelectedTime(time)}
                    sx={{
                      minWidth: 'auto',
                      py: 1,
                      px: 1.5,
                      fontSize: '0.75rem',
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      borderRadius: '8px',
                      background: selectedTime === time 
                        ? 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)'
                        : 'transparent',
                      borderColor: selectedTime === time 
                        ? 'transparent'
                        : 'rgba(255, 255, 255, 0.2)',
                      color: selectedTime === time ? 'white' : 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        background: selectedTime === time 
                          ? 'linear-gradient(135deg, #1976D2 0%, #1EACDF 100%)'
                          : 'rgba(33, 150, 243, 0.1)',
                        borderColor: 'rgba(33, 150, 243, 0.4)'
                      }
                    }}
                  >
                    {time}
                  </Button>
                ))}
              </Box>
            </Grid>
          </Grid>

          {selectedDate && selectedTime && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ 
                mt: 3, 
                p: 2, 
                borderRadius: 2,
                background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 203, 243, 0.05) 100%)',
                border: '1px solid rgba(33, 150, 243, 0.2)'
              }}>
                <Typography sx={{ 
                  color: '#2196F3', 
                  fontSize: '0.9rem', 
                  fontWeight: 600,
                  mb: 1,
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                }}>
                  📋 Pickup Scheduled For:
                </Typography>
                <Typography sx={{ 
                  color: 'white', 
                  fontSize: '1rem', 
                  fontWeight: 700,
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                }}>
                  {new Date(`${selectedDate}T${selectedTime}`).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} at {selectedTime}
                </Typography>
              </Box>
            </motion.div>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={() => setShowScheduleDialog(false)}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              textTransform: 'none',
              '&:hover': { color: 'white' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleScheduleConfirm}
            disabled={!selectedDate || !selectedTime}
            variant="contained"
            sx={{
              background: selectedDate && selectedTime 
                ? 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)'
                : 'rgba(255, 255, 255, 0.1)',
              color: selectedDate && selectedTime ? 'white' : 'rgba(255, 255, 255, 0.5)',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 700,
              textTransform: 'none',
              px: 3,
              '&:hover': {
                background: selectedDate && selectedTime 
                  ? 'linear-gradient(135deg, #1976D2 0%, #1EACDF 100%)'
                  : 'rgba(255, 255, 255, 0.15)'
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.5)'
              }
            }}
          >
            Confirm Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
