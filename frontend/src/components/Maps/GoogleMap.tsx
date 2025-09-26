import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { Box, Typography } from '@mui/material';

// Declare global google maps types
declare global {
  interface Window {
    google: any;
  }
  
  const google: any;
}

interface MapProps {
  center: any;
  zoom: number;
  pickupLocation?: string;
  destinationLocation?: string;
  pickupCoordinates?: any;
  destinationCoordinates?: any;
  drivers?: Array<{
    id: string;
    name: string;
    position: any;
    estimatedArrival: string;
  }>;
  onDriverSelect?: (driverId: string) => void;
  showStreetLines?: boolean;
  showTraffic?: boolean;
}

const MapComponent: React.FC<MapProps> = React.memo(({
  center,
  zoom,
  pickupLocation,
  destinationLocation,
  pickupCoordinates,
  destinationCoordinates,
  drivers = [],
  showTraffic = true
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [map, setMap] = useState<any>();
  const [mapError, setMapError] = useState<string>('');
  const [directionsService, setDirectionsService] = useState<any>();
  const [directionsRenderer, setDirectionsRenderer] = useState<any>();
  const [isCreatingMap, setIsCreatingMap] = useState(false);

  // Memoize map options to prevent unnecessary re-renders
  const mapOptions = useMemo(() => {
    const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;
    return {
      center,
      zoom,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: true,
      rotateControl: true,
      fullscreenControl: true,
      gestureHandling: 'greedy',
      clickableIcons: true,
      keyboardShortcuts: true,
      ...(mapId && { mapId })
    };
  }, [center, zoom]);

  // Stable map creation function
  const createMap = useCallback(() => {
    if (!ref.current || mapRef.current || isCreatingMap || !window.google?.maps) return;
    
    setIsCreatingMap(true);
    
    try {
      // Clear any existing content
      if (ref.current.innerHTML) {
        ref.current.innerHTML = '';
      }
      
      // Create map with delay to ensure container is ready
      setTimeout(() => {
        if (!ref.current) return;
        
        const newMap = new window.google.maps.Map(ref.current, mapOptions);
        
        // Initialize services
        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: '#FF6B35',
            strokeWeight: 4,
            strokeOpacity: 0.8
          }
        });
        
        mapRef.current = newMap;
        setMap(newMap);
        setDirectionsService(directionsService);
        setDirectionsRenderer(directionsRenderer);
        setIsCreatingMap(false);
        
        // Force resize after a short delay
        setTimeout(() => {
          if (newMap && window.google?.maps) {
            window.google.maps.event.trigger(newMap, 'resize');
          }
        }, 200);
        
      }, 100);
      
    } catch (error) {
      console.error('Google Maps error:', error);
      setMapError('Failed to load Google Maps. Please check your API key and internet connection.');
      setIsCreatingMap(false);
    }
  }, [map, isCreatingMap, mapOptions]);

  useEffect(() => {
    
    // Only create map if we have all requirements and container has dimensions
    if (ref.current && 
        ref.current.offsetWidth > 0 && 
        ref.current.offsetHeight > 0 && 
        window.google?.maps &&
        !mapRef.current) {
      createMap();
    } else if (ref.current && !window.google?.maps) {
      // If Google Maps is not available, show fallback after a short delay
      const timer = setTimeout(() => {
        if (!window.google?.maps && !mapRef.current) {
          setMapError('Google Maps API not loaded');
        }
      }, 2000); // Wait 2 seconds for Google Maps to load
      
      return () => clearTimeout(timer);
    }
  }, [createMap, isCreatingMap]);

  // Add traffic layer when map is ready and showTraffic changes
  useEffect(() => {
    if (map && showTraffic && window.google && window.google.maps) {
      const trafficLayer = new window.google.maps.TrafficLayer();
      trafficLayer.setMap(map);
      
      return () => {
        trafficLayer.setMap(null);
      };
    }
  }, [map, showTraffic]);

  // Add pickup marker with house icon using AdvancedMarkerElement (with fallback)
  useEffect(() => {
    if (map && pickupLocation) {
      const pickupPosition = pickupCoordinates || center;
      
      // Try AdvancedMarkerElement first, fallback to regular Marker
      if (window.google?.maps?.marker?.AdvancedMarkerElement) {
        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.innerHTML = `
          <div style="
            width: 32px; 
            height: 32px; 
            background: #4CAF50; 
            border: 3px solid white; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 16px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            🏠
          </div>
        `;
        
        const pickupMarker = new window.google.maps.marker.AdvancedMarkerElement({
          position: pickupPosition,
          map: map,
          title: 'Pickup Location',
          content: markerElement,
        });

        const pickupInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <strong>🏠 Pickup Location</strong><br/>
              ${pickupLocation}
            </div>
          `
        });

        pickupMarker.addListener('click', () => {
          pickupInfoWindow.open(map, pickupMarker);
        });

        return () => {
          pickupMarker.map = null;
        };
      } else {
        // Fallback to regular Marker
        const pickupMarker = new window.google.maps.Marker({
          position: pickupPosition,
          map: map,
          title: 'Pickup Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="#4CAF50" stroke="white" stroke-width="3"/>
                <path d="M16 8l-6 6v8h4v-6h4v6h4v-8l-6-6z" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 16),
          },
        });

        const pickupInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <strong>🏠 Pickup Location</strong><br/>
              ${pickupLocation}
            </div>
          `
        });

        pickupMarker.addListener('click', () => {
          pickupInfoWindow.open(map, pickupMarker);
        });

        return () => {
          pickupMarker.setMap(null);
        };
      }
    }
  }, [map, pickupLocation, pickupCoordinates, center]);

  // Add destination marker with cleaning store icon using AdvancedMarkerElement (with fallback)
  useEffect(() => {
    if (map && destinationLocation) {
      const destPosition = destinationCoordinates || {
        lat: center.lat + 0.02,
        lng: center.lng + 0.03
      };

      // Try AdvancedMarkerElement first, fallback to regular Marker
      if (window.google?.maps?.marker?.AdvancedMarkerElement) {
        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.innerHTML = `
          <div style="
            width: 32px; 
            height: 32px; 
            background: #FF6B35; 
            border: 3px solid white; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 16px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            🏪
          </div>
        `;

        const destMarker = new window.google.maps.marker.AdvancedMarkerElement({
          position: destPosition,
          map: map,
          title: 'Cleaning Store',
          content: markerElement,
        });

        const destInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <strong>🏪 Cleaning Store</strong><br/>
              ${destinationLocation}
            </div>
          `
        });

        destMarker.addListener('click', () => {
          destInfoWindow.open(map, destMarker);
        });

        return () => {
          destMarker.map = null;
        };
      } else {
        // Fallback to regular Marker
        const destMarker = new window.google.maps.Marker({
          position: destPosition,
          map: map,
          title: 'Cleaning Store',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="#FF6B35" stroke="white" stroke-width="3"/>
                <path d="M8 12h16v12H8V12zm2 2v8h12v-8H10zm2 2h8v4h-8v-4z" fill="white"/>
                <circle cx="16" cy="10" r="2" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 16),
          },
        });

        const destInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <strong>🏪 Cleaning Store</strong><br/>
              ${destinationLocation}
            </div>
          `
        });

        destMarker.addListener('click', () => {
          destInfoWindow.open(map, destMarker);
        });

        return () => {
          destMarker.setMap(null);
        };
      }
    }
  }, [map, destinationLocation, destinationCoordinates, center]);

  // Add smart route between pickup and destination
  useEffect(() => {
    if (map && directionsService && directionsRenderer && pickupLocation && destinationLocation) {
      const pickupPos = pickupCoordinates || center;
      const destPos = destinationCoordinates || {
        lat: center.lat + 0.02,
        lng: center.lng + 0.03
      };


      directionsService.route({
        origin: pickupPos,
        destination: destPos,
        travelMode: window.google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false,
        avoidFerries: false,
        optimizeWaypoints: true,
        provideRouteAlternatives: false,
        region: 'ZA', // South Africa region for better local routing
        unitSystem: window.google.maps.UnitSystem.METRIC
      }, (result: any, status: any) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
          directionsRenderer.setMap(map);
          
          // Fit map to show the entire route
          const bounds = new window.google.maps.LatLngBounds();
          result.routes[0].legs.forEach((leg: any) => {
            bounds.extend(leg.start_location);
            bounds.extend(leg.end_location);
          });
          map.fitBounds(bounds);
        } else {
          console.error('Directions request failed due to ' + status);
          // Fallback: draw a simple line between points
          const polyline = new window.google.maps.Polyline({
            path: [pickupPos, destPos],
            geodesic: true,
            strokeColor: '#FF6B35',
            strokeOpacity: 0.8,
            strokeWeight: 4
          });
          polyline.setMap(map);
        }
      });

      return () => {
        directionsRenderer.setMap(null);
      };
    }
  }, [map, directionsService, directionsRenderer, pickupLocation, destinationLocation, pickupCoordinates, destinationCoordinates, center]);

  // Add driver markers with live tracking animation
  useEffect(() => {
    if (map && drivers.length > 0) {
      
      const driverMarkers = drivers.map((driver) => {
        const driverPosition = driver.position || {
          lat: center.lat + (Math.random() - 0.5) * 0.04,
          lng: center.lng + (Math.random() - 0.5) * 0.04
        };


        // Try AdvancedMarkerElement first, fallback to regular Marker
        if (window.google?.maps?.marker?.AdvancedMarkerElement) {
          // Create custom marker element with animation
          const markerElement = document.createElement('div');
          markerElement.innerHTML = `
            <div style="
              width: 40px; 
              height: 40px; 
              background: #0088FF; 
              border: 3px solid white; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-size: 20px; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              animation: pulse 2s infinite;
            ">
              🚗
            </div>
            <style>
              @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.8; }
                100% { transform: scale(1); opacity: 1; }
              }
            </style>
          `;

          const marker = new window.google.maps.marker.AdvancedMarkerElement({
            position: driverPosition,
            map: map,
            title: driver.name,
            content: markerElement,
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; text-align: center;">
                <strong>🚗 ${driver.name}</strong><br/>
                <div style="color: #666; font-size: 0.9em; margin: 4px 0;">
                  ETA: ${driver.estimatedArrival}
                </div>
                <div style="color: #0088FF; font-size: 0.8em; margin: 2px 0;">
                  🟢 Live tracking active
                </div>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          return marker;
        } else {
          // Fallback to regular Marker with animation
          const marker = new window.google.maps.Marker({
            position: driverPosition,
            map: map,
            title: driver.name,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#0088FF" stroke="white" stroke-width="3"/>
                  <text x="20" y="26" text-anchor="middle" fill="white" font-size="16">🚗</text>
                  <circle cx="20" cy="20" r="25" fill="none" stroke="#0088FF" stroke-width="2" opacity="0.3">
                    <animate attributeName="r" values="18;25;18" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite"/>
                  </circle>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20),
            },
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; text-align: center;">
                <strong>🚗 ${driver.name}</strong><br/>
                <div style="color: #666; font-size: 0.9em; margin: 4px 0;">
                  ETA: ${driver.estimatedArrival}
                </div>
                <div style="color: #0088FF; font-size: 0.8em; margin: 2px 0;">
                  🟢 Live tracking active
                </div>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          return marker;
        }
      });

      return () => {
        driverMarkers.forEach(marker => {
          if (marker.map !== undefined) {
            marker.map = null; // AdvancedMarkerElement
          } else {
            marker.setMap(null); // Regular Marker
          }
        });
      };
    }
  }, [map, drivers, center]);

  if (mapError) {
    return (
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #E8F5E8 0%, #F0F8F0 50%, #E8F5E8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Simple map-like background */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.3,
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          zIndex: 1
        }} />
        
        {/* Simple roads */}
        <Box sx={{
          position: 'absolute',
          top: '30%',
          left: '10%',
          right: '10%',
          height: '3px',
          background: '#666',
          borderRadius: '2px',
          zIndex: 2
        }} />
        <Box sx={{
          position: 'absolute',
          top: '60%',
          left: '20%',
          right: '20%',
          height: '3px',
          background: '#888',
          borderRadius: '2px',
          zIndex: 2
        }} />
        
        {/* Vertical roads */}
        <Box sx={{
          position: 'absolute',
          top: '20%',
          bottom: '20%',
          left: '40%',
          width: '3px',
          background: '#888',
          borderRadius: '2px',
          zIndex: 2
        }} />
        <Box sx={{
          position: 'absolute',
          top: '25%',
          bottom: '25%',
          left: '70%',
          width: '3px',
          background: '#666',
          borderRadius: '2px',
          zIndex: 2
        }} />
        
        {/* Driver marker with animation */}
        <Box sx={{
          position: 'absolute',
          top: '40%',
          left: '30%',
          width: '20px',
          height: '20px',
          background: '#0088FF',
          borderRadius: '50%',
          border: '3px solid white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          zIndex: 3,
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)', opacity: 1 },
            '50%': { transform: 'scale(1.2)', opacity: 0.8 },
            '100%': { transform: 'scale(1)', opacity: 1 }
          }
        }} />
        
        {/* Driver pulse ring */}
        <Box sx={{
          position: 'absolute',
          top: '40%',
          left: '30%',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: '2px solid #0088FF',
          opacity: 0.3,
          zIndex: 2,
          animation: 'pulseRing 2s infinite',
          '@keyframes pulseRing': {
            '0%': { transform: 'scale(1)', opacity: 0.3 },
            '50%': { transform: 'scale(1.5)', opacity: 0.1 },
            '100%': { transform: 'scale(1)', opacity: 0.3 }
          }
        }} />
        
        {/* Pickup location marker with house icon */}
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '60%',
          width: '24px',
          height: '24px',
          background: '#4CAF50',
          borderRadius: '50%',
          border: '3px solid white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: 'white'
        }}>
          🏠
        </Box>
        
        {/* Destination marker with store icon */}
        <Box sx={{
          position: 'absolute',
          top: '30%',
          left: '75%',
          width: '24px',
          height: '24px',
          background: '#FF6B35',
          borderRadius: '50%',
          border: '3px solid white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: 'white'
        }}>
          🏪
        </Box>
        
        {/* Smart route line - curved path with animation */}
        <Box sx={{
          position: 'absolute',
          top: '35%',
          left: '32%',
          width: '45%',
          height: '3px',
          background: 'linear-gradient(90deg, #FF6B35 0%, #FF8A65 50%, #FF6B35 100%)',
          borderRadius: '2px',
          zIndex: 2,
          transform: 'rotate(15deg)',
          transformOrigin: 'left center',
          opacity: 0.8,
          animation: 'routeFlow 3s infinite',
          '@keyframes routeFlow': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' }
          }
        }} />
        
        {/* Route progress indicator */}
        <Box sx={{
          position: 'absolute',
          top: '35%',
          left: '32%',
          width: '20px',
          height: '20px',
          background: '#FF6B35',
          borderRadius: '50%',
          border: '2px solid white',
          zIndex: 3,
          transform: 'rotate(15deg) translateX(20px)',
          transformOrigin: 'left center',
          animation: 'moveAlongRoute 4s infinite linear',
          '@keyframes moveAlongRoute': {
            '0%': { transform: 'rotate(15deg) translateX(0px)' },
            '100%': { transform: 'rotate(15deg) translateX(180px)' }
          }
        }} />
        
        {/* Simple map controls */}
        <Box sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px',
          p: 1,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 4
        }}>
          <Typography variant="caption" sx={{ color: '#333', fontSize: '0.7rem' }}>
            🗺️ Map View
          </Typography>
        </Box>
        
        {/* Status indicator */}
        <Box sx={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          borderRadius: '6px',
          p: 1,
          zIndex: 4
        }}>
          <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
            🟢 Live tracking active
          </Typography>
        </Box>
        
        {/* Center content */}
        <Box sx={{ 
          textAlign: 'center', 
          zIndex: 5,
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          p: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ fontSize: '2rem', mb: 1 }}>🗺️</Box>
          <Typography variant="h6" sx={{ color: '#333', mb: 0.5, fontWeight: 600 }}>
            Live Map View
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
            Driver tracking simulation
          </Typography>
          <Typography variant="caption" sx={{ color: '#999' }}>
            {mapError}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <div 
      ref={ref} 
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        zIndex: 1
      }} 
    />
  );
});

