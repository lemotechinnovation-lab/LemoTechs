import React, { useState } from 'react';
import { Box, InputBase } from '@mui/material';
import { styled } from '@mui/material/styles';

interface CompactSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'underlined';
  icon?: React.ReactNode;
  sx?: any;
  onSubmit?: () => void;
}

const StyledInputBase = styled(InputBase)(() => ({
  '& .MuiInputBase-input': {
    transition: 'all 0.3s ease',
  },
}));

const CompactSearchField: React.FC<CompactSearchFieldProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  disabled = false,
  size = 'medium',
  variant = 'outlined',
  icon,
  sx = {},
  onSubmit
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const sizeConfig = {
    small: {
      height: '32px',
      fontSize: '0.875rem',
      padding: '8px 12px',
      iconSize: 16,
    },
    medium: {
      height: '40px',
      fontSize: '1rem',
      padding: '10px 16px',
      iconSize: 20,
    }
  };

  const variantConfig = {
    outlined: {
      background: 'transparent',
      border: isFocused ? '2px solid rgba(255, 107, 53, 0.8)' : '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: 2,
      boxShadow: isFocused ? '0 0 15px rgba(255, 107, 53, 0.2)' : 'none',
    },
    filled: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: isFocused ? '2px solid rgba(255, 107, 53, 0.6)' : 'none',
      borderRadius: 2,
      boxShadow: isFocused ? '0 0 20px rgba(255, 107, 53, 0.25)' : '0 1px 3px rgba(0, 0, 0, 0.12)',
    },
    underlined: {
      background: 'transparent',
      border: 'none',
      borderBottom: isFocused ? '2px solid rgba(255, 107, 53, 0.8)' : '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: 0,
      boxShadow: 'none',
    }
  };

  const currentSizeConfig = sizeConfig[size];
  const currentVariantConfig = variantConfig[variant];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  };

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100%',
      ...sx 
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        height: currentSizeConfig.height,
        background: currentVariantConfig.background,
        border: currentVariantConfig.border,
        borderRadius: currentVariantConfig.borderRadius,
        boxShadow: currentVariantConfig.boxShadow,
        transition: 'all 0.3s ease',
        '&:hover': {
          border: variant === 'outlined' ? '1px solid rgba(255, 255, 255, 0.5)' : currentVariantConfig.border,
          background: variant === 'filled' ? 'rgba(255, 255, 255, 0.15)' : currentVariantConfig.background,
        },
      }}>
        {icon && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ml: 1.5,
            mr: 1,
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: currentSizeConfig.iconSize,
            '& svg': {
              fontSize: currentSizeConfig.iconSize,
            }
          }}>
            {icon}
          </Box>
        )}
        
        <StyledInputBase
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          sx={{
            flex: 1,
            color: 'rgba(255, 255, 255, 0.95)',
            fontSize: currentSizeConfig.fontSize,
            fontWeight: 500,
            px: icon ? 0 : 2,
            py: 0,
            '& .MuiInputBase-input': {
              padding: icon ? '0 16px 0 0' : currentSizeConfig.padding,
              height: 'auto',
              color: 'rgba(255, 255, 255, 0.95)',
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.6)',
                opacity: 1,
              },
              '&:focus': {
                color: 'rgba(255, 255, 255, 1)',
              }
            }
          }}
        />
      </Box>
    </Box>
  );
};

export { CompactSearchField };
