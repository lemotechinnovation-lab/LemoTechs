import { Box, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

// Define spacing scales
export type SpacingScale = 
  | 'none'     // 0
  | 'xs'       // 4px
  | 'sm'       // 8px  
  | 'md'       // 16px
  | 'lg'       // 24px
  | 'xl'       // 32px
  | 'xxl'      // 48px
  | 'xxxl';    // 64px

// Define container sizes
export type ContainerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

// Define flex alignment options
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

interface StackProps {
  children: ReactNode;
  direction?: 'row' | 'column';
  spacing?: SpacingScale;
  align?: FlexAlign;
  justify?: FlexJustify;
  wrap?: boolean;
  sx?: SxProps<Theme>;
}

interface LemoContainerProps {
  children: ReactNode;
  size?: ContainerSize;
  center?: boolean;
  sx?: SxProps<Theme>;
}

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'outlined';
  padding?: SpacingScale;
  sx?: SxProps<Theme>;
}

// Spacing configurations
const spacingConfig: Record<SpacingScale, number> = {
  none: 0,
  xs: 0.5,   // 4px
  sm: 1,     // 8px
  md: 2,     // 16px
  lg: 3,     // 24px
  xl: 4,     // 32px
  xxl: 6,    // 48px
  xxxl: 8    // 64px
};

// Container size configurations
const containerConfig: Record<ContainerSize, string | number> = {
  xs: '400px',
  sm: '600px', 
  md: '800px',
  lg: '1200px',
  xl: '1400px',
  full: '100%'
};

// Flex alignment mappings
const alignmentMap: Record<FlexAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline'
};

const justifyMap: Record<FlexJustify, string> = {
  start: 'flex-start',
  center: 'center', 
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly'
};

// Stack component for consistent spacing and alignment
export const Stack = ({ 
  children, 
  direction = 'column', 
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  sx = {} 
}: StackProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: direction,
        alignItems: alignmentMap[align],
        justifyContent: justifyMap[justify],
        flexWrap: wrap ? 'wrap' : 'nowrap',
        gap: spacingConfig[spacing],
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

// Container component for consistent max-widths
export const LemoContainer = ({ 
  children, 
  size = 'lg', 
  center = true,
  sx = {} 
}: LemoContainerProps) => {
  return (
    <Box
      sx={{
        maxWidth: containerConfig[size],
        width: '100%',
        margin: center ? '0 auto' : '0',
        padding: { xs: 2, md: 3 },
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

// Card component with different variants
export const Card = ({ 
  children, 
  variant = 'default',
  padding = 'lg',
  sx = {} 
}: CardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return {
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        };
      case 'elevated':
        return {
          background: 'rgba(26, 16, 64, 0.9)',
          borderRadius: '16px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.1)'
        };
      case 'outlined':
        return {
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '12px'
        };
      default:
        return {
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)'
        };
    }
  };

  return (
    <Box
      sx={{
        padding: spacingConfig[padding],
        ...getVariantStyles(),
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

// Grid component for responsive layouts
interface GridProps {
  children: ReactNode;
  columns?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  spacing?: SpacingScale;
  sx?: SxProps<Theme>;
}

export const Grid = ({ 
  children, 
  columns = { xs: 1, md: 2, lg: 3 },
  spacing = 'md',
  sx = {} 
}: GridProps) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: `repeat(${columns.xs || 1}, 1fr)`,
          sm: `repeat(${columns.sm || columns.xs || 1}, 1fr)`,
          md: `repeat(${columns.md || columns.sm || columns.xs || 2}, 1fr)`,
          lg: `repeat(${columns.lg || columns.md || columns.sm || 3}, 1fr)`,
          xl: `repeat(${columns.xl || columns.lg || columns.md || 3}, 1fr)`
        },
        gap: spacingConfig[spacing],
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

// Section component for page sections
interface SectionProps {
  children: ReactNode;
  background?: 'transparent' | 'primary' | 'secondary';
  padding?: SpacingScale;
  sx?: SxProps<Theme>;
}

export const Section = ({ 
  children, 
  background = 'transparent',
  padding = 'xl',
  sx = {} 
}: SectionProps) => {
  const getBackgroundStyles = () => {
    switch (background) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, rgba(26, 16, 64, 0.95) 0%, rgba(37, 20, 84, 0.95) 100%)'
        };
      case 'secondary':
        return {
          background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(247,147,30,0.1) 100%)'
        };
      default:
        return {
          background: 'transparent'
        };
    }
  };

  return (
    <Box
      sx={{
        padding: spacingConfig[padding],
        ...getBackgroundStyles(),
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

// Utility components for common spacings
export const Spacer = ({ size = 'md' }: { size?: SpacingScale }) => (
  <Box sx={{ height: spacingConfig[size] * 8 }} />
);

export const Divider = ({ spacing = 'md' }: { spacing?: SpacingScale }) => (
  <Box
    sx={{
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      margin: `${spacingConfig[spacing]}px 0`
    }}
  />
);
