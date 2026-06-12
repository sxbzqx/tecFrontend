"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/api/authService";
import Link from "next/link";
import { Input, Button, Alert, Typography, Form, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function LoginPage() {
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setError(null);
    const { login, password } = values;

    try {
      setLoading(true);

      
      await authService.login(login.trim(), password);

      console.log("[LoginPage] Авторизация успешна! Перенаправляем на ТЭЦ...");

      
      
      window.location.href = "/";
    } catch (err: any) {
      console.error("Ошибка авторизации:", err);
      
      const backendMessage = err.response?.data?.message;
      setError(backendMessage || "Неверный логин или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        padding: "0 16px",
      }}
    >
      <Card
        variant="borderless"
        style={{
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
          borderRadius: "12px",
          padding: "8px",
        }}
      >
        {}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Title
            level={3}
            style={{ margin: 0, fontWeight: 600, letterSpacing: "-0.5px" }}
          >
            Вход в систему ТЭЦ
          </Title>
          <Text
            type="secondary"
            style={{ fontSize: "14px", marginTop: "8px", display: "block" }}
          >
            Или{" "}
            <Link href="/register" style={{ color: "#1677ff", fontWeight: 500 }}>
              зарегистрируйте новый профиль
            </Link>
          </Text>
        </div>

        {/* Форма авторизации */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          size="large"
        >
          {error && (
            <Form.Item style={{ marginBottom: "20px" }}>
              <Alert message={error} type="error" showIcon />
            </Form.Item>
          )}

          {/* Поле: Логин */}
          <Form.Item
            name="login"
            label="Логин"
            rules={[
              { required: true, message: "Пожалуйста, введите логин" },
              { transform: (value) => value?.trim() },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Введите ваш логин"
              disabled={loading}
            />
          </Form.Item>

          {/* Поле: Пароль */}
          <Form.Item
            name="password"
            label="Пароль"
            rules={[{ required: true, message: "Пожалуйста, введите пароль" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="••••••••"
              disabled={loading}
            />
          </Form.Item>

          {/* Кнопка отправки */}
          <Form.Item style={{ marginBottom: 0, marginTop: "24px" }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{ borderRadius: "6px", fontWeight: 500, backgroundColor: "#0d47a1" }}
            >
              {loading ? "Проверка..." : "Войти"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}