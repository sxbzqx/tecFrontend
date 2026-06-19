"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Tag,
  Typography,
  Skeleton,
  message,
  Row,
  Col,
  Divider,
  Result,
  Button,
  Modal,
  Form,
  Input,
  Space,
} from "antd";
import {
  UserOutlined,
  ApartmentOutlined,
  ReloadOutlined,
  EditOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { authService } from "@/services/authService";

const { Title, Text } = Typography;

const ACCENT = "#4338CA";

interface UserProfile {
  loginName: string;
  role: string;
  department: string;
}

// Реальные роли в системе — Worker / Admin / SuperAdmin (см. middleware.ts).
// Цвет тега растёт по "весу" роли, подпись — человекочитаемая.
const ROLE_META: Record<string, { label: string; tagColor: string; ring: string }> = {
  worker: { label: "Сотрудник", tagColor: "blue", ring: ACCENT },
  admin: { label: "Администратор", tagColor: "gold", ring: "#D97706" },
  superadmin: { label: "Супер-админ", tagColor: "red", ring: "#DC2626" },
};

function getRoleMeta(role?: string) {
  const key = role?.toLowerCase() ?? "";
  return ROLE_META[key] ?? { label: role ?? "—", tagColor: "default", ring: ACCENT };
}

function getInitials(name?: string) {
  if (!name) return "?";
  return name.slice(0, 2).toUpperCase();
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const [loginForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const fetchUser = async () => {
    setLoading(true);
    setError(false);
    const data = await authService.getCurrentUser();
    if (data) {
      setUser(data);
    } else {
      setError(true);
      message.error("Не удалось загрузить данные профиля");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChangeLogin = async (values: {
    newLogin: string;
    currentPassword: string;
  }) => {
    setLoginSubmitting(true);
    try {
      await authService.changeLogin(values.newLogin, values.currentPassword);
      setUser((prev) => (prev ? { ...prev, loginName: values.newLogin } : prev));
      message.success("Логин успешно изменён");
      setLoginModalOpen(false);
      loginForm.resetFields();
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? "Не удалось изменить логин");
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleChangePassword = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setPasswordSubmitting(true);
    try {
      await authService.changePassword(values.currentPassword, values.newPassword);
      message.success("Пароль изменён. Сейчас вы будете разлогинены.");
      setPasswordModalOpen(false);
      passwordForm.resetFields();
      // Бэкенд уже сбросил все сессии — синхронизируем клиент и уводим на /login
      setTimeout(() => authService.logout(), 1200);
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? "Не удалось изменить пароль");
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const roleMeta = getRoleMeta(user?.role);

  return (
    <div style={{ padding: "40px 20px", maxWidth: 640, margin: "0 auto" }}>
      <style>{`
        @keyframes profileFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Card
        style={{
          padding: 0,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
        }}
      >
        {/* Баннер — единственный яркий элемент карточки */}
        <div
          style={{
            height: 120,
            background:
              "linear-gradient(135deg, #312E81 0%, #4338CA 45%, #0EA5A4 100%)",
            backgroundImage:
              "radial-gradient(circle at 85% 20%, rgba(255,255,255,0.12) 0%, transparent 45%), linear-gradient(135deg, #312E81 0%, #4338CA 45%, #0EA5A4 100%)",
          }}
        />

        <div style={{ padding: "0 32px 32px", textAlign: "center" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Skeleton.Avatar active size={96} style={{ marginTop: -48 }} />
              <Skeleton
                active
                style={{ marginTop: 20, width: 160 }}
                paragraph={{ rows: 1, width: 100 }}
                title={{ width: 140 }}
              />
            </div>
          ) : error ? (
            <Result
              status="warning"
              title="Профиль не загрузился"
              subTitle="Проверьте соединение и попробуйте ещё раз"
              extra={
                <Button icon={<ReloadOutlined />} onClick={fetchUser}>
                  Повторить
                </Button>
              }
            />
          ) : (
            <div style={{ animation: "profileFadeIn .35s ease" }}>
              <Avatar
                size={96}
                style={{
                  marginTop: -48,
                  background: ACCENT,
                  fontSize: 32,
                  fontWeight: 600,
                  boxShadow: `0 0 0 4px #fff, 0 0 0 7px ${roleMeta.ring}`,
                }}
              >
                {getInitials(user?.loginName)}
              </Avatar>

              <Title level={3} style={{ marginTop: 20, marginBottom: 8 }}>
                {user?.loginName}
              </Title>
              <Tag color={roleMeta.tagColor}>{roleMeta.label}</Tag>

              <Divider style={{ margin: "24px 0" }} />

              <Row gutter={16}>
                <Col span={12}>
                  <InfoBlock
                    icon={<UserOutlined />}
                    label="Логин"
                    value={user?.loginName}
                  />
                </Col>
                <Col span={12}>
                  <InfoBlock
                    icon={<ApartmentOutlined />}
                    label="Отдел"
                    value={user?.department}
                  />
                </Col>
              </Row>

              <Divider style={{ margin: "24px 0 16px" }} />

              <Space size={12}>
                <Button icon={<EditOutlined />} onClick={() => setLoginModalOpen(true)}>
                  Изменить логин
                </Button>
                <Button icon={<LockOutlined />} onClick={() => setPasswordModalOpen(true)}>
                  Изменить пароль
                </Button>
              </Space>
            </div>
          )}
        </div>
      </Card>

      {/* Смена логина */}
      <Modal
        title="Изменить логин"
        open={loginModalOpen}
        onCancel={() => {
          setLoginModalOpen(false);
          loginForm.resetFields();
        }}
        footer={null}
        destroyOnHidden
      >
        <Form
          form={loginForm}
          layout="vertical"
          onFinish={handleChangeLogin}
          requiredMark={false}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="newLogin"
            label="Новый логин"
            rules={[
              { required: true, message: "Введите новый логин" },
              { min: 3, message: "Минимум 3 символа" },
            ]}
          >
            <Input placeholder="Например, ivanov.i" autoFocus />
          </Form.Item>
          <Form.Item
            name="currentPassword"
            label="Текущий пароль"
            rules={[{ required: true, message: "Введите пароль для подтверждения" }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button
              onClick={() => {
                setLoginModalOpen(false);
                loginForm.resetFields();
              }}
              style={{ marginRight: 8 }}
            >
              Отмена
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loginSubmitting}
              style={{ background: ACCENT, borderColor: ACCENT }}
            >
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Смена пароля */}
      <Modal
        title="Изменить пароль"
        open={passwordModalOpen}
        onCancel={() => {
          setPasswordModalOpen(false);
          passwordForm.resetFields();
        }}
        footer={null}
        destroyOnHidden
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
          requiredMark={false}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="currentPassword"
            label="Текущий пароль"
            rules={[{ required: true, message: "Введите текущий пароль" }]}
          >
            <Input.Password placeholder="••••••••" autoFocus />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Новый пароль"
            rules={[
              { required: true, message: "Введите новый пароль" },
              { min: 6, message: "Минимум 6 символов" },
            ]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Повторите новый пароль"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Повторите новый пароль" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Пароли не совпадают"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button
              onClick={() => {
                setPasswordModalOpen(false);
                passwordForm.resetFields();
              }}
              style={{ marginRight: 8 }}
            >
              Отмена
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={passwordSubmitting}
              style={{ background: ACCENT, borderColor: ACCENT }}
            >
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

function InfoBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div>
      <div style={{ fontSize: 18, color: ACCENT, marginBottom: 6 }}>{icon}</div>
      <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
        {label}
      </Text>
      <Text strong>{value ?? "—"}</Text>
    </div>
  );
}