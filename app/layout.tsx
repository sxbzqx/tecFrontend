import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Golos_Text } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import Providers from "./providers";
import Navbar from "@/components/navbar/Navbar";
import FooterWrapper from "@/components/navbar/Footer";
import { App, Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { AuthProvider } from "@/context/AuthContext";
import { decodeAccessToken } from "@/utils/jwt";
import "./globals.css";
import ContextMenuWrapper from "@/components/contextMenu/contextMenuWrapper";

const golosText = Golos_Text({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-golos",
  display: "swap",
});

export const metadata: Metadata = {
  icons: { icon: "/factory-32.png" },
  title: "Корпоративный сайт ТЭЦ",
  description: "Система управления ТЭЦ г. Бишкек",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const { role, loginName } = decodeAccessToken(
    cookieStore.get("accessToken")?.value,
  );

  const initialAuth = {
    role: role || "Guest",
    loginName: loginName || "",
  };

  const initialTheme = cookieStore.get("theme")?.value === "dark" ? "dark" : "light";
  const initialLocale = cookieStore.get("locale")?.value === "kg" ? "kg" : "ru";

  return (
    <html
      lang={initialLocale === "kg" ? "ky" : "ru"}
      data-theme={initialTheme}
      className={golosText.variable}
    >
      <body>
        <AntdRegistry>
          <Providers initialTheme={initialTheme} initialLocale={initialLocale}>
            <AuthProvider initialAuth={initialAuth}>
              <App>
                {/* <ContextMenuWrapper>  кастом контекст меню (ПКМ) */}
                  <Layout style={{ minHeight: "100vh" }}>
                    <Navbar />
                    <Content style={{ padding: 0 }}>{children}</Content>
                    <FooterWrapper />
                  </Layout>
                {/* </ContextMenuWrapper> */}
              </App>
            </AuthProvider>
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
