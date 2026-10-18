import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  componentId: string;
  componentType: string;
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

/**
 * SDUIComponentBoundary protects the page against single-widget failures.
 * If a single component throws or receives a malformed payload, it renders
 * an inline degraded card rather than crashing the entire screen.
 */
export class SDUIComponentBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || 'Unknown component error' };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn(
      `[SDUIComponentBoundary] Component "${this.props.componentId}" (${this.props.componentType}) failed to render:`,
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.fallbackCard}>
          <Text style={styles.fallbackTitle}>⚠️ Widget Unavailable</Text>
          <Text style={styles.fallbackMeta}>
            Type: {this.props.componentType} (ID: {this.props.componentId})
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  fallbackCard: {
    backgroundColor: '#1E1B4B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4338CA',
    padding: 12,
    marginVertical: 4,
  },
  fallbackTitle: {
    color: '#A5B4FC',
    fontSize: 12,
    fontWeight: '700',
  },
  fallbackMeta: {
    color: '#818CF8',
    fontSize: 10,
    marginTop: 2,
  },
});
