import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, ScrollView } from 'react-native';
import { useResponsiveLayout } from './useResponsiveLayout';

export interface ResponsiveContainerProps {
  children?: ReactNode;
  leftPane?: ReactNode;
  rightPane?: ReactNode;
  splitRatio?: [number, number]; // e.g. [1, 1] or [1, 2]
  scrollable?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  testID?: string;
}

export function ResponsiveContainer({
  children,
  leftPane,
  rightPane,
  splitRatio = [1, 1],
  scrollable = false,
  style,
  contentStyle,
  testID = 'responsive-container',
}: ResponsiveContainerProps) {
  const { isTablet, isLandscape, contentMaxWidth, gutter, orientation } = useResponsiveLayout();

  // If both leftPane and rightPane are provided, render master-detail split layout on tablet / landscape
  const isSplitMode = Boolean(leftPane && rightPane);

  const containerContent = () => {
    if (isSplitMode && (isTablet || isLandscape)) {
      const leftFlex = splitRatio[0];
      const rightFlex = splitRatio[1];

      return (
        <View
          style={[
            styles.splitRow,
            { gap: gutter },
            contentStyle,
          ]}
          testID={`${testID}-split-row`}
        >
          <View style={[styles.splitColumn, { flex: leftFlex }]} testID={`${testID}-left-pane`}>
            {leftPane}
          </View>
          <View style={[styles.splitColumn, { flex: rightFlex }]} testID={`${testID}-right-pane`}>
            {rightPane}
          </View>
        </View>
      );
    }

    if (isSplitMode) {
      // On narrow phone portrait, stack leftPane above rightPane
      return (
        <View style={[styles.stackedColumn, contentStyle]} testID={`${testID}-stacked`}>
          {leftPane}
          <View style={{ height: gutter }} />
          {rightPane}
        </View>
      );
    }

    return (
      <View
        style={[
          styles.singleContent,
          { maxWidth: contentMaxWidth, paddingHorizontal: gutter },
          contentStyle,
        ]}
        testID={`${testID}-content`}
      >
        {children}
      </View>
    );
  };

  if (scrollable) {
    return (
      <ScrollView
        style={[styles.root, style]}
        contentContainerStyle={[
          styles.scrollCenter,
          { paddingHorizontal: isTablet ? gutter : 0 },
        ]}
        testID={testID}
        accessible={true}
        accessibilityLabel={`Responsive layout in ${orientation} mode`}
      >
        {containerContent()}
      </ScrollView>
    );
  }

  return (
    <View
      style={[
        styles.root,
        styles.centerAlign,
        style,
      ]}
      testID={testID}
      accessible={true}
      accessibilityLabel={`Responsive layout in ${orientation} mode`}
    >
      {containerContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
  },
  centerAlign: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  scrollCenter: {
    alignItems: 'center',
    flexGrow: 1,
  },
  singleContent: {
    width: '100%',
    alignSelf: 'center',
  },
  splitRow: {
    flexDirection: 'row',
    width: '100%',
    flex: 1,
    padding: 16,
  },
  stackedColumn: {
    width: '100%',
    padding: 16,
  },
  splitColumn: {
    flex: 1,
  },
});
