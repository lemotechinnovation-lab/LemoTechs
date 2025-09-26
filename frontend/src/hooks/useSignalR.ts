import { useEffect, useCallback, useState } from 'react';
import { signalRService, BookingUpdate, DriverLocationUpdate } from '../services/signalRService';

// Hook for Socket.IO connection management
export const useSignalR = () => {
  const [connectionState, setConnectionState] = useState<string>('Disconnected');
  const [isConnected, setIsConnected] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Initialize connection
  const initialize = useCallback(async () => {
    if (isInitializing || isConnected) return; // Prevent multiple initializations
    
    try {
      setIsInitializing(true);
      const token = localStorage.getItem('lemotech_token');
      await signalRService.initialize(token || undefined);
    } catch (error) {
      console.error('Failed to initialize Socket.IO:', error);
    } finally {
      setIsInitializing(false);
    }
  }, [isInitializing, isConnected]);

  // Disconnect
  const disconnect = useCallback(async () => {
    await signalRService.disconnect();
  }, []);

  // Update connection state
  useEffect(() => {
    const updateState = () => {
      const state = signalRService.getConnectionState();
      setConnectionState(state);
      setIsConnected(state === 'Connected');
    };

    // Initial state
    updateState();

    // Update state periodically
    const interval = setInterval(updateState, 1000);

    return () => clearInterval(interval);
  }, []);

  // Initialize on mount if authenticated
  useEffect(() => {
    const token = localStorage.getItem('lemotech_token');
    if (token && !isConnected && !isInitializing) {
      initialize();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [initialize, disconnect, isConnected, isInitializing]);

  return {
    connectionState,
    isConnected,
    initialize,
    disconnect
  };
};

// Hook for booking updates
export const useBookingUpdates = (onUpdate?: (update: BookingUpdate) => void) => {
  const [lastUpdate, setLastUpdate] = useState<BookingUpdate | null>(null);

  useEffect(() => {
    const unsubscribe = signalRService.onBookingUpdate((update: BookingUpdate) => {
      setLastUpdate(update);
      onUpdate?.(update);
    });

    return unsubscribe;
  }, [onUpdate]);

  return { lastUpdate };
};

// Hook for driver location updates
export const useDriverLocationUpdates = (onUpdate?: (update: DriverLocationUpdate) => void) => {
  const [driverLocations, setDriverLocations] = useState<Map<string, DriverLocationUpdate>>(new Map());

  useEffect(() => {
    const unsubscribe = signalRService.onDriverLocationUpdate((update: DriverLocationUpdate) => {
      setDriverLocations(prev => {
        const newMap = new Map(prev);
        newMap.set(update.bookingId, update);
        return newMap;
      });
      onUpdate?.(update);
    });

    return unsubscribe;
  }, [onUpdate]);

  return { driverLocations };
};

// Combined hook for real-time tracking
export const useRealTimeTracking = (bookingId?: string) => {
  const [trackingData, setTrackingData] = useState<{
    booking?: BookingUpdate;
    driverLocation?: DriverLocationUpdate;
  }>({});

  // Listen for booking updates
  useBookingUpdates((update) => {
    if (!bookingId || update.bookingId === bookingId) {
      setTrackingData(prev => ({ ...prev, booking: update }));
    }
  });

  // Listen for driver location updates
  useDriverLocationUpdates((update) => {
    if (!bookingId || update.bookingId === bookingId) {
      setTrackingData(prev => ({ ...prev, driverLocation: update }));
    }
  });

  return trackingData;
};

// Hook for shop notifications
export const useShopNotifications = (onNotification?: (notification: any) => void) => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = signalRService.onNotification((message: any) => {
      if (message.type === 'shop_notification') {
        setNotifications(prev => [message, ...prev].slice(0, 50)); // Keep last 50 notifications
        onNotification?.(message);
      }
    });

    return unsubscribe;
  }, [onNotification]);

  return { notifications };
};