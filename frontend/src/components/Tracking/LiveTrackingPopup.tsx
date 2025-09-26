import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Slide,
  Fade
} from '@mui/material';
import {
  CheckCircle,
  LocationOn,
  Phone,
  AccessTime,
  DirectionsCar,
  Close,
  Send,
  Notifications,
  MyLocation
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GoogleMap from '../Maps/GoogleMap';
import { ParticleBackground } from '../Common/ParticleBackground';

interface LiveTrackingPopupProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
  onGoToDashboard: () => void;
  driverInfo?: {
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
    avatar: string;
    location: { lat: number; lng: number };
  };
  pickupLocation?: string;
  estimatedArrival?: string;
}

interface TrackingStatus {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  active: boolean;
  timestamp?: Date;
}

const trackingSteps: TrackingStatus[] = [
  {
    id: 'confirmed',
    label: 'Booking Confirmed',
    description: 'Your booking has been confirmed',
    completed: true,
    active: false,
    timestamp: new Date(Date.now() - 10 * 60 * 1000)
  },
  {
    id: 'driver_assigned',
    label: 'Driver Assigned',
    description: 'Driver has been assigned to your pickup',
    completed: true,
    active: false,
    timestamp: new Date(Date.now() - 8 * 60 * 1000)
  },
  {
    id: 'en_route',
    label: 'Driver En Route',
    description: 'Driver is on the way to your location',
    completed: false,
    active: true,
    timestamp: new Date(Date.now() - 2 * 60 * 1000)
  },
  {
    id: 'arrived',
    label: 'Driver Arrived',
    description: 'Driver has arrived at your location',
    completed: false,
    active: false
  }
];

