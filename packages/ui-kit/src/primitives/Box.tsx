import React, { forwardRef } from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';

export interface BoxProps extends ViewProps {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export const Box = forwardRef<View, BoxProps>(function Box(
  { children, style, ...rest },
  ref
) {
  return (
    <View ref={ref} style={style} {...rest}>
      {children}
    </View>
  );
});
