import React, { createContext, useContext, useMemo } from 'react';
import { darkTheme, type ThemeTokens } from './tokens';

const ThemeContext = createContext<ThemeTokens>(darkTheme);

export function ThemeProvider({
  theme = darkTheme,
  children,
}: {
  theme?: ThemeTokens;
  children: React.ReactNode;
}) {
  const value = useMemo(() => theme, [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeTokens {
  return useContext(ThemeContext);
}

export * from './tokens';
export * from './globalStyles';
