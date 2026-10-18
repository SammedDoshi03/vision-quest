import { useEffect } from 'react';
import { BackHandler } from 'react-native';

/**
 * Custom hook to intercept Android hardware back press gestures.
 *
 * @param handler Function returning `true` to block default back navigation (e.g. to close a modal or drawer),
 *                or `false` to let default navigation proceed.
 * @param enabled Whether the hardware back listener is actively listening.
 */
export function useHardwareBackHandler(handler: () => boolean, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return undefined;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      return handler();
    });

    return () => {
      subscription.remove();
    };
  }, [handler, enabled]);
}