export const LiveTrackingPopup: React.FC<LiveTrackingPopupProps> = ({
  bookingId,
  isOpen,
  onClose,
  onGoToDashboard,
  driverInfo = {
    name: 'Thabo Mthembu',
    phone: '+27 82 123 4567',
    vehicle: 'Toyota Corolla',
    rating: 4.9,
    avatar: '👨‍💼',
    location: { lat: -26.2041, lng: 28.0473 }
  },
  estimatedArrival = '8 minutes'
}) => {
  const navigate = useNavigate();
  const [eta, setEta] = useState(estimatedArrival);
  const [driverLocation, setDriverLocation] = useState(driverInfo.location);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isDriverNearby, setIsDriverNearby] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      // Update ETA
      const currentEta = parseInt(eta.split(' ')[0]);
      if (currentEta > 1) {
        setEta(`${currentEta - 1} minutes`);
      }

      // Simulate driver movement
      setDriverLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));

      // Check if driver is nearby
      const distance = Math.random() * 2;
      const nearby = distance < 0.5;
      if (nearby !== isDriverNearby) {
        setIsDriverNearby(nearby);
        if (nearby) {
          setSnackbarMessage('🚗 Your driver is approaching!');
          setShowSnackbar(true);
        }
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [isOpen, eta, isDriverNearby]);

  const handleSendMessage = () => {
    // Simulate sending message
    console.log('Sending message:', message);
    setMessage('');
    setShowMessageDialog(false);
    setSnackbarMessage('Message sent to driver');
    setShowSnackbar(true);
  };

  const handleCallDriver = () => {
    window.open(`tel:${driverInfo.phone}`);
  };

  const activeStep = trackingSteps.find(step => step.active);
  const completedSteps = trackingSteps.filter(step => step.completed).length;
  const progress = (completedSteps / trackingSteps.length) * 100;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with map */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1300,
        background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 50%, #190F32 100%)'
      }}>
        <ParticleBackground />
        
        {/* Map Background */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.3
        }}>
          <GoogleMap
            center={driverLocation}
            zoom={13}
            drivers={[{
              id: 'driver1',
              name: driverInfo.name,
              position: driverLocation,
              estimatedArrival: eta
            }]}
          />
        </Box>
      </Box>

      {/* Tracking Popup Overlay */}
      <Fade in={isOpen} timeout={500}>
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1301,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Box sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              p: 4,
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Close Button */}
              <IconButton
                onClick={onClose}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  color: 'rgba(0, 0, 0, 0.6)',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Close />
              </IconButton>

              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)'
                  }}>
                    <CheckCircle sx={{ fontSize: 40, color: '#fff' }} />
                  </Box>
                </motion.div>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    mb: 2,
                    letterSpacing: '-0.02em'
                  }}
                >
                  Booking Confirmed!
                </Typography>

                <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.7)', mb: 3 }}>
                  Booking Reference: #{bookingId}
                </Typography>
              </Box>

              {/* Driver Info */}
              <Box sx={{
                background: 'rgba(76, 175, 80, 0.1)',
                borderRadius: '16px',
                p: 3,
                mb: 3,
                border: '1px solid rgba(76, 175, 80, 0.2)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DirectionsCar sx={{ color: '#4CAF50', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                    {driverInfo.name} is on the way!
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTime sx={{ color: '#FF9800', mr: 1 }} />
                  <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.8)' }}>
                    Estimated arrival: <strong style={{ color: '#FF9800' }}>{eta}</strong>
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Notifications sx={{ color: '#2196F3', mr: 1 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                    You'll receive SMS updates about your driver's location and pickup status.
                  </Typography>
                </Box>
              </Box>

              {/* Progress */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
                    Progress
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                    {Math.round(progress)}%
                  </Typography>
                </Box>
                <Box sx={{
                  height: 6,
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: 3,
                  overflow: 'hidden'
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #4CAF50, #66BB6A)',
                      borderRadius: 3
                    }}
                  />
                </Box>
              </Box>

              {/* Current Status */}
              {activeStep && (
                <Box sx={{
                  background: 'rgba(255, 107, 53, 0.1)',
                  borderRadius: '12px',
                  p: 2,
                  mb: 3,
                  border: '1px solid rgba(255, 107, 53, 0.2)'
                }}>
                  <Typography variant="body1" sx={{ color: '#FF6B35', fontWeight: 600 }}>
                    {activeStep.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
                    {activeStep.description}
                  </Typography>
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<MyLocation />}
                  onClick={() => {
                    console.log('Navigating to:', `/track/booking/${bookingId}`);
                    navigate(`/track/booking/${bookingId}`);
                    onClose();
                  }}
                  sx={{
                    py: 2,
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    color: 'white',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    borderRadius: '12px',
                    boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #F7931E 0%, #FF6B35 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 35px rgba(255, 107, 53, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Track Your Pickup
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<LocationOn />}
                  onClick={onGoToDashboard}
                  sx={{
                    py: 2,
                    borderColor: 'rgba(0, 0, 0, 0.2)',
                    color: 'rgba(0, 0, 0, 0.8)',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 600,
                    fontSize: '1rem',
                    borderRadius: '12px',
                    border: '2px solid',
                    '&:hover': {
                      borderColor: 'rgba(0, 0, 0, 0.3)',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Go to Dashboard
                </Button>
              </Box>

              {/* Driver Contact */}
              <Box sx={{
                mt: 3,
                pt: 3,
                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                display: 'flex',
                gap: 2
              }}>
                <Button
                  variant="outlined"
                  startIcon={<Phone />}
                  onClick={handleCallDriver}
                  sx={{
                    flex: 1,
                    borderColor: '#4CAF50',
                    color: '#4CAF50',
                    '&:hover': {
                      borderColor: '#4CAF50',
                      backgroundColor: 'rgba(76, 175, 80, 0.1)'
                    }
                  }}
                >
                  Call Driver
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Send />}
                  onClick={() => setShowMessageDialog(true)}
                  sx={{
                    flex: 1,
                    borderColor: '#2196F3',
                    color: '#2196F3',
                    '&:hover': {
                      borderColor: '#2196F3',
                      backgroundColor: 'rgba(33, 150, 243, 0.1)'
                    }
                  }}
                >
                  Message
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Fade>

      {/* Message Dialog */}
      <Dialog
        open={showMessageDialog}
        onClose={() => setShowMessageDialog(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }
        }}
      >
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Send Message to {driverInfo.name}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px'
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setShowMessageDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!message.trim()}
            sx={{
              background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
              borderRadius: '8px'
            }}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity="success"
          sx={{
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
