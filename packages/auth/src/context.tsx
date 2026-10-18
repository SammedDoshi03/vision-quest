import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthMachine, AuthState } from './machine';

export interface AuthContextValue extends AuthState {
  requestOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, code: string) => Promise<void>;
  unlockWithBiometrics: () => Promise<boolean>;
  lock: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  machine,
  children,
}: {
  machine: AuthMachine;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<AuthState>(machine.getState());

  useEffect(() => {
    const unsubscribe = machine.subscribe(setState);
    machine.bootstrap();
    return unsubscribe;
  }, [machine]);

  const value: AuthContextValue = {
    ...state,
    requestOtp: (phone) => machine.requestOtp(phone),
    verifyOtp: (phone, code) => machine.verifyOtp(phone, code),
    unlockWithBiometrics: () => machine.unlockWithBiometrics(),
    lock: () => machine.lock(),
    signOut: () => machine.signOut(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export function useSession() {
  const auth = useAuth();
  return {
    user: auth.user,
    isAuthenticated: auth.status === 'authenticated',
    isLocked: auth.status === 'locked',
    status: auth.status,
  };
}
