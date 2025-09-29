// React and React-related imports
import React, { useState } from 'react';

// Third-party libraries
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Stepper, 
  Step, 
  StepLabel, 
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  TextField, 
  Divider,
  LinearProgress,
  Alert,
  Snackbar,
  useTheme
} from '@mui/material';
import { 
  LocationOn, 
  CheckCircle, 
  ArrowBack, 
  ArrowForward,
  LocalLaundryService,
  DryCleaning,
  Checkroom,
  CreditCard,
  AccountBalanceWallet,
  Smartphone
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';

// Absolute imports (from src/)
import { PlacesAutocomplete } from '../../components/Forms/PlacesAutocomplete';
import GoogleMap from '../../components/Maps/GoogleMap';
import { bookingService, paymentService } from '../../services';

// Types
interface ServiceType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  basePrice: number;
  estimatedTime: string;
  features: string[];
}

interface CleaningItem {
  id: string;
  name: string;
  category: string;
  price: number;
  icon: string;
  estimatedTime: number;
}

interface BookingData {
  serviceType: string;
  location: string;
  coordinates: { lat: number; lng: number } | null;
  date: Date | null;
  time: Date | null;
  items: string[];
  paymentMethod: string;
  specialInstructions: string;
  contactPhone: string;
}

// Mock data
const serviceTypes: ServiceType[] = [
  {
    id: 'standard',
    name: 'Standard Clean',
    description: 'Professional cleaning with 48-hour turnaround',
    icon: <LocalLaundryService />,
    basePrice: 25,
    estimatedTime: '2-3 days',
    features: ['Deep cleaning', 'Stain removal', 'Fresh scent', 'Quality guarantee']
  },
  {
    id: 'premium',
    name: 'Premium Clean',
    description: 'Premium service with specialized treatments',
    icon: <DryCleaning />,
    basePrice: 45,
    estimatedTime: '3-4 days',
    features: ['Eco-friendly products', 'Hand finishing', 'Protective coating', 'Premium packaging']
  },
  {
    id: 'express',
    name: 'Express Clean',
    description: 'Fast service with same-day return',
    icon: <Checkroom />,
    basePrice: 35,
    estimatedTime: '24 hours',
    features: ['Same-day service', 'Priority handling', 'Express delivery', 'Real-time tracking']
  }
];

const cleaningItems: CleaningItem[] = [
  { id: 'sneakers', name: 'Sneakers', category: 'Footwear', price: 25, icon: '👟', estimatedTime: 60 },
  { id: 'dress-shoes', name: 'Dress Shoes', category: 'Footwear', price: 30, icon: '👞', estimatedTime: 90 },
  { id: 'boots', name: 'Boots', category: 'Footwear', price: 35, icon: '🥾', estimatedTime: 120 },
  { id: 'shirt', name: 'Dress Shirt', category: 'Clothing', price: 15, icon: '👔', estimatedTime: 45 },
  { id: 'suit', name: 'Business Suit', category: 'Clothing', price: 50, icon: '🤵', estimatedTime: 180 },
  { id: 'dress', name: 'Dress', category: 'Clothing', price: 40, icon: '👗', estimatedTime: 120 },
  { id: 'jacket', name: 'Jacket/Coat', category: 'Clothing', price: 45, icon: '🧥', estimatedTime: 150 },
  { id: 'bag', name: 'Handbag', category: 'Accessories', price: 35, icon: '👜', estimatedTime: 90 }
];

const steps = [
  'Select Service',
  'Choose Location',
  'Pick Date & Time',
  'Select Items',
  'Payment',
  'Confirmation'
];

