import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, InputBase } from '@mui/material';
import { LocationOn } from '@mui/icons-material';

interface PlacesInputProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  onLocationSelected?: () => void; // New callback for when location is selected
  placeholder?: string;
  disabled?: boolean;
  dropdownMaxHeight?: string;
  onSuggestionsOpen?: () => void;
  onSuggestionsClose?: () => void;
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
  { description: 'Fairland, Johannesburg, South Africa', lat: -26.1167, lng: 27.9500 },
  { description: 'Ferndale, Johannesburg, South Africa', lat: -26.0833, lng: 28.0167 },
  { description: 'Florida, Johannesburg, South Africa', lat: -26.1667, lng: 27.9167 },
  { description: 'Fontainebleau, Johannesburg, South Africa', lat: -26.1333, lng: 28.0167 },
  { description: 'Forest Town, Johannesburg, South Africa', lat: -26.1667, lng: 28.0333 },
  { description: 'Fourways Gardens, Johannesburg, South Africa', lat: -25.9833, lng: 28.0167 },
  { description: 'Frankenwald, Johannesburg, South Africa', lat: -26.1333, lng: 28.0167 },
  { description: 'Franklin Roosevelt Park, Johannesburg, South Africa', lat: -26.1500, lng: 28.0167 },
];

const PlacesInput: React.FC<PlacesInputProps> = ({
  value,
  onChange,
  onLocationSelect,
  onLocationSelected,
  placeholder = "Enter pickup location",
  disabled = false,
  dropdownMaxHeight = 'min(300px, 40vh)',
  onSuggestionsOpen,
  onSuggestionsClose
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, setUseFallback] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if Google Maps API is available
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  
  // Check for Google Maps API availability
  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google?.maps?.places?.AutocompleteSuggestion) {
        console.log('✅ Google Maps Places API loaded successfully');
        setIsGoogleMapsLoaded(true);
      } else {
        // Retry after a short delay
        setTimeout(checkGoogleMaps, 100);
      }
    };
    
    // Check if we have the API key
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ Google Maps API key not found. Using fallback suggestions only.');
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
            setSuggestions(formattedSuggestions.slice(0, 6));
            setUseFallback(false);
          } else {
            // Fallback to local suggestions
            const filtered = fallbackSuggestions.filter(suggestion =>
              suggestion.description.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 6));
            setUseFallback(true);
          }
        } else {
          // Use fallback suggestions when API is not available
          const filtered = fallbackSuggestions.filter(suggestion =>
            suggestion.description.toLowerCase().includes(value.toLowerCase())
          );
          setSuggestions(filtered.slice(0, 6));
          setUseFallback(true);
        }
      } catch (error) {
        console.warn('Places API error, using fallback:', error);
        // Use fallback suggestions on error
        const filtered = fallbackSuggestions.filter(suggestion =>
          suggestion.description.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 6));
        setUseFallback(true);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [value, isGoogleMapsLoaded]);

  // Use suggestions from API or fallback suggestions
  const allSuggestions = suggestions;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onChange(newValue);
    setShowSuggestions(newValue.length > 0);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (value.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setIsFocused(false);
        setShowSuggestions(false);
      }
    }, 300);
  };

  const handleSuggestionClick = async (event: React.MouseEvent, suggestion: any) => {
    event.preventDefault();
    event.stopPropagation();
    
    const address = suggestion.description || suggestion.structured_formatting?.main_text || suggestion;
    
    onChange(address);
    setShowSuggestions(false);

    if (onLocationSelect) {
      try {
        // Check if this is a fallback suggestion with coordinates
        if (suggestion.lat && suggestion.lng) {
          onLocationSelect({
            lat: suggestion.lat,
            lng: suggestion.lng,
            address: address
          });
        } else if (suggestion.place_id && isGoogleMapsLoaded) {
          // Check if Place API is available
          if (window.google?.maps?.places?.Place) {
            try {
              const place = new window.google.maps.places.Place({
                id: suggestion.place_id,
                requestedLanguage: 'en'
              });
              
              place.fetchFields({
                fields: ['location', 'displayName']
              }).then((placeData: any) => {
                
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
                
                if (location && typeof location.lat === 'function' && typeof location.lng === 'function') {
                  onLocationSelect({
                    lat: location.lat(),
                    lng: location.lng(),
                    address: displayName
                  });
                } else {
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
            onLocationSelect({
              lat: -26.2041 + (Math.random() - 0.5) * 0.1,
              lng: 28.0473 + (Math.random() - 0.5) * 0.1,
              address: address
            });
          }
        } else {
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
    }

    // Call the new callback to trigger login dialog
    if (onLocationSelected) {
      onLocationSelected();
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Track previous showSuggestions state
  const prevShowSuggestions = useRef(false);
  useEffect(() => {
    if (showSuggestions && !prevShowSuggestions.current && onSuggestionsOpen) {
      onSuggestionsOpen();
    }
    if (!showSuggestions && prevShowSuggestions.current && onSuggestionsClose) {
      onSuggestionsClose();
    }
    prevShowSuggestions.current = showSuggestions;
  }, [showSuggestions, onSuggestionsOpen, onSuggestionsClose]);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        zIndex: showSuggestions ? 1000 : 'auto'
      }}
    >
      {/* Input Field */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '12px',
          border: isFocused ? '3px solid #8B45FF' : '2px solid rgba(139, 69, 255, 0.6)',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          boxShadow: isFocused 
            ? '0 8px 32px rgba(139, 69, 255, 0.3), 0 0 0 1px rgba(139, 69, 255, 0.1)' 
            : '0 4px 16px rgba(139, 69, 255, 0.1)',
          '&:hover': {
            border: '2px solid rgba(139, 69, 255, 0.8)',
            boxShadow: '0 6px 24px rgba(139, 69, 255, 0.2)',
          }
        }}
      >
        {/* Location Icon */}
        <Box
          sx={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            color: isFocused ? '#8B45FF' : 'rgba(139, 69, 255, 0.7)',
            transition: 'color 0.3s ease'
          }}
        >
          <LocationOn sx={{ fontSize: '20px' }} />
        </Box>

        {/* Input */}
        <InputBase
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={
            isLoading 
              ? "Searching..." 
              : !isGoogleMapsLoaded 
                ? "Loading places..." 
                : placeholder
          }
          sx={{
            width: '100%',
            height: '56px',
            pl: '48px',
            pr: '16px',
            fontSize: '16px',
            fontWeight: 500,
            color: '#1A0B4A',
            '& input': {
              '&::placeholder': {
                color: 'rgba(26, 11, 74, 0.6)',
                fontWeight: 500,
                opacity: 1
              }
            }
          }}
        />
      </Box>

      {/* Suggestions Dropdown */}
      {showSuggestions && allSuggestions.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            border: '2px solid rgba(139, 69, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(139, 69, 255, 0.2), 0 0 0 1px rgba(139, 69, 255, 0.1)',
            maxHeight: dropdownMaxHeight,
            overflowY: 'auto',
            zIndex: 1001,
            animation: 'fadeInDropdown 0.2s ease-out',
            '@keyframes fadeInDropdown': {
              '0%': {
                opacity: 0,
                transform: 'translateY(-8px) scale(0.95)'
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0) scale(1)'
              }
            }
          }}
        >
          {/* Fallback indicator */}
          {!isGoogleMapsLoaded && (
            <Box
              sx={{
                p: 1.5,
                borderBottom: '1px solid rgba(139, 69, 255, 0.1)',
                background: 'rgba(255, 193, 7, 0.1)',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px'
              }}
            >
              <Typography
                sx={{
                  fontSize: '12px',
                  color: '#856404',
                  textAlign: 'center',
                  fontWeight: 500
                }}
              >
                📍 Using local suggestions (Google Maps API not available)
              </Typography>
            </Box>
          )}
          {allSuggestions.map((suggestion, index) => (
            <Box
              key={suggestion.place_id || suggestion.description || index}
              onMouseDown={(event) => {
                event.preventDefault();
                handleSuggestionClick(event, suggestion);
              }}
              sx={{
                p: 2,
                cursor: 'pointer',
                borderBottom: index < allSuggestions.length - 1 ? '1px solid rgba(139, 69, 255, 0.1)' : 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(139, 69, 255, 0.05)',
                  transform: 'translateX(4px)'
                },
                '&:first-of-type': {
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px'
                },
                '&:last-of-type': {
                  borderBottomLeftRadius: '12px',
                  borderBottomRightRadius: '12px'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, rgba(139, 69, 255, 0.1) 0%, rgba(139, 69, 255, 0.05) 100%)',
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(139, 69, 255, 0.2)'
                  }}
                >
                  <LocationOn sx={{ fontSize: '16px', color: '#8B45FF' }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#1A0B4A',
                      mb: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {suggestion.structured_formatting?.main_text || suggestion.description?.split(',')[0] || suggestion}
                  </Typography>
                  {(suggestion.structured_formatting?.secondary_text || suggestion.description?.split(',').slice(1).join(',')) && (
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: 'rgba(26, 11, 74, 0.6)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {suggestion.structured_formatting?.secondary_text || suggestion.description?.split(',').slice(1).join(',').trim()}
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

export { PlacesInput };
