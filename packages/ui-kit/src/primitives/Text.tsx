import React, { forwardRef } from 'react';
import { Text as RNText, type TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export type TextVariant = 'title1' | 'title2' | 'title3' | 'body' | 'callout' | 'caption';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  children?: React.ReactNode;
}

export const Text = forwardRef<RNText, TextProps>(function Text(
  { variant = 'body', color, style, children, ...rest },
  ref
) {
  const theme = useTheme();
  const typographyStyle = theme.typography[variant];
  const textColor = color || theme.colors.textPrimary;

  return (
    <RNText
      ref={ref}
      style={[
        styles.base,
        typographyStyle,
        { color: textColor },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
});

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
