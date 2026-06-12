"use client";

import React, { useState } from "react";
import { authService } from "@/api/authService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input, Button, Alert, Typography, Form, Card } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function RegisterPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setError("");
    const { login, mail, password } = values;

    try {
      setLoading(true);

      
      await authService.register(login.trim(), password, mail.trim());

      console.log(
        "[RegisterPage] Автоматический вход выполнен, перенаправляем...",
      );
      router.push("/");
    } catch (err: any) {
      console.error("Ошибка при регистрации:", err);
      setError(
        err.response?.data?.message || "Произошла ошибка при регистрации",
      );
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
            Создание аккаунта
          </Title>
          <Text
            type="secondary"
            style={{ fontSize: "14px", marginTop: "8px", display: "block" }}
          >
            Или{" "}
            <Link href="/login" style={{ color: "#1677ff", fontWeight: 500 }}>
              войдите в существующий профиль
            </Link>
          </Text>
        </div>

        {/* Сама форма */}
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
              placeholder="Придумайте логин"
              disabled={loading}
            />
          </Form.Item>

          {/* Поле: Почта */}
          <Form.Item
            name="mail"
            label="Электронная почта"
            rules={[
              { required: true, message: "Пожалуйста, введите почту" },
              { type: "email", message: "Введите корректный email-адрес" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="name@example.com"
              disabled={loading}
            />
          </Form.Item>

          {/* Поле: Пароль */}
          <Form.Item
            name="password"
            label="Пароль"
            rules={[
              { required: true, message: "Пожалуйста, задайте пароль" },
              { min: 6, message: "Пароль должен быть не менее 6 символов" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="••••••••"
              disabled={loading}
            />
          </Form.Item>

          {/* Поле: Подтверждение пароля */}
          <Form.Item
            name="confirmPassword"
            label="Подтверждение пароля"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Пожалуйста, повторите пароль" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Пароли не совпадают"));
                },
              }),
            ]}
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
              style={{ borderRadius: "6px", fontWeight: 500 }}
            >
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
