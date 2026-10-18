import React, { useCallback, useEffect, useMemo, useState, type RefObject } from 'react';
import {
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Animated,
  useWindowDimensions,
} from 'react-native';
import {
  a11y,
  announce,
  assertContrast,
  useA11yPreferences,
  useAutoFocus,
  useFocusRestore,
  useModalIsolation,
  type FocusableTarget,
} from '@internal/a11y';
import { Portal } from '../overlays/Portal';
import { Text } from '../primitives/Text';
import { IconButton } from '../components/IconButton';
import { useTheme } from '../theme';

export interface SlideUpPanelProps {
  visible: boolean;
  onDismiss: () => void;
  /** Required: used as the dialog's accessible name and visible heading */
  title: string;
  snapPoints?: number[];
  initialSnapIndex?: number;
  dismissible?: boolean;
  /** Element to return screen-reader focus to on close */
  returnFocusRef?: RefObject<FocusableTarget | null>;
  children: React.ReactNode;
  testID?: string;
}

export function SlideUpPanel({
  visible,
  onDismiss,
  title,
  snapPoints = [0.5, 0.92],
  initialSnapIndex = 0,
  dismissible = true,
  returnFocusRef,
  children,
  testID = 'slide-up-panel',
}: SlideUpPanelProps) {
  const theme = useTheme();
  const { height: screenH } = useWindowDimensions();
  const { screenReaderEnabled, reduceMotionEnabled, isLargeText } = useA11yPreferences();

  // For screen reader and large text, collapse to full expansion so no content is truncated
  const snaps = useMemo(() => {
    const sorted = [...snapPoints].sort((a, b) => a - b);
    return screenReaderEnabled || isLargeText ? [sorted[sorted.length - 1]] : sorted;
  }, [snapPoints, screenReaderEnabled, isLargeText]);

  const snapYs = useMemo(() => snaps.map((p) => screenH * (1 - p)), [snaps, screenH]);
  const topY = snapYs[snapYs.length - 1];
  const closedY = screenH;
  const startIndex = Math.min(initialSnapIndex, snapYs.length - 1);

  const [mounted, setMounted] = useState(visible);
  const [snapIndex, setSnapIndex] = useState(startIndex);
  const [animY] = useState(() => new Animated.Value(closedY));

  // Accessibility focus management & background isolation
  const titleRef = useAutoFocus<any>(visible && mounted);
  useFocusRestore(visible, returnFocusRef);
  useModalIsolation(visible);

  useEffect(() => {
    assertContrast(theme.colors.textPrimary, theme.colors.surfaceElevated, 'SlideUpPanel title');
  }, [theme]);

  const animateTo = useCallback(
    (targetY: number, onDone?: () => void) => {
      if (reduceMotionEnabled) {
        animY.setValue(targetY);
        onDone?.();
      } else {
        Animated.spring(animY, {
          toValue: targetY,
          damping: 24,
          stiffness: 260,
          useNativeDriver: true,
        }).start(() => onDone?.());
      }
    },
    [animY, reduceMotionEnabled]
  );

  useEffect(() => {
    if (visible) {
      setMounted(true);
      setSnapIndex(startIndex);
      animateTo(snapYs[startIndex]);
    } else if (mounted) {
      animateTo(closedY, () => setMounted(false));
    }
  }, [visible, snapYs, startIndex, closedY, mounted, animateTo]);

  const requestDismiss = useCallback(() => {
    if (dismissible) onDismiss();
  }, [dismissible, onDismiss]);

  // Android hardware back
  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      requestDismiss();
      return true;
    });
    return () => sub.remove();
  }, [visible, requestDismiss]);

  const setSnap = useCallback(
    (nextIdx: number) => {
      const bounded = Math.max(0, Math.min(snapYs.length - 1, nextIdx));
      if (bounded === snapIndex) return;
      setSnapIndex(bounded);
      animateTo(snapYs[bounded]);
      announce(bounded === snapYs.length - 1 ? `${title}, expanded` : `${title}, collapsed`);
    },
    [snapIndex, snapYs, animateTo, title]
  );

  if (!mounted) return null;

  const isExpanded = snapIndex === snapYs.length - 1;
  const handleA11y = a11y.adjustable({
    label: `${title} sheet size`,
    valueText: isExpanded ? 'Expanded' : 'Collapsed',
    hint: 'Swipe up or down to adjust sheet height',
    onIncrement: () => setSnap(snapIndex + 1),
    onDecrement: () => setSnap(snapIndex - 1),
    actions: dismissible ? [{ name: 'dismiss', label: 'Close sheet' }] : [],
    onCustomAction: (name) => name === 'dismiss' && requestDismiss(),
  });

  return (
    <Portal>
      <View style={StyleSheet.absoluteFill} testID={testID}>
        {/* Scrim */}
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.scrim }]}
          onPress={requestDismiss}
          accessible={false}
          importantForAccessibility="no"
          testID={`${testID}-scrim`}
        />

        {/* Sliding Panel */}
        <Animated.View
          {...a11y.dialog({ label: title })}
          style={[
            styles.panel,
            {
              height: screenH - topY,
              backgroundColor: theme.colors.surfaceElevated,
              borderColor: theme.colors.borderSubtle,
              transform: [{ translateY: animY }],
            },
          ]}
        >
          {/* Header & Grab Handle */}
          <View>
            {snapYs.length > 1 && (
              <Pressable {...handleA11y} style={styles.handleHitArea} testID={`${testID}-handle`}>
                <View style={[styles.handle, { backgroundColor: theme.colors.borderStrong }]} />
              </Pressable>
            )}

            <View style={[styles.header, { paddingHorizontal: theme.space.lg }]}>
              <Text ref={titleRef} variant="title3" style={styles.title} {...a11y.heading()}>
                {title}
              </Text>
              {dismissible && (
                <IconButton
                  accessibilityLabel={`Close ${title}`}
                  icon="✕"
                  onPress={requestDismiss}
                  testID={`${testID}-close`}
                />
              )}
            </View>
          </View>

          {/* Sheet Body Content */}
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: theme.space.lg, paddingBottom: theme.space.xl }}
            keyboardShouldPersistTaps="handled"
            testID={`${testID}-content`}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    overflow: 'hidden',
  },
  handleHitArea: {
    alignSelf: 'center',
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingVertical: 8,
  },
  title: {
    flexShrink: 1,
  },
});
