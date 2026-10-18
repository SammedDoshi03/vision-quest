import { useState, useEffect, useCallback } from 'react';
import { nativeBridge } from '@internal/contracts';

export type BiometricAuthType = 'FACE_ID' | 'TOUCH_ID' | 'FINGERPRINT' | 'IRIS' | 'NONE';

export interface BiometricSecurityState {
  isHardwareAvailable: boolean;
  isEnrolled: boolean;
  biometricType: BiometricAuthType;
  isLoading: boolean;
  error?: string;
}

export interface BiometricAuthOptions {
  promptMessage?: string;
  cancelLabel?: string;
  fallbackLabel?: string;
  disableDeviceFallback?: boolean;
}

export function useBiometrics() {
  const [state, setState] = useState<BiometricSecurityState>({
    isHardwareAvailable: true,
    isEnrolled: true,
    biometricType: 'FACE_ID',
    isLoading: false,
  });

  useEffect(() => {
    let mounted = true;
    async function checkHardware() {
      try {
        const available = await nativeBridge.isAvailable();
        if (mounted) {
          setState((prev) => ({
            ...prev,
            isHardwareAvailable: available,
            isEnrolled: available,
            biometricType: available ? 'FACE_ID' : 'NONE',
            isLoading: false,
          }));
        }
      } catch (err: any) {
        if (mounted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: err?.message,
          }));
        }
      }
    }
    checkHardware();
    return () => {
      mounted = false;
    };
  }, []);

  const authenticate = useCallback(
    async (options?: BiometricAuthOptions): Promise<{ success: boolean; error?: string }> => {
      setState((prev) => ({ ...prev, isLoading: true, error: undefined }));
      try {
        const prompt = options?.promptMessage || 'Scan fingerprint or use FaceID to authenticate';
        const result = await nativeBridge.authenticate(prompt);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: result.error,
        }));
        return result;
      } catch (err: any) {
        const errorMsg = err?.message || 'Biometric authentication failed';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMsg,
        }));
        return { success: false, error: errorMsg };
      }
    },
    []
  );

  return {
    ...state,
    authenticate,
  };
}
