import { Box } from '@mui/material';
import { useState } from 'react';
import { SimpleBookingForm } from './SimpleBookingForm';
import { ParticleBackground } from '../Common/ParticleBackground';
import { MapView } from '../Maps/MapView';
import { Driver, LocationCoordinates, RideBookingProps } from '../../types/booking';
import '../../styles/booking.css';

// Mock drivers data (this would typically come from an API)
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

export const RideBooking = ({ onBackToHome }: RideBookingProps) => {
  // Main state management
  const [showMapView, setShowMapView] = useState(false);
  const [showDriversList, setShowDriversList] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  // Location state
  const [pickupLocation, setPickupLocation] = useState('');

  const [pickupCoords, setPickupCoords] = useState<LocationCoordinates | null>(null);


  // Items state
  const [_selectedItems, setSelectedItems] = useState<string[]>([]);

  // Event handlers
  const handleLocationChange = (location: string, coords: LocationCoordinates | null) => {
    setPickupLocation(location);
    setPickupCoords(coords);

    if (location && !showMapView) {
      setShowMapView(true);
      setTimeout(() => setShowDriversList(true), 500);
    }
  };

  const handleItemsChange = (items: string[]) => {
    setSelectedItems(items);
  };

  const handleDriverSelect = (driverId: string) => {
    setSelectedDriver(driverId);
  };

  const handleShowMapView = (show: boolean) => {
    setShowMapView(show);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0A28 0%, #1E1440 50%, #190F32 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <ParticleBackground />

      {/* Main Content Area */}
      <Box sx={{
        height: '100vh', // Full viewport height since header is hidden
        maxHeight: '100vh',
        display: 'flex',
        overflow: 'hidden', // Prevent overall overflow
        position: 'relative',
        zIndex: 2,
        pl: { xs: 1, sm: 2 }, // Left padding only for outer container
        pb: 0.5 // Minimal bottom padding
      }}>
        {/* Booking Form Component */}
        <SimpleBookingForm
          onBackToHome={onBackToHome}
          onShowMapView={handleShowMapView}
          onLocationChange={handleLocationChange}
          onItemsChange={handleItemsChange}
          onDriverSelect={handleDriverSelect}
          showMapView={showMapView}
        />

        {/* Map View Component */}
        {showMapView && (
          <MapView
            pickupLocation={pickupLocation}
            pickupCoords={pickupCoords}
            drivers={mockDrivers}
            selectedDriver={selectedDriver}
            onDriverSelect={handleDriverSelect}
            showDriversList={showDriversList}
          />
        )}
      </Box>
    </Box>
  );
};