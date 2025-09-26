import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';

// Modern Places API implementation using AutocompleteSuggestion
interface ModernPlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  placeholder?: string;
  disabled?: boolean;
  sx?: any;
  size?: 'small' | 'medium' | 'large';
  variant?: 'standard' | 'outlined' | 'filled' | 'transparent';
}

// Fallback suggestions for when Google Places API isn't available
const fallbackSuggestions = [
  { description: 'Sandton, Johannesburg, South Africa', lat: -26.1076, lng: 28.0567 },
  { description: 'Rosebank, Johannesburg, South Africa', lat: -26.1435, lng: 28.0436 },
  { description: 'Hyde Park, Johannesburg, South Africa', lat: -26.1186, lng: 28.0317 },
  { description: 'Melville, Johannesburg, South Africa', lat: -26.1868, lng: 28.0061 },
  { description: 'Fourways, Johannesburg, South Africa', lat: -25.9927, lng: 28.0094 },
  { description: 'Randburg, Johannesburg, South Africa', lat: -26.0938, lng: 28.0068 },
  { description: 'Midrand, Johannesburg, South Africa', lat: -25.9953, lng: 28.1285 },
  { description: 'Centurion, Pretoria, South Africa', lat: -25.8601, lng: 28.1878 },
  { description: 'Bryanston, Johannesburg, South Africa', lat: -26.0469, lng: 28.0183 },
  { description: 'Woodmead, Johannesburg, South Africa', lat: -26.0667, lng: 28.0833 },
];

