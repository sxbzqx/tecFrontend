"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Alert, Form } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { authService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/utils/apiError";
import AuthShell from "@/components/auth/AuthShell";

interface LoginFormValues {
  login: string;
  password: string;
}

export default function LoginPage() {
  const [form] = Form.useForm<LoginFormValues>();
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFinish = async ({ login, password }: LoginFormValues) => {
    setError(null);
    setLoading(true);
    try {
      await authService.login(login.trim(), password);
      await refreshAuth();
      router.push("/");
    } catch (err) {
      console.error("Ошибка авторизации:", err);
      setError(getApiErrorMessage(err, "Неверный логин или пароль"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Вход в систему"
      subtitleText="Нет аккаунта?"
      subtitleLinkHref="/register"
      subtitleLinkText="Зарегистрируйтесь"
    >
      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
        {error && (
          <Form.Item style={{ marginBottom: 20 }}>
            <Alert title={error} type="error" showIcon closable onClose={() => setError(null)} />
          </Form.Item>
        )}

        <Form.Item name="login" label="Логин" rules={[{ required: true, message: "Пожалуйста, введите логин" }]}>
          <Input
            prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Введите ваш логин"
            disabled={loading}
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item name="password" label="Пароль" rules={[{ required: true, message: "Пожалуйста, введите пароль" }]}>
          <Input.Password
            prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="••••••••"
            disabled={loading}
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={{ borderRadius: 8, fontWeight: 500, background: "#534AB7", borderColor: "#534AB7", height: 44 }}
          >
            {loading ? "Проверка..." : "Войти"}
          </Button>
        </Form.Item>
      </Form>
    </AuthShell>
  );
}