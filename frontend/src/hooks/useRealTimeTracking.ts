// Real-time tracking hook for booking updates
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { signalRService, BookingUpdate, DriverLocationUpdate, UserNotification } from '../services/signalRService';
import { useAuth } from '../hooks/useAuth';

export interface TrackingState {
  bookingId: string;
  status: string;
  driverLocation?: { lat: number; lng: number };
  eta?: string;
  lastUpdate: Date;
  isConnected: boolean;
  notifications: UserNotification[];
}

export const useRealTimeTracking = () => {
  const { id: bookingId } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [trackingState, setTrackingState] = useState<TrackingState>({
    bookingId: bookingId || '',
    status: 'confirmed',
    lastUpdate: new Date(),
    isConnected: false,
    notifications: []
  });

  // Initialize SignalR connection
  useEffect(() => {
    if (!user?.id || !bookingId) return;

    const initializeConnection = async () => {
      try {
        await signalRService.initialize(user.id);
        
        // Join booking room for real-time updates
        signalRService.joinBookingRoom(bookingId, user.id);
        
        console.log('📡 Real-time tracking initialized for booking:', bookingId);
      } catch (error) {
        console.error('❌ Failed to initialize real-time tracking:', error);
      }
    };

    initializeConnection();

    // Cleanup on unmount
    return () => {
      if (bookingId && user?.id) {
        signalRService.leaveBookingRoom(bookingId, user.id);
      }
    };
  }, [bookingId, user?.id]);

  // Subscribe to booking updates
  useEffect(() => {
    const unsubscribeBookingUpdates = signalRService.onBookingUpdate((update: BookingUpdate) => {
      console.log('📡 Received booking update:', update);
      
      setTrackingState(prev => ({
        ...prev,
        status: update.status,
        eta: update.eta?.toString(),
        lastUpdate: update.timestamp,
        driverLocation: update.driverLocation
      }));
    });

    return unsubscribeBookingUpdates;
  }, []);

  // Subscribe to driver location updates
  useEffect(() => {
    const unsubscribeLocationUpdates = signalRService.onDriverLocationUpdate((update: DriverLocationUpdate) => {
      console.log('📡 Received driver location update:', update);
      
      setTrackingState(prev => ({
        ...prev,
        driverLocation: update.location,
        lastUpdate: update.timestamp
      }));
    });

    return unsubscribeLocationUpdates;
  }, []);

  // Subscribe to notifications
  useEffect(() => {
    const unsubscribeNotifications = signalRService.onNotification((notification: UserNotification) => {
      console.log('📡 Received notification:', notification);
      
      setTrackingState(prev => ({
        ...prev,
        notifications: [notification, ...prev.notifications]
      }));
    });

    return unsubscribeNotifications;
  }, []);

  // Subscribe to connection status
  useEffect(() => {
    const unsubscribeConnection = signalRService.onConnectionChange((connected: boolean) => {
      setTrackingState(prev => ({
        ...prev,
        isConnected: connected
      }));
    });

    return unsubscribeConnection;
  }, []);

  // Calculate ETA based on driver location
  const calculateETA = useCallback((driverLocation: { lat: number; lng: number }, pickupLocation: { lat: number; lng: number }) => {
    if (!driverLocation || !pickupLocation) return 'Calculating...';

    // Simple distance calculation (Haversine formula)
    const R = 6371; // Earth's radius in kilometers
    const dLat = (pickupLocation.lat - driverLocation.lat) * Math.PI / 180;
    const dLng = (pickupLocation.lng - driverLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(driverLocation.lat * Math.PI / 180) * Math.cos(pickupLocation.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers

    // Assume average speed of 30 km/h in city traffic
    const estimatedMinutes = Math.round((distance / 30) * 60);
    
    if (estimatedMinutes < 1) return 'Less than 1 minute';
    if (estimatedMinutes < 60) return `${estimatedMinutes} minutes`;
    
    const hours = Math.floor(estimatedMinutes / 60);
    const minutes = estimatedMinutes % 60;
    return `${hours}h ${minutes}m`;
  }, []);

  // Get status message
  const getStatusMessage = useCallback((status: string) => {
    const statusMessages: { [key: string]: string } = {
      'confirmed': 'Your booking has been confirmed!',
      'waiting_driver': 'Looking for an available driver...',
      'driver_assigned': 'Driver has been assigned to your booking!',
      'driver_en_route': 'Driver is on the way to pickup location',
      'arrived_at_pickup': 'Driver has arrived at pickup location',
      'picked_up': 'Items have been collected',
      'at_facility': 'Items delivered to cleaning facility',
      'cleaning': 'Items are being cleaned',
      'ready_for_delivery': 'Items are ready for delivery',
      'out_for_delivery': 'Driver is delivering your items',
      'delivered': 'Items have been delivered successfully!',
      'completed': 'Service completed successfully!'
    };

    return statusMessages[status] || 'Booking status updated';
  }, []);

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setTrackingState(prev => ({
      ...prev,
      notifications: []
    }));
  }, []);

  // Mark notification as read
  const markNotificationAsRead = useCallback((notificationIndex: number) => {
    setTrackingState(prev => ({
      ...prev,
      notifications: prev.notifications.map((notif, index) => 
        index === notificationIndex ? { ...notif, read: true } : notif
      )
    }));
  }, []);

  return {
    trackingState,
    calculateETA,
    getStatusMessage,
    clearNotifications,
    markNotificationAsRead,
    isConnected: signalRService.isSocketConnected()
  };
};

export default useRealTimeTracking;
