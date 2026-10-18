import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  AccessibilityInfo,
  SafeAreaView,
} from 'react-native';
import { nativeBridge } from '@internal/contracts';

export type ToastVariant = 'success' | 'warning' | 'error' | 'info';
export type ToastPosition = 'top' | 'bottom';

export interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface ToastOptions {
  id?: string;
  title: string;
  message?: string;
  variant?: ToastVariant;
  duration?: number;
  position?: ToastPosition;
  action?: ToastAction;
}

export interface ActiveToast extends Required<Omit<ToastOptions, 'action' | 'message'>> {
  message?: string;
  action?: ToastAction;
}

interface ToastContextValue {
  show: (options: ToastOptions) => string;
  success: (title: string, message?: string) => string;
  warning: (title: string, message?: string) => string;
  error: (title: string, message?: string) => string;
  info: (title: string, message?: string) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_CONFIG: Record<
  ToastVariant,
  { bg: string; border: string; text: string; icon: string; haptic: 'success' | 'warning' | 'error' }
> = {
  success: {
    bg: '#064E3B',
    border: '#10B981',
    text: '#ECFDF5',
    icon: '✓',
    haptic: 'success',
  },
  warning: {
    bg: '#78350F',
    border: '#F59E0B',
    text: '#FFFBEB',
    icon: '⚠️',
    haptic: 'warning',
  },
  error: {
    bg: '#7F1D1D',
    border: '#EF4444',
    text: '#FEF2F2',
    icon: '✕',
    haptic: 'error',
  },
  info: {
    bg: '#0C4A6E',
    border: '#38BDF8',
    text: '#F0F9FF',
    icon: 'ℹ️',
    haptic: 'success',
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const show = useCallback(
    (options: ToastOptions): string => {
      const id = options.id || `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const variant: ToastVariant = options.variant || 'info';
      const duration = options.duration ?? 4000;
      const position: ToastPosition = options.position || 'top';

      const newToast: ActiveToast = {
        id,
        title: options.title,
        message: options.message,
        variant,
        duration,
        position,
        action: options.action,
      };

      // Haptic feedback
      try {
        nativeBridge.notification(VARIANT_CONFIG[variant].haptic);
      } catch {
        // Fallback
      }

      // Accessibility Announcement
      const a11yText = `${variant.toUpperCase()}: ${options.title}. ${options.message || ''}`;
      AccessibilityInfo.announceForAccessibility(a11yText);

      setToasts((prev) => [...prev.filter((t) => t.id !== id), newToast]);
      return id;
    },
    []
  );

  const success = useCallback((title: string, message?: string) => show({ title, message, variant: 'success' }), [show]);
  const warning = useCallback((title: string, message?: string) => show({ title, message, variant: 'warning' }), [show]);
  const error = useCallback((title: string, message?: string) => show({ title, message, variant: 'error' }), [show]);
  const info = useCallback((title: string, message?: string) => show({ title, message, variant: 'info' }), [show]);

  return (
    <ToastContext.Provider value={{ show, success, warning, error, info, dismiss, dismissAll }}>
      {children}
      {/* Toast Overlay Container */}
      <View pointerEvents="box-none" style={styles.overlayRoot}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ActiveToast; onDismiss: () => void }) {
  const anim = useRef(new Animated.Value(0)).current;
  const config = VARIANT_CONFIG[toast.variant];

  useEffect(() => {
    // Slide in
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 60,
    }).start();

    // Auto dismiss timer
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [anim, toast.duration]);

  const handleDismiss = () => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [toast.position === 'top' ? -60 : 60, 0],
  });

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        toast.position === 'top' ? styles.positionTop : styles.positionBottom,
      ]}
      pointerEvents="box-none"
    >
      <Animated.View
        style={[
          styles.toastCard,
          {
            backgroundColor: config.bg,
            borderColor: config.border,
            opacity: anim,
            transform: [{ translateY }],
          },
        ]}
        accessible={true}
        accessibilityRole="alert"
        accessibilityLabel={`${toast.variant} alert: ${toast.title}`}
        testID={`toast-${toast.variant}-${toast.id}`}
      >
        <Text style={[styles.icon, { color: config.border }]}>{config.icon}</Text>
        <View style={styles.contentColumn}>
          <Text style={[styles.title, { color: config.text }]}>{toast.title}</Text>
          {toast.message ? (
            <Text style={[styles.message, { color: config.text }]}>{toast.message}</Text>
          ) : null}
        </View>

        {toast.action && (
          <Pressable
            style={styles.actionBtn}
            onPress={() => {
              toast.action?.onPress();
              handleDismiss();
            }}
            accessibilityRole="button"
            accessibilityLabel={toast.action.label}
          >
            <Text style={[styles.actionText, { color: config.border }]}>{toast.action.label}</Text>
          </Pressable>
        )}

        <Pressable
          style={styles.closeBtn}
          onPress={handleDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss notification"
        >
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

const styles = StyleSheet.create({
  overlayRoot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99999,
  },
  safeArea: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  positionTop: {
    top: 12,
  },
  positionBottom: {
    bottom: 24,
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 520,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    marginVertical: 4,
  },
  icon: {
    fontSize: 20,
    fontWeight: '800',
    marginRight: 12,
  },
  contentColumn: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  message: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.9,
    lineHeight: 16,
  },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '800',
  },
  closeBtn: {
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
  },
});
