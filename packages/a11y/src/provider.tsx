import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, Platform, View, useWindowDimensions } from 'react-native';

export const LARGE_TEXT_THRESHOLD = 1.3;

export interface A11yPreferences {
  screenReaderEnabled: boolean;
  reduceMotionEnabled: boolean;
  boldTextEnabled: boolean;
  fontScale: number;
  isLargeText: boolean;
}

interface A11yContextValue extends A11yPreferences {
  modalDepth: number;
  pushModal: () => () => void;
}

const A11yContext = createContext<A11yContextValue | null>(null);

export function A11yProvider({ children }: { children: React.ReactNode }) {
  const { fontScale = 1 } = useWindowDimensions();
  const [screenReaderEnabled, setSR] = useState(false);
  const [reduceMotionEnabled, setRM] = useState(false);
  const [boldTextEnabled, setBold] = useState(false);
  const [modalDepth, setModalDepth] = useState(0);

  useEffect(() => {
    if (AccessibilityInfo?.isScreenReaderEnabled) {
      AccessibilityInfo.isScreenReaderEnabled().then(setSR).catch(() => {});
    }
    if (AccessibilityInfo?.isReduceMotionEnabled) {
      AccessibilityInfo.isReduceMotionEnabled().then(setRM).catch(() => {});
    }

    const srSub = AccessibilityInfo?.addEventListener?.('screenReaderChanged', setSR);
    const rmSub = AccessibilityInfo?.addEventListener?.('reduceMotionChanged', setRM);

    let boldSub: { remove: () => void } | undefined;
    if (Platform.OS === 'ios' && AccessibilityInfo?.isBoldTextEnabled) {
      AccessibilityInfo.isBoldTextEnabled().then(setBold).catch(() => {});
      boldSub = AccessibilityInfo.addEventListener?.('boldTextChanged', setBold);
    }

    return () => {
      srSub?.remove?.();
      rmSub?.remove?.();
      boldSub?.remove?.();
    };
  }, []);

  const pushModal = useCallback(() => {
    setModalDepth((d) => d + 1);
    return () => setModalDepth((d) => Math.max(0, d - 1));
  }, []);

  const value = useMemo<A11yContextValue>(
    () => ({
      screenReaderEnabled,
      reduceMotionEnabled,
      boldTextEnabled,
      fontScale,
      isLargeText: fontScale >= LARGE_TEXT_THRESHOLD,
      modalDepth,
      pushModal,
    }),
    [screenReaderEnabled, reduceMotionEnabled, boldTextEnabled, fontScale, modalDepth, pushModal]
  );

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}

export function useA11yPreferences(): A11yPreferences {
  const ctx = useContext(A11yContext);
  if (!ctx) {
    return {
      screenReaderEnabled: false,
      reduceMotionEnabled: false,
      boldTextEnabled: false,
      fontScale: 1,
      isLargeText: false,
    };
  }
  return ctx;
}

export function A11yIsolationRoot({ children }: { children: React.ReactNode }) {
  const ctx = useContext(A11yContext);
  const hidden = (ctx?.modalDepth ?? 0) > 0;
  return (
    <View
      style={{ flex: 1 }}
      importantForAccessibility={hidden ? 'no-hide-descendants' : 'auto'}
      accessibilityElementsHidden={hidden}
    >
      {children}
    </View>
  );
}

export function useModalIsolation(active: boolean) {
  const ctx = useContext(A11yContext);
  useEffect(() => {
    if (!active || !ctx) return undefined;
    return ctx.pushModal();
  }, [active, ctx]);
}
