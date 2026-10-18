import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useHardwareBackHandler } from '../components/useHardwareBackHandler';
import { nativeBridge } from '@internal/contracts';

export type ModalSize = 'sm' | 'md' | 'lg' | 'fullscreen';
export type ModalVariant = 'default' | 'danger' | 'warning' | 'info';

export interface ModalAction {
  label: string;
  onPress: () => void;
  loading?: boolean;
  danger?: boolean;
  testID?: string;
}

export interface ModalDialogProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: string;
  children?: React.ReactNode;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  size?: ModalSize;
  variant?: ModalVariant;
  dismissOnBackdropPress?: boolean;
  testID?: string;
}

export function ModalDialog({
  visible,
  onClose,
  title,
  description,
  icon,
  children,
  primaryAction,
  secondaryAction,
  size = 'md',
  variant = 'default',
  dismissOnBackdropPress = true,
  testID = 'modal-dialog',
}: ModalDialogProps) {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Intercept Android hardware back button to dismiss modal
  useHardwareBackHandler(() => {
    if (visible) {
      onClose();
      return true;
    }
    return false;
  }, visible);

  useEffect(() => {
    if (visible) {
      if (variant === 'danger' || variant === 'warning') {
        try {
          nativeBridge.notification(variant === 'danger' ? 'error' : 'warning');
        } catch {
          // Fallback
        }
      }

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
    }
  }, [visible, scaleAnim, opacityAnim, variant]);

  if (!visible) return null;

  const defaultIcon =
    icon ||
    (variant === 'danger'
      ? '🚨'
      : variant === 'warning'
      ? '⚠️'
      : variant === 'info'
      ? 'ℹ️'
      : undefined);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      testID={testID}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel={title}
    >
      <View style={styles.backdrop}>
        {dismissOnBackdropPress && (
          <Pressable style={styles.backdropTouchArea} onPress={onClose} accessibilityLabel="Close backdrop" />
        )}

        <Animated.View
          style={[
            styles.card,
            size === 'sm' && styles.sizeSm,
            size === 'md' && styles.sizeMd,
            size === 'lg' && styles.sizeLg,
            size === 'fullscreen' && styles.sizeFullscreen,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            {defaultIcon && <Text style={styles.headerIcon}>{defaultIcon}</Text>}
            <View style={styles.headerTextCol}>
              <Text style={styles.titleText}>{title}</Text>
              {description && <Text style={styles.descText}>{description}</Text>}
            </View>
            <Pressable
              style={styles.closeBtn}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close dialog"
            >
              <Text style={styles.closeIcon}>✕</Text>
            </Pressable>
          </View>

          {/* Body Content */}
          {children && <View style={styles.bodyContent}>{children}</View>}

          {/* Footer Actions */}
          {(primaryAction || secondaryAction) && (
            <View style={styles.footerRow}>
              {secondaryAction && (
                <Pressable
                  style={styles.secondaryBtn}
                  onPress={secondaryAction.onPress}
                  testID={secondaryAction.testID || 'modal-btn-secondary'}
                  accessibilityRole="button"
                  accessibilityLabel={secondaryAction.label}
                >
                  <Text style={styles.secondaryBtnText}>{secondaryAction.label}</Text>
                </Pressable>
              )}

              {primaryAction && (
                <Pressable
                  style={[
                    styles.primaryBtn,
                    (primaryAction.danger || variant === 'danger') && styles.primaryBtnDanger,
                  ]}
                  onPress={primaryAction.onPress}
                  disabled={primaryAction.loading}
                  testID={primaryAction.testID || 'modal-btn-primary'}
                  accessibilityRole="button"
                  accessibilityLabel={primaryAction.label}
                >
                  {primaryAction.loading ? (
                    <ActivityIndicator color="#0F172A" />
                  ) : (
                    <Text
                      style={[
                        styles.primaryBtnText,
                        (primaryAction.danger || variant === 'danger') && styles.primaryBtnDangerText,
                      ]}
                    >
                      {primaryAction.label}
                    </Text>
                  )}
                </Pressable>
              )}
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backdropTouchArea: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 12,
  },
  sizeSm: { maxWidth: 340 },
  sizeMd: { maxWidth: 440 },
  sizeLg: { maxWidth: 580 },
  sizeFullscreen: {
    maxWidth: '100%',
    height: '92%',
    borderRadius: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  headerTextCol: {
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  descText: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 18,
  },
  closeBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  closeIcon: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '700',
  },
  bodyContent: {
    marginVertical: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  secondaryBtn: {
    minHeight: 48,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
  },
  primaryBtn: {
    minHeight: 48,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
  },
  primaryBtnDanger: {
    backgroundColor: '#EF4444',
  },
  primaryBtnDangerText: {
    color: '#FFFFFF',
  },
});
