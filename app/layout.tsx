import type { Metadata } from 'next';
import Providers from './providers';
import Navbar from "@/components/navbar/Navbar";
import FooterWrapper from '@/components/navbar/FooterWrapper'; 
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout'; 

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
          <Layout style={{ minHeight: "100vh" }}>
            <Navbar />
            <Content>
              {children}
            </Content>
            <FooterWrapper />
          </Layout>
        </Providers>
      </body>
    </html>
  );
}