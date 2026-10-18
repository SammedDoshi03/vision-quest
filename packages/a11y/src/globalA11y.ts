import { AccessibilityInfo, Platform, ViewStyle } from 'react-native';

export const MIN_TOUCH_TARGET = {
  AA: 48,   // WCAG 2.1 AA Standard Mobile Touch Target (48x48 dp)
  AAA: 64,  // Elderly & Motor Impairment High-Legibility Target (64x64 dp)
} as const;

/**
 * Triggers a native screen reader voiceover / TalkBack announcement.
 */
export function announceAccessibility(message: string): void {
  if (!message || typeof message !== 'string') return;
  try {
    if (AccessibilityInfo?.announceForAccessibility) {
      AccessibilityInfo.announceForAccessibility(message);
    }
  } catch (err) {
    // Graceful fallback in non-native or testing environments
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      console.log(`[a11y-announcement] ${message}`);
    }
  }
}

/**
 * Validates that an interactive component satisfies WCAG touch target dimensions.
 */
export function checkMinimumTouchTarget(
  width: number,
  height: number,
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  const min = MIN_TOUCH_TARGET[level];
  const isValid = width >= min && height >= min;
  if (!isValid && typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
    console.warn(
      `[a11y-warning] Touch target ${width}x${height}dp is below WCAG ${level} threshold of ${min}x${min}dp.`
    );
  }
  return isValid;
}

/**
 * Returns accessible minimum touch target dimensions style.
 */
export function getA11yTouchTargetStyle(level: 'AA' | 'AAA' = 'AA'): ViewStyle {
  const min = MIN_TOUCH_TARGET[level];
  return {
    minWidth: min,
    minHeight: min,
    justifyContent: 'center',
    alignItems: 'center',
  };
}

/**
 * Hook for voiceover announcements on component state transitions.
 */
export function useAccessibleAnnouncement() {
  return (message: string) => {
    announceAccessibility(message);
  };
}
