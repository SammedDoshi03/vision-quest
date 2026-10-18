import { useRef, useCallback, useEffect } from 'react';
import { Animated } from 'react-native';

/**
 * Micro-interaction press animation (scale down on touch, spring back on release).
 */
export function useScalePressAnimation(pressedScale = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: pressedScale,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scale, pressedScale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  }, [scale]);

  return {
    scaleStyle: { transform: [{ scale }] },
    onPressIn,
    onPressOut,
  };
}

/**
 * Native-driven fade in/out animation hook.
 */
export function useFadeAnimation(visible: boolean, durationMs = 250) {
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: durationMs,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity, durationMs]);

  return {
    fadeStyle: { opacity },
  };
}

/**
 * Native-driven slide up/down animation hook.
 */
export function useSlideAnimation(visible: boolean, distance = 40, durationMs = 300) {
  const translateY = useRef(new Animated.Value(visible ? 0 : distance)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : distance,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, [visible, translateY, distance]);

  return {
    slideStyle: { transform: [{ translateY }] },
  };
}
