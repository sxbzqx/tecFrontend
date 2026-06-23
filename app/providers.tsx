"use client";

import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
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
    <ConfigProvider
      locale={ruRU}
      theme={{
        token: {
          colorPrimary: "#534AB7",
          colorLink: "#534AB7",
          colorLinkHover: "#3C3489",
          borderRadius: 10,
          colorBgLayout: "#f8fafc",
          fontFamily:
            "var(--font-golos), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
        components: {
          Layout: {
            headerBg: "#1b1633",
            footerBg: "#1b1633",
            bodyBg: "#f8fafc",
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
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ConfigProvider>
  );
}