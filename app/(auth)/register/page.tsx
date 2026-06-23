"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Alert, Form, Select } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, ApartmentOutlined } from "@ant-design/icons";
import { authService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { useDepartments } from "@/hooks/useDepartments";
import { getApiErrorMessage } from "@/utils/apiError";
import AuthShell from "@/components/auth/AuthShell";

interface RegisterFormValues {
  login: string;
  mail: string;
  otdelId: number;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [form] = Form.useForm<RegisterFormValues>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: otdels = [], isLoading: otdelsLoading } = useDepartments();

  const onFinish = async ({ login, mail, password, otdelId }: RegisterFormValues) => {
    setError(null);
    setLoading(true);
    try {
      await authService.register(login.trim(), password, mail.trim(), otdelId);
      await refreshAuth();
      router.push("/");
    } catch (err) {
      console.error("Ошибка при регистрации:", err);
      setError(getApiErrorMessage(err, "Произошла ошибка при регистрации"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Создание аккаунта"
      subtitleText="Уже есть аккаунт?"
      subtitleLinkHref="/login"
      subtitleLinkText="Войдите"
    >
      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
        {error && (
          <Form.Item style={{ marginBottom: 20 }}>
            <Alert message={error} type="error" showIcon closable onClose={() => setError(null)} />
          </Form.Item>
        )}

        <Form.Item name="login" label="Логин" rules={[{ required: true, message: "Пожалуйста, введите логин" }]}>
          <Input
            prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Придумайте логин"
            disabled={loading}
            autoComplete="username"
          />
        </Form.Item>

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
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item name="otdelId" label="Ваш отдел" rules={[{ required: true, message: "Пожалуйста, выберите отдел" }]}>
          <Select
            placeholder="Выберите отдел"
            disabled={loading}
            loading={otdelsLoading}
            showSearch
            optionFilterProp="label"
            suffixIcon={<ApartmentOutlined />}
            options={otdels.map((o) => ({ value: o.id, label: o.nameOtd }))}
          />
        </Form.Item>

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
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Подтверждение пароля"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Пожалуйста, повторите пароль" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) return Promise.resolve();
                return Promise.reject(new Error("Пароли не совпадают"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="••••••••"
            disabled={loading}
            autoComplete="new-password"
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
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
        </Form.Item>
      </Form>
    </AuthShell>
  );
}