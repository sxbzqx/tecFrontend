"use client";

import { ConfigProvider, theme as antdTheme } from "antd";
import ruRU from "antd/locale/ru_RU";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, ReactNode } from "react";
import { ThemeProvider, useThemeMode, type ThemeMode } from "@/context/ThemeContext";
import { LocaleProvider, type Locale } from "@/context/LocaleContext";

// AntD пока не поставляет ky_KG локаль (нет официального пакета), поэтому
// системные тексты компонентов (даты, пагинация и т.д.) остаются на ru_RU
// независимо от выбранного языка интерфейса — переведён весь собственный UI.
function AntdBridge({ children }: { children: ReactNode }) {
  const { mode } = useThemeMode();
  const isDark = mode === "dark";

  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#534AB7",
          colorLink: "#534AB7",
          colorLinkHover: "#3C3489",
          borderRadius: 10,
          colorBgLayout: isDark ? "#0e0f14" : "#f8fafc",
          fontFamily:
            "var(--font-golos), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
        components: {
          Layout: {
            headerBg: isDark ? "#151726" : "#1b1633",
            footerBg: isDark ? "#151726" : "#1b1633",
            bodyBg: isDark ? "#0e0f14" : "#f8fafc",
          },
          Menu: {
            darkItemBg: "transparent",
            darkItemColor: "rgba(255,255,255,0.75)",
            darkItemHoverColor: "#ffffff",
            darkItemSelectedColor: "#ffffff",
            darkItemSelectedBg: "rgba(255,255,255,0.08)",
          },
          Card: {
            borderRadiusLG: 16,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

export default function Providers({
  children,
  initialTheme,
  initialLocale,
}: {
  children: ReactNode;
  initialTheme?: ThemeMode;
  initialLocale?: Locale;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <ThemeProvider initialTheme={initialTheme}>
      <LocaleProvider initialLocale={initialLocale}>
        <AntdBridge>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </AntdBridge>
      </LocaleProvider>
    </ThemeProvider>
  );
}
