import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TrackingState {
  isMinimized: boolean;
  bookingId: string | null;
  driverName: string;
  eta: string;
  showFloatingButton: boolean;
  hideOnHome: boolean;
}

interface TrackingContextType {
  trackingState: TrackingState;
  minimizeTracking: (bookingId: string, driverName: string, eta: string) => void;
  restoreTracking: () => void;
  closeTracking: () => void;
  hideFloatingButton: () => void;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};

interface TrackingProviderProps {
  children: ReactNode;
}

export const TrackingProvider: React.FC<TrackingProviderProps> = ({ children }) => {
  const [trackingState, setTrackingState] = useState<TrackingState>({
    isMinimized: false,
    bookingId: null,
    driverName: '',
    eta: '',
    showFloatingButton: false,
    hideOnHome: false
  });

  // Check for persisted tracking state on mount
  useEffect(() => {
    const minimized = localStorage.getItem('trackingMinimized') === 'true';
    const bookingId = localStorage.getItem('trackingBookingId');
    const driverName = localStorage.getItem('trackingDriverName') || '';
    const eta = localStorage.getItem('trackingEta') || '';

    // Only restore tracking if we have a valid booking ID (not mock data)
    if (minimized && bookingId && bookingId !== 'LT-123456') {
      setTrackingState({
        isMinimized: true,
        bookingId,
        driverName,
        eta,
        showFloatingButton: true,
        hideOnHome: false
      });
    } else if (bookingId === 'LT-123456') {
      // Clear mock booking ID from localStorage
      localStorage.removeItem('trackingMinimized');
      localStorage.removeItem('trackingBookingId');
      localStorage.removeItem('trackingDriverName');
      localStorage.removeItem('trackingEta');
    }
  }, []);

  const minimizeTracking = (bookingId: string, driverName: string, eta: string) => {
    setTrackingState({
      isMinimized: true,
      bookingId,
      driverName,
      eta,
      showFloatingButton: true,
      hideOnHome: false
    });

    // Persist to localStorage
    localStorage.setItem('trackingMinimized', 'true');
    localStorage.setItem('trackingBookingId', bookingId);
    localStorage.setItem('trackingDriverName', driverName);
    localStorage.setItem('trackingEta', eta);
  };

  const restoreTracking = () => {
    setTrackingState(prev => ({
      ...prev,
      isMinimized: false,
      showFloatingButton: false,
      hideOnHome: false
    }));

    // Clear localStorage
    localStorage.removeItem('trackingMinimized');
    localStorage.removeItem('trackingBookingId');
    localStorage.removeItem('trackingDriverName');
    localStorage.removeItem('trackingEta');
  };

  const closeTracking = () => {
    setTrackingState({
      isMinimized: false,
      bookingId: null,
      driverName: '',
      eta: '',
      showFloatingButton: false,
      hideOnHome: false
    });

    // Clear localStorage
    localStorage.removeItem('trackingMinimized');
    localStorage.removeItem('trackingBookingId');
    localStorage.removeItem('trackingDriverName');
    localStorage.removeItem('trackingEta');
  };

  const hideFloatingButton = () => {
    setTrackingState(prev => ({
      ...prev,
      hideOnHome: true
    }));
  };

  return (
    <TrackingContext.Provider value={{
      trackingState,
      minimizeTracking,
      restoreTracking,
      closeTracking,
      hideFloatingButton
    }}>
      {children}
    </TrackingContext.Provider>
  );
};
