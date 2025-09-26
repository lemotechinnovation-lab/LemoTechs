import { Box, Typography, Collapse, Button } from '@mui/material';
import {
  PrimaryButton,
} from '../design-system';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PlacesAutocomplete } from './PlacesAutocomplete';
import { BookingConfirmation } from '../../pages/booking/BookingConfirmation';
import { bookingService } from '../../services';
import { paymentService } from '../../services';

import { Driver, LocationCoordinates, BookingDetails, ItemOption } from '../../types/booking';

import { BookingFormProps } from '../../types/booking';

export const BookingForm = ({
  onBackToHome,
  onShowMapView,
  onLocationChange,
  onItemsChange,
  onDriverSelect,
  showMapView
}: BookingFormProps) => {
  // Form-specific state
  const [heroPickupLocation, setHeroPickupLocation] = useState('');

  const [heroSelectedItems, setHeroSelectedItems] = useState<string[]>([]);
  const [heroLocationCoords, setHeroLocationCoords] = useState<LocationCoordinates | null>(null);
  const [showDriversList, setShowDriversList] = useState(false);

  // Enhanced booking flow state
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState<'location' | 'items' | 'driver' | 'payment' | 'confirmation'>('location');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'mobile'>('card');
  // Payment processing state is handled by existing booking state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    pickupTime: '',
    specialInstructions: '',
    contactPhone: '',
    estimatedPrice: 0
  });

  // API integration states
  const [isProcessingBooking, setIsProcessingBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const itemOptions: ItemOption[] = [
    { name: 'Sneakers', price: 25, icon: '👟' },
    { name: 'Casual Shoes', price: 20, icon: '👞' },
    { name: 'Suits', price: 35, icon: '🤵' },
    { name: 'Shirts', price: 15, icon: '👔' },
    { name: 'Jackets', price: 30, icon: '🧥' },
    { name: 'Dresses', price: 25, icon: '👗' },
    { name: 'Jeans', price: 18, icon: '👖' },
    { name: 'Bedding', price: 40, icon: '🛏️' }
  ];

  // Mock drivers data (enhanced)
  const mockDrivers: Driver[] = [
    {
      id: '1',
      name: 'James',
      avatar: '👨‍💼',
      rating: 4.9,
      location: 'Sandton',
      estimatedTime: '8 min',
      priceMultiplier: 1.0,
      carModel: 'Toyota Camry',
      carType: 'standard',
      available: true,
      distance: '2.1 km'
    },
    {
      id: '2',
      name: 'Sarah',
      avatar: '👩‍💼',
      rating: 4.8,
      location: 'Rosebank',
      estimatedTime: '12 min',
      priceMultiplier: 1.1,
      carModel: 'Honda Civic',
      carType: 'premium',
      available: true,
      distance: '3.5 km'
    },
    {
      id: '3',
      name: 'Michael',
      avatar: '👨‍🚗',
      rating: 4.95,
      location: 'Hyde Park',
      estimatedTime: '5 min',
      priceMultiplier: 1.2,
      carModel: 'BMW 3 Series',
      carType: 'luxury',
      available: true,
      distance: '1.2 km'
    }
  ];

  // Event handlers
  const handleLocationSelect = (location: string, coordinates: LocationCoordinates | null) => {
    setHeroPickupLocation(location);
    setHeroLocationCoords(coordinates);
    onLocationChange(location, coordinates);

    if (location && !showMapView) {
      onShowMapView(true);
      setTimeout(() => setShowDriversList(true), 500);
    }
  };

  const handleItemToggle = (itemName: string) => {
    const newItems = heroSelectedItems.includes(itemName)
      ? heroSelectedItems.filter(item => item !== itemName)
      : [...heroSelectedItems, itemName];

    setHeroSelectedItems(newItems);
    onItemsChange(newItems);

    if (newItems.length > 0) {
      calculateEstimatedPrice(newItems);
    }
  };

  const calculateEstimatedPrice = (items: string[]) => {
    const totalPrice = items.reduce((sum, itemName) => {
      const item = itemOptions.find(opt => opt.name === itemName);
      return sum + (item?.price || 0);
    }, 0);

    const selectedDriverMultiplier = selectedDriver
      ? mockDrivers.find(d => d.id === selectedDriver)?.priceMultiplier || 1.0
      : 1.0;

    const finalPrice = Math.round(totalPrice * selectedDriverMultiplier);
    setBookingDetails(prev => ({ ...prev, estimatedPrice: finalPrice }));
  };

  const handleDriverSelection = (driverId: string) => {
    setSelectedDriver(driverId);
    onDriverSelect(driverId);
    calculateEstimatedPrice(heroSelectedItems);
    setBookingStep('payment');
  };

  const processBooking = async () => {
    if (!selectedDriver || heroSelectedItems.length === 0) return;
    
    // Validate contact phone
    if (!bookingDetails.contactPhone || bookingDetails.contactPhone.trim() === '') {
      setError('Please enter your contact phone number to complete the booking');
      return;
    }

    setIsProcessingBooking(true);
    setError(null);

    try {
      // Calculate total amount
      const total = heroSelectedItems.reduce((sum, itemName) => {
        const item = itemOptions.find(opt => opt.name === itemName);
        return sum + (item?.price || 0);
      }, 0);
      
      // Process payment first (except for cash payments)
      let paymentResult = null;
      if (paymentMethod !== 'cash') {
        const paymentRequest = {
          amount: total,
          currency: 'ZAR',
          paymentMethod: paymentMethod,
          description: `LemoTech Cleaning Service - ${heroSelectedItems.length} items`,
          customerEmail: 'customer@example.com',
          customerName: bookingDetails.contactPhone || 'Customer',
          bookingId: `BOOKING-${Date.now()}`
        };
        
        paymentResult = await paymentService.createPaymentIntent(
          paymentRequest.amount,
          paymentRequest.currency,
          {
            bookingId: paymentRequest.bookingId,
            description: paymentRequest.description,
            customerEmail: paymentRequest.customerEmail,
            customerName: paymentRequest.customerName
          }
        );
        
        if (paymentResult.status !== 'succeeded') {
          throw new Error('Payment failed');
        }
      }

      const bookingData = {
        pickupLocation: heroPickupLocation,
        items: heroSelectedItems,
        driverId: selectedDriver || '',
        contactPhone: bookingDetails.contactPhone,
        specialInstructions: bookingDetails.specialInstructions,
        paymentMethod,
        paymentId: paymentResult?.id || 'CASH_PAYMENT',
        amount: total,
        serviceType: 'standard',
        scheduledDate: new Date(bookingDetails.pickupTime) || null,
        scheduledTime: new Date(bookingDetails.pickupTime) || null,
        coordinates: heroLocationCoords
      };

      const result = await bookingService.createBooking(bookingData);

      if (result.status === 'confirmed') {
        // Track successful booking event
        if (typeof (window as any).trackBookingEvent === 'function') {
          (window as any).trackBookingEvent('booking_completed', {
            booking_id: paymentResult?.id || result.bookingId,
            service_type: 'cleaning',
            amount: total,
            location: heroPickupLocation || 'Unknown'
          });
        }
        
        setShowConfirmation(true);
        setBookingStep('confirmation');
      } else {
        setError('Booking failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Booking/Payment error:', error);
      if (error?.message === 'Payment failed') {
        setError('Payment failed. Please check your payment method and try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsProcessingBooking(false);
    }
  };

  // Show confirmation screen
  if (showConfirmation) {
    return (
      <BookingConfirmation
        bookingId="LT2024001"
        onBackToHome={onBackToHome}
      />
    );
  }

  return (
    <Box sx={{
      width: { xs: '100%', sm: '100%', md: showMapView ? '420px' : '100%', lg: showMapView ? '450px' : '100%' },
      background: 'linear-gradient(135deg, rgba(26, 16, 64, 0.98) 0%, rgba(37, 20, 84, 0.95) 50%, rgba(103, 58, 183, 0.92) 100%)',
      backdropFilter: 'blur(25px)',
      border: '2px solid rgba(255, 255, 255, 0.12)',
      borderRadius: { xs: 0, md: showMapView ? '0 16px 16px 0' : '16px' },
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowY: 'auto',
      boxShadow: { 
        xs: 'none', 
        md: '0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 25px rgba(255, 107, 53, 0.1)' 
      },
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      {/* Compact Booking Form */}
      <Box sx={{
        position: 'relative',
        height: 'calc(100vh - 48px)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Enhanced Fixed Header Section */}
        <Box sx={{
          position: 'absolute',
          top: { xs: '40px', md: '60px' },
          left: 0,
          right: 0,
          height: { xs: '100px', md: '120px' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 2.5, md: 3 },
          py: { xs: 1, md: 0 },
          zIndex: 10,
          background: 'linear-gradient(180deg, rgba(26, 16, 64, 0.95) 0%, rgba(26, 16, 64, 0.8) 70%, transparent 100%)',
          backdropFilter: 'blur(15px)'
        }}>
                    <Typography 
            variant="h4" 
            sx={{ 
              color: 'white', 
              fontWeight: { xs: 500, md: 600 }, // Reduced for softer appearance
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
              mb: { xs: 0.3, md: 0.5 },
              textAlign: 'center',
              lineHeight: { xs: 1.2, md: 1.3 },
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
            }}
          >
            Book <span style={{ color: '#FF6B35' }}>Your Ride</span>
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: 'rgba(255,255,255,0.85)', 
              fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
              textAlign: 'center',
              maxWidth: { xs: '280px', sm: '320px', md: '300px' },
              lineHeight: 1.4,
              px: { xs: 1, md: 0 }
            }}
          >
            Experience premium cleaning & delivery <span style={{ color: '#FFD700' }}>at your fingertips ✨</span>
          </Typography>
        </Box>

        {/* Scrollable Content Area */}
        <Box sx={{
          mt: { xs: '180px', md: '220px' },
          px: { xs: 1.5, sm: 2.5, md: 4 },
          pb: { xs: 6, md: 8 },
          pt: { xs: 2, md: 3 },
          flex: 1,
          maxWidth: { xs: '100%', sm: '600px', md: '800px' },
          mx: 'auto',
          position: 'relative',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          minHeight: 'calc(100vh - 200px)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: { xs: -20, md: -40 },
            left: { xs: '5%', md: '10%' },
            right: { xs: '5%', md: '10%' },
            height: { xs: '200px', md: '300px' },
            background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,107,53,0.1) 0%, rgba(247,147,30,0.05) 50%, transparent 80%)',
            pointerEvents: 'none',
            zIndex: -1,
            filter: 'blur(20px)'
          }
        }}>
          {/* Step 1: Pickup Location */}
          <Box sx={{ mb: 6, mt: 3, width: '100%', maxWidth: { xs: '100%', sm: '500px', md: '600px' } }}>
            <Typography sx={{
              color: 'white',
              fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
              fontWeight: { xs: 500, md: 600 }, // Reduced for softer appearance
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              mb: { xs: 0.8, md: 1 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 0.8, md: 1 },
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
                borderRadius: '50%',
                width: { xs: 28, md: 32 },
                height: { xs: 28, md: 32 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: { xs: '0.8rem', md: '0.9rem' },
                fontWeight: 600, // Reduced from 700
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)',
                transition: 'all 0.3s ease'
              }}>
                1
              </Box>
              Where should we pick you up?
            </Typography>
            <Typography sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: { xs: '0.9rem', md: '1rem' },
              mb: { xs: 3, md: 4 },
              textAlign: 'center',
              lineHeight: 1.4
            }}>
              Enter your address and we'll come to you
            </Typography>

            {/* Enhanced Input with Premium Effects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Box sx={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.96) 50%, rgba(248, 250, 252, 0.98) 100%)',
                borderRadius: { xs: 2, sm: 2.5, md: 3 },
                p: { xs: 0.3, sm: 0.4, md: 0.6 },
                boxShadow: {
                  xs: '0 8px 25px rgba(0, 0, 0, 0.2), 0 3px 8px rgba(255, 107, 53, 0.1)',
                  md: '0 12px 40px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(255, 107, 53, 0.15)'
                },
                border: '2px solid rgba(255, 107, 53, 0.25)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'visible',
                minHeight: { xs: '56px', sm: '60px', md: '64px' },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,107,53,0.12), rgba(247,147,30,0.08), transparent)',
                  transition: 'left 0.6s ease'
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at 50% 50%, rgba(255, 107, 53, 0.03) 0%, transparent 70%)',
                  pointerEvents: 'none',
                  zIndex: 0
                },
                '&:focus-within': {
                  border: '2px solid #FF6B35',
                  boxShadow: {
                    xs: '0 12px 35px rgba(255, 107, 53, 0.35), 0 6px 18px rgba(0, 0, 0, 0.25)',
                    md: '0 16px 50px rgba(255, 107, 53, 0.4), 0 8px 25px rgba(0, 0, 0, 0.3)'
                  },
                  transform: { xs: 'translateY(-2px) scale(1.005)', md: 'translateY(-3px) scale(1.01)' },
                  '&::before': {
                    left: '100%'
                  },
                  '&::after': {
                    background: 'radial-gradient(circle at 50% 50%, rgba(255, 107, 53, 0.08) 0%, transparent 70%)'
                  }
                },
                '&:hover': {
                  boxShadow: {
                    xs: '0 10px 30px rgba(0, 0, 0, 0.25), 0 4px 15px rgba(255, 107, 53, 0.15)',
                    md: '0 14px 45px rgba(0, 0, 0, 0.3), 0 6px 20px rgba(255, 107, 53, 0.2)'
                  },
                  transform: { xs: 'translateY(-1px)', md: 'translateY(-1px)' },
                  border: '2px solid rgba(255, 107, 53, 0.35)'
                }
              }}>
                <PlacesAutocomplete
                  value={heroPickupLocation}
                  onChange={setHeroPickupLocation}
                  onLocationSelect={(location: any) => handleLocationSelect(location.address, { lat: location.lat, lng: location.lng })}
                  placeholder="Enter your pickup address..."
                  variant="transparent"
                  size="large"
                />
              </Box>
            </motion.div>
            
            {/* Extra spacing for autocorrect visibility */}
            <Box sx={{ height: { xs: '60px', md: '80px' } }} />
          </Box>

          {/* Success Indicator */}
          {heroPickupLocation && heroLocationCoords && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 4,
                p: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(139, 195, 74, 0.1))',
                border: '2px solid rgba(76, 175, 80, 0.4)',
                boxShadow: '0 4px 20px rgba(76, 175, 80, 0.2)'
              }}>
                <Box sx={{
                  background: '#4CAF50',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>
                  ✓
                </Box>
                <Box>
                  <Typography sx={{ color: 'white', fontSize: '1.1rem', fontWeight: 600, textAlign: 'left' }}>
                    Perfect! We've got your location
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', textAlign: 'left' }}>
                    {heroPickupLocation}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          )}

          {/* Step 2: Service Type Selection (Uber-style) */}
          <Collapse in={showMapView} timeout={500} sx={{ width: '100%' }}>
            <Box sx={{ mb: 4, width: '100%', maxWidth: { xs: '100%', sm: '500px', md: '600px' } }}>
              {/* Service Type Header */}
              <Typography sx={{
                color: 'white',
                fontSize: '1.3rem',
                fontWeight: 600, // Reduced from 700
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}>
                <Box sx={{
                  background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 600, // Reduced from 700
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                }}>
                  2
                </Box>
                Choose your service
              </Typography>
              <Typography sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1rem',
                mb: 3,
                textAlign: 'center'
              }}>
                Select the type of cleaning service you need
              </Typography>

              {/* Service Type Selection - Uber Style */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Box sx={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.1) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  p: 2,
                  mb: 3,
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[
                      { 
                        id: 'express', 
                        name: 'LemoExpress', 
                        icon: '⚡', 
                        description: 'Quick cleaning service',
                        time: '2-3 hours',
                        multiplier: 1.5,
                        popular: true
                      },
                      { 
                        id: 'standard', 
                        name: 'LemoStandard', 
                        icon: '🧽', 
                        description: 'Thorough cleaning service',
                        time: '4-6 hours',
                        multiplier: 1.0,
                        popular: false
                      },
                      { 
                        id: 'premium', 
                        name: 'LemoPremium', 
                        icon: '✨', 
                        description: 'Deep cleaning + extras',
                        time: '6-8 hours',
                        multiplier: 2.0,
                        popular: false
                      }
                    ].map((service) => (
                      <Box
                        key={service.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 2.5,
                          borderRadius: 2,
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          position: 'relative',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.12)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                            border: '1px solid rgba(255, 255, 255, 0.25)'
                          }
                        }}
                      >
                        {service.popular && (
                          <Box sx={{
                            position: 'absolute',
                            top: -8,
                            right: 16,
                            background: 'linear-gradient(135deg, #00D4AA, #0096FF)',
                            color: 'white',
                            px: 1.5,
                            py: 0.3,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            boxShadow: '0 2px 8px rgba(0, 212, 170, 0.3)'
                          }}>
                            Popular
                          </Box>
                        )}
                        
                        <Box sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: service.id === 'express' 
                            ? 'linear-gradient(135deg, #FF6B35, #F7931E)'
                            : service.id === 'premium'
                            ? 'linear-gradient(135deg, #9C27B0, #E91E63)'
                            : 'linear-gradient(135deg, #2196F3, #21CBF3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          mr: 2,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                        }}>
                          {service.icon}
                        </Box>
                        
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{
                            color: 'white',
                            fontSize: '1.1rem',
                            fontWeight: 600, // Reduced from 700
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            mb: 0.3
                          }}>
                            {service.name}
                          </Typography>
                          <Typography sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.85rem',
                            mb: 0.5
                          }}>
                            {service.description}
                          </Typography>
                          <Typography sx={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.8rem'
                          }}>
                            {service.time}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography sx={{
                            color: service.id === 'express' ? '#FF6B35' : service.id === 'premium' ? '#E91E63' : '#21CBF3',
                            fontSize: '1rem',
                            fontWeight: 600
                          }}>
                            {service.multiplier}x
                          </Typography>
                          <Typography sx={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.75rem'
                          }}>
                            Base rate
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </motion.div>

              {/* Step 3: What to Clean */}
              <Typography sx={{
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 600, // Reduced from 700
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                mt: 2
              }}>
                <Box sx={{
                  background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: 600, // Reduced from 700
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                }}>
                  3
                </Box>
                What needs cleaning?
              </Typography>
              <Typography sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1rem',
                mb: 3,
                textAlign: 'center'
              }}>
                Select the items you'd like us to clean for you
              </Typography>

              {/* Enhanced Item Selection Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Box sx={{
                  background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.18) 0%, rgba(233, 30, 99, 0.12) 50%, rgba(255, 107, 53, 0.08) 100%)',
                  border: '2px solid rgba(156, 39, 176, 0.3)',
                  borderRadius: { xs: 2.5, md: 3 },
                  p: { xs: 2.5, md: 3 },
                  mb: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 8px 32px rgba(156, 39, 176, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 20% 80%, rgba(233, 30, 99, 0.1) 0%, transparent 50%)',
                    pointerEvents: 'none',
                    zIndex: 0
                  },
                  '&:hover': {
                    border: '2px solid rgba(156, 39, 176, 0.4)',
                    boxShadow: '0 12px 40px rgba(156, 39, 176, 0.2), 0 6px 20px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-2px)'
                  }
                }}>
                  <Typography sx={{
                    color: '#E91E63',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <span style={{ fontSize: '1.3rem' }}>🧽</span>
                    What needs our magic touch?
                  </Typography>

                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(2, 1fr)',
                      sm: 'repeat(3, 1fr)',
                      md: 'repeat(4, 1fr)',
                      lg: 'repeat(4, 1fr)'
                    },
                    gap: { xs: 1, sm: 1.2, md: 1.5 },
                    mb: 2,
                    position: 'relative',
                    zIndex: 1,
                    '@media (max-width: 480px)': {
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '0.8rem'
                    }
                  }}>
                    {itemOptions.map((item) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: itemOptions.indexOf(item) * 0.05,
                          ease: "easeOut"
                        }}
                        whileHover={{ 
                          scale: 1.02,
                          y: -2
                        }}
                        whileTap={{ 
                          scale: 0.98,
                          transition: { duration: 0.1 }
                        }}
                      >
                        <Box
                          onClick={() => handleItemToggle(item.name)}
                          sx={{
                            p: { xs: 1, sm: 1.2, md: 1.5 },
                            borderRadius: { xs: 1.2, sm: 1.5, md: 2 },
                            border: heroSelectedItems.includes(item.name)
                              ? '2px solid #FFD700'
                              : '1px solid rgba(255, 255, 255, 0.25)',
                            background: heroSelectedItems.includes(item.name)
                              ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.32) 0%, rgba(255, 107, 53, 0.25) 50%, rgba(247, 147, 30, 0.18) 100%)'
                              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.12) 100%)',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            minHeight: { xs: '60px', sm: '68px', md: '75px' },
                            justifyContent: 'center',
                            position: 'relative',
                            backdropFilter: 'blur(15px)',
                            boxShadow: heroSelectedItems.includes(item.name)
                              ? {
                                  xs: '0 4px 15px rgba(255, 215, 0, 0.3), 0 2px 6px rgba(0, 0, 0, 0.1)',
                                  md: '0 6px 20px rgba(255, 215, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1)'
                                }
                              : {
                                  xs: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                  md: '0 3px 12px rgba(0, 0, 0, 0.1)'
                                },
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: heroSelectedItems.includes(item.name)
                                ? 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 70%)'
                                : 'none',
                              borderRadius: 'inherit',
                              pointerEvents: 'none',
                              zIndex: -1
                            },
                            '&:hover': {
                              background: heroSelectedItems.includes(item.name)
                                ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.4) 0%, rgba(255, 107, 53, 0.32) 50%, rgba(247, 147, 30, 0.25) 100%)'
                                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.18) 100%)',
                              transform: {
                                xs: 'translateY(-2px) scale(1.02)',
                                md: 'translateY(-3px) scale(1.02)'
                              },
                              boxShadow: heroSelectedItems.includes(item.name)
                                ? {
                                    xs: '0 8px 25px rgba(255, 215, 0, 0.45), 0 4px 12px rgba(0, 0, 0, 0.2)',
                                    md: '0 12px 35px rgba(255, 215, 0, 0.4), 0 6px 15px rgba(0, 0, 0, 0.2)'
                                  }
                                : {
                                    xs: '0 6px 20px rgba(0, 0, 0, 0.15), 0 3px 8px rgba(255, 255, 255, 0.1)',
                                    md: '0 8px 25px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(255, 255, 255, 0.1)'
                                  },
                              border: heroSelectedItems.includes(item.name)
                                ? '2px solid #FFD700'
                                : '1px solid rgba(255, 255, 255, 0.35)'
                            },
                            '&:active': {
                              transform: {
                                xs: 'translateY(-1px) scale(1.005)',
                                md: 'translateY(-1px) scale(1.01)'
                              },
                              transition: 'all 0.15s ease'
                            },
                            // Enhanced mobile touch feedback
                            '@media (hover: none)': {
                              '&:active': {
                                background: heroSelectedItems.includes(item.name)
                                  ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.45) 0%, rgba(255, 107, 53, 0.35) 50%, rgba(247, 147, 30, 0.28) 100%)'
                                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.18) 50%, rgba(255, 255, 255, 0.22) 100%)',
                                transform: 'scale(0.98)',
                                transition: 'all 0.1s ease'
                              }
                            }
                          }}
                        >
                          <Typography sx={{ 
                            fontSize: { xs: '1.3rem', sm: '1.4rem', md: '1.5rem' }, 
                            mb: { xs: 0.3, md: 0.5 },
                            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
                          }}>
                            {item.icon}
                          </Typography>
                          <Typography sx={{
                            color: 'white',
                            fontSize: { xs: '0.7rem', md: '0.75rem' },
                            fontWeight: 600,
                            mb: 0.3,
                            lineHeight: 1.2,
                            textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
                          }}>
                            {item.name}
                          </Typography>
                          <Typography sx={{
                            color: '#FFD700',
                            fontSize: '0.7rem',
                            fontWeight: 600, // Reduced from 700
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                          }}>
                            R{item.price}
                          </Typography>
                          {heroSelectedItems.includes(item.name) && (
                            <Box sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              background: '#FFD700',
                              borderRadius: '50%',
                              width: 20,
                              height: 20,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Typography sx={{ fontSize: '0.7rem', color: '#000' }}>✓</Typography>
                            </Box>
                          )}
                        </Box>
                      </motion.div>
                    ))}
                  </Box>

                  {/* Enhanced Pricing Summary - Uber Style */}
                  {heroSelectedItems.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box sx={{
                        background: 'linear-gradient(135deg, rgba(0, 150, 255, 0.12) 0%, rgba(0, 212, 170, 0.08) 100%)',
                        border: '1px solid rgba(0, 150, 255, 0.25)',
                        borderRadius: 3,
                        p: 3,
                        mb: 3,
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(0, 150, 255, 0.15)'
                      }}>
                        {/* Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                          <Typography sx={{ 
                            color: '#0096FF', 
                            fontSize: '1.1rem', 
                            fontWeight: 600, // Reduced from 700
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}>
                            <span style={{ fontSize: '1.2rem' }}>💰</span>
                            Price Breakdown
                          </Typography>
                          <Box sx={{
                            background: 'rgba(0, 150, 255, 0.15)',
                            px: 2,
                            py: 0.5,
                        borderRadius: 2,
                            border: '1px solid rgba(0, 150, 255, 0.3)'
                      }}>
                            <Typography sx={{ color: '#0096FF', fontSize: '0.8rem', fontWeight: 600 }}>
                              {heroSelectedItems.length} items selected
                        </Typography>
                          </Box>
                        </Box>

                        {/* Items List */}
                        <Box sx={{ mb: 2 }}>
                          {heroSelectedItems.map((itemName) => {
                            const item = itemOptions.find(opt => opt.name === itemName);
                            return (
                              <Box 
                                key={itemName}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  py: 1,
                                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                  <Typography sx={{ fontSize: '1.2rem' }}>{item?.icon}</Typography>
                                  <Typography sx={{ 
                                  color: 'white',
                                    fontSize: '0.9rem',
                                    fontWeight: 500 
                                  }}>
                                    {itemName}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography sx={{ 
                                    color: '#00D4AA', 
                                    fontSize: '0.9rem',
                                    fontWeight: 600 
                                  }}>
                                    R{item?.price}
                                  </Typography>
                                  <Box
                                    onClick={() => handleItemToggle(itemName)}
                                    sx={{
                                      width: 20,
                                      height: 20,
                                      borderRadius: '50%',
                                      background: 'rgba(255, 107, 53, 0.2)',
                                      border: '1px solid rgba(255, 107, 53, 0.4)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        background: 'rgba(255, 107, 53, 0.3)',
                                        transform: 'scale(1.1)'
                                      }
                                    }}
                                  >
                                    <Typography sx={{ color: '#FF6B35', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                      ×
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>

                        {/* Subtotal */}
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          pt: 2,
                          borderTop: '2px solid rgba(255, 255, 255, 0.15)'
                        }}>
                          <Typography sx={{ color: 'white', fontSize: '1rem', fontWeight: 600 }}>
                            Subtotal
                          </Typography>
                          <Typography sx={{ color: '#00D4AA', fontSize: '1.2rem', fontWeight: 600, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                            R{heroSelectedItems.reduce((sum, itemName) => {
                              const item = itemOptions.find(opt => opt.name === itemName);
                              return sum + (item?.price || 0);
                            }, 0)}
                          </Typography>
                        </Box>

                        {/* Estimated Total Preview */}
                        <Box sx={{
                          mt: 2,
                          p: 2,
                          borderRadius: 2,
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                          <Typography sx={{ 
                            color: 'rgba(255, 255, 255, 0.8)', 
                            fontSize: '0.85rem',
                            textAlign: 'center',
                            mb: 1
                          }}>
                            Final price will include driver selection and service type
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography sx={{ color: '#FFD700', fontSize: '0.8rem', fontWeight: 600 }}>
                                Express (1.5x)
                              </Typography>
                              <Typography sx={{ color: '#FFD700', fontSize: '0.9rem', fontWeight: 600, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                ~R{Math.round(heroSelectedItems.reduce((sum, itemName) => {
                                  const item = itemOptions.find(opt => opt.name === itemName);
                                  return sum + (item?.price || 0);
                                }, 0) * 1.5)}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography sx={{ color: '#21CBF3', fontSize: '0.8rem', fontWeight: 600 }}>
                                Standard (1x)
                              </Typography>
                              <Typography sx={{ color: '#21CBF3', fontSize: '0.9rem', fontWeight: 600, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                ~R{heroSelectedItems.reduce((sum, itemName) => {
                                  const item = itemOptions.find(opt => opt.name === itemName);
                                  return sum + (item?.price || 0);
                                }, 0)}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography sx={{ color: '#E91E63', fontSize: '0.8rem', fontWeight: 600 }}>
                                Premium (2x)
                              </Typography>
                              <Typography sx={{ color: '#E91E63', fontSize: '0.9rem', fontWeight: 600, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                ~R{Math.round(heroSelectedItems.reduce((sum, itemName) => {
                                  const item = itemOptions.find(opt => opt.name === itemName);
                                  return sum + (item?.price || 0);
                                }, 0) * 2.0)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </motion.div>
                  )}
                </Box>
              </motion.div>
              {/* End of Item Selection Card */}

              {/* Enhanced Available Drivers Section */}
              <Collapse in={showDriversList && heroSelectedItems.length > 0} timeout={800}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Box sx={{
                    mb: 3,
                    p: { xs: 1.5, sm: 2, md: 3 },
                    borderRadius: { xs: 2, sm: 2.5, md: 3 },
                    background: 'linear-gradient(135deg, rgba(0, 172, 255, 0.12) 0%, rgba(33, 150, 243, 0.08) 30%, rgba(103, 58, 183, 0.1) 70%, rgba(156, 39, 176, 0.08) 100%)',
                    border: '2px solid rgba(33, 150, 243, 0.25)',
                    backdropFilter: 'blur(20px)',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 12px 40px rgba(33, 150, 243, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'radial-gradient(circle at 80% 20%, rgba(33, 150, 243, 0.12) 0%, rgba(103, 58, 183, 0.08) 50%, transparent 70%)',
                      pointerEvents: 'none',
                      zIndex: 0
                    },
                    '&:hover': {
                      border: '2px solid rgba(33, 150, 243, 0.35)',
                      boxShadow: '0 16px 50px rgba(33, 150, 243, 0.2), 0 6px 20px rgba(0, 0, 0, 0.15)',
                      transform: 'translateY(-2px)'
                    }
                  }}>
                                      <Typography sx={{ 
                    color: 'white', 
                    fontSize: { xs: '1rem', sm: '1.05rem', md: '1.1rem' }, 
                    fontWeight: { xs: 500, md: 600 }, // Reduced for softer appearance
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    mb: { xs: 1.5, md: 2 },
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 0.8, md: 1 },
                    position: 'relative',
                    zIndex: 1,
                    textShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #2196F3 70%, #3F51B5 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                      <span style={{ fontSize: '1.3rem' }}>🚗</span>
                      Choose your driver
                    </Typography>

                    <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: { xs: 1.2, md: 1.5 },
                    position: 'relative',
                    zIndex: 1
                  }}>
                      {mockDrivers.map((driver) => (
                        <motion.div
                          key={driver.id}
                          initial={{ opacity: 0, x: -20, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ 
                            duration: 0.4, 
                            delay: mockDrivers.indexOf(driver) * 0.1,
                            ease: "easeOut"
                          }}
                          whileHover={{ 
                            scale: 1.01,
                            x: 3
                          }}
                          whileTap={{ 
                            scale: 0.98,
                            transition: { duration: 0.1 }
                          }}
                        >
                          <Box
                            onClick={() => handleDriverSelection(driver.id)}
                            sx={{
                              p: 3,
                              borderRadius: 3,
                              border: selectedDriver === driver.id
                                ? '2px solid #00D4AA'
                                : '1px solid rgba(255, 255, 255, 0.15)',
                              background: selectedDriver === driver.id
                                ? 'linear-gradient(135deg, rgba(0, 212, 170, 0.15), rgba(0, 150, 255, 0.1))'
                                : 'rgba(255, 255, 255, 0.08)',
                              cursor: 'pointer',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              position: 'relative',
                              overflow: 'hidden',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: '-100%',
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                                transition: 'left 0.5s ease',
                              },
                              '&:hover': {
                                background: selectedDriver === driver.id
                                  ? 'linear-gradient(135deg, rgba(0, 212, 170, 0.2), rgba(0, 150, 255, 0.15))'
                                  : 'rgba(255, 255, 255, 0.12)',
                                transform: 'translateY(-3px)',
                                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                                border: selectedDriver === driver.id
                                  ? '2px solid #00D4AA'
                                  : '1px solid rgba(255, 255, 255, 0.25)',
                                '&::before': {
                                  left: '100%',
                                }
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, position: 'relative', zIndex: 1 }}>
                              {/* Driver Avatar with Uber-style design */}
                              <Box sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.8rem',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                border: selectedDriver === driver.id ? '2px solid #00D4AA' : '2px solid rgba(255, 255, 255, 0.2)'
                              }}>
                                {driver.avatar}
                              </Box>
                              
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography sx={{
                                  color: 'white',
                                    fontSize: '1.1rem',
                                    fontWeight: 600, // Reduced from 700
                                    fontFamily: '"Plus Jakarta Sans", sans-serif'
                                }}>
                                  {driver.name}
                                </Typography>
                                  {selectedDriver === driver.id && (
                                    <Box sx={{
                                      width: 20,
                                      height: 20,
                                      borderRadius: '50%',
                                      background: '#00D4AA',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}>
                                      <Typography sx={{ fontSize: '0.7rem', color: 'white' }}>✓</Typography>
                                    </Box>
                                  )}
                                </Box>
                                
                                <Typography sx={{
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  fontSize: '0.85rem',
                                  fontWeight: 500,
                                  mb: 0.8
                                }}>
                                  {driver.carModel} • {driver.distance} away
                                </Typography>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                  <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 0.5,
                                    background: 'rgba(255, 215, 0, 0.15)',
                                    px: 1,
                                    py: 0.3,
                                    borderRadius: 1,
                                    border: '1px solid rgba(255, 215, 0, 0.3)'
                                  }}>
                                    <Typography sx={{ color: '#FFD700', fontSize: '0.75rem' }}>⭐</Typography>
                                    <Typography sx={{ color: '#FFD700', fontSize: '0.8rem', fontWeight: 600 }}>
                                      {driver.rating}
                                  </Typography>
                                  </Box>
                                  
                                  <Box sx={{
                                    background: 'rgba(0, 150, 255, 0.15)',
                                    px: 1,
                                    py: 0.3,
                                    borderRadius: 1,
                                    border: '1px solid rgba(0, 150, 255, 0.3)'
                                  }}>
                                    <Typography sx={{ color: '#0096FF', fontSize: '0.8rem', fontWeight: 600 }}>
                                      {driver.estimatedTime}
                                  </Typography>
                                </Box>
                              </Box>
                              </Box>
                              
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography sx={{
                                  color: selectedDriver === driver.id ? '#00D4AA' : '#FFD700',
                                  fontSize: '1.3rem',
                                  fontWeight: 600, // Reduced from 700
                                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                                  mb: 0.2
                                }}>
                                  R{Math.round(bookingDetails.estimatedPrice * driver.priceMultiplier)}
                                </Typography>
                                <Typography sx={{
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  fontSize: '0.75rem',
                                  fontWeight: 500
                                }}>
                                  Total estimate
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                </motion.div>
              </Collapse>
            </Box>
          </Collapse>
        </Box>
      </Box>

      {/* Enhanced Booking Confirmation Modal - Payment Flow */}
      {bookingStep === 'payment' && selectedDriver && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}>
          <Box sx={{
            background: 'linear-gradient(135deg, rgba(26, 16, 64, 0.95) 0%, rgba(37, 20, 84, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 3,
            p: 4,
            maxWidth: '400px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <Typography sx={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 600,
              mb: 3,
              textAlign: 'center'
            }}>
              Confirm Your Booking
            </Typography>

            {/* Booking Summary */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: '#FFD700', fontSize: '0.9rem', fontWeight: 600, mb: 2 }}>
                Trip Summary
              </Typography>

              <Box sx={{ mb: 2, p: 2, borderRadius: 2, background: 'rgba(255, 255, 255, 0.05)' }}>
                <Typography sx={{ color: 'white', fontSize: '0.8rem', mb: 1 }}>
                  📍 From: {heroPickupLocation}
                </Typography>
                <Typography sx={{ color: 'white', fontSize: '0.8rem', mb: 1 }}>
                  🏠 To: Same location (return delivery)
                </Typography>
                <Typography sx={{ color: 'white', fontSize: '0.8rem' }}>
                  🧽 Items: {heroSelectedItems.join(', ')}
                </Typography>
              </Box>

              {/* Driver Info */}
              {(() => {
                const driver = mockDrivers.find(d => d.id === selectedDriver);
                return driver ? (
                  <Box sx={{ mb: 2, p: 2, borderRadius: 2, background: 'rgba(255, 255, 255, 0.05)' }}>
                    <Typography sx={{ color: '#FFD700', fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>
                      Your Driver
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography sx={{ fontSize: '2rem' }}>{driver.avatar}</Typography>
                      <Box>
                        <Typography sx={{ color: 'white', fontSize: '0.9rem', fontWeight: 600 }}>
                          {driver.name}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                          {driver.carModel} • ⭐ {driver.rating}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                          {driver.estimatedTime} away
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ) : null;
              })()}

              {/* Price Breakdown */}
              <Box sx={{ mb: 3, p: 2, borderRadius: 2, background: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                <Typography sx={{ color: '#FFD700', fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>
                  Price Breakdown
                </Typography>
                {heroSelectedItems.map((itemName) => {
                  const item = itemOptions.find(opt => opt.name === itemName);
                  return (
                    <Box key={itemName} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography sx={{ color: 'white', fontSize: '0.8rem' }}>
                        {item?.icon} {itemName}
                      </Typography>
                      <Typography sx={{ color: 'white', fontSize: '0.8rem' }}>
                        R{item?.price}
                      </Typography>
                    </Box>
                  );
                })}
                <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.3)', pt: 1, mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#FFD700', fontSize: '1rem', fontWeight: 600 }}>
                      Total
                    </Typography>
                    <Typography sx={{ color: '#FFD700', fontSize: '1rem', fontWeight: 600 }}>
                      R{bookingDetails.estimatedPrice}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Payment Method Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, mb: 2 }}>
                Payment Method
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                {[
                  { 
                    id: 'card', 
                    icons: ['💳', '💰'], 
                    primaryIcon: '💳',
                    label: 'Card',
                    tooltip: 'Credit/Debit Card' 
                  },
                  { 
                    id: 'mobile', 
                    icons: ['📱', '💸'], 
                    primaryIcon: '📱',
                    label: 'Mobile',
                    tooltip: 'Mobile Payment' 
                  },
                  { 
                    id: 'cash', 
                    icons: ['💵', '🤝'], 
                    primaryIcon: '💵',
                    label: 'Cash',
                    tooltip: 'Cash on Delivery' 
                  }
                ].map((method) => (
                  <Box
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    title={method.tooltip}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      border: paymentMethod === method.id
                        ? '3px solid #FFD700'
                        : '2px solid rgba(255, 255, 255, 0.2)',
                      background: paymentMethod === method.id
                        ? 'rgba(255, 215, 0, 0.15)'
                        : 'rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                      minHeight: '80px',
                      position: 'relative',
                      '&:hover': {
                        background: paymentMethod === method.id
                          ? 'rgba(255, 215, 0, 0.2)'
                          : 'rgba(255, 255, 255, 0.12)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)'
                      }
                    }}
                  >
                    {/* Primary Icon */}
                    <Typography sx={{ 
                      fontSize: '2rem',
                      filter: paymentMethod === method.id 
                        ? 'drop-shadow(0 4px 8px rgba(255, 215, 0, 0.4))' 
                        : 'drop-shadow(0 2px 4px rgba(255, 255, 255, 0.2))',
                      transition: 'all 0.3s ease',
                      transform: paymentMethod === method.id ? 'scale(1.1)' : 'scale(1)'
                    }}>
                      {method.primaryIcon}
                    </Typography>
                    
                    {/* Secondary Icons */}
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 0.5,
                      opacity: paymentMethod === method.id ? 1 : 0.7,
                      transition: 'opacity 0.3s ease'
                    }}>
                      {method.icons.filter(icon => icon !== method.primaryIcon).map((icon, index) => (
                        <Typography key={index} sx={{ 
                          fontSize: '0.9rem',
                          filter: 'drop-shadow(0 1px 2px rgba(255, 255, 255, 0.1))'
                        }}>
                          {icon}
                        </Typography>
                      ))}
                    </Box>

                    {/* One-word Label */}
                    <Typography sx={{
                      color: paymentMethod === method.id ? '#FFD700' : 'rgba(255, 255, 255, 0.9)',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      fontFamily: '"Inter", sans-serif',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      opacity: 0.9
                    }}>
                      {method.label}
                    </Typography>

                    {/* Selection Indicator */}
                    {paymentMethod === method.id && (
                      <Box sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#FFD700',
                        boxShadow: '0 2px 8px rgba(255, 215, 0, 0.5)',
                        animation: 'pulse 2s infinite'
                      }} />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Contact Information */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, mb: 2 }}>
                Contact Information <span style={{ color: '#FF6B35' }}>*</span>
              </Typography>
              <input
                type="tel"
                placeholder="Enter your phone number (e.g., 082 123 4567)"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: bookingDetails.contactPhone 
                    ? '1px solid rgba(76, 175, 80, 0.5)' 
                    : '1px solid rgba(255, 107, 53, 0.5)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 215, 0, 0.4)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = bookingDetails.contactPhone 
                    ? 'rgba(76, 175, 80, 0.5)' 
                    : 'rgba(255, 107, 53, 0.5)';
                  e.target.style.boxShadow = 'none';
                }}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, contactPhone: e.target.value }))}
              />
              {!bookingDetails.contactPhone && (
                <Typography sx={{
                  color: '#FF6B35',
                  fontSize: '0.75rem',
                  mt: 1
                }}>
                  ⚠️ Phone number is required to complete your booking
                </Typography>
              )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
              <motion.div
                whileHover={{ scale: isProcessingBooking ? 1 : 1.02 }}
                whileTap={{ scale: isProcessingBooking ? 1 : 0.98 }}
              >
                <PrimaryButton
                  size="xl"
                  fullWidth
                  isLoading={isProcessingBooking}
                  onClick={processBooking}
                  icon={!isProcessingBooking ? '💳' : undefined}
                >
                  {isProcessingBooking ? 'Processing Payment...' : 'Confirm Booking & Pay'}
                </PrimaryButton>
              </motion.div>

              <Button
                onClick={() => setBookingStep('driver')}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.9rem',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Back to Driver Selection
              </Button>
            </Box>

            {/* Error Display */}
            {error && (
              <Box sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                background: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.3)'
              }}>
                <Typography sx={{ color: '#f44336', fontSize: '0.8rem' }}>
                  {error}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};
