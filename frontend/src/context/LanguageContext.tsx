'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Locale, Translations } from '@/lib/translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  toggleLocale: () => void;
  t: Translations;
  dir: 'rtl' | 'ltr';
  translateCategory: (cat: string) => string;
  translateStructure: (struct: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Arabic is the default language
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('seedlens_locale') as Locale | null;
      if (saved === 'ar' || saved === 'en') {
        return saved;
      }
    }
    return 'ar';
  });

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('seedlens_locale', newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
  };

  const toggleLocale = () => {
    setLocale(locale === 'ar' ? 'en' : 'ar');
  };

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const t = translations[locale];

  const translateCategory = (cat: string): string => {
    if (locale === 'en') return cat;
    switch (cat) {
      case 'Strategic Mega-Hub':
        return t.catStrategicMegaHub;
      case 'Trading Metropolis':
        return t.catTradingMetropolis;
      case 'Abyssal Hub':
        return t.catAbyssalHub;
      case 'Spawn Outpost':
        return t.catSpawnOutpost;
      case 'Dense Multi':
        return t.catDenseMulti;
      default:
        return cat;
    }
  };

  const translateStructure = (struct: string): string => {
    if (locale === 'en') return struct;
    switch (struct) {
      case 'Village':
        return t.structVillage;
      case 'Shipwreck':
        return t.structShipwreck;
      case 'Ancient City':
        return t.structAncientCity;
      case 'Desert Pyramid':
        return t.structDesertPyramid;
      case 'Jungle Temple':
        return t.structJungleTemple;
      default:
        return struct;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        toggleLocale,
        t,
        dir,
        translateCategory,
        translateStructure,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
