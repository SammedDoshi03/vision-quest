import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import enTranslations from './locales/en.json';
import mrTranslations from './locales/mr.json';

export type SupportedLanguage = 'en' | 'mr';

type TranslationDictionary = Record<string, string>;

const dictionaries: Record<SupportedLanguage, TranslationDictionary> = {
  en: enTranslations,
  mr: mrTranslations,
};

interface I18nContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  language: 'mr',
  setLanguage: () => {},
  t: (key) => key,
});

export interface I18nProviderProps {
  initialLanguage?: SupportedLanguage;
  children: ReactNode;
}

export function I18nProvider({ initialLanguage = 'mr', children }: I18nProviderProps) {
  const [language, setLanguage] = useState<SupportedLanguage>(initialLanguage);

  const value = useMemo<I18nContextValue>(() => {
    return {
      language,
      setLanguage,
      t: (key: string, fallback?: string) => {
        const dict = dictionaries[language] || dictionaries.en;
        return dict[key] ?? fallback ?? key;
      },
    };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}
