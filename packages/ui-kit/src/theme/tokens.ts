export interface ThemeTokens {
  colors: {
    background: string;
    surface: string;
    surfaceElevated: string;
    surfaceCard: string;
    scrim: string;
    primary: string;
    primaryForeground: string;
    accent: string;
    accentForeground: string;
    gold: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    borderSubtle: string;
    borderStrong: string;
    error: string;
    success: string;
  };
  space: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radii: {
    sm: number;
    md: number;
    lg: number;
    full: number;
  };
  typography: {
    title1: { fontSize: number; lineHeight: number; fontWeight: '700' };
    title2: { fontSize: number; lineHeight: number; fontWeight: '700' };
    title3: { fontSize: number; lineHeight: number; fontWeight: '600' };
    body: { fontSize: number; lineHeight: number; fontWeight: '400' };
    callout: { fontSize: number; lineHeight: number; fontWeight: '500' };
    caption: { fontSize: number; lineHeight: number; fontWeight: '400' };
  };
}

export const darkTheme: ThemeTokens = {
  colors: {
    background: '#0B0C10',
    surface: '#15161E',
    surfaceElevated: '#1F202B',
    surfaceCard: '#1A1B24',
    scrim: 'rgba(5, 5, 8, 0.72)',
    primary: '#E05638', // warm ember terracotta
    primaryForeground: '#FFFFFF',
    accent: '#8B5CF6', // violet resonance
    accentForeground: '#FFFFFF',
    gold: '#F5A623',
    textPrimary: '#F5F5F7',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
    borderSubtle: 'rgba(255, 255, 255, 0.08)',
    borderStrong: 'rgba(255, 255, 255, 0.18)',
    error: '#EF4444',
    success: '#10B981',
  },
  space: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radii: {
    sm: 8,
    md: 14,
    lg: 24,
    full: 9999,
  },
  typography: {
    title1: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
    title2: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
    title3: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
    body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
    callout: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
    caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  },
};
