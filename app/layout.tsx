import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Providers from './providers';
import Navbar from "@/components/navbar/Navbar";
import FooterWrapper from '@/components/navbar/FooterWrapper';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { AuthProvider } from '@/context/AuthContext';
import { decodeAccessToken } from '@/utils/jwt';

export const metadata: Metadata = {
  icons: { icon: "/factory-32.png" },
  title: 'Корпоративный сайт ТЭЦ',
  description: 'Система управления ТЭЦ г. Бишкек',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const { role, loginName } = decodeAccessToken(cookieStore.get("accessToken")?.value);

  const initialAuth = {
    role: role || "Guest",
    loginName: loginName || "",
  };

  return (
    <html lang="ru">
      <body>
        <AntdRegistry>
          <Providers>
            <AuthProvider initialAuth={initialAuth}>
              <Layout style={{ minHeight: "100vh" }}>
                <Navbar />
                <Content style={{ padding: 0 }}>{children}</Content>
                <FooterWrapper />
              </Layout>
            </AuthProvider>
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}