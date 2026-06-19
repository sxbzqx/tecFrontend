"use client";

import React, { useEffect, useState } from "react";
import { Card, Descriptions, Spin, Typography, message } from "antd";
import { $api } from "@/api/api"; 

const { Title } = Typography;

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await $api.get("/auth/me");
        setUser(data);
      } catch (err) {
        message.error("Не удалось загрузить данные профиля");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <div style={{ textAlign: "center", marginTop: 50 }}><Spin size="large" /></div>;

  return (
    <div style={{ padding: "40px 20px", maxWidth: "600px", margin: "0 auto" }}>
      <Card 
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        title={<Title level={3} style={{ margin: 0 }}>Личный кабинет</Title>}
      >
        <Descriptions column={1} bordered size="middle">
          <Descriptions.Item label="Логин">{user?.loginName}</Descriptions.Item>
          <Descriptions.Item label="Роль">{user?.role}</Descriptions.Item>
          <Descriptions.Item label="Отдел">{user?.department}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}