const ModernPlacesAutocomplete: React.FC<ModernPlacesAutocompleteProps> = ({
  value,
  onChange,
  onLocationSelect,
  placeholder = "Enter pickup location",
  disabled = false,
  sx = {},
  size = 'large'
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, setUseFallback] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if Google Maps API is available
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  
  // Check for Google Maps API availability
  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google?.maps?.places?.AutocompleteSuggestion) {
        console.log('✅ Google Maps Places API loaded successfully (ModernPlacesAutocomplete)');
        setIsGoogleMapsLoaded(true);
      } else {
        // Retry after a short delay
        setTimeout(checkGoogleMaps, 100);
      }
    };
    
    // Check if we have the API key
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ Google Maps API key not found. Using fallback suggestions only (ModernPlacesAutocomplete).');
      setIsGoogleMapsLoaded(false);
      return;
    }
    
    checkGoogleMaps();
  }, []);

  // Fetch autocomplete suggestions using the new API
  const fetchAutocompleteSuggestions = async (input: string) => {
    if (!isGoogleMapsLoaded || !window.google?.maps?.places?.AutocompleteSuggestion) {
      return [];
    }

    try {
      const { suggestions } = await window.google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input,
        includedRegionCodes: ['ZA'] // South Africa only
      });
      return suggestions || [];
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
      return [];
    }
  };

  // Debounced search function
  useEffect(() => {
    if (!value.trim() || value.length < 2) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      
      try {
        if (isGoogleMapsLoaded && window.google?.maps?.places?.AutocompleteSuggestion) {
          // Use new AutocompleteSuggestion API
          const apiSuggestions = await fetchAutocompleteSuggestions(value);
          
          if (apiSuggestions && apiSuggestions.length > 0) {
            // Convert API suggestions to our format
            const formattedSuggestions = apiSuggestions.map((suggestion: any) => ({
              description: suggestion.placePrediction?.mainText?.text || suggestion.placePrediction?.description,
              structured_formatting: {
                main_text: suggestion.placePrediction?.mainText?.text,
                secondary_text: suggestion.placePrediction?.secondaryText?.text
              },
              place_id: suggestion.placePrediction?.placeId
            }));
            setSuggestions(formattedSuggestions.slice(0, 8));
            setUseFallback(false);
          } else {
            // Fallback to local suggestions
            const filtered = fallbackSuggestions.filter(suggestion =>
              suggestion.description.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 8));
            setUseFallback(true);
          }
        } else {
          // Use fallback suggestions when API is not available
          const filtered = fallbackSuggestions.filter(suggestion =>
            suggestion.description.toLowerCase().includes(value.toLowerCase())
          );
          setSuggestions(filtered.slice(0, 8));
          setUseFallback(true);
        }
      } catch (error) {
        console.warn('Places API error, using fallback:', error);
        // Use fallback suggestions on error
        const filtered = fallbackSuggestions.filter(suggestion =>
          suggestion.description.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 8));
        setUseFallback(true);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [value, isGoogleMapsLoaded]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSuggestionSelect = async (suggestion: any) => {
    console.log('🔍 Debug: Suggestion clicked:', suggestion);
    
    const address = suggestion.description || suggestion.structured_formatting?.main_text || suggestion;
    console.log('🔍 Debug: Selected address:', address);
    
    onChange(address);
    setSuggestions([]);
    setIsFocused(false);

    if (onLocationSelect) {
      console.log('🔍 Debug: onLocationSelect callback exists, processing...');
      
      try {
        // Check if this is a fallback suggestion with coordinates
        if (suggestion.lat && suggestion.lng) {
          console.log('🔍 Debug: Using fallback coordinates:', suggestion.lat, suggestion.lng);
          onLocationSelect({
            lat: suggestion.lat,
            lng: suggestion.lng,
            address: address
          });
        } else if (suggestion.place_id) {
          console.log('🔍 Debug: Using Place API for place_id:', suggestion.place_id);
          
          // Check if Place API is available
          if (window.google?.maps?.places?.Place) {
            try {
              const place = new window.google.maps.places.Place({
                id: suggestion.place_id,
                requestedLanguage: 'en'
              });
              
              console.log('🔍 Debug: Place object created, fetching fields...');
              
              place.fetchFields({
                fields: ['location', 'displayName']
              }).then((placeData: any) => {
                console.log('🔍 Debug: Place data received:', placeData);
                console.log('🔍 Debug: Place data structure:', Object.keys(placeData));
                
                // Try different ways to access location data
                let location = null;
                let displayName = address;
                
                if (placeData?.location) {
                  location = placeData.location;
                } else if (placeData?.place?.location) {
                  location = placeData.place.location;
                } else if (placeData?.place?.geometry?.location) {
                  location = placeData.place.geometry.location;
                }
                
                if (placeData?.displayName) {
                  displayName = placeData.displayName;
                } else if (placeData?.place?.displayName) {
                  displayName = placeData.place.displayName;
                } else if (placeData?.place?.formatted_address) {
                  displayName = placeData.place.formatted_address;
                }
                
                console.log('🔍 Debug: Extracted location:', location);
                console.log('🔍 Debug: Extracted displayName:', displayName);
                
                if (location && typeof location.lat === 'function' && typeof location.lng === 'function') {
                  console.log('✅ Using location from Place API');
                  onLocationSelect({
                    lat: location.lat(),
                    lng: location.lng(),
                    address: displayName
                  });
                } else {
                  console.warn('⚠️ No valid location data found, using fallback');
                  onLocationSelect({
                    lat: -26.2041 + (Math.random() - 0.5) * 0.1,
                    lng: 28.0473 + (Math.random() - 0.5) * 0.1,
                    address: displayName
                  });
                }
              }).catch((error: any) => {
                console.error('❌ Error fetching place details:', error);
                // Fallback coordinates for Johannesburg area
                onLocationSelect({
                  lat: -26.2041 + (Math.random() - 0.5) * 0.1,
                  lng: 28.0473 + (Math.random() - 0.5) * 0.1,
                  address: address
                });
              });
            } catch (error) {
              console.error('❌ Error creating Place object:', error);
              // Fallback coordinates for Johannesburg area
              onLocationSelect({
                lat: -26.2041 + (Math.random() - 0.5) * 0.1,
                lng: 28.0473 + (Math.random() - 0.5) * 0.1,
                address: address
              });
            }
          } else {
            console.warn('⚠️ Place API not available, using fallback coordinates');
            onLocationSelect({
              lat: -26.2041 + (Math.random() - 0.5) * 0.1,
              lng: 28.0473 + (Math.random() - 0.5) * 0.1,
              address: address
            });
          }
        } else {
          console.log('🔍 Debug: No place_id, using fallback coordinates');
          // Fallback coordinates for Johannesburg area
          onLocationSelect({
            lat: -26.2041 + (Math.random() - 0.5) * 0.1,
            lng: 28.0473 + (Math.random() - 0.5) * 0.1,
            address: address
          });
        }
      } catch (error) {
        console.error('❌ Error getting location details:', error);
      }
    } else {
      console.log('🔍 Debug: No onLocationSelect callback provided');
    }
  };

  const showSuggestions = isFocused && suggestions.length > 0 && value.length > 0;

  // Size configurations
  const sizeConfig = {
    small: { fontSize: '0.875rem', padding: '10px 16px', height: '36px' },
    medium: { fontSize: '1rem', padding: '14px 18px', height: '50px' },
    large: { fontSize: '1.1rem', padding: '16px 20px', height: '56px' }
  };

  const currentSizeConfig = sizeConfig[size];

  return (
    <Box sx={{ position: 'relative', width: '100%', ...sx }}>
      {/* Input field */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        disabled={disabled}
        placeholder={isLoading ? "Searching..." : placeholder}
        style={{
          width: '100%',
          height: currentSizeConfig.height,
          padding: currentSizeConfig.padding,
          fontSize: currentSizeConfig.fontSize,
          border: '2px solid rgba(139, 69, 255, 0.8)',
          borderRadius: '8px',
          background: '#FFFFFF',
          outline: 'none',
          fontFamily: 'inherit',
          fontWeight: '600',
          color: '#1A0B4A'
        }}
      />

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'linear-gradient(135deg, rgba(15, 8, 40, 0.98) 0%, rgba(30, 20, 65, 0.96) 100%)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(139, 69, 255, 0.8)',
            borderRadius: '12px',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 1000,
            boxShadow: '0 8px 32px rgba(139, 69, 255, 0.3)',
            mt: 1
          }}
        >
          {suggestions.map((suggestion, index) => (
            <Box
              key={suggestion.place_id || index}
              onClick={() => handleSuggestionSelect(suggestion)}
              sx={{
                p: 2,
                cursor: 'pointer',
                borderBottom: index < suggestions.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(139, 69, 255, 0.1)',
                  transform: 'translateX(4px)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '6px',
                  background: 'rgba(139, 69, 255, 0.2)',
                  mr: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography sx={{ fontSize: '10px' }}>📍</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    mb: 0.5
                  }}>
                    {suggestion.structured_formatting?.main_text || suggestion.description?.split(',')[0] || suggestion}
                  </Typography>
                  {suggestion.structured_formatting?.secondary_text && (
                    <Typography sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.8rem'
                    }}>
                      {suggestion.structured_formatting.secondary_text}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export { ModernPlacesAutocomplete };
