import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from './index';
import { useResponsiveLayout } from '../responsive';

export interface GlobalStylesResult {
  // Layout containers
  rootContainer: ViewStyle;
  centerContainer: ViewStyle;
  rowContainer: ViewStyle;
  spaceBetweenRow: ViewStyle;
  cardContainer: ViewStyle;
  elevatedCard: ViewStyle;
  
  // Responsive content constraints
  responsiveContent: ViewStyle;
  
  // Typography helpers
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  bodyText: TextStyle;
  captionText: TextStyle;
  mutedText: TextStyle;
  
  // Spacing & Dividers
  divider: ViewStyle;
  badge: ViewStyle;
  badgeText: TextStyle;
}

export function useGlobalStyles(): GlobalStylesResult {
  const theme = useTheme();
  const { contentMaxWidth, gutter, isTablet } = useResponsiveLayout();

  return StyleSheet.create({
    rootContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      padding: gutter,
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.space.sm,
    },
    spaceBetweenRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.space.xs,
    },
    cardContainer: {
      backgroundColor: theme.colors.surfaceCard,
      borderRadius: theme.radii.md,
      padding: theme.space.md,
      marginBottom: theme.space.sm,
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
    },
    elevatedCard: {
      backgroundColor: theme.colors.surfaceElevated,
      borderRadius: theme.radii.md,
      padding: theme.space.md,
      marginBottom: theme.space.md,
      borderWidth: 1,
      borderColor: theme.colors.borderStrong,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    responsiveContent: {
      width: '100%',
      maxWidth: isTablet ? contentMaxWidth : undefined,
      alignSelf: 'center',
      paddingHorizontal: gutter,
    },
    h1: {
      fontSize: theme.typography.title1.fontSize,
      lineHeight: theme.typography.title1.lineHeight,
      fontWeight: theme.typography.title1.fontWeight,
      color: theme.colors.textPrimary,
    },
    h2: {
      fontSize: theme.typography.title2.fontSize,
      lineHeight: theme.typography.title2.lineHeight,
      fontWeight: theme.typography.title2.fontWeight,
      color: theme.colors.textPrimary,
    },
    h3: {
      fontSize: theme.typography.title3.fontSize,
      lineHeight: theme.typography.title3.lineHeight,
      fontWeight: theme.typography.title3.fontWeight,
      color: theme.colors.textPrimary,
    },
    bodyText: {
      fontSize: theme.typography.body.fontSize,
      lineHeight: theme.typography.body.lineHeight,
      color: theme.colors.textPrimary,
    },
    captionText: {
      fontSize: theme.typography.caption.fontSize,
      lineHeight: theme.typography.caption.lineHeight,
      color: theme.colors.textSecondary,
    },
    mutedText: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textMuted,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.borderSubtle,
      marginVertical: theme.space.sm,
    },
    badge: {
      backgroundColor: theme.colors.surfaceElevated,
      paddingHorizontal: theme.space.sm,
      paddingVertical: theme.space.xs,
      borderRadius: theme.radii.sm,
      alignSelf: 'flex-start',
    },
    badgeText: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: '700',
      color: theme.colors.primary,
    },
  });
}
