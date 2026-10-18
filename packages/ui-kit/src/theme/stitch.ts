/**
 * Google Stitch & Material Design 3 Design System Specification
 * Implements elevation surfaces, tonal palettes, state layers, and shape scales.
 */

export interface StitchElevationLevel {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface StitchElevationLevels {
  level0: StitchElevationLevel;
  level1: StitchElevationLevel;
  level2: StitchElevationLevel;
  level3: StitchElevationLevel;
  level4: StitchElevationLevel;
  level5: StitchElevationLevel;
}

export const stitchElevations: StitchElevationLevels = {
  level0: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  level1: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 1,
  },
  level2: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 3,
  },
  level3: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 10,
    elevation: 6,
  },
  level4: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.24,
    shadowRadius: 14,
    elevation: 8,
  },
  level5: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 12,
  },
};

/**
 * Google Stitch Surface Container Tokens
 */
export const stitchSurfaceTokens = {
  surfaceContainerLowest: '#0A0E1A',
  surfaceContainerLow: '#0F172A',
  surfaceContainer: '#151E32',
  surfaceContainerHigh: '#1E293B',
  surfaceContainerHighest: '#27354E',
  outline: 'rgba(148, 163, 184, 0.25)',
  outlineVariant: 'rgba(148, 163, 184, 0.12)',
  glassBackground: 'rgba(15, 23, 42, 0.78)',
  glassBorder: 'rgba(255, 255, 255, 0.10)',
};

/**
 * Google Stitch State Layer Opacities
 */
export const stitchStateLayers = {
  hover: 0.08,
  focus: 0.12,
  press: 0.16,
  drag: 0.20,
};

/**
 * Google Stitch Shape Scales (Material You rounded curves)
 */
export const stitchShapes = {
  none: 0,
  extraSmall: 4,
  small: 8,
  medium: 12,
  large: 16,
  extraLarge: 28,
  full: 9999,
};