interface GoogleMapProps {
  center?: any;
  zoom?: number;
  pickupLocation?: string;
  destinationLocation?: string;
  pickupCoordinates?: any;
  destinationCoordinates?: any;
  drivers?: Array<{
    id: string;
    name: string;
    position: any;
    estimatedArrival: string;
  }>;
  onDriverSelect?: (driverId: string) => void;
  showStreetLines?: boolean;
  showTraffic?: boolean;
}

// Export a wrapper that provides Google Maps context
export const GoogleMapsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  
  if (!apiKey) {
    return <>{children}</>;
  }

  return (
    <Wrapper apiKey={apiKey} libraries={['places', 'marker'] as any}>
      {children}
    </Wrapper>
  );
};

const GoogleMap: React.FC<GoogleMapProps> = React.memo(({
  center = { lat: -26.2041, lng: 28.0473 }, // Johannesburg
  zoom = 13,
  pickupLocation,
  destinationLocation,
  pickupCoordinates,
  destinationCoordinates,
  drivers,
  showTraffic = true
}) => {
  // Always render the MapComponent - let it handle the API key detection internally
  return (
    <MapComponent
      center={center}
      zoom={zoom}
      pickupLocation={pickupLocation}
      destinationLocation={destinationLocation}
      pickupCoordinates={pickupCoordinates}
      destinationCoordinates={destinationCoordinates}
      drivers={drivers}
      showTraffic={showTraffic}
    />
  );
});

export default GoogleMap;