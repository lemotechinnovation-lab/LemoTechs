/**
 * Example: Refactored BookingForm using custom hooks
 * This demonstrates how to use the new custom hooks and utilities
 */

import React from 'react';
import { Box, Typography, Button, Alert, Card } from '@mui/material';
import { motion } from 'framer-motion';
import { useBooking, usePayment } from '../../hooks';
import { formatCurrency, formatDateTime } from '../../utils';
import { SERVICE_ITEMS, PAYMENT_METHODS } from '../../constants';

interface BookingFormExampleProps {
  onBackToHome: () => void;
}

export const BookingFormExample: React.FC<BookingFormExampleProps> = ({ onBackToHome }) => {
  // Using custom hooks instead of managing state manually
  const booking = useBooking();
  const payment = usePayment();

  // Handle booking submission
  const handleCreateBooking = async () => {
    if (!booking.selectedDriver || booking.selectedItems.length === 0) {
      return;
    }

    // Calculate total using utility function
    const subtotal = booking.selectedItems.reduce((sum, itemName) => {
      const item = SERVICE_ITEMS.find(i => i.name === itemName);
      return sum + (item?.basePrice || 0);
    }, 0);

    const total = payment.calculateTotal(subtotal);

    // Create payment intent first
    const paymentResult = await payment.createPaymentIntent(
      total,
      'ZAR',
      {
        description: `LemoTech Cleaning Service - ${booking.selectedItems.length} items`,
        customerEmail: 'customer@example.com',
        customerName: 'John Doe',
        bookingId: `BOOKING-${Date.now()}`
      }
    );

    if (paymentResult?.status === 'succeeded') {
      // Create booking
      const bookingResult = await booking.createBooking({
        pickupLocation: booking.pickupLocation,
        items: booking.selectedItems,
        driverId: booking.selectedDriver.id,
        contactPhone: '+27 82 123 4567',
        specialInstructions: '',
        paymentMethod: booking.paymentMethod,
        amount: total
      });

      if (bookingResult) {
        console.log('Booking created successfully:', bookingResult);
      }
    }
  };

  // Handle step navigation
  const handleNext = () => {
    booking.nextStep();
  };

  const handlePrevious = () => {
    booking.previousStep();
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Book Your Cleaning Service
      </Typography>

      {/* Error Display */}
      {(booking.error || payment.error) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {booking.error || payment.error}
        </Alert>
      )}

      {/* Step Indicator */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Step {booking.currentStep === 'location' ? '1' : 
                booking.currentStep === 'items' ? '2' : 
                booking.currentStep === 'driver' ? '3' : 
                booking.currentStep === 'payment' ? '4' : '5'} of 5
        </Typography>
      </Box>

      {/* Location Step */}
      {booking.currentStep === 'location' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Typography variant="h6" gutterBottom>
            Where should we pick up your items?
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                booking.setPickupLocation('123 Main Street, Sandton', { lat: -26.1076, lng: 28.0567 });
                handleNext();
              }}
              fullWidth
              sx={{ mb: 1 }}
            >
              Use Demo Address
            </Button>
          </Box>
        </motion.div>
      )}

      {/* Items Step */}
      {booking.currentStep === 'items' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Typography variant="h6" gutterBottom>
            What items need cleaning?
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            {SERVICE_ITEMS.slice(0, 4).map((item) => (
              <Button
                key={item.id}
                variant={booking.selectedItems.includes(item.name) ? "contained" : "outlined"}
                onClick={() => {
                  if (booking.selectedItems.includes(item.name)) {
                    booking.removeItem(item.name);
                  } else {
                    booking.addItem(item.name);
                  }
                }}
                sx={{ mr: 1, mb: 1 }}
              >
                {item.icon} {item.name} - {formatCurrency(item.basePrice)}
              </Button>
            ))}
          </Box>

          {booking.selectedItems.length > 0 && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Selected: {booking.selectedItems.join(', ')}
            </Typography>
          )}
        </motion.div>
      )}

      {/* Driver Step */}
      {booking.currentStep === 'driver' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Typography variant="h6" gutterBottom>
            Choose your driver
          </Typography>
          
          {booking.isLoadingDrivers ? (
            <Typography>Loading available drivers...</Typography>
          ) : (
            <Box sx={{ mt: 2 }}>
              {booking.availableDrivers.map((driver) => (
                <Button
                  key={driver.id}
                  variant={booking.selectedDriver?.id === driver.id ? "contained" : "outlined"}
                  onClick={() => booking.selectDriver(driver)}
                  fullWidth
                  sx={{ mb: 1, justifyContent: 'flex-start' }}
                >
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="subtitle2">
                      {driver.name} ⭐ {driver.rating}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {driver.vehicle} • Arrives in {driver.estimatedArrival}
                    </Typography>
                  </Box>
                </Button>
              ))}
              
              {booking.availableDrivers.length === 0 && (
                <Button
                  onClick={() => booking.loadDrivers({ lat: -26.1076, lng: 28.0567 })}
                  variant="outlined"
                  fullWidth
                >
                  Load Available Drivers
                </Button>
              )}
            </Box>
          )}
        </motion.div>
      )}

      {/* Payment Step */}
      {booking.currentStep === 'payment' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Typography variant="h6" gutterBottom>
            Choose payment method
          </Typography>
          
          <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            {PAYMENT_METHODS.map((method) => {
              const extendedMethod = {
                ...method,
                icons: method.id === 'card' ? ['💳', '💰'] : 
                       method.id === 'mobile' ? ['📱', '💸'] : ['💵', '🤝'],
                primaryIcon: method.icon,
                label: method.id === 'card' ? 'Card' : 
                       method.id === 'mobile' ? 'Mobile' : 'Cash',
                tooltip: `${method.name} - ${method.fees > 0 ? `${method.fees}% fee` : 'No additional fees'}`
              };
              
              return (
                <Card
                  key={method.id}
                  onClick={() => booking.setPaymentMethod(method.id as any)}
                  title={extendedMethod.tooltip}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: booking.paymentMethod === method.id
                      ? 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
                    border: booking.paymentMethod === method.id
                      ? '3px solid #1976d2'
                      : '2px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '12px',
                    minHeight: '100px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    '&:hover': {
                      background: booking.paymentMethod === method.id
                        ? 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: booking.paymentMethod === method.id
                        ? '0 8px 25px rgba(25, 118, 210, 0.3)'
                        : '0 6px 20px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  {/* Primary Icon */}
                  <Typography sx={{ 
                    fontSize: '2.5rem',
                    filter: booking.paymentMethod === method.id 
                      ? 'drop-shadow(0 4px 8px rgba(255, 255, 255, 0.4))' 
                      : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                    transition: 'all 0.3s ease',
                    transform: booking.paymentMethod === method.id ? 'scale(1.1)' : 'scale(1)'
                  }}>
                    {extendedMethod.primaryIcon}
                  </Typography>
                  
                  {/* Secondary Icons */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 0.5,
                    opacity: booking.paymentMethod === method.id ? 1 : 0.7,
                    transition: 'opacity 0.3s ease'
                  }}>
                    {extendedMethod.icons.filter(icon => icon !== extendedMethod.primaryIcon).map((icon, index) => (
                      <Typography key={index} sx={{ 
                        fontSize: '1rem',
                        filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                      }}>
                        {icon}
                      </Typography>
                    ))}
                  </Box>

                  {/* One-word Label */}
                  <Typography sx={{
                    color: booking.paymentMethod === method.id ? '#FFFFFF' : 'rgba(0, 0, 0, 0.8)',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    fontFamily: '"Inter", sans-serif',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    opacity: 0.9
                  }}>
                    {extendedMethod.label}
                  </Typography>

                  {/* Selection Indicator */}
                  {booking.paymentMethod === method.id && (
                    <Box sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      boxShadow: '0 2px 8px rgba(255, 255, 255, 0.5)',
                      animation: 'pulse 2s infinite'
                    }} />
                  )}
                </Card>
              );
            })}
          </Box>

          {/* Order Summary */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            {booking.selectedItems.map((itemName) => {
              const item = SERVICE_ITEMS.find(i => i.name === itemName);
              return item ? (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{item.name}</Typography>
                  <Typography variant="body2">{formatCurrency(item.basePrice)}</Typography>
                </Box>
              ) : null;
            })}
            
            <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 1, mt: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Total
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {formatCurrency(payment.calculateTotal(
                    booking.selectedItems.reduce((sum, itemName) => {
                      const item = SERVICE_ITEMS.find(i => i.name === itemName);
                      return sum + (item?.basePrice || 0);
                    }, 0)
                  ))}
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>
      )}

      {/* Confirmation Step */}
      {booking.currentStep === 'confirmation' && booking.bookingResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" color="success.main" gutterBottom>
              ✅ Booking Confirmed!
            </Typography>
            
            <Typography variant="body1" gutterBottom>
              Booking ID: {booking.bookingResult.bookingId}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Estimated pickup: {formatDateTime(booking.bookingResult.estimatedPickupTime)}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Estimated delivery: {formatDateTime(booking.bookingResult.estimatedDeliveryTime)}
            </Typography>
            
            <Button
              variant="contained"
              onClick={onBackToHome}
              sx={{ mt: 3 }}
            >
              Back to Home
            </Button>
          </Box>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          onClick={booking.currentStep === 'location' ? onBackToHome : handlePrevious}
          variant="outlined"
          disabled={booking.isLoading || payment.isProcessing}
        >
          {booking.currentStep === 'location' ? 'Cancel' : 'Previous'}
        </Button>
        
        {booking.currentStep !== 'confirmation' && (
          <Button
            onClick={booking.currentStep === 'payment' ? handleCreateBooking : handleNext}
            variant="contained"
            disabled={
              booking.isLoading || 
              payment.isProcessing ||
              (booking.currentStep === 'location' && !booking.pickupLocation) ||
              (booking.currentStep === 'items' && booking.selectedItems.length === 0) ||
              (booking.currentStep === 'driver' && !booking.selectedDriver)
            }
          >
            {booking.currentStep === 'payment' ? 'Confirm Booking' : 'Next'}
          </Button>
        )}
      </Box>

      {/* Loading State */}
      {(booking.isLoading || payment.isProcessing) && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {booking.isLoading ? 'Processing booking...' : 'Processing payment...'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
