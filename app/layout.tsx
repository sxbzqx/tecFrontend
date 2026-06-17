import type { Metadata } from 'next';
import Providers from './providers';
import Navbar from "@/components/navbar/Navbar";
import FooterWrapper from '@/components/navbar/FooterWrapper'; 
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout'; 
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  icons: {
    icon: "/factory-32.png"
  },
  title: 'Корпоративный сайт ТЭЦ',
  description: 'Система управления ТЭЦ г. Бишкек',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          <AuthProvider>
            <Layout style={{ minHeight: "100vh" }}>
              <Navbar />
              <Content style={{ padding: 0 }}>
                {children}
              </Content>
              <FooterWrapper />
            </Layout>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}