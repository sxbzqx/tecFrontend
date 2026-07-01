'use client';

import React from 'react';
import { ConfigProvider, theme, Layout, Card, Row, Col, Typography, List, Divider } from 'antd';
import { AppstoreOutlined, InfoCircleOutlined, CompassOutlined, FileTextOutlined, TeamOutlined, SettingOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import { useDepartments } from '@/hooks/useDepartments';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const MapComponent = dynamic(() => import('@/components/tecMap/tecMap'), { ssr: false });

const navItems = [
  { title: 'Отчетность', icon: <FileTextOutlined />, desc: 'Аналитика и генерация документов' },
  { title: 'Персонал', icon: <TeamOutlined />, desc: 'Управление кадровым составом' },
  { title: 'Настройки', icon: <SettingOutlined />, desc: 'Конфигурация параметров системы' },
];

export default function DashboardPage() {
  const { data: otdels = [], isLoading: otdelsLoading } = useDepartments();

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#9d50bb', // Более насыщенный фиолетовый
          colorBgBase: '#0a0a0f',
          colorBgContainer: 'rgba(30, 25, 45, 0.6)', // Полупрозрачность для стекла
          borderRadius: 16,
        },
      }}
    >
      <Layout style={{ background: 'radial-gradient(circle at top right, #240b36, #0a0a0f)', minHeight: '100vh', padding: '40px' }}>
        <Content style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          
          <Row gutter={[24, 24]} align="stretch">
            {/* Карта с эффектом стекла */}
            <Col span={16}>
              <Card 
                title={<span style={{ color: '#fff' }}><InfoCircleOutlined /> Визуализация активов</span>} 
                style={{ background: 'rgba(30, 25, 45, 0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', height: '100%' }}
              >
                <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
                  <MapComponent />
                </div>
              </Card>
            </Col>

            {/* Список с антовским скроллом */}
            <Col span={8}>
              <Card 
                title={<span style={{ color: '#fff' }}>Подразделения</span>}
                style={{ background: 'rgba(30, 25, 45, 0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', height: '100%' }}
                styles={{ body: { padding: '0px', height: '400px', display: 'flex', flexDirection: 'column' } }}
              >
                <List
                  loading={otdelsLoading}
                  dataSource={otdels}
                  style={{ overflowY: 'auto', height: '100%', padding: '0 16px' }}
                  renderItem={(dep) => (
                    <List.Item style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '12px 0' }}>
                      <List.Item.Meta
                        avatar={<div style={{ background: 'rgba(157, 80, 187, 0.2)', padding: '8px', borderRadius: '8px' }}><AppstoreOutlined style={{ color: '#d395f1' }} /></div>}
                        title={<Text style={{ color: '#fff' }}>{dep.nameOtd}</Text>}
                        description={<Text style={{ fontSize: '11px', color: '#888' }}>ID: {dep.idOtd}</Text>}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            {/* Навигация */}
            <Col span={24} style={{ marginTop: '20px' }}>
              <Divider style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.1)' }}><CompassOutlined /> Навигация по системе</Divider>
              <Row gutter={[24, 24]}>
                {navItems.map((item, i) => (
                  <Col span={8} key={i}>
                    <Card 
                      hoverable 
                      style={{ background: 'rgba(30, 25, 45, 0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', transition: '0.3s' }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#9d50bb'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                    >
                      <div style={{ fontSize: '28px', color: '#9d50bb', marginBottom: '10px' }}>{item.icon}</div>
                      <Title level={5} style={{ color: '#fff', margin: 0 }}>{item.title}</Title>
                      <Paragraph type="secondary" style={{ fontSize: '13px', margin: '8px 0 0' }}>{item.desc}</Paragraph>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}