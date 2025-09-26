import { Box, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

// Define icon sizes
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// Define icon variants
export type IconVariant = 
  | 'default'    // Standard icon
  | 'primary'    // LemoTech primary colors
  | 'success'    // Green tones
  | 'warning'    // Yellow/orange tones
  | 'danger'     // Red tones
  | 'muted'      // Low contrast

interface LemoIconProps {
  children: ReactNode;
  size?: IconSize;
  variant?: IconVariant;
  animated?: boolean;
  sx?: SxProps<Theme>;
  onClick?: () => void;
}

// Size configurations
const sizeConfig: Record<IconSize, string> = {
  xs: '16px',
  sm: '20px', 
  md: '24px',
  lg: '32px',
  xl: '40px',
  xxl: '48px'
};

// Variant color configurations
const getVariantStyles = (variant: IconVariant) => {
  switch (variant) {
    case 'primary':
      return {
        color: '#FF6B35',
        filter: 'drop-shadow(0 2px 4px rgba(255,107,53,0.3))'
      };
    case 'success':
      return {
        color: '#4caf50',
        filter: 'drop-shadow(0 2px 4px rgba(76,175,80,0.3))'
      };
    case 'warning':
      return {
        color: '#FFD700',
        filter: 'drop-shadow(0 2px 4px rgba(255,215,0,0.3))'
      };
    case 'danger':
      return {
        color: '#f44336',
        filter: 'drop-shadow(0 2px 4px rgba(244,67,54,0.3))'
      };
    case 'muted':
      return {
        color: 'rgba(255,255,255,0.5)'
      };
    default:
      return {
        color: 'rgba(255,255,255,0.9)'
      };
  }
};

export const LemoIcon = ({ 
  children, 
  size = 'md', 
  variant = 'default',
  animated = false,
  sx = {},
  onClick 
}: LemoIconProps) => {
  const sizeValue = sizeConfig[size];
  const variantStyles = getVariantStyles(variant);

  return (
    <Box
      onClick={onClick}
      sx={{
        fontSize: sizeValue,
        width: sizeValue,
        height: sizeValue,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: animated ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        '&:hover': onClick ? {
          transform: animated ? 'scale(1.1)' : 'none',
          filter: 'brightness(1.2)'
        } : {},
        ...variantStyles,
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

// Common icon components with semantic names
export const LocationIcon = (props: Omit<LemoIconProps, 'children'>) => (
  <LemoIcon {...props}>📍</LemoIcon>
);

export const ArrowIcon = (props: Omit<LemoIconProps, 'children'>) => (
  <LemoIcon {...props}>→</LemoIcon>
);

export const PhoneIcon = (props: Omit<LemoIconProps, 'children'>) => (
  <LemoIcon {...props}>📞</LemoIcon>
);

export const ProfileIcon = (props: Omit<LemoIconProps, 'children'>) => (
  <LemoIcon {...props}>👤</LemoIcon>
);

export const CarIcon = (props: Omit<LemoIconProps, 'children'>) => (
  <LemoIcon {...props}>🚗</LemoIcon>
);

export const CleanIcon = (props: Omit<LemoIconProps, 'children'>) => (
  <LemoIcon {...props}>🧹</LemoIcon>
);

export const DeliveryIcon = (props: Omit<LemoIconProps, 'children'>) => (
  <LemoIcon {...props}>📦</LemoIcon>
);

export const HomeIcon = (props: Omit<LemoIconProps, 'children'>) => (
  <LemoIcon {...props}>🏠</LemoIcon>
);

export const CheckIcon = (props: Omit<LemoIconProps, 'children'>) => (
  <LemoIcon {...props}>✓</LemoIcon>
);

export const CloseIcon = (props: Omit<LemoIconProps, 'children'>) => (
  <LemoIcon {...props}>✕</LemoIcon>
);

export const LoadingIcon = (props: Omit<LemoIconProps, 'children'>) => (
  <LemoIcon animated {...props}>⟳</LemoIcon>
);

export const StarIcon = (props: Omit<LemoIconProps, 'children'>) => (
  <LemoIcon {...props}>⭐</LemoIcon>
);

export const HeartIcon = (props: Omit<LemoIconProps, 'children'>) => (
  <LemoIcon {...props}>❤️</LemoIcon>
);

export const FireIcon = (props: Omit<LemoIconProps, 'children'>) => (
  <LemoIcon {...props}>🔥</LemoIcon>
);

export const SparkleIcon = (props: Omit<LemoIconProps, 'children'>) => (
  <LemoIcon {...props}>✨</LemoIcon>
);

export const RocketIcon = (props: Omit<LemoIconProps, 'children'>) => (
  <LemoIcon {...props}>🚀</LemoIcon>
);
