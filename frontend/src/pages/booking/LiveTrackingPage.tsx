// React and React-related imports
import React, { useState, useEffect } from 'react';

// Third-party libraries
import {
  Box,
  Container,
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
  useTheme,
  Paper
} from '@mui/material';
import {
  CheckCircle,
  Navigation,
  LocalShipping,
  CleaningServices,
  ArrowBack,
  HourglassEmpty,
  Message,
  Phone,
  Refresh
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Absolute imports (from src/)
import GoogleMap from '../../components/Maps/GoogleMap';
import { ParticleBackground } from '../../components/Common/ParticleBackground';
import { FloatingTrackingButton } from '../../components/Common/FloatingTrackingButton';
import { useTracking } from '../../context/TrackingContext';
import { bookingService } from '../../services';
import { useRealTimeTracking, useSignalR } from '../../hooks/useSignalR';
import { signalRService } from '../../services/signalRService';
import { useAuth } from '../../hooks/useAuth';

// Independent Map Component that exists outside the main component's render cycle
const IndependentMapComponent = React.memo(() => {
  const [mapData, setMapData] = useState({
    center: { lat: -25.9867, lng: 28.1306 },
    pickupLocation: "Midrand, Johannesburg",
    destinationLocation: "Customer Location",
    pickupCoordinates: { lat: -25.9867, lng: 28.1306 },
    destinationCoordinates: { lat: -25.9867 + 0.02, lng: 28.1306 + 0.03 },
    drivers: [{
      id: "driver-1",
      name: "John Doe",
      position: { lat: -25.9867, lng: 28.1306 },
      estimatedArrival: "5 minutes"
    }]
  });

  // Update map data independently
  useEffect(() => {
    const interval = setInterval(() => {
      setMapData(prev => {
        // Simulate driver movement
        const newLat = prev.drivers[0].position.lat + (Math.random() - 0.5) * 0.0001;
        const newLng = prev.drivers[0].position.lng + (Math.random() - 0.5) * 0.0001;
        
        return {
          ...prev,
          drivers: [{
            ...prev.drivers[0],
            position: { lat: newLat, lng: newLng }
          }]
        };
      });
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: '14px'
    }}>
      <GoogleMap
        center={mapData.center}
        zoom={14}
        pickupLocation={mapData.pickupLocation}
        destinationLocation={mapData.destinationLocation}
        pickupCoordinates={mapData.pickupCoordinates}
        destinationCoordinates={mapData.destinationCoordinates}
        drivers={mapData.drivers}
        showStreetLines={true}
        showTraffic={false}
      />
    </Box>
  );
});

interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  licensePlate: string;
  rating: number;
  avatar: string;
  location: { lat: number; lng: number };
  eta: string;
  speed: number;
  distance: number;
}

interface BookingDetails {
  id: string;
  pickupLocation: string;
  pickupCoords?: { lat: number; lng: number };
  items: string[];
  totalAmount: number;
  serviceType: string;
  scheduledTime: Date;
  status: string;
  driver: DriverInfo;
}

interface TrackingStep {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  active: boolean;
  timestamp?: Date;
  estimatedTime?: string;
  icon: React.ReactNode;
}

// User roles for different tracking views
type UserRole = 'user' | 'driver' | 'shop';

// Function to generate role-specific tracking steps
const generateRoleBasedTrackingSteps = (currentStatus: string, bookingTime: Date, userRole: UserRole = 'user'): TrackingStep[] => {
  const stepOrder = [
    'confirmed', 'waiting_driver', 'driver_accepted', 'driver_en_route',
    'pickup_arrived', 'items_collected', 'driving_to_facility', 'items_dropped',
    'cleaning', 'cleaning_complete', 'out_for_delivery', 'returning_to_customer', 'delivered'
  ];

  const currentIndex = stepOrder.indexOf(currentStatus);

  // USER ROLE - Customer view
  if (userRole === 'user') {
    return [
      {
        id: 'confirmed',
        label: 'Booking Confirmed',
        description: 'Your order has been submitted',
        completed: true,
        active: currentStatus === 'confirmed',
        timestamp: bookingTime,
        estimatedTime: 'Immediate',
        icon: <CheckCircle />
      },
      {
        id: 'waiting_driver',
        label: 'Looking for Driver',
        description: 'Finding available driver',
        completed: currentIndex > 0,
        active: currentStatus === 'waiting_driver',
        timestamp: currentIndex > 0 ? new Date(bookingTime.getTime() + 2 * 60 * 1000) : undefined,
        estimatedTime: '2-5 min',
        icon: <HourglassEmpty />
      },
      {
        id: 'driver_accepted',
        label: 'Driver Found',
        description: 'Driver accepted your request',
        completed: currentIndex > 1,
        active: currentStatus === 'driver_accepted',
        timestamp: currentIndex > 1 ? new Date(bookingTime.getTime() + 5 * 60 * 1000) : undefined,
        estimatedTime: '1-3 min',
        icon: <CheckCircle />
      },
      {
        id: 'driver_en_route',
        label: 'Driver Coming',
        description: 'Driver is on the way to you',
        completed: currentIndex > 2,
        active: currentStatus === 'driver_en_route',
        timestamp: currentIndex > 2 ? new Date(bookingTime.getTime() + 8 * 60 * 1000) : undefined,
        estimatedTime: '8 min',
        icon: <Navigation />
      },
      {
        id: 'pickup_arrived',
        label: 'Driver Arrived',
        description: 'Driver has arrived at your location',
        completed: currentIndex > 3,
        active: currentStatus === 'pickup_arrived',
        timestamp: currentIndex > 3 ? new Date(bookingTime.getTime() + 16 * 60 * 1000) : undefined,
        estimatedTime: 'Now',
        icon: <LocalShipping />
      },
      {
        id: 'items_collected',
        label: 'Items Collected',
        description: 'Your items have been collected',
        completed: currentIndex > 4,
        active: currentStatus === 'items_collected',
        timestamp: currentIndex > 4 ? new Date(bookingTime.getTime() + 20 * 60 * 1000) : undefined,
        estimatedTime: '5-10 min',
        icon: <LocalShipping />
      },
      {
        id: 'cleaning',
        label: 'Items Being Cleaned',
        description: 'Your items are being professionally cleaned',
        completed: currentIndex > 7,
        active: currentStatus === 'cleaning',
        timestamp: currentIndex > 7 ? new Date(bookingTime.getTime() + 55 * 60 * 1000) : undefined,
        estimatedTime: '2-4 hours',
        icon: <CleaningServices />
      },
      {
        id: 'out_for_delivery',
        label: 'Out for Delivery',
        description: 'Driver is bringing your cleaned items back',
        completed: currentIndex > 9,
        active: currentStatus === 'out_for_delivery',
        timestamp: currentIndex > 9 ? new Date(bookingTime.getTime() + 180 * 60 * 1000) : undefined,
        estimatedTime: '15-20 min',
        icon: <Navigation />
      },
      {
        id: 'delivered',
        label: 'Items Delivered',
        description: 'Your cleaned items have been delivered',
        completed: currentIndex > 11,
        active: currentStatus === 'delivered',
        timestamp: currentIndex > 11 ? new Date(bookingTime.getTime() + 200 * 60 * 1000) : undefined,
        estimatedTime: 'Now',
        icon: <CheckCircle />
      }
    ];
  }

  // DRIVER ROLE - Driver view
  if (userRole === 'driver') {
    return [
      {
        id: 'confirmed',
        label: 'Request Received',
        description: 'New cleaning request received',
        completed: true,
        active: currentStatus === 'confirmed',
        timestamp: bookingTime,
        estimatedTime: 'Immediate',
        icon: <CheckCircle />
      },
      {
        id: 'waiting_driver',
        label: 'Request Ringing',
        description: 'Request is being sent to drivers',
        completed: currentIndex > 0,
        active: currentStatus === 'waiting_driver',
        timestamp: currentIndex > 0 ? new Date(bookingTime.getTime() + 2 * 60 * 1000) : undefined,
        estimatedTime: '2-5 min',
        icon: <HourglassEmpty />
      },
      {
        id: 'driver_accepted',
        label: 'Accept',
        description: 'You accepted this request',
        completed: currentIndex > 1,
        active: currentStatus === 'driver_accepted',
        timestamp: currentIndex > 1 ? new Date(bookingTime.getTime() + 5 * 60 * 1000) : undefined,
        estimatedTime: '1-3 min',
        icon: <CheckCircle />
      },
      {
        id: 'driver_en_route',
        label: 'Going to Customer',
        description: 'Driving to pickup location',
        completed: currentIndex > 2,
        active: currentStatus === 'driver_en_route',
        timestamp: currentIndex > 2 ? new Date(bookingTime.getTime() + 8 * 60 * 1000) : undefined,
        estimatedTime: '8 min',
        icon: <Navigation />
      },
      {
        id: 'pickup_arrived',
        label: 'Arrived at Pickup',
        description: 'Arrived at customer location',
        completed: currentIndex > 3,
        active: currentStatus === 'pickup_arrived',
        timestamp: currentIndex > 3 ? new Date(bookingTime.getTime() + 16 * 60 * 1000) : undefined,
        estimatedTime: 'Now',
        icon: <LocalShipping />
      },
      {
        id: 'items_collected',
        label: 'Items Collected',
        description: 'Items collected from customer',
        completed: currentIndex > 4,
        active: currentStatus === 'items_collected',
        timestamp: currentIndex > 4 ? new Date(bookingTime.getTime() + 20 * 60 * 1000) : undefined,
        estimatedTime: '5-10 min',
        icon: <LocalShipping />
      },
      {
        id: 'driving_to_facility',
        label: 'Drops them off to nearest registered shops',
        description: 'Taking items to nearest registered shop',
        completed: currentIndex > 5,
        active: currentStatus === 'driving_to_facility',
        timestamp: currentIndex > 5 ? new Date(bookingTime.getTime() + 30 * 60 * 1000) : undefined,
        estimatedTime: '15-20 min',
        icon: <Navigation />
      },
      {
        id: 'items_dropped',
        label: 'Items Dropped Off',
        description: 'Items delivered to shop',
        completed: currentIndex > 6,
        active: currentStatus === 'items_dropped',
        timestamp: currentIndex > 6 ? new Date(bookingTime.getTime() + 50 * 60 * 1000) : undefined,
        estimatedTime: '2-3 min',
        icon: <LocalShipping />
      },
      {
        id: 'out_for_delivery',
        label: 'Picks them up',
        description: 'Going back to shop to pick up cleaned items',
        completed: currentIndex > 9,
        active: currentStatus === 'out_for_delivery',
        timestamp: currentIndex > 9 ? new Date(bookingTime.getTime() + 180 * 60 * 1000) : undefined,
        estimatedTime: '15-20 min',
        icon: <Navigation />
      },
      {
        id: 'returning_to_customer',
        label: 'Drop off to client/user',
        description: 'Taking cleaned items back to customer',
        completed: currentIndex > 10,
        active: currentStatus === 'returning_to_customer',
        timestamp: currentIndex > 10 ? new Date(bookingTime.getTime() + 195 * 60 * 1000) : undefined,
        estimatedTime: '15-20 min',
        icon: <Navigation />
      },
      {
        id: 'delivered',
        label: 'Items Delivered',
        description: 'Items delivered to customer',
        completed: currentIndex > 11,
        active: currentStatus === 'delivered',
        timestamp: currentIndex > 11 ? new Date(bookingTime.getTime() + 200 * 60 * 1000) : undefined,
        estimatedTime: 'Now',
        icon: <CheckCircle />
      }
    ];
  }

  // SHOP ROLE - Shop view
  if (userRole === 'shop') {
    return [
      {
        id: 'items_dropped',
        label: 'Accept items',
        description: 'Items delivered to your shop',
        completed: currentIndex > 6,
        active: currentStatus === 'items_dropped',
        timestamp: currentIndex > 6 ? new Date(bookingTime.getTime() + 50 * 60 * 1000) : undefined,
        estimatedTime: 'Now',
        icon: <LocalShipping />
      },
      {
        id: 'cleaning',
        label: 'Start washing',
        description: 'Begin cleaning the items',
        completed: currentIndex > 7,
        active: currentStatus === 'cleaning',
        timestamp: currentIndex > 7 ? new Date(bookingTime.getTime() + 55 * 60 * 1000) : undefined,
        estimatedTime: '2-4 hours',
        icon: <CleaningServices />
      },
      {
        id: 'cleaning_complete',
        label: 'Set status to done',
        description: 'Items cleaned and ready for pickup - so that the driver can see the notification',
        completed: currentIndex > 8,
        active: currentStatus === 'cleaning_complete',
        timestamp: currentIndex > 8 ? new Date(bookingTime.getTime() + 175 * 60 * 1000) : undefined,
        estimatedTime: 'Done',
        icon: <CheckCircle />
      }
    ];
  }

  // Fallback to user view
  return generateRoleBasedTrackingSteps(currentStatus, bookingTime, 'user');
};

// Default tracking steps - will be replaced with dynamic steps based on booking status
const defaultTrackingSteps: TrackingStep[] = generateRoleBasedTrackingSteps('confirmed', new Date(), 'user');

const mockBooking: BookingDetails = {
  id: 'TEST-123456',
  pickupLocation: 'Midrand, Johannesburg',
  pickupCoords: { lat: -25.9967, lng: 28.1406 }, // Midrand coordinates
  items: ['Business Suit', 'Dress Shoes'],
  totalAmount: 150,
  serviceType: 'LemoClean Premium',
  scheduledTime: new Date(),
  status: 'confirmed', // Start with confirmed status
  driver: {
    id: 'driver1',
    name: 'Thabo Mthembu',
    phone: '+27 82 123 4567',
    vehicle: 'Toyota Corolla',
    licensePlate: 'GP 123 ABC',
    rating: 4.9,
    avatar: '👨‍💼',
    location: { lat: -25.9867, lng: 28.1306 }, // Driver starts slightly away from pickup
    eta: '8 minutes',
    speed: 45,
    distance: 2.5
  }
};

export const LiveTrackingPage: React.FC = () => {
  // Get user role from authenticated user
  const { user } = useAuth();
  
  // Determine user role from authenticated user or fallback to URL/localStorage
  const getUserRole = (): UserRole => {
    // First priority: authenticated user's role
    if (user?.role && ['user', 'driver', 'shop'].includes(user.role)) {
      return user.role as UserRole;
    }
    
    // Second priority: URL path detection
    const urlPath = window.location.pathname;
    if (urlPath.includes('/driver/')) return 'driver';
    if (urlPath.includes('/shop/')) return 'shop';
    
    // Third priority: localStorage (for testing/development)
    const storedRole = localStorage.getItem('lemotech_user_role') as UserRole;
    if (storedRole && ['user', 'driver', 'shop'].includes(storedRole)) {
      return storedRole;
    }
    
    return 'user'; // Default to user role
  };

  const [userRole, setUserRole] = useState<UserRole>(getUserRole());
  const theme = useTheme();
  const { trackingState, minimizeTracking, restoreTracking } = useTracking();

  // Get role-specific styling
  const getRoleStyling = () => {
    switch (userRole) {
      case 'driver':
        return {
          primaryColor: '#2196F3', // Blue for driver
          secondaryColor: '#1976D2',
          accentColor: '#64B5F6',
          roleIcon: '🚗',
          roleTitle: 'Driver Dashboard'
        };
      case 'shop':
        return {
          primaryColor: '#4CAF50', // Green for shop
          secondaryColor: '#388E3C',
          accentColor: '#81C784',
          roleIcon: '🏪',
          roleTitle: 'Shop Dashboard'
        };
      default: // user
        return {
          primaryColor: '#FF6B35', // Orange for user
          secondaryColor: '#E55A2B',
          accentColor: '#FF8A65',
          roleIcon: '👤',
          roleTitle: 'Live Order Tracking'
        };
    }
  };

  const roleStyling = getRoleStyling();

  // Update user role when user changes
  useEffect(() => {
    const newRole = getUserRole();
    setUserRole(newRole);
  }, [user]);

  // SignalR real-time updates
  const { isConnected, connectionState } = useSignalR();
  const bookingId = trackingState.bookingId || (typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('id') || '') : '');
  const realTimeData = useRealTimeTracking(bookingId);

  // Join booking room for real-time updates
  useEffect(() => {
    if (bookingId && isConnected) {
      const userId = localStorage.getItem('lemotech_user_id') || 'anonymous';
      signalRService.joinBookingRoom(bookingId, userId);

      return () => {
        signalRService.leaveBookingRoom(bookingId, userId);
      };
    }
  }, [bookingId, isConnected]);

  const [booking, setBooking] = useState<BookingDetails>(mockBooking);
  const [steps, setSteps] = useState<TrackingStep[]>(defaultTrackingSteps);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [cleaningProgress, setCleaningProgress] = useState(0);
  const [, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  // Update tracking steps when booking status changes
  useEffect(() => {
    const newSteps = generateRoleBasedTrackingSteps(booking.status, booking.scheduledTime, userRole);
    setSteps(newSteps);
  }, [booking.status, booking.scheduledTime, userRole]);

  // Helper function to refresh booking data
  const refreshBookingData = async () => {
    try {
      const bookingData = await bookingService.getBookingDetails(bookingId);
      setBooking(bookingData);
      
      // Update tracking context
      if (bookingData.status) {
        minimizeTracking(bookingId, bookingData.driverInfo?.name || 'Driver', bookingData.estimatedDeliveryTime || '30 min');
      }
    } catch (error) {
      console.error('Failed to refresh booking data:', error);
    }
  };

  const handleDriverAction = async (action: string) => {
    console.log(`Driver action: ${action}`);
    try {
      switch (action) {
        case 'mark-complete':
          const completeResult = await bookingService.updateBookingStatus(bookingId, 'delivered', 'driver');
          if (completeResult.success) {
            setSnackbarMessage('Job marked as completed');
            setShowSnackbar(true);
            setTimeout(() => refreshBookingData(), 1000);
          } else {
            setSnackbarMessage(completeResult.message);
            setShowSnackbar(true);
          }
          break;
        case 'message-customer':
          const customerContact = await bookingService.getContactInfo(bookingId, 'user');
          if (customerContact.available) {
            setSnackbarMessage(`Messaging ${customerContact.name} (${customerContact.phone})`);
            setShowSnackbar(true);
          } else {
            setSnackbarMessage('Customer is currently unavailable for messages');
            setShowSnackbar(true);
          }
          break;
        case 'call-customer':
          const customerInfo = await bookingService.getContactInfo(bookingId, 'user');
          if (customerInfo.phone) {
            window.open(`tel:${customerInfo.phone}`, '_self');
          } else {
            setSnackbarMessage('Customer phone number not available');
            setShowSnackbar(true);
          }
          break;
        case 'update-location':
          setSnackbarMessage('Location updated successfully');
          setShowSnackbar(true);
          break;
      }
    } catch (error) {
      console.error('Driver action failed:', error);
      setSnackbarMessage('Action failed. Please try again.');
      setShowSnackbar(true);
    }
  };

  const handleShopAction = async (action: string) => {
    console.log(`Shop action: ${action}`);
    try {
      switch (action) {
        case 'start-washing':
          const startResult = await bookingService.updateBookingStatus(bookingId, 'cleaning', 'shop');
          if (startResult.success) {
            setSnackbarMessage('Washing process started');
            setShowSnackbar(true);
            setTimeout(() => refreshBookingData(), 1000);
          } else {
            setSnackbarMessage(startResult.message);
            setShowSnackbar(true);
          }
          break;
        case 'mark-complete':
          const completeResult = await bookingService.updateBookingStatus(bookingId, 'cleaning_complete', 'shop');
          if (completeResult.success) {
            setSnackbarMessage('Washing completed successfully');
            setShowSnackbar(true);
            setTimeout(() => refreshBookingData(), 1000);
          } else {
            setSnackbarMessage(completeResult.message);
            setShowSnackbar(true);
          }
          break;
        case 'message-driver':
          const driverContact = await bookingService.getContactInfo(bookingId, 'driver');
          if (driverContact.available) {
            setSnackbarMessage(`Messaging ${driverContact.name} (${driverContact.phone})`);
            setShowSnackbar(true);
          } else {
            setSnackbarMessage('Driver is currently unavailable for messages');
            setShowSnackbar(true);
          }
          break;
        case 'call-driver':
          const driverInfo = await bookingService.getContactInfo(bookingId, 'driver');
          if (driverInfo.phone) {
            window.open(`tel:${driverInfo.phone}`, '_self');
          } else {
            setSnackbarMessage('Driver phone number not available');
            setShowSnackbar(true);
          }
          break;
      }
    } catch (error) {
      console.error('Shop action failed:', error);
      setSnackbarMessage('Action failed. Please try again.');
      setShowSnackbar(true);
    }
  };

  // Real-time updates via SignalR
  useEffect(() => {
    if (!bookingId) return;

    const handleBookingUpdate = (update: any) => {
      console.log('📡 Received booking update:', update);
      
      if (update.bookingId === bookingId) {
        // Update booking status
        if (update.status) {
          setBooking(prev => ({
            ...prev,
            status: update.status
          }));
          
          // Update tracking context
          minimizeTracking(bookingId, update.driverName || trackingState.driverName, update.eta || trackingState.eta);
        }
        
        // Show notification if message provided
        if (update.message) {
          setSnackbarMessage(update.message);
          setShowSnackbar(true);
        }
      }
    };

    const handleDriverLocationUpdate = (locationUpdate: any) => {
      console.log('📍 Received driver location update:', locationUpdate);
      
      if (locationUpdate.bookingId === bookingId) {
        // Update driver location for map
        setDriverLocation(locationUpdate.location);
        
        // Update ETA if provided
        if (locationUpdate.eta) {
          minimizeTracking(bookingId, trackingState.driverName, `${Math.round(locationUpdate.eta)} min`);
        }
      }
    };

    // Set up SignalR event handlers
    const unsubscribeBooking = signalRService.onBookingUpdate(handleBookingUpdate);
    const unsubscribeLocation = signalRService.onDriverLocationUpdate(handleDriverLocationUpdate);
    
    // Join booking room for real-time updates
    const userId = user?.id || 'anonymous';
    signalRService.joinBookingRoom(bookingId, userId);

    return () => {
      // Cleanup handlers
      unsubscribeBooking();
      unsubscribeLocation();
      signalRService.leaveBookingRoom(bookingId, userId);
    };
  }, [bookingId, userRole, trackingState.driverName, trackingState.eta, user?.id, minimizeTracking]);

  // Role-based notifications
  useEffect(() => {
    if (userRole && booking.status) {
      const currentStep = steps.find(step => step.active);
      if (currentStep) {
        let notificationMessage = '';
        
        switch (userRole) {
          case 'user':
            if (currentStep.id === 'driver_accepted') {
              notificationMessage = '🎉 Great! Your driver has been found and is on the way!';
            } else if (currentStep.id === 'pickup_arrived') {
              notificationMessage = '🚗 Your driver has arrived! Please meet them at the pickup location.';
            } else if (currentStep.id === 'items_collected') {
              notificationMessage = '✅ Your items have been collected and are being taken for cleaning.';
            } else if (currentStep.id === 'out_for_delivery') {
              notificationMessage = '🚚 Your cleaned items are on their way back to you!';
            }
            break;
            
          case 'driver':
            if (currentStep.id === 'driver_accepted') {
              notificationMessage = '✅ Request accepted! Navigate to the pickup location.';
            } else if (currentStep.id === 'items_collected') {
              notificationMessage = '📦 Items collected! Take them to the nearest registered shop.';
            } else if (currentStep.id === 'out_for_delivery') {
              notificationMessage = '🔄 Items are ready for pickup! Go back to the shop.';
            } else if (currentStep.id === 'returning_to_customer') {
              notificationMessage = '🏠 Returning to customer with cleaned items.';
            }
            break;
            
          case 'shop':
            if (currentStep.id === 'items_dropped') {
              notificationMessage = '📦 New items received! Please start the cleaning process.';
            } else if (currentStep.id === 'cleaning') {
              notificationMessage = '🧽 Cleaning in progress. Update status when complete.';
            } else if (currentStep.id === 'cleaning_complete') {
              notificationMessage = '✅ Cleaning complete! Driver will be notified for pickup.';
            }
            break;
        }
        
        if (notificationMessage) {
          setSnackbarMessage(notificationMessage);
          setShowSnackbar(true);
        }
      }
    }
  }, [userRole, booking.status, steps]);

  // Load booking data from navigation state or API
  useEffect(() => {
    const loadBookingData = async () => {
      // First, try to get data from navigation state (passed from SmartBookingFlow)
      const navigationState = (window as any).history?.state?.state;
      if (navigationState?.bookingData) {

        // Convert booking data to proper format
        const bookingData = navigationState.bookingData;
        setBooking(prev => ({
          ...prev,
          id: navigationState.bookingId || prev.id,
          pickupLocation: bookingData.location || prev.pickupLocation,
          pickupCoords: bookingData.pickupCoords || prev.pickupCoords,
          items: bookingData.items ? Object.entries(bookingData.items)
            .filter(([_, quantity]) => (quantity as number) > 0)
            .map(([item, quantity]) => `${item} (${quantity})`)
            : prev.items,
          totalAmount: bookingData.totalAmount || prev.totalAmount,
          serviceType: bookingData.serviceType || prev.serviceType,
          scheduledTime: new Date(),
          status: 'confirmed', // Start with confirmed status
          driver: {
            ...prev.driver,
            location: bookingData.pickupCoords ? {
              lat: bookingData.pickupCoords.lat + 0.01, // Driver starts slightly away from pickup
              lng: bookingData.pickupCoords.lng + 0.01
            } : prev.driver.location
          }
        }));

        // Set facility location (you can get this from your facility API or config)
        // For now, using a default facility location - you should replace this with real data
        setDriverLocation({ lat: -26.2041 + 0.05, lng: 28.0473 + 0.05 });

        return;
      }

      // Get booking ID from multiple sources
      let currentId = trackingState.bookingId;

      // Try to get from URL path (e.g., /track/booking/931e0b79-f1a2-48f0-8b17-acc1d379d5b9)
      if (!currentId && typeof window !== 'undefined') {
        const pathParts = window.location.pathname.split('/');
        const bookingIndex = pathParts.indexOf('booking');
        if (bookingIndex !== -1 && pathParts[bookingIndex + 1]) {
          currentId = pathParts[bookingIndex + 1];
        }
      }

      // Fallback to URL search params
      if (!currentId && typeof window !== 'undefined') {
        currentId = new URLSearchParams(window.location.search).get('id') || '';
      }

      // Fallback to localStorage
      const stored = localStorage.getItem('currentBooking');
      const fallback = stored ? JSON.parse(stored) : null;
      const useId = currentId || fallback?.bookingId || fallback?.id;

      // Only try to load from API if we have a valid booking ID
      if (!useId || useId === 'LT-123456') {
        setDriverLocation({ lat: -26.2041 + 0.05, lng: 28.0473 + 0.05 });
        return;
      }

      try {
        const details = await bookingService.getBookingDetails(useId);
        setBooking(prev => ({
          ...prev,
          id: details.id || useId,
          pickupLocation: details.pickupLocation || prev.pickupLocation,
          pickupCoords: details.pickupCoords || prev.pickupCoords,
          items: details.items || prev.items,
          totalAmount: details.amount || prev.totalAmount,
          serviceType: details.serviceType || prev.serviceType,
          scheduledTime: details.estimatedPickupTime ? new Date(details.estimatedPickupTime) : prev.scheduledTime,
          status: details.status || prev.status,
          driver: {
            ...prev.driver,
            name: details.driver?.name || prev.driver.name,
            phone: details.driver?.phone || prev.driver.phone,
            vehicle: details.driver?.vehicle || prev.driver.vehicle,
            rating: details.driver?.rating || prev.driver.rating,
            location: details.driver?.currentLocation || prev.driver.location
          }
        }));

        // Set facility location from API or default
        setDriverLocation({ lat: -26.2041 + 0.05, lng: 28.0473 + 0.05 });
      } catch (e) {
        // Keep demo data if API fails
        setDriverLocation({ lat: -26.2041 + 0.05, lng: 28.0473 + 0.05 });
      }
    };

    loadBookingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle real-time updates from SignalR
  useEffect(() => {
    if (!realTimeData.booking) return;

    // Update booking status
    setBooking(prev => ({
      ...prev,
      status: realTimeData.booking!.status,
      driver: {
        ...prev.driver,
        location: realTimeData.booking!.driverLocation || prev.driver.location,
        eta: (realTimeData.booking as any).eta || prev.driver.eta,
        speed: (realTimeData.booking as any).speed || prev.driver.speed,
        distance: (realTimeData.booking as any).distance || prev.driver.distance
      }
    }));

    // Update tracking steps based on status - sync with real-time updates
    setSteps(prev => prev.map(step => {
      const currentStatus = realTimeData.booking!.status;

      // Mark current step as active and completed
      if (step.id === currentStatus) {
        return {
          ...step,
          completed: true,
          active: true,
          timestamp: new Date(realTimeData.booking!.timestamp || Date.now())
        };
      }

      // Mark previous steps as completed but not active
      const stepOrder = ['confirmed', 'waiting_driver', 'driver_accepted', 'driver_en_route', 'arrived_at_pickup', 'picked_up', 'at_facility', 'cleaning', 'ready_for_delivery', 'driver_en_route_delivery', 'arrived_at_delivery', 'delivered', 'returning_to_customer'];
      const currentIndex = stepOrder.indexOf(currentStatus);
      const stepIndex = stepOrder.indexOf(step.id);

      if (stepIndex < currentIndex) {
        return { ...step, completed: true, active: false };
      } else if (stepIndex === currentIndex) {
        return { ...step, completed: true, active: true };
      } else {
        return { ...step, completed: false, active: false };
      }
    }));

    // Show notification
    if (realTimeData.booking!.message) {
      setSnackbarMessage(realTimeData.booking!.message);
      setShowSnackbar(true);
    }
    setLastUpdateTime(new Date());
  }, [realTimeData.booking]);

  // Handle real-time driver location updates
  useEffect(() => {
    if (!realTimeData.driverLocation) return;

    setBooking(prev => ({
      ...prev,
      driver: {
        ...prev.driver,
        location: realTimeData.driverLocation!.location
      }
    }));

    setLastUpdateTime(new Date());
  }, [realTimeData.driverLocation]);

  // Simulate driver movement for demo purposes (optimized to reduce re-renders)
  useEffect(() => {
    if (booking.status === 'waiting_driver' || !booking.driver.location) return;

    const interval = setInterval(() => {
      setBooking(prev => {
        if (!prev.driver.location || !prev.pickupCoords) return prev;

        // Calculate distance to pickup
        const distanceToPickup = Math.sqrt(
          Math.pow(prev.driver.location.lat - prev.pickupCoords.lat, 2) +
          Math.pow(prev.driver.location.lng - prev.pickupCoords.lng, 2)
        );

        // If driver is close to pickup, stop moving
        if (distanceToPickup < 0.001) return prev;

        // Move driver towards pickup location
        const moveStep = 0.0001; // Small movement step
        const latDiff = prev.pickupCoords.lat - prev.driver.location.lat;
        const lngDiff = prev.pickupCoords.lng - prev.driver.location.lng;
        const totalDiff = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

        const newLat = prev.driver.location.lat + (latDiff / totalDiff) * moveStep;
        const newLng = prev.driver.location.lng + (lngDiff / totalDiff) * moveStep;

        // Only update if there's a meaningful change
        if (Math.abs(newLat - prev.driver.location.lat) > 0.00001 ||
          Math.abs(newLng - prev.driver.location.lng) > 0.00001) {
          return {
            ...prev,
            driver: {
              ...prev.driver,
              location: { lat: newLat, lng: newLng }
            }
          };
        }

        return prev; // No change needed
      });
    }, 3000); // Update every 3 seconds instead of 2 to reduce frequency

    return () => clearInterval(interval);
  }, [booking.status]); // Removed dependencies that cause excessive re-renders



  // Cleaning progress simulation
  useEffect(() => {
    if (booking.status !== 'cleaning') return;

    const interval = setInterval(() => {
      setCleaningProgress(prev => {
        const newProgress = prev + Math.random() * 5;
        return Math.min(100, newProgress);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [booking.status]);

  const handleSendMessage = () => {
    setMessage('');
    setShowMessageDialog(false);
    setSnackbarMessage('Message sent to driver');
    setShowSnackbar(true);
  };

  const handleBackToHome = () => {
    // Minimize tracking window instead of navigating back
    minimizeTracking(booking.id, booking.driver.name, booking.driver.eta);
    // Navigate to home page after minimizing
    window.location.href = '/';
  };

  const handleRestoreTracking = () => {
    restoreTracking();
  };



  return (
    <Box sx={{
      height: '100vh',
      background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 50%, #190F32 100%)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      '& @keyframes pulse': {
        '0%': {
          opacity: 1,
          transform: 'scale(1)'
        },
        '50%': {
          opacity: 0.5,
          transform: 'scale(1.1)'
        },
        '100%': {
          opacity: 1,
          transform: 'scale(1)'
        }
      }
    }}>
      <ParticleBackground />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', py: 2 }}>
        {/* Navigation Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            p: 1.5,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={handleBackToHome}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" sx={{
                color: 'white',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 600,
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <span style={{ fontSize: '1.2rem' }}>{roleStyling.roleIcon}</span>
                {roleStyling.roleTitle}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* User Role Indicator */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mr: 2,
                p: 0.5,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <Typography variant="caption" sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.7rem',
                  mr: 1
                }}>
                  Viewing as:
                </Typography>
                <Typography variant="caption" sx={{
                  color: roleStyling.primaryColor,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'capitalize'
                }}>
                  {userRole}
                </Typography>
              </Box>

              {/* Real-time Connection Status */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.5,
                borderRadius: '6px',
                backgroundColor: isConnected ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
                border: `1px solid ${isConnected ? 'rgba(76, 175, 80, 0.5)' : 'rgba(255, 152, 0, 0.5)'}`
              }}>
                <Box sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: isConnected ? '#4CAF50' : '#FF9800',
                  animation: isConnected ? 'pulse 2s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                    '100%': { opacity: 1 }
                  }
                }} />
                <Typography sx={{
                  fontSize: '0.7rem',
                  color: isConnected ? '#4CAF50' : '#FF9800',
                  fontWeight: 600,
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                }}>
                  {isConnected ? 'LIVE' : connectionState}
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >

          <Box sx={{
            flex: 1,
            display: 'flex',
            gap: 2,
            height: { xs: 'calc(100vh - 80px)', md: 'calc(100vh - 100px)' },
            minHeight: { xs: '400px', md: '450px' }
          }}>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{ width: '300px', flexShrink: 0 }}
            >
              <Paper
                elevation={0}
                sx={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  p: 1.5,
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                  }
                }}
              >
                <Typography variant="h6" sx={{
                  color: 'white',
                  mb: 2,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 600,
                  textAlign: 'center',
                  fontSize: '1.15rem'
                }}>
                  📋 Order Progress
                </Typography>

                {/* Vertical Progress Timeline */}
                <Box sx={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.8,
                  px: 0.5,
                  flex: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '2px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '2px',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                }}>
                  {/* Vertical Progress Line */}
                  <Box sx={{
                    position: 'absolute',
                    left: '50%',
                    top: 0,
                    bottom: 0,
                    width: '2px',
                    background: 'linear-gradient(180deg, #FF6B35 0%, #4CAF50 50%, #2196F3 100%)',
                    transform: 'translateX(-50%)',
                    borderRadius: '1px',
                    zIndex: 1
                  }} />

                  {/* Timeline Steps - Vertical (Show only important steps) */}
                  {steps.filter((step, index) => {
                    // Always show completed steps
                    if (step.completed) return true;
                    // Show active step
                    if (step.active) return true;
                    // Show next 2 upcoming steps
                    const activeIndex = steps.findIndex(s => s.active);
                    if (activeIndex !== -1 && index <= activeIndex + 2) return true;
                    // Show first few steps always
                    if (index < 3) return true;
                    return false;
                  }).map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: 2,
                        gap: 0.8,
                        justifyContent: 'center'
                      }}>
                        {/* Step Circle */}
                        <Box sx={{
                          width: step.active ? 24 : 18,
                          height: step.active ? 24 : 18,
                          borderRadius: '50%',
                          background: step.completed
                            ? '#4CAF50'
                            : step.active
                              ? '#FF6B35'
                              : 'rgba(255, 255, 255, 0.2)',
                          border: step.active ? '2px solid white' : '1.5px solid white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: step.active ? '0 0 15px rgba(255, 107, 53, 0.6)' : '0 1px 4px rgba(0, 0, 0, 0.3)',
                          transition: 'all 0.3s ease',
                          flexShrink: 0,
                          animation: step.active ? 'pulse 2s infinite' : 'none'
                        }}>
                          {step.completed && (
                            <CheckCircle sx={{ color: 'white', fontSize: step.active ? 16 : 13 }} />
                          )}
                          {step.active && !step.completed && (
                            <Box sx={{
                              width: step.active ? 10 : 7,
                              height: step.active ? 10 : 7,
                              borderRadius: '50%',
                              backgroundColor: 'white',
                              animation: 'pulse 2s infinite',
                              boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)'
                            }} />
                          )}
                          {!step.completed && !step.active && (
                            <Typography sx={{
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontSize: '0.65rem',
                              fontWeight: 600
                            }}>
                              {index + 1}
                            </Typography>
                          )}
                        </Box>

                        {/* Step Content */}
                        <Box sx={{
                          flex: 1,
                          minWidth: 0,
                          marginLeft: '0.5rem',
                          textAlign: step.active ? 'center' : 'left'
                        }}>
                          <Typography variant={step.active ? "h6" : "body1"} sx={{
                            color: step.active
                              ? '#FF6B35'
                              : step.completed
                                ? '#4CAF50'
                                : 'rgba(255, 255, 255, 0.8)',
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            fontWeight: step.active ? 700 : 500,
                            fontSize: step.active ? '1rem' : '0.85rem',
                            display: 'block',
                            lineHeight: step.active ? 1.3 : 1.2,
                            mb: step.active ? 0.3 : 0.1,
                            textShadow: step.active ? '0 1px 3px rgba(255, 107, 53, 0.3)' : 'none'
                          }}>
                            {step.label}
                          </Typography>
                          {step.estimatedTime && (
                            <Typography variant={step.active ? "body1" : "body2"} sx={{
                              color: step.active ? '#FF6B35' : 'rgba(255, 255, 255, 0.6)',
                              fontFamily: '"Plus Jakarta Sans", sans-serif',
                              fontSize: step.active ? '0.85rem' : '0.7rem',
                              fontWeight: step.active ? 600 : 500,
                              display: 'block',
                              mb: step.active ? 0.2 : 0.1,
                              textShadow: step.active ? '0 1px 2px rgba(255, 107, 53, 0.3)' : 'none'
                            }}>
                              {step.estimatedTime}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Box>

                {/* Role-Based Action Buttons */}
                <Box sx={{
                  mt: 2,
                  p: 1.5,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <Typography variant="body2" sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    mb: 1.5,
                    textAlign: 'center'
                  }}>
                    {userRole === 'user' && '📞 Contact & Support'}
                    {userRole === 'driver' && '🚗 Driver Actions'}
                    {userRole === 'shop' && '🏪 Shop Actions'}
                  </Typography>

                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}>
                    {/* USER ROLE ACTIONS */}
                    {userRole === 'user' && (
                      <>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Message />}
                          onClick={() => setShowMessageDialog(true)}
                          sx={{
                            color: roleStyling.primaryColor,
                            borderColor: roleStyling.primaryColor,
                            '&:hover': {
                              backgroundColor: `${roleStyling.primaryColor}20`,
                              borderColor: roleStyling.primaryColor
                            }
                          }}
                        >
                          Message Driver
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Phone />}
                          onClick={() => window.open(`tel:${booking.driver.phone}`)}
                          sx={{
                            color: roleStyling.primaryColor,
                            borderColor: roleStyling.primaryColor,
                            '&:hover': {
                              backgroundColor: `${roleStyling.primaryColor}20`,
                              borderColor: roleStyling.primaryColor
                            }
                          }}
                        >
                          Call Driver
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Refresh />}
                          onClick={() => window.location.reload()}
                          sx={{
                            color: roleStyling.primaryColor,
                            borderColor: roleStyling.primaryColor,
                            '&:hover': {
                              backgroundColor: `${roleStyling.primaryColor}20`,
                              borderColor: roleStyling.primaryColor
                            }
                          }}
                        >
                          Refresh Status
                        </Button>
                      </>
                    )}

                    {/* DRIVER ROLE ACTIONS */}
                    {userRole === 'driver' && (
                      <>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<CheckCircle />}
                          onClick={() => handleDriverAction('mark-complete')}
                          sx={{
                            backgroundColor: roleStyling.primaryColor,
                            '&:hover': {
                              backgroundColor: roleStyling.secondaryColor
                            }
                          }}
                        >
                          Mark Complete
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Message />}
                          onClick={() => setShowMessageDialog(true)}
                          sx={{
                            color: roleStyling.primaryColor,
                            borderColor: roleStyling.primaryColor,
                            '&:hover': {
                              backgroundColor: `${roleStyling.primaryColor}20`,
                              borderColor: roleStyling.primaryColor
                            }
                          }}
                        >
                          Message Customer
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Phone />}
                          onClick={() => window.open(`tel:+27 82 123 4567`)}
                          sx={{
                            color: roleStyling.primaryColor,
                            borderColor: roleStyling.primaryColor,
                            '&:hover': {
                              backgroundColor: `${roleStyling.primaryColor}20`,
                              borderColor: roleStyling.primaryColor
                            }
                          }}
                        >
                          Call Customer
                        </Button>
                      </>
                    )}

                    {/* SHOP ROLE ACTIONS */}
                    {userRole === 'shop' && (
                      <>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<CleaningServices />}
                          onClick={() => handleShopAction('start-washing')}
                          sx={{
                            backgroundColor: roleStyling.primaryColor,
                            '&:hover': {
                              backgroundColor: roleStyling.secondaryColor
                            }
                          }}
                        >
                          Start Washing
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<CheckCircle />}
                          onClick={() => handleShopAction('mark-complete')}
                          sx={{
                            backgroundColor: roleStyling.primaryColor,
                            '&:hover': {
                              backgroundColor: roleStyling.secondaryColor
                            }
                          }}
                        >
                          Mark Complete
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Message />}
                          onClick={() => setShowMessageDialog(true)}
                          sx={{
                            color: roleStyling.primaryColor,
                            borderColor: roleStyling.primaryColor,
                            '&:hover': {
                              backgroundColor: `${roleStyling.primaryColor}20`,
                              borderColor: roleStyling.primaryColor
                            }
                          }}
                        >
                          Message Driver
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              </Paper>
            </motion.div>

            {/* BLUE SECTION - Maps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ flex: 1 }}
            >
              <Box sx={{
                height: '100%',
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '2px solid rgba(255, 107, 53, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
                {/* Map Container */}
                <IndependentMapComponent />

                {/* Map Controls */}
                <Box sx={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  display: 'flex',
                  gap: 1,
                  zIndex: 2
                }}>
                  <IconButton
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#333',
                      width: 40,
                      height: 40,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                    onClick={() => {
                    }}
                  >
                    🔄
                  </IconButton>

                  <IconButton
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#333',
                      width: 40,
                      height: 40,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                    onClick={() => {
                    }}
                  >
                    🎯
                  </IconButton>
                </Box>

                {/* Map Status Indicator */}
                <Box sx={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '6px',
                  p: 1,
                  border: '1px solid rgba(255, 107, 53, 0.3)',
                  zIndex: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: booking.status === 'waiting_driver' ? '#FFC107' : '#4CAF50',
                      animation: 'pulse 2s infinite'
                    }} />
                    <Typography variant="caption" sx={{
                      color: 'white',
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontSize: '0.7rem'
                    }}>
                      {booking.status === 'waiting_driver' ? 'Searching for driver...' : 'Live tracking active'}
                    </Typography>
                  </Box>
                </Box>

                {/* Waiting for Driver Overlay */}
                {booking.status === 'waiting_driver' && (
                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    p: 3,
                    textAlign: 'center',
                    border: '1px solid rgba(255, 193, 7, 0.3)',
                    zIndex: 3
                  }}>
                    <Box sx={{
                      fontSize: '2rem',
                      mb: 1,
                      animation: 'pulse 2s infinite'
                    }}>
                      🔍
                    </Box>
                    <Typography variant="h6" sx={{
                      color: '#FFC107',
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 600,
                      mb: 1
                    }}>
                      Looking for Driver
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontSize: '0.8rem'
                    }}>
                      We're searching for an available driver in your area
                    </Typography>
                  </Box>
                )}
              </Box>
            </motion.div>

            {/* GREEN SECTION - Driver Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{ width: '300px', flexShrink: 0 }}
            >
              <Paper
                elevation={0}
                sx={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                  p: 2,
                  height: '100%',
                  border: '1px solid rgba(255, 107, 53, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{
                    color: '#1a1a1a',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}>
                    👨‍💼 Driver Details
                  </Typography>
                  <Typography variant="caption" sx={{
                    color: '#FF6B35',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 600,
                    fontSize: '0.8rem'
                  }}>
                    Order #{booking.id}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: booking.status === 'waiting_driver'
                      ? 'linear-gradient(135deg, #FFC107 0%, #FF9800 100%)'
                      : 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    mr: 2,
                    animation: booking.status === 'waiting_driver' ? 'pulse 2s infinite' : 'none'
                  }}>
                    {booking.status === 'waiting_driver' ? '🔍' : booking.driver.avatar}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{
                      color: '#1a1a1a',
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 600,
                      fontSize: '1rem',
                      mb: 0.5
                    }}>
                      {booking.driver.name}
                    </Typography>

                    {booking.status === 'waiting_driver' ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="body2" sx={{
                          color: '#FF9800',
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontWeight: 600,
                          fontSize: '0.85rem'
                        }}>
                          ⏳ Searching for driver...
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="body2" sx={{
                          color: '#FF6B35',
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontWeight: 600,
                          fontSize: '0.85rem'
                        }}>
                          ⭐ {booking.driver.rating}
                        </Typography>
                        <Typography variant="body2" sx={{
                          color: '#666',
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontSize: '0.85rem'
                        }}>
                          • {booking.driver.vehicle}
                        </Typography>
                      </Box>
                    )}

                    <Typography variant="body2" sx={{
                      color: booking.status === 'waiting_driver' ? '#FF9800' : '#FF6B35',
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 600,
                      fontSize: '0.85rem'
                    }}>
                      {booking.status === 'waiting_driver' ? '⏱️ ' : '🚗 '}{booking.driver.eta} {booking.status === 'waiting_driver' ? 'estimated' : 'away'}
                    </Typography>
                  </Box>
                </Box>

                {/* Last Update Timestamp */}
                <Box sx={{
                  mt: 1,
                  p: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <Typography variant="caption" sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.7rem',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}>
                    🔄 Last updated: {lastUpdateTime.toLocaleTimeString()}
                    {isConnected && (
                      <Box sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: '#4CAF50',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': { opacity: 1 },
                          '50%': { opacity: 0.5 },
                          '100%': { opacity: 1 }
                        }
                      }} />
                    )}
                  </Typography>
                </Box>

                {/* Cleaning Progress */}
                {booking.status === 'cleaning' && (
                  <Box sx={{ mb: 2, p: 2, background: 'rgba(33, 150, 243, 0.1)', borderRadius: '8px', border: '1px solid rgba(33, 150, 243, 0.2)' }}>
                    <Typography variant="body2" sx={{
                      color: '#1976D2',
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      🧽 Cleaning Progress
                    </Typography>
                    <Box sx={{
                      width: '100%',
                      height: 8,
                      backgroundColor: 'rgba(33, 150, 243, 0.2)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      mb: 1
                    }}>
                      <Box sx={{
                        width: `${cleaningProgress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #2196F3 0%, #1976D2 100%)',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease'
                      }} />
                    </Box>
                    <Typography variant="caption" sx={{
                      color: '#1976D2',
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {Math.round(cleaningProgress)}% Complete
                    </Typography>
                  </Box>
                )}

                {/* Location Info */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: '#FF6B35',
                      mr: 1.5,
                      flexShrink: 0,
                      mt: 0.5
                    }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" sx={{
                        color: '#666',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        display: 'block',
                        mb: 0.25
                      }}>
                        Pickup:
                      </Typography>
                      <Typography variant="body2" sx={{
                        color: '#1a1a1a',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        lineHeight: 1.3
                      }}>
                        {booking.pickupLocation}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: booking.status === 'cleaning' || booking.status === 'cleaning_complete' || booking.status === 'out_for_delivery' ? '#2196F3' : '#4CAF50',
                      mr: 1.5,
                      flexShrink: 0,
                      mt: 0.5
                    }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" sx={{
                        color: '#666',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        display: 'block',
                        mb: 0.25
                      }}>
                        {booking.status === 'cleaning' || booking.status === 'cleaning_complete' || booking.status === 'out_for_delivery' ? 'Facility:' : 'Drop:'}
                      </Typography>
                      <Typography variant="body2" sx={{
                        color: '#1a1a1a',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        lineHeight: 1.3
                      }}>
                        {booking.status === 'cleaning' || booking.status === 'cleaning_complete' || booking.status === 'out_for_delivery' ? 'LemoClean Facility' : 'Customer Location'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Order Items */}
                <Box sx={{ mt: 2, p: 2, background: 'rgba(255, 107, 53, 0.05)', borderRadius: '8px', border: '1px solid rgba(255, 107, 53, 0.1)' }}>
                  <Typography variant="body2" sx={{
                    color: '#FF6B35',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    📦 Order Items
                  </Typography>
                  {booking.items.map((item, index) => (
                    <Typography key={index} variant="caption" sx={{
                      color: '#666',
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontSize: '0.75rem',
                      display: 'block',
                      mb: 0.5
                    }}>
                      • {item}
                    </Typography>
                  ))}
                  <Typography variant="caption" sx={{
                    color: '#FF6B35',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'block',
                    mt: 1
                  }}>
                    Total: R{booking.totalAmount}
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Box>
        </motion.div>
      </Container>


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
            Send Message to {booking.driver.name}
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

      {/* Floating Action Button */}
      <FloatingTrackingButton
        bookingId={trackingState.bookingId || ''}
        driverName={trackingState.driverName}
        eta={trackingState.eta}
        onRestore={handleRestoreTracking}
        visible={trackingState.showFloatingButton}
        hideOnHome={trackingState.hideOnHome}
      />

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
      `}</style>
    </Box>
  );
};
