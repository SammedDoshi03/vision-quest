import React, { forwardRef, ReactElement, useMemo } from 'react';
import {
  FlatList,
  FlatListProps,
  SectionList,
  SectionListProps,
  RefreshControl,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';

export interface OptimizedFlatListProps<T> extends Omit<FlatListProps<T>, 'getItemLayout'> {
  /** Fixed uniform height for lists where all items have the exact same height */
  itemHeight?: number;
  /** Custom dynamic height resolver per item to calculate exact offsets */
  getItemHeight?: (item: T, index: number) => number;
  /** Map of component tokens/types to known rendered heights */
  itemHeightMap?: Record<string, number>;
  /** Key or extractor to obtain the component token/type for itemHeightMap lookup */
  itemTypeKey?: keyof T | ((item: T) => string);
  onRefresh?: () => Promise<void> | void;
  isRefreshing?: boolean;
  emptyText?: string;
  loadingMore?: boolean;
}

function InnerOptimizedFlatList<T>(
  {
    data,
    renderItem,
    itemHeight,
    getItemHeight,
    itemHeightMap,
    itemTypeKey,
    onRefresh,
    isRefreshing = false,
    emptyText = 'No items available.',
    loadingMore = false,
    keyExtractor = (item: any, index) => item?.id ?? item?.key ?? String(index),
    initialNumToRender = 10,
    maxToRenderPerBatch = 10,
    windowSize = 5,
    removeClippedSubviews = Platform.OS === 'android',
    ListEmptyComponent,
    ListFooterComponent,
    ...rest
  }: OptimizedFlatListProps<T>,
  ref: React.ForwardedRef<FlatList<T>>
) {
  // Pre-compute cumulative offsets when dynamic heights or dictionary is provided
  const cumulativeLayouts = useMemo(() => {
    if (!data || data.length === 0) return null;

    if (itemHeight) {
      // Uniform height shortcut
      return null;
    }

    if (!getItemHeight && !itemHeightMap) {
      // Variable height without explicit heights - let React Native measure naturally
      return null;
    }

    const layouts: Array<{ length: number; offset: number; index: number }> = [];
    let currentOffset = 0;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      let length = 80; // default fallback

      if (getItemHeight) {
        length = getItemHeight(item, i);
      } else if (itemHeightMap && itemTypeKey) {
        const typeStr =
          typeof itemTypeKey === 'function'
            ? itemTypeKey(item)
            : String(item[itemTypeKey] ?? '');
        length = itemHeightMap[typeStr] ?? 80;
      }

      layouts.push({
        length,
        offset: currentOffset,
        index: i,
      });
      currentOffset += length;
    }

    return layouts;
  }, [data, itemHeight, getItemHeight, itemHeightMap, itemTypeKey]);

  const getItemLayout = useMemo(() => {
    if (itemHeight) {
      return (_data: any, index: number) => ({
        length: itemHeight,
        offset: itemHeight * index,
        index,
      });
    }

    if (cumulativeLayouts) {
      return (_data: any, index: number) => {
        if (cumulativeLayouts[index]) {
          return cumulativeLayouts[index];
        }
        return { length: 80, offset: 80 * index, index };
      };
    }

    // Returning undefined enables native dynamic measurement, preventing overlaps
    return undefined;
  }, [itemHeight, cumulativeLayouts]);

  const renderEmpty = () => {
    if (ListEmptyComponent) return <>{ListEmptyComponent}</>;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (ListFooterComponent) return <>{ListFooterComponent}</>;
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#38BDF8" />
        </View>
      );
    }
    return null;
  };

  return (
    <FlatList
      ref={ref}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      initialNumToRender={initialNumToRender}
      maxToRenderPerBatch={maxToRenderPerBatch}
      windowSize={windowSize}
      removeClippedSubviews={removeClippedSubviews}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#38BDF8"
            colors={['#38BDF8']}
          />
        ) : undefined
      }
      {...rest}
    />
  );
}

export const OptimizedFlatList = forwardRef(InnerOptimizedFlatList) as <T>(
  props: OptimizedFlatListProps<T> & { ref?: React.ForwardedRef<FlatList<T>> }
) => ReactElement;

export interface OptimizedSectionListProps<T, SectionT = any>
  extends SectionListProps<T, SectionT> {
  onRefresh?: () => Promise<void> | void;
  isRefreshing?: boolean;
}

export function OptimizedSectionList<T, SectionT = any>({
  sections,
  renderItem,
  renderSectionHeader,
  keyExtractor = (item: any, index) => item?.id ?? item?.key ?? String(index),
  onRefresh,
  isRefreshing = false,
  stickySectionHeadersEnabled = true,
  ...rest
}: OptimizedSectionListProps<T, SectionT>) {
  return (
    <SectionList
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={keyExtractor}
      stickySectionHeadersEnabled={stickySectionHeadersEnabled}
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={5}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#38BDF8"
            colors={['#38BDF8']}
          />
        ) : undefined
      }
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
