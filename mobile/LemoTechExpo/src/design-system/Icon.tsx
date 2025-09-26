import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Animated
} from 'react-native';
import { COLORS } from '../constants/app';

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
  children: React.ReactNode;
  size?: IconSize;
  variant?: IconVariant;
  animated?: boolean;
  style?: ViewStyle;
  onPress?: () => void;
}

// Size configurations matching frontend
const sizeConfig: Record<IconSize, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48
};

// Variant color configurations matching frontend
const getVariantStyles = (variant: IconVariant) => {
  switch (variant) {
    case 'primary':
      return {
        color: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
      };
    case 'success':
      return {
        color: COLORS.success,
        shadowColor: COLORS.success,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
      };
    case 'warning':
      return {
        color: COLORS.warning,
        shadowColor: COLORS.warning,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
      };
    case 'danger':
      return {
        color: COLORS.error,
        shadowColor: COLORS.error,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
      };
    case 'muted':
      return {
        color: 'rgba(255, 255, 255, 0.5)',
      };
    default:
      return {
        color: 'rgba(255, 255, 255, 0.9)',
      };
  }
};

export const LemoIcon: React.FC<LemoIconProps> = ({
  children,
  size = 'md',
  variant = 'default',
  animated = false,
  style,
  onPress
}) => {
  const sizeValue = sizeConfig[size];
  const variantStyles = getVariantStyles(variant);
  const [scaleValue] = React.useState(new Animated.Value(1));

  const handlePressIn = () => {
    if (animated && onPress) {
      Animated.spring(scaleValue, {
        toValue: 1.1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (animated && onPress) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }
  };

  const iconStyle: ViewStyle = {
    width: sizeValue,
    height: sizeValue,
    alignItems: 'center',
    justifyContent: 'center',
    ...variantStyles,
  };

  const textStyle: TextStyle = {
    fontSize: sizeValue,
    color: variantStyles.color,
  };

  const IconComponent = animated ? Animated.createAnimatedComponent(View) : View;
  const TouchComponent = onPress ? TouchableOpacity : View;

  const iconContent = (
    <IconComponent
      style={[
        iconStyle,
        animated && onPress && { transform: [{ scale: scaleValue }] },
        style
      ]}
    >
      <Text style={textStyle}>{children}</Text>
    </IconComponent>
  );

  if (onPress) {
    return (
      <TouchComponent
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={animated ? 1 : 0.7}
      >
        {iconContent}
      </TouchComponent>
    );
  }

  return iconContent;
};

// Common icon components with semantic names matching frontend
export const LocationIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>📍</LemoIcon>
);

export const ArrowIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>→</LemoIcon>
);

export const PhoneIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>📞</LemoIcon>
);

export const ProfileIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>👤</LemoIcon>
);

export const CarIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>🚗</LemoIcon>
);

export const CleanIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>🧹</LemoIcon>
);

export const DeliveryIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>📦</LemoIcon>
);

export const HomeIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>🏠</LemoIcon>
);

export const CheckIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>✓</LemoIcon>
);

export const CloseIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>✕</LemoIcon>
);

export const LoadingIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon animated {...props}>⟳</LemoIcon>
);

export const StarIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>⭐</LemoIcon>
);

export const HeartIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>❤️</LemoIcon>
);

export const FireIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>🔥</LemoIcon>
);

export const SparkleIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>✨</LemoIcon>
);

export const RocketIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>🚀</LemoIcon>
);

export const LemonIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>🍋</LemoIcon>
);

export const BackIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>←</LemoIcon>
);

export const ForwardIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>→</LemoIcon>
);

export const MenuIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>☰</LemoIcon>
);

export const SearchIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>🔍</LemoIcon>
);

export const NotificationIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>🔔</LemoIcon>
);

export const SettingsIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>⚙️</LemoIcon>
);

export const CalendarIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>📅</LemoIcon>
);

export const ClockIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>🕐</LemoIcon>
);

export const MoneyIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>💰</LemoIcon>
);

export const CardIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>💳</LemoIcon>
);

export const CashIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>💵</LemoIcon>
);

export const MobileIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>📱</LemoIcon>
);

export const PlusIcon: React.FC<Omit<LemoIconProps, 'children'>> = (props) => (
  <LemoIcon {...props}>+</LemoIcon>
);


