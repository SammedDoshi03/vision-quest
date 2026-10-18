import { useEffect, useRef, type RefObject } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

export type FocusableTarget = Parameters<typeof AccessibilityInfo.sendAccessibilityEvent>[0];

export function useAutoFocus<T extends FocusableTarget = FocusableTarget>(
  active: boolean,
  delayMs = 350
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => {
      if (ref.current && AccessibilityInfo?.sendAccessibilityEvent) {
        AccessibilityInfo.sendAccessibilityEvent(ref.current, 'focus');
      }
    }, delayMs);
    return () => clearTimeout(timer);
  }, [active, delayMs]);

  return ref;
}

export function useFocusRestore(
  visible: boolean,
  returnFocusRef?: RefObject<FocusableTarget | null>,
  delayMs = 250
) {
  const wasVisible = useRef(visible);

  useEffect(() => {
    const isClosing = wasVisible.current && !visible;
    wasVisible.current = visible;
    const target = returnFocusRef?.current;

    if (!isClosing || !target) return;

    const timer = setTimeout(() => {
      if (AccessibilityInfo?.sendAccessibilityEvent) {
        AccessibilityInfo.sendAccessibilityEvent(target, 'focus');
      }
    }, delayMs);

    return () => clearTimeout(timer);
  }, [visible, returnFocusRef, delayMs]);
}

export function announce(message: string, options: { queue?: boolean } = {}) {
  const { queue = true } = options;
  if (!AccessibilityInfo?.announceForAccessibility) return;

  if (Platform.OS === 'ios' && AccessibilityInfo.announceForAccessibilityWithOptions) {
    AccessibilityInfo.announceForAccessibilityWithOptions(message, { queue });
  } else {
    AccessibilityInfo.announceForAccessibility(message);
  }
}