export const BookingFlow: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [bookingData, setBookingData] = useState<BookingData>({
    serviceType: '',
    location: '',
    coordinates: null,
    date: null,
    time: null,
    items: [],
    paymentMethod: 'card',
    specialInstructions: '',
    contactPhone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const handleNext = async () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const calculateTotal = () => {
    const serviceMultiplier = serviceTypes.find(s => s.id === bookingData.serviceType)?.basePrice || 0;
    const itemsTotal = bookingData.items.reduce((sum, itemId) => {
      const item = cleaningItems.find(i => i.id === itemId);
      return sum + (item?.price || 0);
    }, 0);
    return Math.round(serviceMultiplier + itemsTotal);
  };

  const handleBookingSubmit = async () => {
    setIsProcessing(true);
    setBookingError(null);
    
    try {
      // Step 1: Process Payment
      const paymentResult = await paymentService.createPaymentIntent(
        calculateTotal(),
        'ZAR',
        {
          description: `LemoTech Cleaning Service - ${serviceTypes.find(s => s.id === bookingData.serviceType)?.name}`,
          customerEmail: 'customer@example.com', // TODO: Get from user profile
          customerName: 'Customer', // TODO: Get from user profile
          bookingId: 'temp-' + Date.now()
        }
      );

      if (paymentResult.status !== 'succeeded') {
        throw new Error('Payment failed. Please check your payment details and try again.');
      }

      // Step 2: Create Booking
      const bookingRequest = {
        pickupLocation: bookingData.location,
        items: bookingData.items.map(itemId => {
          const item = cleaningItems.find(i => i.id === itemId);
          return item?.name || itemId;
        }),
        contactPhone: bookingData.contactPhone,
        specialInstructions: bookingData.specialInstructions,
        paymentMethod: bookingData.paymentMethod as 'card' | 'cash' | 'mobile',
        paymentId: paymentResult.id,
        amount: calculateTotal(),
        serviceType: bookingData.serviceType,
        scheduledDate: bookingData.date,
        scheduledTime: bookingData.time,
        coordinates: bookingData.coordinates
      };

      const bookingResponse = await bookingService.createBooking(bookingRequest);
      
      setBookingId(bookingResponse.bookingId);
      setShowSuccess(true);
      
      // Store booking data in localStorage for tracking
      localStorage.setItem('currentBooking', JSON.stringify({
        ...bookingResponse,
        bookingData: bookingData
      }));
      
      setTimeout(() => {
        setActiveStep(steps.length - 1);
      }, 1500);
      
    } catch (error) {
      console.error('Booking failed:', error);
      setBookingError(error instanceof Error ? error.message : 'Booking failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Service Selection
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
              Choose Your Service
            </Typography>
            <Grid container spacing={3}>
              {serviceTypes.map((service) => (
                <Grid item xs={12} md={4} key={service.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: bookingData.serviceType === service.id ? 2 : 1,
                      borderColor: bookingData.serviceType === service.id 
                        ? theme.palette.primary.main 
                        : 'rgba(255,255,255,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                      }
                    }}
                    onClick={() => setBookingData({ ...bookingData, serviceType: service.id })}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box sx={{ fontSize: '3rem', mb: 2, color: theme.palette.primary.main }}>
                        {service.icon}
                      </Box>
                      <Typography variant="h5" gutterBottom>
                        {service.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {service.description}
                      </Typography>
                      <Chip
                        label={`From R${service.basePrice}`}
                        color="primary"
                        sx={{ mb: 2 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {service.estimatedTime}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {service.features.map((feature, index) => (
                          <Chip
                            key={index}
                            label={feature}
                            size="small"
                            variant="outlined"
                            sx={{ m: 0.5 }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        );

      case 1: // Location Selection
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
              Where should we collect your items?
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <PlacesAutocomplete
                  value={bookingData.location}
                  onChange={(location) => {
                    setBookingData({
                      ...bookingData,
                      location
                    });
                  }}
                  onLocationSelect={(locationData) => {
                    setBookingData({
                      ...bookingData,
                      location: locationData.address,
                      coordinates: { lat: locationData.lat, lng: locationData.lng }
                    });
                  }}
                  placeholder="Enter your pickup address"
                />
                <Button
                  variant="outlined"
                  startIcon={<LocationOn />}
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => setShowMap(!showMap)}
                >
                  {showMap ? 'Hide Map' : 'Show Map'}
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                {showMap && bookingData.coordinates && (
                  <Box sx={{ height: 300, borderRadius: 2, overflow: 'hidden' }}>
                    <GoogleMap
                      center={bookingData.coordinates}
                      zoom={15}
                      pickupLocation={bookingData.location}
                      pickupCoordinates={bookingData.coordinates}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
          </motion.div>
        );

      case 2: // Date & Time Selection
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
              When should we collect?
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Collection Date"
                    value={bookingData.date}
                    onChange={(date) => setBookingData({ ...bookingData, date })}
                    minDate={new Date()}
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label="Collection Time"
                    value={bookingData.time}
                    onChange={(time) => setBookingData({ ...bookingData, time })}
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </motion.div>
        );

      case 3: // Item Selection
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
              What would you like us to clean?
            </Typography>
            <Grid container spacing={2}>
              {cleaningItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: bookingData.items.includes(item.id) ? 2 : 1,
                      borderColor: bookingData.items.includes(item.id)
                        ? theme.palette.primary.main
                        : 'rgba(255,255,255,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': { transform: 'translateY(-2px)' }
                    }}
                    onClick={() => {
                      const items = bookingData.items.includes(item.id)
                        ? bookingData.items.filter(i => i !== item.id)
                        : [...bookingData.items, item.id];
                      setBookingData({ ...bookingData, items });
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ mb: 1 }}>{item.icon}</Typography>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        R{item.price}
                      </Typography>
                      <Chip
                        label={item.category}
                        size="small"
                        variant="outlined"
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {bookingData.items.length > 0 && (
              <Paper sx={{ p: 2, mt: 3, textAlign: 'center' }}>
                <Typography variant="h6">
                  Selected Items: {bookingData.items.length} • Total: R{
                    bookingData.items.reduce((sum, itemId) => {
                      const item = cleaningItems.find(i => i.id === itemId);
                      return sum + (item?.price || 0);
                    }, 0)
                  }
                </Typography>
              </Paper>
            )}
          </motion.div>
        );

      case 4: // Payment
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
              Payment & Details
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Payment Method</Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {[
                    { id: 'card', label: 'Credit Card', icon: <CreditCard /> },
                    { id: 'wallet', label: 'Digital Wallet', icon: <AccountBalanceWallet /> },
                    { id: 'mobile', label: 'Mobile Money', icon: <Smartphone /> }
                  ].map((method) => (
                    <Grid item xs={12} key={method.id}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: bookingData.paymentMethod === method.id ? 2 : 1,
                          borderColor: bookingData.paymentMethod === method.id
                            ? theme.palette.primary.main
                            : 'rgba(255,255,255,0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': { transform: 'translateY(-2px)' }
                        }}
                        onClick={() => setBookingData({ ...bookingData, paymentMethod: method.id })}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {method.icon}
                            <Typography variant="h6">{method.label}</Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Additional Details</Typography>
                <TextField
                  fullWidth
                  label="Special Instructions"
                  multiline
                  rows={3}
                  value={bookingData.specialInstructions}
                  onChange={(e) => setBookingData({ ...bookingData, specialInstructions: e.target.value })}
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  label="Contact Phone"
                  value={bookingData.contactPhone}
                  onChange={(e) => setBookingData({ ...bookingData, contactPhone: e.target.value })}
                  placeholder="+27 XX XXX XXXX"
                />
              </Grid>
            </Grid>
            
            {/* Order Summary */}
            <Paper sx={{ p: 3, mt: 4, background: 'rgba(255,255,255,0.05)' }}>
              <Typography variant="h6" gutterBottom>Order Summary</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Service Type:</Typography>
                <Typography>{serviceTypes.find(s => s.id === bookingData.serviceType)?.name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Location:</Typography>
                <Typography>{bookingData.location}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Items:</Typography>
                <Typography>{bookingData.items.length} items</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">R{calculateTotal()}</Typography>
              </Box>
            </Paper>
          </motion.div>
        );

      case 5: // Confirmation
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
              Payment & Details
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Payment Method</Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {[
                    { id: 'card', label: 'Credit Card', icon: <CreditCard /> },
                    { id: 'wallet', label: 'Digital Wallet', icon: <AccountBalanceWallet /> },
                    { id: 'mobile', label: 'Mobile Money', icon: <Smartphone /> }
                  ].map((method) => (
                    <Grid item xs={12} key={method.id}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: bookingData.paymentMethod === method.id ? 2 : 1,
                          borderColor: bookingData.paymentMethod === method.id
                            ? theme.palette.primary.main
                            : 'rgba(255,255,255,0.1)'
                        }}
                        onClick={() => setBookingData({ ...bookingData, paymentMethod: method.id })}
                      >
                        <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                          {method.icon}
                          <Typography sx={{ ml: 2 }}>{method.label}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                <TextField
                  fullWidth
                  label="Contact Phone"
                  value={bookingData.contactPhone}
                  onChange={(e) => setBookingData({ ...bookingData, contactPhone: e.target.value })}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Special Instructions (Optional)"
                  multiline
                  rows={3}
                  value={bookingData.specialInstructions}
                  onChange={(e) => setBookingData({ ...bookingData, specialInstructions: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Booking Summary</Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Service</Typography>
                    <Typography variant="body1">
                      {serviceTypes.find(s => s.id === bookingData.serviceType)?.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Location</Typography>
                    <Typography variant="body1">{bookingData.location}</Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Date & Time</Typography>
                    <Typography variant="body1">
                      {bookingData.date?.toLocaleDateString()} at {bookingData.time?.toLocaleTimeString()}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Items ({bookingData.items.length})</Typography>
                    {bookingData.items.map(itemId => {
                      const item = cleaningItems.find(i => i.id === itemId);
                      return (
                        <Typography key={itemId} variant="body2">
                          {item?.name} - R{item?.price}
                        </Typography>
                      );
                    })}
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" color="primary">
                    Total: R{calculateTotal()}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        );

      case 6: // Confirmation
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h3" gutterBottom>
                Booking Confirmed!
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Your cleaning service has been booked successfully
              </Typography>
              
              <Paper sx={{ p: 3, mb: 3, textAlign: 'left', maxWidth: 600, mx: 'auto' }}>
                <Typography variant="h6" gutterBottom>Booking Details</Typography>
                <Typography variant="body2">
                  <strong>Booking ID:</strong> {bookingId || 'LT-' + Date.now().toString().slice(-6)}
                </Typography>
                <Typography variant="body2">
                  <strong>Service:</strong> {serviceTypes.find(s => s.id === bookingData.serviceType)?.name}
                </Typography>
                <Typography variant="body2">
                  <strong>Service:</strong> Cleaning Service
                </Typography>
                <Typography variant="body2">
                  <strong>Collection:</strong> {bookingData.date?.toLocaleDateString()} at {bookingData.time?.toLocaleTimeString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Location:</strong> {bookingData.location}
                </Typography>
                <Typography variant="body2">
                  <strong>Total:</strong> R{calculateTotal()}
                </Typography>
              </Paper>
              
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate(`/track/booking/${bookingId || 'demo'}`)}
                  >
                    Track Your Order
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" onClick={() => navigate('/dashboard')}>
                    Go to Dashboard
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const isStepComplete = () => {
    switch (activeStep) {
      case 0: return bookingData.serviceType !== '';
      case 1: return bookingData.location !== '';
      case 2: return bookingData.date !== null && bookingData.time !== null;
      case 3: return bookingData.items.length > 0;
      case 4: return bookingData.paymentMethod !== '' && bookingData.contactPhone !== '';
      case 5: return true;
      default: return true;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, minHeight: '80vh' }}>
        {/* Progress Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Loading Progress */}
        {isProcessing && (
          <Box sx={{ mb: 4 }}>
            <LinearProgress />
            <Typography align="center" sx={{ mt: 2 }}>
              {activeStep === 4 ? 'Loading available cleaners...' : 'Processing your booking...'}
            </Typography>
          </Box>
        )}

        {/* Error Display */}
        {bookingError && (
          <Alert severity="error" sx={{ mb: 4 }} onClose={() => setBookingError(null)}>
            {bookingError}
          </Alert>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <Box sx={{ minHeight: 400 }}>
            {renderStepContent()}
          </Box>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            disabled={activeStep === 0 || isProcessing}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => window.location.href = '/dashboard'}
            >
              Go to Dashboard
            </Button>
          ) : activeStep === 5 ? (
            <Button
              variant="contained"
              endIcon={<CheckCircle />}
              onClick={handleBookingSubmit}
              disabled={!isStepComplete() || isProcessing}
            >
              Confirm Booking
            </Button>
          ) : (
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={handleNext}
              disabled={!isStepComplete() || isProcessing}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Booking confirmed! You'll receive a confirmation SMS shortly.
        </Alert>
      </Snackbar>
    </Container>
  );
};
