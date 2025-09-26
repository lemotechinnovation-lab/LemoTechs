// Standardized Card Sizing Utilities

export type CardSize = 'small' | 'medium' | 'large' | 'xl';

export interface CardSizeConfig {
  minHeight: number;
  maxHeight: number;
  fixedHeight?: number;
  titleFontSize: string;
  contentPadding: number;
}

// Card size configurations based on title text size
export const CARD_SIZE_CONFIGS: Record<CardSize, CardSizeConfig> = {
  small: {
    minHeight: 180,
    maxHeight: 220,
    fixedHeight: 200,
    titleFontSize: '1.2rem',
    contentPadding: 16,
  },
  medium: {
    minHeight: 240,
    maxHeight: 280,
    fixedHeight: 260,
    titleFontSize: '1.4rem',
    contentPadding: 20,
  },
  large: {
    minHeight: 320,
    maxHeight: 380,
    fixedHeight: 350,
    titleFontSize: '1.6rem',
    contentPadding: 24,
  },
  xl: {
    minHeight: 400,
    maxHeight: 480,
    fixedHeight: 450,
    titleFontSize: '1.8rem',
    contentPadding: 28,
  },
};

// Responsive breakpoints for mobile adjustments
export const MOBILE_CARD_ADJUSTMENTS: Record<CardSize, { minHeight: number; fixedHeight: number }> = {
  small: { minHeight: 160, fixedHeight: 180 },
  medium: { minHeight: 200, fixedHeight: 220 },
  large: { minHeight: 280, fixedHeight: 300 },
  xl: { minHeight: 350, fixedHeight: 380 },
};

/**
 * Get Material-UI sx props for card sizing
 */
export const getCardSxProps = (size: CardSize, fixed: boolean = false, mobile: boolean = false) => {
  const config = CARD_SIZE_CONFIGS[size];
  const mobileConfig = MOBILE_CARD_ADJUSTMENTS[size];
  
  const baseHeight = fixed 
    ? (mobile ? mobileConfig.fixedHeight : config.fixedHeight)
    : (mobile ? mobileConfig.minHeight : config.minHeight);
    
  const maxHeight = fixed 
    ? undefined 
    : (mobile ? mobileConfig.fixedHeight : config.maxHeight);

  return {
    height: fixed ? `${baseHeight}px` : undefined,
    minHeight: !fixed ? `${baseHeight}px` : undefined,
    maxHeight: maxHeight ? `${maxHeight}px` : undefined,
    display: 'flex',
    flexDirection: 'column' as const,
  };
};

/**
 * Get Material-UI sx props for card content
 */
export const getCardContentSxProps = (size: CardSize) => {
  const config = CARD_SIZE_CONFIGS[size];
  
  return {
    p: config.contentPadding / 8, // Convert to Material-UI spacing units
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    flex: 1,
  };
};

/**
 * Get title typography props
 */
export const getCardTitleSxProps = (size: CardSize) => {
  const config = CARD_SIZE_CONFIGS[size];
  
  return {
    fontSize: config.titleFontSize,
    fontWeight: 600,
    mb: 2,
    flexShrink: 0,
  };
};

/**
 * Get card body container props (for content that should grow)
 */
export const getCardBodySxProps = () => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'space-between',
});

/**
 * Get card footer props (for buttons/actions that should stick to bottom)
 */
export const getCardFooterSxProps = () => ({
  mt: 'auto',
  pt: 2,
  flexShrink: 0,
});
