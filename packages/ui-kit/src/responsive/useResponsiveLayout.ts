import { useWindowDimensions } from 'react-native';

export type DeviceType = 'phone' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

export interface ResponsiveLayout {
  width: number;
  height: number;
  orientation: Orientation;
  deviceType: DeviceType;
  isTablet: boolean;
  isLandscape: boolean;
  columns: number;
  contentMaxWidth: number;
  gutter: number;
}

export function useResponsiveLayout(): ResponsiveLayout {
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;
  const orientation: Orientation = isLandscape ? 'landscape' : 'portrait';

  let deviceType: DeviceType = 'phone';
  if (width >= 1024) {
    deviceType = 'desktop';
  } else if (width >= 768 || (isLandscape && width >= 640)) {
    deviceType = 'tablet';
  }

  const isTablet = deviceType === 'tablet' || deviceType === 'desktop';

  let columns = 1;
  if (width >= 1024) {
    columns = 3;
  } else if (width >= 768 || isLandscape) {
    columns = 2;
  }

  return {
    width,
    height,
    orientation,
    deviceType,
    isTablet,
    isLandscape,
    columns,
    contentMaxWidth: isTablet ? 1100 : width,
    gutter: isTablet ? 24 : 16,
  };
}
