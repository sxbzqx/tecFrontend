"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import Cookies from "js-cookie";
import { ru, type TranslationKey } from "@/locales/ru";
import { kg } from "@/locales/kg";

export type Locale = "ru" | "kg";

const dictionaries: Record<Locale, Record<TranslationKey, string>> = { ru, kg };

interface LocaleContextType {
  locale: Locale;
  t: (key: TranslationKey) => string;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{
  children: React.ReactNode;
  initialLocale?: Locale;
}> = ({ children, initialLocale }) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? "ru");

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    Cookies.set("locale", next, { expires: 365, path: "/" });
  }, []);

  const t = useCallback(
    (key: TranslationKey) => dictionaries[locale][key] ?? dictionaries.ru[key] ?? key,
    [locale],
  );

  const value = useMemo(() => ({ locale, t, setLocale }), [locale, t, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
};
