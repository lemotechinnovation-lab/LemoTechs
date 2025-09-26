import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

// Enhanced placeholder styling
const placeholderStyles = `
  .places-input::placeholder {
    color: rgba(0, 0, 0, 0.7) !important;
    font-weight: 700 !important;
    opacity: 1 !important;
  }
  .places-input-transparent::placeholder {
    color: rgba(0, 0, 0, 0.7) !important;
    font-weight: 700 !important;
    opacity: 1 !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('places-autocomplete-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'places-autocomplete-styles';
    styleSheet.textContent = placeholderStyles;
    document.head.appendChild(styleSheet);
  }
}

interface PlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  onLocationSelected?: () => void; // New callback for when location is selected
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
  { description: 'Illovo, Johannesburg, South Africa', lat: -26.1333, lng: 28.0500 },
  { description: 'Parktown, Johannesburg, South Africa', lat: -26.1667, lng: 28.0333 },
  { description: 'Morningside, Johannesburg, South Africa', lat: -26.1167, lng: 28.0667 },
  { description: 'Craighall, Johannesburg, South Africa', lat: -26.1333, lng: 28.0167 },
  { description: 'Parkhurst, Johannesburg, South Africa', lat: -26.1333, lng: 28.0000 },
  { description: 'Linden, Johannesburg, South Africa', lat: -26.1500, lng: 28.0167 },
  { description: 'Lenasia, Johannesburg, South Africa', lat: -26.3333, lng: 27.8333 },
  { description: 'Lenasia South, Johannesburg, South Africa', lat: -26.3500, lng: 27.8333 },
  { description: 'Leratong Hospital, Krugersdorp, South Africa', lat: -26.0833, lng: 27.7500 },
  { description: 'Leandra, Mpumalanga, South Africa', lat: -26.3833, lng: 29.1000 },
  { description: 'Leeuwenhof Akademie, Johannesburg, South Africa', lat: -26.1500, lng: 27.9833 },
  { description: 'Boksburg, Johannesburg, South Africa', lat: -26.2167, lng: 28.2500 },
  { description: 'Germiston, Johannesburg, South Africa', lat: -26.2167, lng: 28.1667 },
  { description: 'Kempton Park, Johannesburg, South Africa', lat: -26.1000, lng: 28.2333 },
  { description: 'Benoni, Johannesburg, South Africa', lat: -26.1833, lng: 28.3167 },
  { description: 'Springs, Johannesburg, South Africa', lat: -26.2500, lng: 28.4333 },
  { description: 'Alberton, Johannesburg, South Africa', lat: -26.2667, lng: 28.1167 },
  { description: 'Roodepoort, Johannesburg, South Africa', lat: -26.1667, lng: 27.8667 },
  { description: 'Krugersdorp, Johannesburg, South Africa', lat: -26.1000, lng: 27.7833 },
  { description: 'Edenvale, Johannesburg, South Africa', lat: -26.1333, lng: 28.1500 },
  { description: 'Bedfordview, Johannesburg, South Africa', lat: -26.1833, lng: 28.1333 },
  { description: 'Observatory, Johannesburg, South Africa', lat: -26.1833, lng: 28.0833 },
  { description: 'Yeoville, Johannesburg, South Africa', lat: -26.1833, lng: 28.0667 },
  { description: 'Berea, Johannesburg, South Africa', lat: -26.1833, lng: 28.0500 },
  { description: 'Hillbrow, Johannesburg, South Africa', lat: -26.1833, lng: 28.0500 },
  { description: 'Newtown, Johannesburg, South Africa', lat: -26.2000, lng: 28.0333 },
  { description: 'Maboneng, Johannesburg, South Africa', lat: -26.2000, lng: 28.0500 },
  { description: 'Fordsburg, Johannesburg, South Africa', lat: -26.2000, lng: 28.0167 },
  { description: 'Mayfair, Johannesburg, South Africa', lat: -26.2167, lng: 28.0000 },
  { description: 'Turffontein, Johannesburg, South Africa', lat: -26.2333, lng: 28.0500 },
  { description: 'La Rochelle, Johannesburg, South Africa', lat: -26.1167, lng: 28.0167 },
  { description: 'Hurlingham, Johannesburg, South Africa', lat: -26.1333, lng: 28.0167 },
  { description: 'Greenside, Johannesburg, South Africa', lat: -26.1500, lng: 28.0167 },
  { description: 'Emmarentia, Johannesburg, South Africa', lat: -26.1500, lng: 28.0000 },
  { description: 'Northcliff, Johannesburg, South Africa', lat: -26.1333, lng: 27.9833 },
  { description: 'Fairland, Johannesburg, South Africa', lat: -26.1167, lng: 27.9500 },
  { description: 'Blackheath, Johannesburg, South Africa', lat: -26.1000, lng: 27.9333 },
  { description: 'Little Falls, Johannesburg, South Africa', lat: -26.0833, lng: 27.9500 },
  { description: 'Weltevreden Park, Johannesburg, South Africa', lat: -26.1167, lng: 27.8667 },
  { description: 'Westdene, Johannesburg, South Africa', lat: -26.1333, lng: 28.0000 },
  { description: 'Westgate, Johannesburg, South Africa', lat: -26.1000, lng: 27.8833 },
  { description: 'Winchester Hills, Johannesburg, South Africa', lat: -26.2833, lng: 27.9167 },
  { description: 'Witbank, Mpumalanga, South Africa', lat: -25.8667, lng: 29.2333 },
  { description: 'Witkoppen, Johannesburg, South Africa', lat: -25.9667, lng: 28.0500 },
  { description: 'Waverley, Johannesburg, South Africa', lat: -26.1833, lng: 28.0667 },
  { description: 'Wendywood, Johannesburg, South Africa', lat: -26.0667, lng: 28.0500 }
];

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  value,
  onChange,
  onLocationSelect,
  onLocationSelected,
  placeholder = "Enter pickup location",
  disabled = false,
  sx = {},
  size = 'large',
  variant = 'standard'
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  
  const {
    ready,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      // Bias towards Johannesburg area
      componentRestrictions: { country: 'za' }, // South Africa only
      locationBias: {
        radius: 100000, // Increased to 100km radius for more suggestions
        center: { lat: -26.2041, lng: 28.0473 }
      },
      // Request more suggestions from Google Places API
      types: ['geocode'], // Focus on addresses for better results
      language: 'en', // English language results
    },
    debounce: 200, // Faster response
    callbackName: 'initMap', // Ensure proper callback handling
    cache: 24 * 60 * 60, // Cache for 24 hours
  });

  // Check if we should use fallback suggestions
  useEffect(() => {
    if (!ready && value.length > 0) {
      // If Google Places isn't ready but user is typing, use fallback temporarily
      setFallbackMode(true);
    } else if (ready && status !== 'OK' && data.length === 0 && value.length > 2) {
      // Only use fallback if Google Places returns no results and we have enough characters
      setFallbackMode(true);
    } else if (ready && status === 'OK' && data.length > 0) {
      // Prioritize Google Places results when available
      setFallbackMode(false);
    } else if (ready && value.length === 0) {
      // Clear fallback mode when input is empty
      setFallbackMode(false);
    }
  }, [ready, status, value, data]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('🔥 handleInput called with:', newValue);
    setValue(newValue);
    onChange(newValue);
    
    // Always ensure focused state when typing
    setIsFocused(true);
    setIsInteracting(true); // Also set interacting to ensure dropdown shows
    console.log('🔥 PlacesAutocomplete: Input changed, setting isFocused=true, isInteracting=true');
  };

  const handleFocus = () => {
    console.log('🔥 handleFocus called - setting isFocused=true');
    setIsFocused(true);
    setIsInteracting(true);
  };

  const handleClick = () => {
    console.log('🔥 handleClick called - setting isFocused=true');
    setIsFocused(true);
    setIsInteracting(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    console.log('🔥 handleBlur called, isInteracting:', isInteracting);
    
    // Don't hide suggestions if user is interacting with them
    if (isInteracting) {
      console.log('🔥 Not blurring - user is interacting');
      return;
    }
    
    // Don't hide suggestions if focus is moving to a suggestion item
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && relatedTarget.closest('[data-suggestion-item]')) {
      console.log('🔥 Not blurring - focus moving to suggestion');
      return;
    }
    
    // Use a longer delay to ensure clicks are processed
    setTimeout(() => {
      if (!isInteracting) {
        setIsFocused(false);
        setIsInteracting(false);
        console.log('🔥 PlacesAutocomplete: Input blurred, hiding suggestions');
      }
    }, 200); // Reduced delay but still allows for clicks
  };

  const handleSelect = async (suggestion: any) => {
    console.log('🔥 handleSelect called with:', suggestion.description);
    
    // Immediately update the input value and hide suggestions
    setValue(suggestion.description, false);
    onChange(suggestion.description);
    clearSuggestions();
    setFallbackMode(false);
    setIsFocused(false);
    setIsInteracting(false);

    if (onLocationSelect) {
      try {
        // Check if this is a fallback suggestion
        if (suggestion.lat && suggestion.lng) {
          // Use coordinates from fallback suggestion
          console.log('🔥 Using fallback coordinates:', suggestion.lat, suggestion.lng);
          onLocationSelect({
            lat: suggestion.lat,
            lng: suggestion.lng,
            address: suggestion.description
          });
        } else {
          // Use Google Places geocoding
          console.log('🔥 Geocoding address:', suggestion.description);
          const results = await getGeocode({ address: suggestion.description });
          const { lat, lng } = await getLatLng(results[0]);
          console.log('🔥 Geocoded coordinates:', lat, lng);
          onLocationSelect({
            lat,
            lng,
            address: suggestion.description
          });
        }
      } catch (error) {
        console.error('Error getting geocode:', error);
        // Still call onLocationSelect with fallback coordinates
        onLocationSelect({
          lat: 0,
          lng: 0,
          address: suggestion.description
        });
      }
    }

    // Call the new callback to trigger login dialog
    if (onLocationSelected) {
      onLocationSelected();
    }
  };

  // Get fallback suggestions that match the input - improved matching logic
  const filteredFallbackSuggestions = fallbackSuggestions.filter(suggestion => {
    const searchTerm = value.toLowerCase().trim();
    const description = suggestion.description.toLowerCase();
    
    // Check if any part of the address matches the search term
    const addressParts = description.split(',').map(part => part.trim());
    
    return searchTerm.length === 0 || addressParts.some(part => 
      part.startsWith(searchTerm) || // Starts with search term
      part.includes(` ${searchTerm}`) || // Word boundary match
      part.includes(`-${searchTerm}`) || // Hyphen boundary match
      (searchTerm.length >= 2 && part.includes(searchTerm)) // Include partial matches for 2+ chars
    );
  }).slice(0, 8); // Limit fallback suggestions

  // Combine Google Places results with fallback suggestions for more results
  const googlePlacesResults = ready && status === 'OK' ? data : [];
  const currentSuggestions = [...googlePlacesResults];
  
  // Add fallback suggestions if we have fewer than 10 results, but keep them separate for typing
  const combinedFallbacks = currentSuggestions.length < 10 && value.length > 0 ? 
    filteredFallbackSuggestions
      .filter(fallback => {
        const fallbackMainName = fallback.description.split(',')[0].toLowerCase().trim();
        // Check if this fallback suggestion is similar to any Google Places result
        return !currentSuggestions.some(google => {
          const googleMainName = google.description.toLowerCase().trim();
          return googleMainName.includes(fallbackMainName) || fallbackMainName.includes(googleMainName.split(',')[0]);
        });
      })
      .slice(0, 10 - currentSuggestions.length) : [];
  
  // For rendering, we'll handle both types in the map function

  // Show suggestions when we have input and any results available
  const showSuggestions = value.length > 0 && (
    (isFocused || isInteracting) && (
      (ready && status === 'OK' && googlePlacesResults.length > 0) || 
      (fallbackMode && filteredFallbackSuggestions.length > 0) ||
      (!ready && filteredFallbackSuggestions.length > 0)
    )
  );
  
  // Debug logging
  console.log('PlacesAutocomplete Debug:', {
    searchTerm: value,
    googlePlacesCount: googlePlacesResults.length,
    filteredFallbacksCount: filteredFallbackSuggestions.length,
    combinedFallbacksCount: combinedFallbacks.length,
    totalSuggestions: currentSuggestions.length + combinedFallbacks.length,
    showSuggestions,
    ready,
    status,
    fallbackSuggestions: value.length > 0 ? filteredFallbackSuggestions.map(f => f.description.split(',')[0]) : []
  });

  // Size configurations
  const sizeConfig = {
    small: {
      fontSize: '0.875rem',
      padding: '10px 16px 6px 16px',
      labelFontSize: '0.75rem',
      borderRadius: 2,
      height: '36px'
    },
    medium: {
      fontSize: '1rem',
      padding: '14px 18px 10px 18px',
      labelFontSize: '0.8rem',
      borderRadius: 2.5,
      height: '50px'
    },
    large: {
      fontSize: '1.1rem',
      padding: '16px 20px 16px 20px',
      labelFontSize: '0.85rem',
      borderRadius: 3,
      height: '56px'
    }
  };

  // Variant configurations
  const variantConfig = {
    standard: {
      background: '#FFFFFF',
      border: isFocused ? '4px solid rgba(139, 69, 255, 1)' : '3px solid rgba(139, 69, 255, 0.9)',
      boxShadow: 'none',
      color: '#1A0B3D',
      fontWeight: 900,
      fontSize: '1.2rem',
      filter: 'contrast(2.5) brightness(1.2)',
    },
    outlined: {
      background: 'transparent',
      border: isFocused ? '2px solid rgba(255, 107, 53, 0.8)' : '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: isFocused ? '0 0 15px rgba(255, 107, 53, 0.2)' : 'none',
    },
    filled: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: isFocused ? '2px solid rgba(255, 107, 53, 0.6)' : 'none',
      boxShadow: isFocused ? '0 0 20px rgba(255, 107, 53, 0.25)' : '0 1px 3px rgba(0, 0, 0, 0.12)',
    },
    transparent: {
      background: 'transparent',
      border: 'none',
      boxShadow: 'none',
    }
  };

  const currentSizeConfig = sizeConfig[size];
  const currentVariantConfig = variantConfig[variant];

  return (
    <Box sx={{ 
      position: 'relative', 
      zIndex: 100, 
      width: '100%',
      isolation: 'isolate',
      ...sx 
    }}>
      {/* Custom floating label input */}
      <Box sx={{
        position: 'relative',
        width: '100%',
        minHeight: variant === 'transparent' ? 'auto' : currentSizeConfig.height,
        background: currentVariantConfig.background,
        borderRadius: currentSizeConfig.borderRadius,
        border: currentVariantConfig.border,
        transition: 'all 0.3s ease',
        boxShadow: currentVariantConfig.boxShadow,
        '&:hover': {
          border: variant === 'transparent' ? 'none' : (variant === 'outlined' ? '1px solid rgba(255, 255, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.25)'),
          background: variant === 'transparent' ? 'transparent' : (variant === 'filled' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)'),
          boxShadow: 'none',
        },
      }}>
        {/* Floating label - hidden for transparent variant */}
        {variant !== 'transparent' && (
          <Typography
            component="span"
            sx={{
              position: 'absolute',
              left: size === 'small' ? 16 : 20,
              top: value.length > 0 || isFocused ? (size === 'small' ? '6px' : '10px') : '50%',
              transform: value.length > 0 || isFocused ? 'translateY(0)' : 'translateY(-50%)',
              fontSize: value.length > 0 || isFocused ? currentSizeConfig.labelFontSize : currentSizeConfig.fontSize,
              color: value.length > 0 || isFocused ? 'rgba(255, 107, 53, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              fontWeight: value.length > 0 || isFocused ? 600 : 500,
              transition: 'all 0.3s ease',
              pointerEvents: 'none',
              zIndex: 2,
              textShadow: 'none',
            }}
          >
            {ready ? placeholder : `${placeholder} (Local suggestions)`}
          </Typography>
        )}
        
        {/* Input field */}
        <input
          type="text"
          id="places-autocomplete-input"
          name="pickup-location"
          value={value}
          onChange={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={handleClick}
          disabled={disabled}
          className={variant === 'transparent' ? 'places-input-transparent' : 'places-input'}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
                         color: variant === 'transparent' ? '#ffffff' : '#1A0B4A',
            fontSize: currentSizeConfig.fontSize,
            padding: currentSizeConfig.padding,
            fontFamily: 'inherit',
            fontWeight: '600',
            letterSpacing: size === 'small' ? '0.25px' : '0.5px',
            minHeight: size === 'small' ? '24px' : size === 'medium' ? '28px' : '32px',
          }}
          placeholder={ready ? placeholder : "Loading location services..."}
        />
      </Box>

                {/* Enhanced Suggestions Dropdown - Traditional Style */}
      {showSuggestions && (
        <Box 
          data-testid="suggestions-dropdown" 
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            width: '100%',
            mt: 1,
            background: 'linear-gradient(135deg, rgba(15, 8, 40, 0.98) 0%, rgba(30, 20, 65, 0.96) 50%, rgba(25, 15, 50, 0.98) 100%)',
            backdropFilter: 'blur(30px) saturate(3.5) contrast(1.8) brightness(1.2)',
            border: '3px solid rgba(139, 69, 255, 0.9)',
            borderRadius: '16px',
            minHeight: '150px',
            maxHeight: '320px',
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingBottom: '8px',
            zIndex: 99999,
            // Ensure clicks work properly
            pointerEvents: 'auto',
            userSelect: 'none',
            // Ensure smooth scrolling
            scrollBehavior: 'smooth',
            // Force scrollbar to be visible when needed
            '&:hover': {
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(139, 69, 255, 0.7)'
              }
            },
            boxShadow: '0 0 100px rgba(139, 69, 255, 0.8), 0 0 50px rgba(255, 107, 53, 0.5), 0 20px 60px rgba(0, 0, 0, 0.6), 0 8px 32px rgba(139, 69, 255, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.2)',
            animation: 'fadeInDropdown 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '@keyframes fadeInDropdown': {
              '0%': {
                opacity: 0,
                transform: 'scale(0.95) translateY(-10px)'
              },
              '100%': {
                opacity: 1,
                transform: 'scale(1) translateY(0)'
              }
            },
            // Enhanced scrollbar styling for better visibility and functionality
            scrollbarWidth: 'auto', // Firefox - use auto for better visibility
            scrollbarColor: 'rgba(139, 69, 255, 0.8) rgba(255, 255, 255, 0.1)', // Firefox
            scrollbarGutter: 'stable', // Prevent layout shift
            '&::-webkit-scrollbar': {
              width: '12px',
              height: '12px',
              display: 'block',
              backgroundColor: 'transparent'
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              margin: '4px 0',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'linear-gradient(180deg, rgba(139, 69, 255, 0.9) 0%, rgba(139, 69, 255, 0.7) 100%)',
              borderRadius: '6px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 2px 8px rgba(139, 69, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              minHeight: '40px', // Ensure minimum thumb size
              '&:hover': {
                background: 'linear-gradient(180deg, rgba(139, 69, 255, 1) 0%, rgba(139, 69, 255, 0.8) 100%)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 3px 12px rgba(139, 69, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                transform: 'scaleX(1.1)'
              },
              '&:active': {
                background: 'rgba(139, 69, 255, 1)',
                transform: 'scaleX(1.2)',
                boxShadow: '0 2px 8px rgba(139, 69, 255, 0.5)'
              }
            },
            '&::-webkit-scrollbar-corner': {
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '6px'
            },
            // Ensure scrollbar is always visible when content overflows
            '&:hover::-webkit-scrollbar-thumb': {
              background: 'linear-gradient(180deg, rgba(139, 69, 255, 1) 0%, rgba(139, 69, 255, 0.8) 100%)'
            }
          }}
        >
          
          {/* Render Google Places suggestions first */}
          {currentSuggestions.map((suggestion, index) => {
            const displayText = (suggestion as any).description;
            console.log('🔥 Rendering suggestion:', index, displayText);

            return (
              <Box
                key={(suggestion as any).place_id || `fallback-${index}-${displayText}`}
                data-suggestion-item="true"
                onMouseEnter={() => {
                  console.log('🔥 Mouse entered suggestion:', suggestion.description);
                  setIsInteracting(true);
                }}
                onMouseLeave={() => {
                  console.log('🔥 Mouse left suggestion:', suggestion.description);
                  setIsInteracting(false);
                }}
                onMouseDown={(e) => {
                  console.log('🔥 MouseDown event fired for suggestion:', suggestion.description);
                  // Prevent blur event when clicking on suggestion
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  console.log('🔥 Click event fired for suggestion:', suggestion.description);
                  console.log('🔥 Event target:', e.target);
                  console.log('🔥 Event currentTarget:', e.currentTarget);
                  // Try without preventDefault first to see if that's blocking it
                  // e.preventDefault();
                  e.stopPropagation();
                  console.log('🔥 Suggestion clicked:', suggestion.description);
                  handleSelect(suggestion);
                  setIsInteracting(false);
                }}
                sx={{
                  p: 1.2,
                  cursor: 'pointer',
                  borderBottom: index < currentSuggestions.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                  borderRadius: index === 0 ? `${currentSizeConfig.borderRadius}px ${currentSizeConfig.borderRadius}px 0 0` :
                             index === currentSuggestions.length - 1 ? `0 0 ${currentSizeConfig.borderRadius}px ${currentSizeConfig.borderRadius}px` : '0',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  // Add a test background to make sure the element is clickable
                  backgroundColor: 'rgba(255, 0, 0, 0.1)', // Red tint for testing
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 107, 53, 0.05), transparent)',
                    transition: 'left 0.3s ease'
                  },
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(139, 69, 255, 0.12) 0%, rgba(139, 69, 255, 0.08) 100%)',
                    transform: 'translateX(2px)',
                    boxShadow: 'inset 2px 0 0 rgba(139, 69, 255, 0.7), 0 2px 8px rgba(139, 69, 255, 0.2)',
                    borderLeft: '2px solid rgba(139, 69, 255, 0.5)',
                    '&::before': {
                      left: '100%'
                    }
                  },
                  '&:active': {
                    transform: 'translateX(2px) scale(0.98)',
                    transition: 'all 0.1s ease'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* Uber-style location icon */}
                  <Box sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, rgba(139, 69, 255, 0.2) 0%, rgba(139, 69, 255, 0.1) 100%)',
                    mr: 1.2,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(139, 69, 255, 0.3)',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(139, 69, 255, 0.1)'
                  }}>
                    <Typography sx={{ 
                      fontSize: '12px',
                      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'
                    }}>📍</Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      component="span"
                      sx={{ 
                        color: '#FFFFFF', 
                        fontWeight: 700,
                        lineHeight: 1.3,
                        fontSize: '0.9rem',
                        display: 'block',
                        mb: 0.1,
                        textAlign: 'left',
                        textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'
                      }}
                    >
                      {displayText.split(',')[0]}
                    </Typography>
                    <Typography 
                      component="span"
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.9)', 
                        fontWeight: 500,
                        lineHeight: 1.2,
                        fontSize: '0.75rem',
                        display: 'block',
                        textAlign: 'left'
                      }}
                    >
                      {displayText.split(',').slice(1).join(',').trim()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}

          {/* Render additional fallback suggestions */}
          {combinedFallbacks.map((suggestion, index) => {
            const displayText = suggestion.description;
            const actualIndex = currentSuggestions.length + index;

            return (
              <Box
                key={`fallback-${index}-${displayText}`}
                data-suggestion-item="true"
                onMouseEnter={() => {
                  console.log('🔥 Mouse entered suggestion:', suggestion.description);
                  setIsInteracting(true);
                }}
                onMouseLeave={() => {
                  console.log('🔥 Mouse left suggestion:', suggestion.description);
                  setIsInteracting(false);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🔥 Fallback suggestion clicked:', suggestion.description);
                  handleSelect(suggestion);
                  setIsInteracting(false);
                }}
                sx={{
                  p: 1.2,
                  cursor: 'pointer',
                  borderBottom: actualIndex < currentSuggestions.length + combinedFallbacks.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                  borderRadius: actualIndex === 0 ? `${currentSizeConfig.borderRadius}px ${currentSizeConfig.borderRadius}px 0 0` :
                             actualIndex === currentSuggestions.length + combinedFallbacks.length - 1 ? `0 0 ${currentSizeConfig.borderRadius}px ${currentSizeConfig.borderRadius}px` : '0',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 107, 53, 0.05), transparent)',
                    transition: 'left 0.3s ease'
                  },
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(139, 69, 255, 0.12) 0%, rgba(139, 69, 255, 0.08) 100%)',
                    transform: 'translateX(2px)',
                    boxShadow: 'inset 2px 0 0 rgba(139, 69, 255, 0.7), 0 2px 8px rgba(139, 69, 255, 0.2)',
                    borderLeft: '2px solid rgba(139, 69, 255, 0.5)',
                    '&::before': {
                      left: '100%'
                    }
                  },
                  '&:active': {
                    transform: 'translateX(2px) scale(0.98)',
                    transition: 'all 0.1s ease'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, rgba(139, 69, 255, 0.2) 0%, rgba(139, 69, 255, 0.1) 100%)',
                    mr: 1.2,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(139, 69, 255, 0.3)',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(139, 69, 255, 0.1)'
                  }}>
                    <Typography sx={{ 
                      fontSize: '12px',
                      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'
                    }}>📍</Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      component="span"
                      sx={{ 
                        color: '#FFFFFF', 
                        fontWeight: 700,
                        lineHeight: 1.3,
                        fontSize: '0.9rem',
                        display: 'block',
                        mb: 0.1,
                        textAlign: 'left',
                        textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'
                      }}
                    >
                      {displayText.split(',')[0]}
                    </Typography>
                    <Typography 
                      component="span"
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.9)', 
                        fontWeight: 500,
                        lineHeight: 1.2,
                        fontSize: '0.75rem',
                        display: 'block',
                        textAlign: 'left'
                      }}
                    >
                      {displayText.split(',').slice(1).join(',').trim()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export { PlacesAutocomplete };
