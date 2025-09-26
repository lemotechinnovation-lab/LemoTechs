import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  Animated
} from 'react-native';
import { COLORS, ANIMATION_DURATION } from '../constants/app';

// Define button variants matching frontend
export type ButtonVariant = 
  | 'primary'          // Main CTA buttons (orange gradient)
  | 'secondary'        // Secondary actions (white/transparent)
  | 'ghost'           // Minimal buttons (text only)
  | 'danger'          // Delete/cancel actions (red)
  | 'success'         // Confirm/complete actions (green)
  | 'icon'            // Icon-only buttons
  | 'tab'             // Navigation tab buttons
  | 'floating'        // Floating action buttons

// Define button sizes
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface LemoButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  animated?: boolean;
  children?: React.ReactNode;
}

// Size configurations matching frontend
const sizeConfig = {
  xs: {
    fontSize: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    height: 32,
    iconSize: 16,
    borderRadius: 8
  },
  sm: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
    height: 36,
    iconSize: 18,
    borderRadius: 10
  },
  md: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    height: 44,
    iconSize: 20,
    borderRadius: 12
  },
  lg: {
    fontSize: 18,
    paddingVertical: 16,
    paddingHorizontal: 32,
    height: 52,
    iconSize: 24,
    borderRadius: 14
  },
  xl: {
    fontSize: 20,
    paddingVertical: 20,
    paddingHorizontal: 40,
    height: 60,
    iconSize: 28,
    borderRadius: 16
  }
};

// Variant configurations matching frontend
const getVariantStyles = (variant: ButtonVariant, size: ButtonSize) => {
  const config = sizeConfig[size];
  
  const baseStyles: ViewStyle = {
    height: config.height,
    borderRadius: config.borderRadius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: config.paddingVertical,
    paddingHorizontal: config.paddingHorizontal,
  };

  const baseTextStyles: TextStyle = {
    fontSize: config.fontSize,
    fontWeight: '600',
    textAlign: 'center',
  };

  switch (variant) {
    case 'primary':
      return {
        container: {
          ...baseStyles,
          backgroundColor: COLORS.primary,
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        },
        text: {
          ...baseTextStyles,
          color: COLORS.white,
        }
      };

    case 'secondary':
      return {
        container: {
          ...baseStyles,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        text: {
          ...baseTextStyles,
          color: 'rgba(255, 255, 255, 0.9)',
        }
      };

    case 'ghost':
      return {
        container: {
          ...baseStyles,
          backgroundColor: 'transparent',
        },
        text: {
          ...baseTextStyles,
          color: 'rgba(255, 255, 255, 0.8)',
        }
      };

    case 'danger':
      return {
        container: {
          ...baseStyles,
          backgroundColor: COLORS.error,
          shadowColor: COLORS.error,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        },
        text: {
          ...baseTextStyles,
          color: COLORS.white,
        }
      };

    case 'success':
      return {
        container: {
          ...baseStyles,
          backgroundColor: COLORS.success,
          shadowColor: COLORS.success,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        },
        text: {
          ...baseTextStyles,
          color: COLORS.white,
        }
      };

    case 'icon':
      return {
        container: {
          ...baseStyles,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.2)',
          width: config.height,
          height: config.height,
          paddingVertical: 0,
          paddingHorizontal: 0,
        },
        text: {
          ...baseTextStyles,
          color: 'rgba(255, 255, 255, 0.8)',
        }
      };

    case 'tab':
      return {
        container: {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderRadius: 8,
        },
        text: {
          ...baseTextStyles,
          color: 'rgba(255, 255, 255, 0.7)',
        }
      };

    case 'floating':
      return {
        container: {
          ...baseStyles,
          backgroundColor: COLORS.primary,
          borderRadius: config.height / 2,
          width: config.height,
          height: config.height,
          paddingVertical: 0,
          paddingHorizontal: 0,
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 8,
        },
        text: {
          ...baseTextStyles,
          color: COLORS.white,
        }
      };

    default:
      return {
        container: baseStyles,
        text: baseTextStyles
      };
  }
};

export const LemoButton: React.FC<LemoButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  isLoading = false,
  fullWidth = false,
  animated = true,
  children,
  style,
  ...props
}) => {
  const config = sizeConfig[size];
  const variantStyles = getVariantStyles(variant, size);
  const [scaleValue] = React.useState(new Animated.Value(1));

  const handlePressIn = () => {
    if (animated) {
      Animated.spring(scaleValue, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (animated) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }
  };

  const buttonStyle: ViewStyle = {
    ...variantStyles.container,
    width: fullWidth ? '100%' : undefined,
    opacity: props.disabled ? 0.5 : 1,
  };

  const ButtonComponent = animated ? Animated.createAnimatedComponent(TouchableOpacity) : TouchableOpacity;

  return (
    <ButtonComponent
      style={[
        buttonStyle,
        animated && { transform: [{ scale: scaleValue }] },
        style
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={animated ? 1 : 0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variantStyles.text.color}
        />
      ) : (
        <>
          {icon && (
            <View style={{ marginRight: children ? 8 : 0 }}>
              {icon}
            </View>
          )}
          {children && (
            <Text style={variantStyles.text}>
              {children}
            </Text>
          )}
        </>
      )}
    </ButtonComponent>
  );
};

// Preset button components for common use cases
export const PrimaryButton: React.FC<Omit<LemoButtonProps, 'variant'>> = (props) => (
  <LemoButton variant="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<LemoButtonProps, 'variant'>> = (props) => (
  <LemoButton variant="secondary" {...props} />
);

export const IconButton: React.FC<Omit<LemoButtonProps, 'variant'>> = (props) => (
  <LemoButton variant="icon" {...props} />
);

export const TabButton: React.FC<Omit<LemoButtonProps, 'variant'>> = (props) => (
  <LemoButton variant="tab" {...props} />
);

export const FloatingButton: React.FC<Omit<LemoButtonProps, 'variant'>> = (props) => (
  <LemoButton variant="floating" {...props} />
);


