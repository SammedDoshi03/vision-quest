import React from 'react';
import { View, StyleSheet } from 'react-native';

export function MetricCardSkeleton() {
  return (
    <View style={styles.metricSkeleton}>
      <View style={[styles.shimmerBox, { width: '40%', height: 12, marginBottom: 8 }]} />
      <View style={[styles.shimmerBox, { width: '70%', height: 24, marginBottom: 8 }]} />
      <View style={[styles.shimmerBox, { width: '30%', height: 10 }]} />
    </View>
  );
}

export function EntityCardSkeleton() {
  return (
    <View style={styles.entitySkeleton}>
      <View style={{ flex: 1 }}>
        <View style={[styles.shimmerBox, { width: '60%', height: 16, marginBottom: 6 }]} />
        <View style={[styles.shimmerBox, { width: '40%', height: 12 }]} />
      </View>
      <View style={[styles.shimmerBox, { width: 64, height: 32, borderRadius: 6 }]} />
    </View>
  );
}

export function StatusBannerSkeleton() {
  return (
    <View style={styles.bannerSkeleton}>
      <View style={[styles.shimmerBox, { width: '50%', height: 14, marginBottom: 6 }]} />
      <View style={[styles.shimmerBox, { width: '85%', height: 12 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  shimmerBox: {
    backgroundColor: '#1E293B',
    borderRadius: 4,
  },
  metricSkeleton: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 8,
  },
  entitySkeleton: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerSkeleton: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 10,
  },
});
