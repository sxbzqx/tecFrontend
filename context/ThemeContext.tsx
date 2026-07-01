"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import Cookies from "js-cookie";

export type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  initialTheme?: ThemeMode;
}> = ({ children, initialTheme }) => {
  const [mode, setMode] = useState<ThemeMode>(initialTheme ?? "light");

  const setTheme = useCallback((next: ThemeMode) => {
    setMode(next);
    Cookies.set("theme", next, { expires: 365, path: "/" });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(mode === "light" ? "dark" : "light");
  }, [mode, setTheme]);

  // Держим атрибут data-theme на <html> в синхроне (сервер уже выставляет
  // корректное значение при первом рендере — здесь только отражаем смену).
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const value = useMemo(() => ({ mode, toggleTheme, setTheme }), [mode, toggleTheme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useThemeMode must be used within ThemeProvider");
  return context;
};
